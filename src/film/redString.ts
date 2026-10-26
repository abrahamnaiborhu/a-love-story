// The red string of the loading screen: a tangle that untangles into one line as loading progresses.
// Points are interpolated between a knot and a gentle line, untangling from her end (right) first.

const N = 240

export type StringGeometry = { width: number; height: number }

function knot(t: number, cx: number, cy: number, r: number) {
  const a = t * Math.PI * 6
  return {
    x: cx + r * (0.62 * Math.sin(a + 0.3) + 0.34 * Math.sin(a * 2.3 + 1.1)),
    y: cy + r * (0.46 * Math.cos(a * 1.4) + 0.26 * Math.cos(a * 3.1 + 1)),
  }
}

function line(t: number, { width, height }: StringGeometry) {
  return { x: width * (0.16 + 0.68 * t), y: height * 0.5 + Math.sin(t * Math.PI * 2) * height * 0.012 }
}

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)

// progress 0..1 untangles; wobble (0..1) adds a slow living sway; fall (0..1) gathers the string at its end
// and drops it down the screen as a thin streak (the first rain).
export function stringPath(progress: number, geo: StringGeometry, time: number, wobble: number, fall = 0) {
  const r = Math.min(geo.width, geo.height) * 0.2
  const cx = geo.width * 0.5, cy = geo.height * 0.5
  const end = line(1, geo)
  let d = ''
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1)
    const local = easeInOut(Math.min(1, Math.max(0, progress * 1.5 - (1 - t) * 0.5)))
    const k = knot(t, cx, cy, r), l = line(t, geo)
    let x = k.x + (l.x - k.x) * local
    let y = k.y + (l.y - k.y) * local + Math.sin(time * 0.0012 + t * 9) * 3 * wobble * (1 - local * 0.7)
    if (fall > 0) {
      // Gather toward her end, then stream down as one falling thread.
      const gather = Math.min(1, fall * 1.6)
      const drop = Math.max(0, fall * 1.6 - 0.6)
      x += (end.x - x) * gather * gather
      y += (end.y + (1 - t) * geo.height * 0.08 * gather - y) * gather * gather + drop * drop * geo.height * 0.9
    }
    d += (i ? 'L' : 'M') + x.toFixed(1) + ',' + y.toFixed(1)
  }
  return { d, end }
}
