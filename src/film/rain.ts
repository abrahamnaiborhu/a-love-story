// Night rain on a canvas: slanted streaks driven by time, kept off the umbrella's shelter.
import { WIND, mod, rng, type Frame } from './scene'

type Streak = { x: number; phase: number; speed: number; len: number; alpha: number }
type Point = { x: number; y: number }

export class Rain {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private streaks: Streak[]
  private frame: Frame | null = null
  private dpr = 1

  constructor(canvas: HTMLCanvasElement, count: number) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')!
    const r = rng(5)
    this.streaks = Array.from({ length: count }, () => ({
      x: r(), phase: r(), speed: 0.9 + r() * 0.5, len: 26 + r() * 46, alpha: 0.18 + r() * 0.3,
    }))
  }

  resize(frame: Frame, width: number, height: number) {
    this.frame = frame
    this.dpr = Math.min(window.devicePixelRatio || 1, 2)
    this.canvas.width = Math.round(width * this.dpr)
    this.canvas.height = Math.round(height * this.dpr)
  }

  // shelter: the area under the umbrella in screen-frame units (the rain doesn't fall there).
  draw(now: number, opacity: number, shelter: Point[] | null) {
    const { ctx, frame } = this
    if (!frame) return
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    if (opacity <= 0.01) return
    const s = frame.scale * this.dpr
    ctx.setTransform(s, 0, 0, s, -frame.x * s, -frame.y * s)
    ctx.save()
    if (shelter) {
      ctx.beginPath()
      ctx.rect(frame.x - 400, frame.y - 400, frame.w + 800, frame.h + 800)
      ctx.moveTo(shelter[0].x, shelter[0].y)
      for (const p of shelter.slice(1)) ctx.lineTo(p.x, p.y)
      ctx.closePath()
      ctx.clip('evenodd')
    }
    ctx.strokeStyle = '#BFD2FF'
    ctx.lineWidth = 1.3
    ctx.lineCap = 'round'
    const H = frame.h + 200
    for (const d of this.streaks) {
      const y = frame.y - 100 + mod(d.phase * H + now * d.speed, H)
      const x = frame.x - 300 + d.x * (frame.w + 300) + (y - frame.y) * WIND
      ctx.globalAlpha = d.alpha * opacity
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x - d.len * WIND, y - d.len)
      ctx.stroke()
    }
    ctx.restore()
  }
}
