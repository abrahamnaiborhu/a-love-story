// Chapters 5–6 and the credits: her petals tear away in a storm, the water keeps her shape a moment,
// she walks away taking the red, and what is left of him slips off the bare stem and falls into black.
import type { Loaded, MediaName } from './media'
import { clamp, easeIn, easeInOut, easeOut, lerp, rng, seg } from './scene'
import { BEAT } from './timeline'

export type EndElements = {
  scene: HTMLDivElement // chapter 4–5's picture, which rises away as he falls in chapter 6
  voidCover: HTMLDivElement // the black he falls into
  curl: HTMLImageElement
  herStrong: HTMLImageElement
  stem: HTMLImageElement
  herLeaving: HTMLImageElement
  storm: HTMLCanvasElement
  svg: SVGSVGElement // the impact: flash, rings and the water's horizon
  ripples: SVGEllipseElement[] // [lead ring, its glow, echo, echo, echo]
  flash: SVGCircleElement
  horizon: SVGRectElement
  // The last of the water, painted (Batch 03), in screen pixels:
  cup: HTMLImageElement // the water keeping her cup's shape
  beadRed: HTMLImageElement // the drop in the calyx, still in her red…
  beadGrey: HTMLImageElement // …the same drop, drained
  bleed: HTMLImageElement // her red washing out of it and drifting after her
  fallGrey: HTMLImageElement // the grey drop falling into black
  nobody: HTMLElement
  credits: HTMLElement
}

const HEART = { fx: 0.54, fy: 0.4 } // the heart of her rose in its painting
const CALYX = { fx: 0.53, fy: 0.12 } // the empty calyx at the top of the bare stem (measured)
const TORN = ['torn-1', 'torn-2', 'torn-3', 'torn-4', 'torn-5', 'torn-6', 'torn-7', 'torn-8', 'torn-9'] as MediaName[]
export const END_SPRITES = TORN

