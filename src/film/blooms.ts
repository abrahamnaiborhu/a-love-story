// The flowers he falls through, on three canvases (far, middle, near) so each depth can be blurred by CSS.
// Flowers rise past him as he falls and open as they pass: bud → half open → full. Early ones are red;
// the closer he gets to her, the more of them are purple. At the landing everything bursts into purple bloom,
// then purple petals rain (time-driven, so the rest keeps living).
import type { Loaded, MediaName } from './media'
import { clamp, easeOut, hash, mod, rng, seg, type Frame } from './scene'

const RED = { bud: ['bud-1', 'bud-2', 'bud-3'], half: ['half-1', 'half-2', 'half-3'], full: ['half-3', 'half-1'] }
const PURPLE = { bud: ['bud-4'], half: ['half-4'], full: ['bloom-1', 'bloom-2', 'bloom-3', 'bloom-4'] }
const RED_PETALS = ['petal-1', 'petal-2', 'petal-4', 'petal-5', 'petal-8', 'petal-9']
const PURPLE_PETALS = ['petal-3', 'petal-6', 'petal-7']

export const BLOOM_SPRITES: MediaName[] = [
  ...new Set([...RED.bud, ...RED.half, ...PURPLE.bud, ...PURPLE.half, ...PURPLE.full, ...RED_PETALS, ...PURPLE_PETALS]),
] as MediaName[]

type Flower = { x: number; y: number; z: number; rot: number; seed: number }
type Petal = { x: number; y: number; z: number; rot: number; spin: number; seed: number }
type Layer = { ctx: CanvasRenderingContext2D; canvas: HTMLCanvasElement }

export type BloomState = {
  travel: number // how far the camera has fallen, in scene units
  purple: number // 0..1 share of flowers that come up purple
  fade: number // the whole field fading in after release
  burst: number // 0..1 everything bursts into full purple bloom
  rain: number // 0..1 purple petal rain intensity
  now: number // ms, for the petal rain
  still: boolean // reduced motion: no time-driven drift
}

export class Blooms {
  private layers: Layer[]
  private flowers: Flower[]
  private petals: Petal[][] // [far, near]
  private rainPetals: Petal[]
  private frame: Frame | null = null
  private dpr = 1
  private sprites: Loaded

  constructor(canvases: HTMLCanvasElement[], sprites: Loaded) {
    this.sprites = sprites
    this.layers = canvases.map((canvas) => ({ canvas, ctx: canvas.getContext('2d')! }))
    const r = rng(11)
    this.flowers = Array.from({ length: 14 }, (_, i) => ({ x: r(), y: i / 14 + r() * 0.04, z: 0.75 + r() * 0.85, rot: (r() - 0.5) * 50, seed: i }))
    const petal = (z: number, seed: number): Petal => ({ x: r(), y: r(), z, rot: r() * 360, spin: (r() - 0.5) * 300, seed })
    this.petals = [
      Array.from({ length: 22 }, (_, i) => petal(0.35 + r() * 0.3, 100 + i)),
      Array.from({ length: 6 }, (_, i) => petal(2 + r() * 0.8, 200 + i)),
    ]
    this.rainPetals = Array.from({ length: 36 }, (_, i) => petal(0.6 + r() * 1.2, 300 + i))
  }

  resize(frame: Frame, width: number, height: number) {
    this.frame = frame
    this.dpr = Math.min(window.devicePixelRatio || 1, 2)
    for (const { canvas } of this.layers) {
      canvas.width = Math.round(width * this.dpr)
      canvas.height = Math.round(height * this.dpr)
    }
  }

  private sprite(names: string[], seed: number) {
    return this.sprites.get(names[Math.floor(hash(seed, 3) * names.length)] as MediaName)
  }

