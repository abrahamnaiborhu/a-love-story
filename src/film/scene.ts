// Scene geometry and small maths helpers shared by every layer.
// The scene is measured in units: 1000 tall on landscape screens, 760 wide on portrait ones
// (the framing proven in the studies). The street's ground line, where the couple stands, is y = 830.

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
export const seg = (v: number, a: number, b: number) => clamp((v - a) / (b - a))
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
export const mod = (a: number, n: number) => ((a % n) + n) % n
export const easeIn = (t: number) => t * t
export const easeOut = (t: number) => 1 - (1 - t) * (1 - t)
export const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)

export function mix(a: string, b: string, t: number) {
  const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16)
  const ch = (s: number) => Math.round(lerp((A >> s) & 255, (B >> s) & 255, t))
  return '#' + ((ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).padStart(6, '0')
}

// Deterministic randomness, so scrolling back and forth always shows the same flowers and rain.
export function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
export const hash = (a: number, b: number) => rng(a * 7919 + b * 104729)()

export const COLOR = {
  his: '#2D5BFF',
  her: '#FF3D2E',
  love: '#9D3BE0',
  clearDrop: '#CFE0FF',
  night: '#0A0F1F',
  violet: '#1B0E2E',
  plum: '#2B1240',
}

export type Frame = { scale: number; x: number; y: number; w: number; h: number }

// The stage is sized to the large viewport (100lvh), which doesn't change when a phone browser's bars
// slide in and out while scrolling, so the scene never jumps. Measured with a hidden probe element.
let probe: HTMLDivElement | null = null
export function stageSize() {
  if (!probe) {
    probe = document.createElement('div')
    probe.style.cssText = 'position:fixed;top:0;left:0;width:0;height:100vh;height:100lvh;visibility:hidden;pointer-events:none'
    document.body.appendChild(probe)
  }
  return { width: innerWidth, height: probe.offsetHeight || innerHeight }
}

// Which part of the scene is visible for a viewport, and how many pixels one unit is.
// Phones get a tighter, couple-centred crop (600 units wide) so the two figures aren't lost in the street.
export function frameFor(width: number, height: number, focusY = 600): Frame {
  const aspect = width / height
  if (aspect >= 0.85) {
    const w = 1000 * aspect
    return { scale: height / 1000, x: 500 - w / 2, y: 0, w, h: 1000 }
  }
  const h = 600 / aspect
  return { scale: width / 600, x: 175, y: focusY - h / 2, w: 600, h }
}

export type Box = { x: number; y: number; w: number; h: number }

// Where each photograph sits in the scene once he has arrived (feet on y ≈ 830).
// Fractions below were measured from the images' pixels (see PROJECT_SCRIPT, Sprint 1 umbrella fix).
export const HER: Box = { x: 436, y: 483, w: 239, h: 358 }
export const HIM: Box = { x: 258, y: 429, w: 275, h: 413 }
// The walking photo, aligned so his body and feet land where the standing photo's are.
export const HIM_WALK: Box = { x: 265, y: 435, w: 275, h: 413 }
const FIST = { fx: 0.77, fy: 0.125 } // his raised fist in the standing photo
export const HAND = { x: HIM.x + FIST.fx * HIM.w, y: HIM.y + FIST.fy * HIM.h } // the umbrella's grip
export const WALK_HAND = { fx: 0.83, fy: 0.47 } // the centre of his forward hand in the walking photo (measured)

// The open umbrella photo, as fractions of its square image. The grip is the top of the handle tube
// (measured: tube 0.74–0.855, hook 0.82–0.93), so his fist closes around it: the shaft rises out of his
// fist and the hook hangs behind his wrist. 300 units ≈ a 1.3 m bubble umbrella, rim a hand-span above his head.
export const UMBRELLA = { size: 300, tilt: 9, grip: { fx: 0.53, fy: 0.76 }, centerX: 0.506, rimY: 0.52, rimHalf: 0.44, crownY: 0.03 }
// The closed umbrella photo (portrait image), scaled to the same overall height as the open one.
// While he walks he carries it hanging by the handle at `carried` size (full length would reach below the
// pavement), held where the shaft meets the hook (measured: tube 0.77–0.88, hook 0.86–0.96). As he raises it
// his hand slides up to `heldFy`, the same place on the handle as the open umbrella's grip.
export const UMBRELLA_CLOSED = { w: 197, h: 295, grip: { fx: 0.52, fy: 0.87 }, heldFy: 0.79, carried: 0.72 }

// A point on the open umbrella photo (fractions) → scene units, tilted around the grip.
export function umbrellaPoint(fx: number, fy: number, tilt = UMBRELLA.tilt) {
  const s = UMBRELLA.size
  const lx = (fx - UMBRELLA.grip.fx) * s, ly = (fy - UMBRELLA.grip.fy) * s
  const a = (tilt * Math.PI) / 180
  return { x: HAND.x + lx * Math.cos(a) - ly * Math.sin(a), y: HAND.y + lx * Math.sin(a) + ly * Math.cos(a) }
}

// The canopy's top surface, u from -1 (left rim) to 1 (right rim, her side), as image fractions.
export function canopySurface(u: number) {
  return { fx: UMBRELLA.centerX + u * UMBRELLA.rimHalf, fy: UMBRELLA.rimY - (UMBRELLA.rimY - UMBRELLA.crownY) * (1 - u * u) }
}

export const WIND = 0.25 // rain drifts right by this much per unit it falls

// Teardrop with its tip up; m sharpens the tip, stretch elongates it.
export function dropPath(cx: number, cy: number, r: number, stretch: number, m: number) {
  let d = ''
  for (let i = 0; i <= 40; i++) {
    const t = (i / 40) * Math.PI * 2
    const x = cx + r * Math.sin(t) * Math.pow(Math.sin(t / 2), m)
    const y = cy - r * stretch * Math.cos(t)
    d += (i ? 'L' : 'M') + x.toFixed(1) + ',' + y.toFixed(1)
  }
  return d + 'Z'
}