export function createChapters56(els: EndElements, sprites: Loaded) {
  const ctx = els.storm.getContext('2d')!
  let vw = 0, vh = 0, dpr = 1 // set by resize()
  let rose = { left: 0, top: 0, size: 0 }
  let heart = { x: 0, y: 0 }

  // The storm: the first petal, then a second, then all at once. Positions are pure functions of scroll,
  // so scrolling back reverses the storm exactly.
  const r = rng(51)
  const petals = Array.from({ length: 64 }, (_, i) => {
    const launch = i === 0 ? BEAT.tearFirst : i === 1 ? BEAT.tearSecond : lerp(BEAT.storm[0], BEAT.storm[1], r())
    const angle = r() * Math.PI * 2, dist = Math.sqrt(r()) * 0.36
    return {
      launch, sprite: TORN[i % TORN.length], ox: Math.cos(angle) * dist, oy: Math.sin(angle) * dist * 0.8,
      wind: 1.1 + r() * 0.9, lift: 0.15 + r() * 0.45, spin: (r() - 0.5) * 3, rot: r() * 360, size: i < 2 ? 1.25 : 0.7 + r() * 0.6,
    }
  })

  function resize(width: number, height: number) {
    vw = width
    vh = height
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    els.storm.width = Math.round(vw * dpr)
    els.storm.height = Math.round(vh * dpr)
    els.svg.setAttribute('viewBox', `0 0 ${vw} ${vh}`)
    // Same rose box as chapter 4; the bare stem's calyx sits exactly where the rose's heart was.
    const size = Math.min(vw * 0.85, vh * 0.48)
    rose = { left: (vw - size) / 2, top: vh * 0.5 - size / 2, size }
    heart = { x: rose.left + HEART.fx * size, y: rose.top + HEART.fy * size }
    const stemH = vh * 0.62, stemW = stemH * (1024 / 1536)
    Object.assign(els.stem.style, { width: `${stemW}px`, height: `${stemH}px`, left: `${heart.x - CALYX.fx * stemW}px`, top: `${heart.y - CALYX.fy * stemH}px` })
    Object.assign(els.herLeaving.style, { height: `${vh * 0.78}px`, width: 'auto', left: '50%', top: `${vh * 0.02}px`, translate: '-50% 0' })
  }

  function drawStorm(s: number) {
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, els.storm.width, els.storm.height)
    if (s < BEAT.tearFirst || s > BEAT.storm[1] + 1.6) return
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    for (const p of petals) {
      const u = s - p.launch
      if (u < 0 || u > 1.6) continue
      // Torn loose and thrown by the wind: fast to the right, a little lift, then falling.
      const x = heart.x + p.ox * rose.size + p.wind * vw * (u * 0.9 + u * u * 0.8)
      const y = heart.y + p.oy * rose.size - p.lift * vh * u + 0.45 * vh * u * u
      if (x > vw + 120 || y > vh + 120) continue
      const img = sprites.get(p.sprite)
      if (!img) continue
      const size = 58 * p.size * clamp(vw / 600, 0.75, 1.4)
      const w = (size * img.naturalWidth) / Math.max(img.naturalWidth, img.naturalHeight)
      const h = (size * img.naturalHeight) / Math.max(img.naturalWidth, img.naturalHeight)
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(((p.rot + p.spin * u * 360) * Math.PI) / 180)
      ctx.drawImage(img, -w / 2, -h / 2, w, h)
      ctx.restore()
    }
  }

  // Returns the stage colour once the ending owns the screen, else null.
  function render(s: number, reduced: boolean) {
    const ending = s >= BEAT.tearFirst - 0.2
    els.svg.style.visibility = ending ? 'visible' : 'hidden'
    if (!ending) {
      // Scrolled back above the ending: leave nothing of it on screen.
      els.credits.style.visibility = 'hidden'
      els.nobody.style.opacity = '0'
      for (const img of [els.cup, els.beadRed, els.beadGrey, els.bleed, els.fallGrey, els.stem, els.herLeaving]) img.style.opacity = '0'
      els.scene.style.transform = ''
      els.voidCover.style.opacity = '0'
      drawStorm(s)
      return null
    }

    // ---- Chapter 5: the tearing ----
    const gone = easeInOut(seg(s, BEAT.roseGone[0], BEAT.roseGone[1]))
    els.curl.style.opacity = String(1 - gone)
    els.stem.style.opacity = String(gone)
    drawStorm(s)

    // She leaves: her standing photograph gives way to her walking away, out of frame.
    const leave = seg(s, BEAT.herLeaves[0], BEAT.herLeaves[1])
    const herStrong = Number(els.herStrong.style.opacity || 0)
    els.herStrong.style.opacity = String(herStrong * (1 - seg(leave, 0, 0.2)))
    const walk = easeIn(seg(leave, 0.15, 1))
    els.herLeaving.style.opacity = String(seg(leave, 0, 0.2) * 0.75 * (1 - seg(leave, 0.75, 1)))
    els.herLeaving.style.transform = `translateX(${(walk * vw * 0.35).toFixed(0)}px) scale(${lerp(1, 0.82, walk).toFixed(3)})`

    // The water: it keeps the cup's shape a moment, collapses into a drop in the empty calyx, loses its red
    // to her (washing away after her like watercolour), and in chapter 6 slides off and falls into black.
    // Image framing (measured): cup 0.89 wide, centre at 0.51; drops 0.52 wide, base at 0.73;
    // falling drop 0.45 wide, body centre at 0.62 of its height.
    const holds = seg(s, BEAT.waterHolds[0], BEAT.waterHolds[0] + 0.15)
    const slump = easeInOut(seg(s, BEAT.slump[0], BEAT.slump[1]))
    const bead = rose.size * 0.05
    const since = s - BEAT.slipOff
    const slide = easeInOut(seg(since, 0, 0.25))
    const fallFor = Math.max(0, since - 0.25)
    const dist = fallFor < 0.45 ? (fallFor / 0.45) ** 2 * 0.22 * vh : 0.22 * vh + (fallFor - 0.45) * 0.95 * vh
    const seatY = heart.y + bead * 0.6 // where the drop rests in the calyx
    const startY = seatY - bead
    const anchor = vh * 0.55
    const camY = Math.max(0, startY + dist - anchor)
    const dropX = heart.x + slide * rose.size * 0.09
    const dropY = Math.min(startY + dist, anchor)
    const landed = seg(s, BEAT.impact - 0.05, BEAT.impact + 0.02)
    const falling = seg(since, 0.25, 0.35)

    const cupW = (rose.size * 0.3) / 0.89
    Object.assign(els.cup.style, { width: `${cupW}px`, left: `${heart.x - cupW / 2}px`, top: `${heart.y - 0.51 * cupW}px` })
    els.cup.style.opacity = String(holds * (1 - seg(slump, 0.2, 0.7)))
    els.cup.style.transform = `scale(${lerp(1, 0.7, slump).toFixed(3)}, ${lerp(1, 0.5, slump).toFixed(3)})`

    const beadW = (2 * bead) / 0.52
    const drain = seg(s, BEAT.redDrains[0], BEAT.redDrains[1])
    const beadShown = seg(slump, 0.4, 0.9) * (1 - falling)
    for (const [img, share] of [[els.beadRed, 1 - drain], [els.beadGrey, drain]] as const) {
      Object.assign(img.style, { width: `${beadW}px`, left: `${dropX - beadW / 2}px`, top: `${seatY - 0.73 * beadW}px` })
      img.style.opacity = String(beadShown * share)
      img.style.transform = `scale(${lerp(1.25, 1, seg(slump, 0.4, 1)).toFixed(3)})`
    }

    // Her red lifts off him like a small watercolour stain, drifts a little after her and dissolves
    // before it reaches her. Kept small and faint: large, it read as red smoke swallowing her (client, 2026-10-26).
    const wash = easeOut(drain)
    const bleedW = Math.min(vw, vh) * lerp(0.1, 0.3, wash)
    Object.assign(els.bleed.style, {
      width: `${bleedW}px`,
      left: `${dropX - 0.12 * bleedW + wash * bleedW * 0.35}px`,
      top: `${seatY - bead * 0.8 - bleedW / 3 - wash * bead * 1.5}px`,
    })
    els.bleed.style.opacity = String(Math.sin(Math.PI * drain) * 0.45 * (1 - seg(drain, 0.6, 0.95)))
    els.bleed.style.filter = `blur(${(1 + wash * 2.5).toFixed(1)}px)`

    const fallW = (2 * bead) / 0.45, fallH = fallW * 1.5
    Object.assign(els.fallGrey.style, { width: `${fallW}px`, left: `${dropX - fallW / 2}px`, top: `${dropY - 0.62 * fallH}px` })
    els.fallGrey.style.opacity = String(falling * (1 - landed))

    // ---- Chapter 6: he falls; the picture rises away into black. One ripple. Mr. Nobody. ----
    els.scene.style.transform = camY > 0 ? `translateY(${(-camY).toFixed(1)}px)` : ''
    els.voidCover.style.opacity = String(seg(camY, 0, vh * 0.6))
    // The impact: a pinprick of light, one bright ring racing out past the edges of the screen, then
    // slower, fainter echoes; for an instant a line of light runs along a vast black water surface.
    const surfaceY = anchor + bead
    const flash = seg(s, BEAT.flash[0], BEAT.flash[1])
    els.flash.setAttribute('cx', String(dropX))
    els.flash.setAttribute('cy', String(surfaceY))
    els.flash.setAttribute('r', String(lerp(4, vw * 0.12, easeOut(flash))))
    els.flash.style.opacity = String(flash > 0 && flash < 1 ? Math.sin(Math.PI * flash) : 0)
    const horizon = seg(s, BEAT.horizon[0], BEAT.horizon[1])
    els.horizon.setAttribute('y', String(surfaceY - 1))
    els.horizon.setAttribute('width', String(vw))
    els.horizon.style.opacity = String(horizon > 0 && horizon < 1 ? Math.sin(Math.PI * Math.sqrt(horizon)) * 0.55 : 0)
    const rings = [
      { from: BEAT.ripple[0], to: BEAT.ripple[1], reach: 0.95, width: 2.4, alpha: 0.95 }, // the lead ring
      { from: BEAT.ripple[0], to: BEAT.ripple[1], reach: 0.95, width: 7, alpha: 0.35 }, // its glow
      { from: BEAT.echoes[0], to: BEAT.echoes[0] + 0.55, reach: 0.62, width: 1.4, alpha: 0.55 },
      { from: BEAT.echoes[0] + 0.12, to: BEAT.echoes[0] + 0.7, reach: 0.5, width: 1.1, alpha: 0.4 },
      { from: BEAT.echoes[0] + 0.26, to: BEAT.echoes[1], reach: 0.4, width: 0.9, alpha: 0.28 },
    ]
    els.ripples.forEach((ring, k) => {
      const r = rings[k]
      const t = seg(s, r.from, r.to)
      const rx = easeOut(t) * vw * r.reach
      ring.setAttribute('cx', String(dropX))
      ring.setAttribute('cy', String(surfaceY))
      ring.setAttribute('rx', rx.toFixed(1))
      ring.setAttribute('ry', (rx * 0.12).toFixed(1))
      ring.setAttribute('stroke-width', String(lerp(r.width, r.width * 0.3, t)))
      ring.style.opacity = String(t > 0 && t < 1 ? Math.pow(1 - t, 1.4) * r.alpha : 0)
    })

    // His name, pressed into the dark where he vanished: letters draw together as it appears.
    const name = easeOut(seg(s, BEAT.nobody[0], BEAT.nobody[1]))
    els.nobody.style.top = `${surfaceY}px`
    els.nobody.style.opacity = String(name * 0.92 * (1 - seg(s, BEAT.nobodyOut[0], BEAT.nobodyOut[1])))
    const tracking = `${lerp(1.3, 0.42, name).toFixed(3)}em`
    els.nobody.style.letterSpacing = tracking
    els.nobody.style.textIndent = tracking // balances the space after the last letter, so the name stays centred
    els.nobody.style.filter = name > 0 && name < 1 ? `blur(${((1 - name) * 4).toFixed(1)}px)` : 'none'

    // ---- Credits: a cut to black, then they roll up and settle ----
    const shown = s >= BEAT.credits[0]
    const roll = reduced ? 1 : easeOut(seg(s, BEAT.credits[0], BEAT.credits[1]))
    els.credits.style.visibility = shown ? 'visible' : 'hidden'
    els.credits.style.opacity = String(seg(s, BEAT.credits[0], BEAT.credits[0] + 0.25))
    els.credits.style.transform = `translateY(${((1 - roll) * 60).toFixed(2)}vh)`
    els.credits.style.pointerEvents = shown && roll > 0.9 ? 'auto' : 'none'

    return s >= BEAT.slipOff ? '#030305' : null
  }

  return { resize, render }
}