  private drawSprite(ctx: CanvasRenderingContext2D, img: HTMLImageElement | undefined, x: number, y: number, size: number, rot: number, alpha: number) {
    if (!img || alpha <= 0.01) return
    const w = size * (img.naturalWidth / Math.max(img.naturalWidth, img.naturalHeight))
    const h = size * (img.naturalHeight / Math.max(img.naturalWidth, img.naturalHeight))
    ctx.save()
    ctx.globalAlpha = alpha
    ctx.translate(x, y)
    ctx.rotate((rot * Math.PI) / 180)
    ctx.drawImage(img, -w / 2, -h / 2, w, h)
    ctx.restore()
  }

  draw(st: BloomState) {
    const { frame } = this
    if (!frame) return
    const s = frame.scale * this.dpr
    for (const { ctx, canvas } of this.layers) {
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.setTransform(s, 0, 0, s, -frame.x * s, -frame.y * s)
    }
    if (st.fade <= 0.01) return
    const [far, mid, near] = this.layers.map((l) => l.ctx)
    const span = frame.h + 500
    const top = frame.y - 250

    // A flower or petal that wraps around comes back as a new one: its cycle number picks red or purple.
    const place = (yFrac: number, z: number) => {
      const raw = yFrac * span - st.travel * z
      return { y: top + mod(raw, span), cycle: Math.floor(-raw / span) }
    }
    const isPurple = (seed: number, cycle: number) => st.burst > 0.5 || hash(seed, cycle) < st.purple
    // Flowers and petals fade where his lines are (the top of the screen), so the words stay readable.
    const legible = (y: number) => 0.15 + 0.85 * seg(y, frame.y + frame.h * 0.12, frame.y + frame.h * 0.32)

    for (const [i, layerPetals] of this.petals.entries()) {
      const ctx = i === 0 ? far : near
      for (const p of layerPetals) {
        const { y, cycle } = place(p.y, p.z)
        const x = frame.x - 100 + p.x * (frame.w + 200) + Math.sin(st.travel * 0.002 + p.rot) * 30 * p.z
        const img = this.sprite(isPurple(p.seed, cycle) ? PURPLE_PETALS : RED_PETALS, p.seed + cycle)
        this.drawSprite(ctx, img, x, y, 26 * p.z, p.rot + p.spin * st.travel * 0.0004, st.fade * (i === 0 ? 0.6 : 0.85) * legible(y))
      }
    }

    for (const f of this.flowers) {
      const { y, cycle } = place(f.y, f.z)
      const x = frame.x + (0.1 + f.x * 0.8) * frame.w
      // Opens as it rises past him; at the burst, everything is in full bloom and a little bigger.
      const open = Math.max(easeOut(seg(frame.y + frame.h - y, 0, frame.h * 0.65)), st.burst)
      const set = isPurple(f.seed, cycle) ? PURPLE : RED
      const size = 92 * f.z * (1 + 0.25 * st.burst)
      const stageA = open < 0.5 ? set.bud : set.half
      const stageB = open < 0.5 ? set.half : set.full
      const blend = open < 0.5 ? seg(open, 0.3, 0.5) : seg(open, 0.7, 0.9)
      const key = f.seed * 31 + cycle
      const alpha = st.fade * legible(y)
      this.drawSprite(mid, this.sprite(stageA, key), x, y, size, f.rot, alpha * (1 - blend))
      this.drawSprite(mid, this.sprite(stageB, key), x, y, size, f.rot, alpha * blend)
    }

    // Purple rain: petals falling down the screen after the landing.
    if (st.rain > 0.01) {
      const t = st.still ? 0 : st.now
      for (const p of this.rainPetals) {
        const fall = (p.y * span + t * 0.06 * p.z) % span
        const y = top + fall
        const x = frame.x + p.x * frame.w + Math.sin(t * 0.0009 + p.rot) * 24 * p.z
        const ctx = p.z > 1.4 ? near : mid
        const img = this.sprite(PURPLE_PETALS, p.seed)
        this.drawSprite(ctx, img, x, y, 24 * p.z, p.rot + (st.still ? 0 : t * 0.02 * p.spin * 0.01), clamp(st.rain * 1.2) * (p.z > 1.4 ? 0.8 : 1) * legible(y))
      }
    }
  }
}
