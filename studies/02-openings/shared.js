/*
  Study 02 shared code (throwaway). A classic script rather than a module so the pages
  also open straight from the file system. Append ?p=0.5 to a page URL to freeze it.
*/
window.Study = (() => {
  const SVG_NS = 'http://www.w3.org/2000/svg'
  const HIS = '#2D5BFF', HER = '#FF3D2E', LOVE = '#9D3BE0', NIGHT = '#0A0F1F'
  const WIND = 0.25 // rain drifts right by this much per unit it falls

  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
  const seg = (p, a, b) => clamp((p - a) / (b - a))
  const lerp = (a, b, t) => a + (b - a) * t
  const mod = (a, n) => ((a % n) + n) % n
  const easeIn = (t) => t * t
  const easeOut = (t) => 1 - (1 - t) * (1 - t)
  const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)

  function mix(a, b, t) {
    const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16)
    const ch = (s) => Math.round(lerp((A >> s) & 255, (B >> s) & 255, t))
    return '#' + ((ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).padStart(6, '0')
  }

  // Deterministic randomness so every load looks the same.
  function rng(seed) {
    return () => {
      seed = (seed + 0x6d2b79f5) | 0
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
  }

  function el(tag, attrs, parent) {
    const node = document.createElementNS(SVG_NS, tag)
    for (const k in attrs) node.setAttribute(k, attrs[k])
    if (parent) parent.appendChild(node)
    return node
  }

  // Teardrop with its tip up; m sharpens the tip, stretch elongates it.
  function dropPath(cx, cy, r, stretch, m) {
    let d = ''
    for (let i = 0; i <= 48; i++) {
      const t = (i / 48) * Math.PI * 2
      const x = cx + r * Math.sin(t) * Math.pow(Math.sin(t / 2), m)
      const y = cy - r * stretch * Math.cos(t)
      d += (i ? 'L' : 'M') + x.toFixed(1) + ',' + y.toFixed(1)
    }
    return d + 'Z'
  }

  // Silhouettes, drawn around the feet at (0, 0). Vague on purpose.
  const circle = (cx, cy, r) => `M${cx - r},${cy} a${r},${r} 0 1,0 ${r * 2},0 a${r},${r} 0 1,0 ${-r * 2},0`
  const WOMAN =
    circle(4, -298, 21) +
    'M-18,-305 C-20,-332 24,-338 27,-306 C30,-286 28,-262 19,-250 L-13,-252 C-21,-270 -17,-290 -18,-305Z' +
    'M-14,-262 C-30,-260 -42,-252 -44,-236 L-56,-120 C-60,-100 -64,-92 -66,-84 L66,-84 C62,-96 58,-108 54,-128 L44,-238 C42,-254 30,-261 14,-263Z' +
    'M-26,-86 L-22,0 L-11,0 L-9,-86Z M9,-86 L11,0 L22,0 L26,-86Z'
  const MAN =
    circle(0, -330, 23) +
    'M-9,-312 L9,-312 L9,-296 L-9,-296Z' +
    'M-16,-300 C-40,-298 -56,-288 -58,-268 L-64,-150 L-60,-108 L60,-108 L64,-150 L58,-268 C56,-288 40,-298 16,-300Z' +
    'M-34,-110 L-30,0 L-15,0 L-7,-110Z M7,-110 L15,0 L30,0 L34,-110Z'
  // Raised arm from the shoulder (32, -288) to the hand (48, -372).
  const MAN_ARM = 'M24,-294 C38,-298 50,-304 53,-330 L56,-374 L41,-375 L39,-334 C37,-314 33,-302 30,-282Z'
  // Umbrella canopy around its own centre: rim at y=+60, crown at y=-62.
  const CANOPY = 'M-190,60 C-182,-6 -104,-60 0,-62 C104,-60 182,-6 190,60 C162,46 128,46 95,60 C66,46 30,46 0,60 C-30,46 -66,46 -95,60 C-128,46 -162,46 -190,60Z'
  const CANOPY_RIBS = 'M0,-62 L-95,58 M0,-62 L0,58 M0,-62 L95,58'

  // Frame the 1000-unit scene to the viewport: wider on landscape, taller on portrait.
  const view = { x: 0, y: 0, w: 1000, h: 1000 }
  function frame(svg, focusY) {
    const aspect = innerWidth / innerHeight
    if (aspect >= 0.85) Object.assign(view, { w: 1000 * aspect, h: 1000, x: 500 - (1000 * aspect) / 2, y: 0 })
    else Object.assign(view, { w: 760, h: 760 / aspect, x: 120, y: focusY - 760 / aspect / 2 })
    svg.setAttribute('viewBox', `${view.x} ${view.y} ${view.w} ${view.h}`)
  }

  // ---- Ambient rain: slanted streaks driven by time, not scroll ----
  function buildRain(g, count, seed) {
    const r = rng(seed)
    return Array.from({ length: count }, () => ({
      x: r(), phase: r(), speed: 0.9 + r() * 0.5, len: 26 + r() * 46,
      node: el('line', { stroke: '#BFD2FF', 'stroke-opacity': (0.18 + r() * 0.3).toFixed(2), 'stroke-width': 1.3, 'stroke-linecap': 'round' }, g),
    }))
  }
  function renderRain(drops, now) {
    const H = view.h + 200
    for (const d of drops) {
      const y = view.y - 100 + mod(d.phase * H + now * d.speed, H)
      const x = view.x - 300 + d.x * (view.w + 300) + (y - view.y) * WIND
      d.node.setAttribute('x1', x.toFixed(1))
      d.node.setAttribute('y1', y.toFixed(1))
      d.node.setAttribute('x2', (x - d.len * WIND).toFixed(1))
      d.node.setAttribute('y2', (y - d.len).toFixed(1))
    }
  }

  // ---- The shared ending: falling with him while flowers open ----
  const PETAL = 'M0,-1 C0.62,-0.55 0.55,0.62 0,1 C-0.55,0.62 -0.62,-0.55 0,-1Z'
  function buildFall(g) {
    g.ownerSVGElement.querySelector('defs').insertAdjacentHTML('beforeend',
      '<filter id="fallBack" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.5"/></filter>' +
      '<filter id="fallFront" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9"/></filter>')
    const r = rng(11)
    const speedG = el('g', {}, g)
    const back = el('g', { filter: 'url(#fallBack)' }, g)
    const flowersG = el('g', {}, g)
    const mid = el('g', {}, g)
    const drop = el('path', {}, g)
    const shine = el('ellipse', { fill: '#fff', 'fill-opacity': 0.6 }, g)
    const front = el('g', { filter: 'url(#fallFront)' }, g)
    const petal = (layer, z) => ({ x: r(), y: r(), z, rot: r() * 360, spin: (r() - 0.5) * 300, node: el('path', { d: PETAL }, layer) })
    return {
      drop, shine,
      // Everything but the drop, with base opacities, so the blooms can fade in around him.
      layers: [[speedG, 1], [back, 0.6], [flowersG, 1], [mid, 1], [front, 0.85]],
      streaks: Array.from({ length: 26 }, () => ({
        x: r(), y: r(), len: 60 + r() * 160,
        node: el('line', { stroke: '#fff', 'stroke-opacity': (0.06 + r() * 0.1).toFixed(2), 'stroke-width': 1.5 }, speedG),
      })),
      petals: [
        ...Array.from({ length: 22 }, () => petal(back, 0.35 + r() * 0.3)),
        ...Array.from({ length: 16 }, () => petal(mid, 0.8 + r() * 0.4)),
        ...Array.from({ length: 6 }, () => petal(front, 2 + r() * 0.8)),
      ],
      flowers: Array.from({ length: 12 }, (_, i) => {
        const node = el('g', {}, flowersG)
        const n = 6 + Math.floor(r() * 3)
        return {
          x: r(), y: i / 12 + r() * 0.05, z: 0.7 + r() * 0.9, rot: r() * 360, n,
          petals: Array.from({ length: n }, () => el('path', { d: PETAL }, node)),
          heart: el('circle', {}, node),
        }
      }),
    }
  }

  // Options: travel (how far the camera has fallen, in scene units), x/y (where his drop is), fade (blooms).
  function renderFall(f, p, o = {}) {
    const travel = o.travel ?? p * 2600
    const S = view.h + 500
    const top = view.y - 250
    const cx = o.x ?? view.x + view.w / 2, cy = o.y ?? view.y + view.h * 0.42
    for (const [layer, base] of f.layers) layer.style.opacity = base * (o.fade ?? 1)
    const bloom = mix(HER, LOVE, easeInOut(seg(p, 0.35, 0.95)))

    for (const s of f.streaks) {
      const x = view.x + s.x * view.w, y = top + mod(s.y * S - travel * 1.8, S)
      s.node.setAttribute('x1', x.toFixed(1)); s.node.setAttribute('x2', x.toFixed(1))
      s.node.setAttribute('y1', y.toFixed(1)); s.node.setAttribute('y2', (y + s.len).toFixed(1))
    }
    for (const pt of f.petals) {
      const y = top + mod(pt.y * S - travel * pt.z, S)
      const x = view.x - 100 + pt.x * (view.w + 200) + Math.sin(p * 6 + pt.rot) * 30 * pt.z
      const s = 16 * pt.z
      pt.node.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(pt.rot + pt.spin * p).toFixed(1)}) scale(${(s * 0.6).toFixed(1)} ${s.toFixed(1)})`)
      pt.node.setAttribute('fill', bloom)
    }
    // Flowers open as they rise past him, and stay open.
    for (const fl of f.flowers) {
      const y = top + mod(fl.y * S - travel * fl.z, S)
      const x = view.x + (0.12 + fl.x * 0.76) * view.w
      const open = easeOut(seg(view.y + view.h - y, 0, view.h * 0.6))
      const R = 34 * fl.z
      fl.petals.forEach((node, k) => {
        node.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(fl.rot + (k * 360) / fl.n + p * 40).toFixed(1)}) translate(0 ${(-R * open).toFixed(1)}) scale(${(R * 0.7 * open).toFixed(2)} ${(R * open).toFixed(2)})`)
        node.setAttribute('fill', bloom)
      })
      fl.heart.setAttribute('cx', x.toFixed(1)); fl.heart.setAttribute('cy', y.toFixed(1))
      fl.heart.setAttribute('r', (R * 0.35 * open).toFixed(1))
      fl.heart.setAttribute('fill', mix(bloom, '#FFD27A', 0.6))
    }
    f.drop.setAttribute('d', dropPath(cx, cy, 20, 1.35 + 0.08 * Math.sin(p * 40), 1.3))
    f.drop.setAttribute('fill', mix(HIS, LOVE, seg(p, 0.4, 1) * 0.6))
    f.shine.setAttribute('cx', cx - 6); f.shine.setAttribute('cy', cy + 6)
    f.shine.setAttribute('rx', 4); f.shine.setAttribute('ry', 7)
  }

  // ---- Story lines condense like breath on glass: blur, spacing and opacity settle together ----
  function renderLines(nodes, p) {
    for (const n of nodes) {
      const a = seg(p, +n.dataset.in, +n.dataset.in + 0.07)
      const o = n.dataset.out ? 1 - seg(p, +n.dataset.out, +n.dataset.out + 0.04) : 1
      n.style.opacity = (a * o).toFixed(3)
      n.style.filter = `blur(${((1 - a) * 8).toFixed(1)}px)`
      n.style.letterSpacing = `${((1 - a) * 0.25).toFixed(3)}em`
    }
  }

  function caption(p, list, node) {
    let text = list[0][1]
    for (const [at, t] of list) if (p >= at) text = t
    if (node.textContent !== text) node.textContent = text
  }

  // ---- Scroll and Play share one timeline: Play just scrolls the page ----
  function run({ render, duration, onInput = () => {} }) {
    const button = document.getElementById('play')
    const hint = document.getElementById('hint')
    const maxScroll = () => document.documentElement.scrollHeight - innerHeight
    const target = () => clamp(scrollY / maxScroll())
    const frozen = new URLSearchParams(location.search).get('p')
    let shown = target(), playing = false, last = performance.now(), playPos = 0

    const idleLabel = () => (target() >= 0.999 ? 'Replay' : 'Play')
    function setPlaying(value) {
      playing = value
      button.setAttribute('aria-pressed', String(value))
      button.textContent = value ? 'Pause' : idleLabel()
    }

    button.addEventListener('click', () => {
      if (playing) return setPlaying(false)
      onInput()
      if (target() >= 0.999) scrollTo(0, 0)
      playPos = scrollY
      last = performance.now()
      hint.style.opacity = 0
      setPlaying(true)
    })

    // Any manual scroll input takes control back from Play.
    const interrupt = () => { onInput(); if (playing) setPlaying(false) }
    addEventListener('wheel', interrupt, { passive: true })
    addEventListener('touchstart', interrupt, { passive: true })
    addEventListener('keydown', (e) => {
      if (e.target !== button && ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(e.key)) interrupt()
    })

    if (frozen !== null) {
      button.hidden = hint.hidden = true
      render(clamp(parseFloat(frozen) || 0), 4000, true)
      return
    }

    function tick(now) {
      if (playing) {
        // A large jump means the scrollbar was dragged mid-play.
        if (Math.abs(scrollY - playPos) > 4) setPlaying(false)
        else {
          playPos = Math.min(maxScroll(), playPos + ((now - last) * maxScroll()) / duration)
          scrollTo(0, playPos)
          if (playPos >= maxScroll()) setPlaying(false)
        }
      }
      last = now
      if (!playing && button.textContent !== idleLabel()) setPlaying(false)
      shown += (target() - shown) * 0.18
      if (Math.abs(target() - shown) < 0.0005) shown = target()
      render(shown, now, false)
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }

  return {
    HIS, HER, LOVE, NIGHT, WIND, WOMAN, MAN, MAN_ARM, CANOPY, CANOPY_RIBS, view,
    clamp, seg, lerp, mod, easeIn, easeOut, easeInOut, mix, rng, el, dropPath,
    frame, buildRain, renderRain, buildFall, renderFall, renderLines, caption, run,
  }
})()
