// Draws any moment of the first act from two numbers: how far the visitor has scrolled (in screens)
// and how far the opening has played (ms). Called every frame by Film; it only writes to the DOM and canvases.
import { Blooms } from './blooms'
import { aspect, type Loaded, type MediaName } from './media'
import { Rain } from './rain'
import {
  COLOR, HAND, HER, HIM, HIM_WALK, UMBRELLA, UMBRELLA_CLOSED, WALK_HAND, WIND,
  canopySurface, stageSize, easeIn, easeInOut, easeOut, frameFor, lerp, mix, rng, seg, umbrellaPoint, type Frame,
} from './scene'
import { BEAT, INTRO, LINES, LINE_FADE_IN, LINE_FADE_OUT, PUSH_IN, STILLS, WORD_HANDOVER } from './timeline'
import { createChapters34, type DeepElements } from './chapters34'
import { createChapters56, type EndElements } from './chapters56'

export type Elements = {
  stage: HTMLDivElement
  world: HTMLDivElement
  ground: HTMLDivElement
  plate: HTMLImageElement
  her: HTMLImageElement
  himWalk: HTMLImageElement
  him: HTMLImageElement
  umbrellaClosed: HTMLImageElement
  umbrellaOpen: HTMLImageElement
  canopy: SVGGElement
  splashes: SVGGElement
  hangClear: HTMLImageElement // his drop hanging from the umbrella, photographed: clear…
  hangBlue: HTMLImageElement // …then the same drop in his blue
  rain: HTMLCanvasElement
  bloomCanvases: HTMLCanvasElement[]
  rose: HTMLDivElement
  roseImgs: HTMLImageElement[] // bud, opening, full
  glow: HTMLDivElement
  screenSvg: SVGSVGElement
  fallPhoto: HTMLImageElement // his drop as it lets go (the photographed one)…
  fallPaint: HTMLImageElement // …becoming a painted drop as he falls in love
  ring: SVGEllipseElement
  title: HTMLElement
  hint: HTMLElement
  lines: HTMLElement[]
  deep: DeepElements
  end: EndElements
}

const SVG_NS = 'http://www.w3.org/2000/svg'
// The point of each rose painting placed under his drop: the full rose's pool of water (0.54, 0.40), and
// for the bud and the opening rose the same offset from their measured centre of red mass, so the three
// paintings overlap as closely as possible when they cross-fade (bud 0.574/0.377, opening 0.560/0.397,
// full 0.531/0.430).
const ROSE_POOL = [{ fx: 0.583, fy: 0.347 }, { fx: 0.569, fy: 0.367 }, { fx: 0.54, fy: 0.4 }] // bud, opening, full

function place(el: HTMLElement, x: number, y: number, w: number, h: number) {
  el.style.left = `${x}px`
  el.style.top = `${y}px`
  el.style.width = `${w}px`
  el.style.height = `${h}px`
}

