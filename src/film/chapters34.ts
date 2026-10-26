// Chapters 3–4: sinking into her rose, his blue rising through her petals, the walls closing in;
// then (after a dissolve) her rose curling, her standing strong, and him only a fading reflection.
import { easeIn, easeInOut, easeOut, lerp, mix, rng, seg } from './scene'
import { BEAT } from './timeline'

export type DeepElements = {
  act2: HTMLDivElement // chapter 2's layers, which rise away above the waterline
  inside: HTMLDivElement
  insideImgs: HTMLImageElement[] // open, closing
  ink: HTMLDivElement[]
  stain: HTMLDivElement // his colour washing up her petals
  petalGlow: HTMLDivElement
  outside: HTMLDivElement
  curl: HTMLImageElement
  herStrong: HTMLImageElement
  reflection: HTMLImageElement
  dryPetal: HTMLImageElement
}

export function createChapters34(els: DeepElements) {
  const r = rng(21)
  const inkBlobs = els.ink.map((node) => ({ node, x: 0.25 + r() * 0.5, size: 0.35 + r() * 0.35, rise: 0.25 + r() * 0.35, delay: r() * 0.3 }))

  function render(s: number, now: number, reduced: boolean, vw: number, vh: number) {
    // ---- The waterline: chapter 2 rises away, her inside rises up from below. Same downward fall. ----
    const water = easeInOut(seg(s, BEAT.waterline[0], BEAT.waterline[1]))
    els.act2.style.transform = water > 0 ? `translateY(${(-water * vh).toFixed(1)}px)` : ''
    els.act2.style.visibility = water >= 1 ? 'hidden' : 'visible'
    // A screen before each new view is needed it is painted invisibly in place, so its large image is
    // already prepared when it appears (otherwise the first visible frame can stall while it's painted).
    const warmInside = s > BEAT.waterline[0] - 1 && s <= BEAT.waterline[0]
    const insideOn = s > BEAT.waterline[0] && s < BEAT.dissolve[1]
    els.inside.style.visibility = insideOn || warmInside ? 'visible' : 'hidden'
    if (warmInside) {
      els.inside.style.transform = ''
      els.inside.style.opacity = '0.001'
    }
    if (insideOn) {
      els.inside.style.transform = `translateY(${((1 - water) * vh).toFixed(1)}px)`
      els.inside.style.opacity = String(1 - seg(s, BEAT.dissolve[0], (BEAT.dissolve[0] + BEAT.dissolve[1]) / 2))
      const drift = seg(s, BEAT.insideDrift[0], BEAT.insideDrift[1])
      const walls = easeInOut(seg(s, BEAT.walls[0], BEAT.walls[1]))
      const view = `translateY(${lerp(3, -3, drift).toFixed(2)}%) scale(${(1.12 * lerp(1, 1.06, walls)).toFixed(4)})`
      els.insideImgs[0].style.transform = view
      els.insideImgs[1].style.transform = view
      els.insideImgs[1].style.opacity = String(walls)

      // His blue blooms through her water and drifts up, turning purple.
      const ink = seg(s, BEAT.ink[0], BEAT.ink[1])
      for (const b of inkBlobs) {
        const t = easeOut(seg(ink, b.delay, 1))
        const size = Math.max(vw, vh) * b.size * lerp(0.2, 1, t)
        b.node.style.width = b.node.style.height = `${size.toFixed(0)}px`
        b.node.style.transform = `translate(${(b.x * vw - size / 2).toFixed(0)}px, ${(vh * (1.05 - b.rise * t) - size / 2).toFixed(0)}px)`
        b.node.style.opacity = String(seg(ink, b.delay, b.delay + 0.2) * (1 - seg(s, BEAT.trails[1], BEAT.walls[0])) * 0.9)
        b.node.style.filter = `hue-rotate(${(seg(s, BEAT.trails[0], BEAT.trails[1]) * 50).toFixed(0)}deg)`
      }
      // She drinks him: his colour washes up her petals from the water, turning from his blue to their purple.
      const climb = easeInOut(seg(s, BEAT.trails[0], BEAT.trails[1]))
      els.stain.style.transform = `translateY(${lerp(100, 12, climb).toFixed(1)}%)`
      els.stain.style.filter = `hue-rotate(${(easeIn(climb) * 45).toFixed(0)}deg)`
      els.stain.style.opacity = String(seg(s, BEAT.trails[0], BEAT.trails[0] + 0.3) * (1 - seg(s, BEAT.walls[0], BEAT.walls[1]) * 0.5))
      els.petalGlow.style.opacity = String(seg(s, BEAT.petalsGlow[0], BEAT.petalsGlow[1]) * 0.85)
    }

    // ---- Chapter 4, after the dissolve: her rose curling, her strong, his reflection fading ----
    const out = seg(s, (BEAT.dissolve[0] + BEAT.dissolve[1]) / 2, BEAT.dissolve[1])
    const warmOutside = out <= 0 && s > BEAT.dissolve[0] - 1
    els.outside.style.visibility = out > 0 || warmOutside ? 'visible' : 'hidden'
    if (warmOutside) els.outside.style.opacity = '0.001'
    if (out > 0) {
      els.outside.style.opacity = String(out)
      els.herStrong.style.opacity = String(seg(s, BEAT.herAppears[0], BEAT.herAppears[1]) * 0.6)
      const fade = seg(s, BEAT.reflectionFades[0], BEAT.reflectionFades[1])
      const ripple = reduced ? 0 : Math.sin(now * 0.0021)
      els.reflection.style.opacity = String(lerp(0.5, 0.04, fade))
      els.reflection.style.transform = `scaleY(-1) skewX(${(ripple * 1.6).toFixed(2)}deg) scaleX(${(1 + ripple * 0.012).toFixed(4)})`
      // The rest: one dry petal falls through the frame, the only thing moving.
      const fall = seg(s, BEAT.dryPetal[0], BEAT.dryPetal[1])
      const px = vw * 0.62 + Math.sin(fall * 7) * 40, py = lerp(-0.1, 1.05, fall) * vh
      els.dryPetal.style.opacity = fall > 0 && fall < 1 ? '1' : '0'
      els.dryPetal.style.transform = `translate(${px.toFixed(0)}px, ${py.toFixed(0)}px) rotate(${(fall * 220 - 30).toFixed(0)}deg)`
    }

    const deep = mix('#140818', '#16070c', seg(s, BEAT.dissolve[0], BEAT.dissolve[1]))
    return s > BEAT.waterline[0] + 0.2 ? deep : null
  }

  // Inside and outside layouts depend on the screen size.
  // The rose sits above the lines (which are low and centred) and his reflection lies beneath them.
  function resize(vw: number, vh: number) {
    const rose = Math.min(vw * 0.85, vh * 0.48)
    Object.assign(els.curl.style, { width: `${rose}px`, height: `${rose}px`, left: `${(vw - rose) / 2}px`, top: `${vh * 0.5 - rose / 2}px` })
    const herH = vh * 0.78
    Object.assign(els.herStrong.style, { height: `${herH}px`, width: 'auto', left: '50%', top: `${vh * 0.02}px`, translate: '-50% 0' })
    const refH = vh * 0.5
    Object.assign(els.reflection.style, { height: `${refH}px`, width: 'auto', left: `${vw * 0.5 - refH * 0.29}px`, top: `${vh * 0.8}px`, transformOrigin: '50% 50%' })
  }

  return { render, resize }
}