export function createRenderer(els: Elements, loaded: Loaded, plate: MediaName) {
  const rain = new Rain(els.rain, 170)
  const blooms = new Blooms(els.bloomCanvases, loaded)
  const deep = createChapters34(els.deep)
  const end = createChapters56(els.end, loaded)
  let viewport = stageSize()
  let frame: Frame = frameFor(viewport.width, viewport.height)
  const plateAspect = aspect(plate)

  // Raindrops that gather on the canopy and run down to her side.
  const r = rng(9)
  const canopyDrops = Array.from({ length: 22 }, () => ({
    u: -0.85 + r() * 1.6, at: BEAT.canopyDrops[0] + r() * (BEAT.canopyDrops[1] - BEAT.canopyDrops[0] - 1.2), size: 3 + r() * 3,
    node: els.canopy.appendChild(document.createElementNS(SVG_NS, 'circle')),
  }))
  // Rain hitting her shoulders before he arrives.
  const splashes = Array.from({ length: 6 }, (_, i) => {
    const node = els.splashes.appendChild(document.createElementNS(SVG_NS, 'path'))
    node.setAttribute('d', 'M-7,0 Q0,-9 7,0')
    node.setAttribute('transform', `translate(${505 + i * 18 + r() * 6} ${528 + (i % 3) * 18 + r() * 8})`)
    return { node, phase: r() * 10 }
  })

  function resize() {
    viewport = stageSize()
    const { width, height } = viewport
    frame = frameFor(width, height)
    // The street covers the visible scene; dark wet ground continues below it for the fall.
    const W = Math.max(frame.w, frame.h * plateAspect) * 1.04, H = W / plateAspect
    place(els.plate, frame.x + (frame.w - W) / 2, frame.y + (frame.h - H) / 2, W, H)
    place(els.ground, frame.x - 200, frame.y + (frame.h + H) / 2 - 80, frame.w + 400, 3000)
    place(els.her, HER.x, HER.y, HER.w, HER.h)
    place(els.him, HIM.x, HIM.y, HIM.w, HIM.h)
    place(els.himWalk, HIM_WALK.x, HIM_WALK.y, HIM_WALK.w, HIM_WALK.h)
    const s = UMBRELLA.size
    place(els.umbrellaOpen, HAND.x - UMBRELLA.grip.fx * s, HAND.y - UMBRELLA.grip.fy * s, s, s)
    els.umbrellaOpen.style.transformOrigin = `${UMBRELLA.grip.fx * 100}% ${UMBRELLA.grip.fy * 100}%`
    place(els.umbrellaClosed, 0, 0, UMBRELLA_CLOSED.w, UMBRELLA_CLOSED.h)
    els.screenSvg.setAttribute('viewBox', `${frame.x} ${frame.y} ${frame.w} ${frame.h}`)
    rain.resize(frame, width, height)
    blooms.resize(frame, width, height)
    deep.resize(width, height)
    end.resize(width, height)
  }

  // Scene units → pixels on screen for the screen-space layers (rose, glow).
  const px = (ux: number, uy: number) => ({ x: (ux - frame.x) * frame.scale, y: (uy - frame.y) * frame.scale })

  function render(screens: number, introMs: number, now: number, reduced: boolean) {
    let s = screens
    let dip = 1
    if (reduced) {
      // Still frames: show the nearest complete beat; dip to dark when passing from one to the next.
      const bounds = STILLS.slice(1).map((v, i) => (STILLS[i] + v) / 2)
      const index = bounds.filter((b) => screens >= b).length
      s = STILLS[index]
      dip = Math.min(1, ...bounds.map((b) => Math.abs(screens - b) / 0.2))
      introMs = INTRO.length
    }
    const t = introMs
    const ambient = reduced ? 0 : now

    // ---- The opening, which plays by itself ----
    const walk = easeOut(seg(t, INTRO.walk[0], INTRO.walk[1]))
    const bob = walk > 0 && walk < 1 ? -Math.abs(Math.sin(t * 0.012)) * 5 : 0
    const dx = lerp(-520, 0, walk)
    const raise = easeInOut(seg(t, INTRO.raise[0], INTRO.raise[1]))
    const swap = seg(t, INTRO.poseSwap[0], INTRO.poseSwap[1])
    const open = easeOut(seg(t, INTRO.open[0], INTRO.open[1]))
    els.himWalk.style.transform = `translate(${dx}px, ${bob}px)`
    els.himWalk.style.opacity = String(1 - swap)
    els.him.style.opacity = String(swap)
    const walkHand = { x: HIM_WALK.x + WALK_HAND.fx * HIM_WALK.w + dx, y: HIM_WALK.y + WALK_HAND.fy * HIM_WALK.h + bob }
    const gx = lerp(walkHand.x, HAND.x, raise), gy = lerp(walkHand.y, HAND.y, raise)
    // He carries it hanging down by the handle, swaying a little with his stride; as he raises his arm it
    // swings forward and up (180° → 0°, tip passing toward her) and grows to full size before it opens.
    const sway = walk > 0 && walk < 1 ? Math.sin(t * 0.0062) * 5 : 0
    const angle = lerp(180 + sway, 0, raise)
    const carried = lerp(UMBRELLA_CLOSED.carried, 1, raise)
    const gripFx = UMBRELLA_CLOSED.grip.fx, gripFy = lerp(UMBRELLA_CLOSED.grip.fy, UMBRELLA_CLOSED.heldFy, raise)
    els.umbrellaClosed.style.transformOrigin = `${gripFx * 100}% ${(gripFy * 100).toFixed(2)}%`
    els.umbrellaClosed.style.transform = `translate(${gx - gripFx * UMBRELLA_CLOSED.w}px, ${gy - gripFy * UMBRELLA_CLOSED.h}px) rotate(${angle.toFixed(2)}deg) scale(${carried.toFixed(3)})`
    const opened = seg(t, INTRO.open[0], INTRO.open[0] + 250)
    els.umbrellaClosed.style.opacity = String(1 - opened)
    els.umbrellaOpen.style.opacity = String(opened)
    els.umbrellaOpen.style.transform = `rotate(${UMBRELLA.tilt * open}deg) scaleX(${lerp(0.12, 1, open)})`
    for (const sp of splashes) {
      const flicker = Math.pow(0.5 + 0.5 * Math.sin(now * 0.03 + sp.phase), 4)
      sp.node.style.opacity = String((t > 600 ? 0.8 : 0) * flicker * (1 - open))
    }

    // ---- Chapter 1: rain runs down the canopy into one drop on her side ----
    for (const d of canopyDrops) {
      const u = lerp(d.u, 1, easeIn(seg(s, d.at + 0.1, d.at + 1.2)))
      const size = d.size * (1 - seg(u, 0.93, 1))
      const p = canopySurface(u)
      d.node.setAttribute('cx', ((p.fx - UMBRELLA.grip.fx) * UMBRELLA.size).toFixed(1))
      d.node.setAttribute('cy', ((p.fy - UMBRELLA.grip.fy) * UMBRELLA.size - size * 0.6).toFixed(1))
      d.node.setAttribute('r', size.toFixed(2))
      d.node.style.opacity = String(seg(s, d.at, d.at + 0.1))
    }
    els.canopy.setAttribute('transform', `translate(${HAND.x} ${HAND.y}) rotate(${UMBRELLA.tilt})`)

    const tip = umbrellaPoint(UMBRELLA.centerX + UMBRELLA.rimHalf, UMBRELLA.rimY + 0.015)
    // His drop hangs from the rim (a photograph: its neck at the top edge of the image, its round body
    // ~0.39 of the image height wide). It swells, and fills with his blue.
    const rad = lerp(3, 16, seg(s, BEAT.dropGrows[0], BEAT.dropGrows[1]))
    const dropH = rad * 5.1, dropW = dropH * (1024 / 1536)
    const cy = tip.y + 0.6 * dropH // the centre of the drop's round body
    const released = s >= BEAT.release
    const appear = seg(s, BEAT.dropGrows[0], BEAT.dropGrows[0] + 0.15)
    const blue = seg(s, BEAT.dropTurnsBlue[0], BEAT.dropTurnsBlue[1])
    for (const [img, share] of [[els.hangClear, 1 - blue], [els.hangBlue, blue]] as const) {
      place(img, tip.x - dropW / 2, tip.y - 0.02 * dropH, dropW, dropH)
      // A faint minimum keeps both photographs painted, so neither stalls the frame when it first shows.
      img.style.opacity = released ? '0' : String(Math.max(0.001, appear * share))
    }

    // ---- Camera: a gentle push-in that settles, then it follows his fall down ----
    // Short portrait screens (e.g. 360×640) push in less: the zoom is centred on the drop, so it carries
    // the couple's feet down into chapter 1's lines.
    const shortPortrait = viewport.width / viewport.height < 0.85 && viewport.height / viewport.width < 1.95
    const k = lerp(1, shortPortrait ? 1.12 : PUSH_IN, easeInOut(seg(s, BEAT.pushIn[0], BEAT.pushIn[1])))
    const since = s - BEAT.release
    const fallDist = since <= 0 ? 0 : since < BEAT.accelerate ? 300 * (since / BEAT.accelerate) ** 2 : 300 + (since - BEAT.accelerate) * BEAT.fallSpeed
    const anchorY = frame.y + frame.h * 0.45
    const camY = Math.max(0, cy + fallDist - anchorY)
    const sc = frame.scale
    const tx = sc * (tip.x * (1 - k) - frame.x), ty = sc * (cy * (1 - k) - frame.y - camY)
    els.world.style.transform = `matrix(${sc * k}, 0, 0, ${sc * k}, ${tx}, ${ty})`
    const streetFade = 1 - seg(camY, 150, 550)
    els.world.style.opacity = String(seg(t, INTRO.fadeIn[0], INTRO.fadeIn[1]) * streetFade)

    // Rain stays out of the umbrella's shelter, which leans with the wind.
    let shelter = null
    if (open > 0.05) {
      const toScreen = (p: { x: number; y: number }) => ({ x: tip.x + (p.x - tip.x) * k, y: cy + (p.y - cy) * k - camY })
      const half = UMBRELLA.rimHalf * lerp(0.12, 1, open)
      const L = toScreen(umbrellaPoint(UMBRELLA.centerX - half, UMBRELLA.rimY, UMBRELLA.tilt * open))
      const R = toScreen(umbrellaPoint(UMBRELLA.centerX + half, UMBRELLA.rimY, UMBRELLA.tilt * open))
      const floor = frame.y + frame.h + 400
      shelter = [L, R, { x: R.x + WIND * (floor - R.y), y: floor }, { x: L.x + WIND * (floor - L.y), y: floor }]
    }
    rain.draw(ambient, seg(t, 0, INTRO.fadeIn[1]) * streetFade, shelter)

    // ---- Chapter 2: he falls through the blooms toward her rose ----
    const dropX = lerp(tip.x, frame.x + frame.w / 2, easeInOut(seg(camY, 0, 900)))
    const dropY = Math.min(cy + fallDist, anchorY)
    // As he lets go he is still the photographed drop; within half a screen of falling he becomes the
    // painted one (love is painted), tinted toward their purple as he nears her, and shrinks into her heart.
    const landed = seg(s, BEAT.landing - 0.05, BEAT.landing + 0.05)
    const painted = seg(since, 0.05, 0.45)
    const photoH = dropH * k * (1 - landed), photoW = photoH * (1024 / 1536)
    const photoAt = px(dropX - photoW / 2, dropY - 0.6 * photoH)
    place(els.fallPhoto, photoAt.x, photoAt.y, photoW * sc, photoH * sc)
    // Painted invisibly in place a screen before he lets go, so neither image stalls its first frame.
    const warm = s > BEAT.release - 1 ? '0.001' : '0'
    els.fallPhoto.style.opacity = released ? String(1 - painted) : warm
    const paintW = 55 * k * (1 - landed), paintH = paintW * 1.5
    const paintAt = px(dropX - paintW / 2, dropY - 0.68 * paintH)
    place(els.fallPaint, paintAt.x, paintAt.y, paintW * sc, paintH * sc)
    els.fallPaint.style.opacity = released ? String(Math.max(0.001, painted)) : warm
    els.fallPaint.style.filter = `hue-rotate(${(seg(s, 5, BEAT.landing) * 40).toFixed(0)}deg)`

    // Once we're underwater (chapter 3), the bloom field is out of sight and isn't drawn.
    if (s < BEAT.waterline[1]) blooms.draw({
      travel: camY,
      purple: seg(s, BEAT.bloomsTurnPurple[0], BEAT.bloomsTurnPurple[1]),
      fade: seg(camY, 100, 600),
      burst: easeOut(seg(s, BEAT.burst[0], BEAT.burst[1])),
      rain: seg(s, BEAT.petalRain[0], BEAT.petalRain[1]),
      now: ambient,
      still: reduced,
    })

    // Her rose rises from below until the pool at its heart sits under his drop.
    const size = Math.min(frame.w * 1.05, frame.h * 0.75)
    const poolY = lerp(frame.y + frame.h + size * 0.7, dropY + 30, easeOut(seg(s, BEAT.roseRises[0], BEAT.roseRises[1])))
    const weights = [
      1 - seg(s, BEAT.roseOpen[0], BEAT.roseOpen[1]),
      seg(s, BEAT.roseOpen[0], BEAT.roseOpen[1]) * (1 - seg(s, BEAT.roseFull[0], BEAT.roseFull[1])),
      seg(s, BEAT.roseFull[0], BEAT.roseFull[1]),
    ]
    els.roseImgs.forEach((img, i) => {
      const at = px(dropX - size * ROSE_POOL[i].fx, poolY - size * ROSE_POOL[i].fy)
      place(img, at.x, at.y, size * sc, size * sc)
      img.style.opacity = String(weights[i])
      // A brief softness at the hand-over makes it read as the bloom opening, not a double exposure.
      img.style.filter = weights[i] > 0.02 && weights[i] < 0.98 ? `blur(${(Math.sin(Math.PI * weights[i]) * 2.5).toFixed(1)}px)` : 'none'
    })
    els.rose.style.visibility = s > BEAT.roseRises[0] - 0.05 ? 'visible' : 'hidden'
    const pool = px(dropX, poolY)
    els.glow.style.transform = `translate(${pool.x}px, ${pool.y}px)`
    els.glow.style.opacity = String(easeOut(seg(s, BEAT.burst[0], BEAT.burst[1])) * 0.85)
    const ring = seg(s, BEAT.landing, BEAT.landing + 0.4)
    els.ring.setAttribute('cx', String(dropX))
    els.ring.setAttribute('cy', String(poolY - 6))
    els.ring.setAttribute('rx', String(easeOut(ring) * 60))
    els.ring.setAttribute('ry', String(easeOut(ring) * 14))
    els.ring.style.opacity = String(ring > 0 ? 1 - ring : 0)

    // ---- Chapters 3–4 ----
    const deepColour = deep.render(s, ambient, reduced, viewport.width, viewport.height)
    // ---- Chapters 5–6 and the credits (drawn after chapter 4, whose picture they take over) ----
    const endColour = end.render(s, reduced)
    els.stage.style.backgroundColor = endColour ?? deepColour ?? mix(mix(COLOR.night, COLOR.violet, seg(camY, 100, 900)), COLOR.plum, seg(s, 5, BEAT.landing))
    els.stage.style.opacity = String(dip)

    // ---- Words ----
    els.title.style.opacity = String(seg(t, INTRO.title[0], INTRO.title[1]) * (1 - seg(s, 0.1, 0.4)))
    els.hint.style.opacity = String(t >= INTRO.length ? 0.75 * (1 - seg(s, 0.05, 0.2)) : 0)
    LINES.forEach((line, i) => {
      const el = els.lines[i]
      const a = seg(s, line.in, line.in + LINE_FADE_IN)
      const o = line.out === undefined ? 1 : 1 - seg(s, line.out, line.out + LINE_FADE_OUT)
      const shown = reduced ? (a > 0 ? 1 : 0) * o : a * o
      el.style.opacity = shown.toFixed(3)
      el.style.filter = reduced ? 'none' : `blur(${((1 - a) * 8).toFixed(1)}px)`
      el.style.letterSpacing = reduced ? 'normal' : `${((1 - a) * 0.25).toFixed(3)}em`
      el.style.visibility = shown > 0.01 ? 'visible' : 'hidden'
      if (line.handover !== undefined && shown > 0.01) handOver(el, line.handover, line.herFrom ?? 0, s, reduced)
    })
  }

  // His words become hers, word by word: his copy blurs out first, then hers condenses in its place,
  // so a word is never shown as two half-legible copies at once.
  function handOver(el: HTMLElement, start: number, herFrom: number, s: number, reduced: boolean) {
    el.querySelectorAll<HTMLElement>('.w').forEach((word, i) => {
      const at = start + i * WORD_HANDOVER.stagger
      const local = reduced || i < herFrom ? 1 : seg(s, at, at + WORD_HANDOVER.each)
      const his = word.querySelector<HTMLElement>('.his-word')!, her = word.querySelector<HTMLElement>('.her-word')!
      const out = seg(local, 0, 0.5), into = seg(local, 0.5, 1)
      his.style.opacity = String(1 - out)
      his.style.filter = out > 0 && out < 1 ? `blur(${(out * 6).toFixed(1)}px)` : 'none'
      her.style.opacity = String(into)
      her.style.filter = into > 0 && into < 1 ? `blur(${((1 - into) * 6).toFixed(1)}px)` : 'none'
    })
  }

  resize()
  return { resize, render }
}
