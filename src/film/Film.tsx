import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Loader } from './Loader'
import { BLOOM_SPRITES } from './blooms'
import { aspect, pick, preload, type Loaded, type MediaName, type Picked } from './media'
import { createRenderer, type Elements } from './renderer'
import { HER, HIM, UMBRELLA, UMBRELLA_CLOSED, frameFor, stageSize } from './scene'
import type { DeepElements } from './chapters34'
import { END_SPRITES, type EndElements } from './chapters56'
import { BEAT, FIRST_ACT_END, INTRO, LINES, MIDDLE_END, PLAY_SECONDS, PUSH_IN, SCREENS, STORY, storyAt } from './timeline'
import './film.css'

const FONTS = ['400 24px "Nothing You Could Do"', 'italic 500 40px "Bodoni Moda"', '400 12px "Inter"']
const STALL_MS = 8000
const SAVED = 'a-love-story:progress'

// Every image the film needs, at the size this screen will show it: the first act (waited for by the
// red string), then chapters 3–4 and chapters 5–6 (loaded quietly after Begin, in that order).
function plan() {
  const frame = frameFor(innerWidth, innerHeight)
  const px = (units: number) => units * frame.scale
  const plate: MediaName = innerWidth / innerHeight >= 0.85 ? 'street-landscape' : 'street-portrait'
  const roseSize = px(Math.min(frame.w * 1.05, frame.h * 0.75))
  const picks: Record<string, Picked> = {
    plate: pick(plate, px(Math.max(frame.w, frame.h * 1.5) * 1.04)),
    her: pick('her', px(HER.w * PUSH_IN)),
    him: pick('him', px(HIM.w * PUSH_IN)),
    himWalk: pick('him-walking', px(HIM.w)),
    umbrellaOpen: pick('umbrella-open', px(UMBRELLA.size * PUSH_IN)),
    umbrellaClosed: pick('umbrella-closed', px(UMBRELLA_CLOSED.w)),
    roseBud: pick('her-rose-bud', roseSize),
    roseOpening: pick('her-rose-opening', roseSize),
    roseFull: pick('her-rose-full', roseSize),
    // His drop: about 16 units wide at its biggest, seen at up to the push-in scale.
    dropClear: pick('drop-clear', px(16 * 5.1 * (1024 / 1536) * PUSH_IN)),
    dropBlue: pick('drop-blue', px(16 * 5.1 * (1024 / 1536) * PUSH_IN)),
    dropPainted: pick('drop-painted', px(55 * PUSH_IN)),
  }
  const sprites = BLOOM_SPRITES.map((name) => pick(name, 0))
  const cover = Math.max(innerWidth, innerHeight) * 1.2
  const ahead: Record<string, Picked> = {
    insideOpen: pick('inside-open', cover),
    insideClosing: pick('inside-closing', cover),
    curl: pick('her-rose-curling', Math.min(innerWidth * 0.92, innerHeight * 0.56)),
    herStrong: pick('her-strong', innerHeight * 0.82 * aspect('her-strong')),
    dryPetal: pick('torn-5', 0),
  }
  const end: Record<string, Picked> = {
    stem: pick('bare-stem', innerHeight * 0.62 * aspect('bare-stem')),
    herLeaving: pick('her-leaving', innerHeight * 0.78 * aspect('her-leaving')),
    // The last of the water; sizes follow the chapter-4 rose box (min(vw·0.85, vh·0.48)).
    cup: pick('water-cup', (Math.min(innerWidth * 0.85, innerHeight * 0.48) * 0.3) / 0.89),
    beadRed: pick('bead-red', (Math.min(innerWidth * 0.85, innerHeight * 0.48) * 0.1) / 0.52),
    beadGrey: pick('bead-grey', (Math.min(innerWidth * 0.85, innerHeight * 0.48) * 0.1) / 0.52),
    fallGrey: pick('drop-grey-falling', (Math.min(innerWidth * 0.85, innerHeight * 0.48) * 0.1) / 0.45),
    bleed: pick('red-bleed', innerWidth * 0.62),
  }
  return {
    plate,
    picks: { ...picks, ...ahead, ...end },
    first: [...Object.values(picks), ...sprites],
    ahead: Object.values(ahead),
    end: [...Object.values(end), ...END_SPRITES.map((name) => pick(name, 0))],
  }
}

function readSaved() {
  try {
    return Number(sessionStorage.getItem(SAVED)) || 0
  } catch {
    return 0
  }
}
function save(p: number) {
  try {
    sessionStorage.setItem(SAVED, p.toFixed(4))
  } catch {
    // Private mode: returning mid-page simply starts from the top.
  }
}

export function Film() {
  const act = useMemo(() => plan(), [])
  const [progress, setProgress] = useState(0)
  const [ready, setReady] = useState(false)
  const [stalled, setStalled] = useState(false)
  const [started, setStarted] = useState(false)
  const [loaderGone, setLoaderGone] = useState(false)
  const [playing, setPlaying] = useState<'idle' | 'playing' | 'ended'>('idle')
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)

  const root = useRef<HTMLDivElement>(null)
  const spacer = useRef<HTMLDivElement>(null)
  const els = useRef<Partial<Elements>>({
    bloomCanvases: [],
    roseImgs: [],
    lines: [],
    deep: { insideImgs: [], ink: [] } as unknown as DeepElements,
    end: { ripples: [] } as unknown as EndElements,
  })
  const playTween = useRef<gsap.core.Tween | null>(null)
  const intro = useRef<gsap.core.Tween | null>(null)
  const introDone = useRef(false)
  const loaded = useRef<Loaded>(new Map())
  const aheadReady = useRef(false)
  const endReady = useRef(false)
  // Set by Replay / Watch again: once the film is back at the top, the opening replays (and Play resumes).
  const replayPending = useRef<'watch' | 'play' | null>(null)
  const startPlayRef = useRef<(delay?: number) => void>(() => {})
  const playButton = useRef<HTMLButtonElement>(null)

  // Load the first act; the red string follows the real progress. Stalls offer "Begin anyway".
  useEffect(() => {
    let last = performance.now()
    let done = false
    const timer = setInterval(() => !done && performance.now() - last > STALL_MS && setStalled(true), 1000)
    const onProgress = (f: number) => {
      last = performance.now()
      setStalled(false)
      setProgress(f)
    }
    preload(act.first, FONTS, onProgress, loaded.current).then(() => {
      done = true
      setReady(true)
    })
    return () => clearInterval(timer)
  }, [act])

  // After Begin, chapters 3–4 then 5–6 load quietly; until a group is ready the film holds just before it.
  useEffect(() => {
    if (!started) return
    preload(act.ahead, [], () => {}, loaded.current)
      .then(() => {
        aheadReady.current = true
        return preload(act.end, [], () => {}, loaded.current)
      })
      .then(() => void (endReady.current = true))
  }, [started, act])

  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(query.matches)
    query.addEventListener('change', onChange)
    history.scrollRestoration = 'manual'
    return () => query.removeEventListener('change', onChange)
  }, [])

  // After Begin: build the renderer, tie it to scroll, and play the opening once.
  const { contextSafe } = useGSAP(
    () => {
      if (!started || !spacer.current) return
      const renderer = createRenderer(els.current as Elements, loaded.current, act.plate)
      const proxy = { p: 0 }
      const opening = { ms: 0 }
      const saved = readSaved()
      // A resize changes the page height, and the browser clamps the scroll position; remember the place
      // in the story when a resize starts and put the visitor back there once ScrollTrigger has re-measured.
      let place = saved
      let restore: number | null = null
      let resizingUntil = 0

      gsap.to(proxy, {
        p: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: spacer.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
          onUpdate: (self) => {
            if (performance.now() < resizingUntil) return
            place = self.progress
            save(place)
            if (place < 0.995) setPlaying((state) => (state === 'ended' ? 'idle' : state))
          },
        },
      })
      const onRefresh = () => {
        if (restore === null) return
        window.scrollTo(0, restore * (document.documentElement.scrollHeight - innerHeight))
        restore = null
      }
      ScrollTrigger.addEventListener('refresh', onRefresh)

      // The opening plays by itself; any input, a mid-page return or reduced motion skips to its end.
      intro.current = gsap.to(opening, {
        ms: INTRO.length,
        duration: INTRO.length / 1000,
        ease: 'none',
        onComplete: () => void (introDone.current = true),
      })
      if (reduced || saved > 0.01 || introDone.current) intro.current.progress(1)
      if (saved > 0.01) {
        ScrollTrigger.refresh()
        window.scrollTo(0, saved * (document.documentElement.scrollHeight - innerHeight))
      }
      const skip = () => intro.current?.progress(1)
      // Manual input skips the opening, and cancels a Replay that is still waiting for the opening to end.
      const onInput = () => {
        skip()
        const waiting = playTween.current && playTween.current.delay() > 0 && playTween.current.time() === 0
        if (waiting) {
          playTween.current?.kill()
          setPlaying('idle')
        }
      }
      const keys = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' ']
      const onKey = (e: KeyboardEvent) => keys.includes(e.key) && onInput()
      addEventListener('wheel', onInput, { passive: true })
      addEventListener('touchstart', onInput, { passive: true })
      addEventListener('keydown', onKey)

      const tick = (time: number) => {
        if (replayPending.current) {
          // Back at the top after Replay / Watch again: replay the opening, then (for Replay) play on.
          if (proxy.p < 0.002) {
            const mode = replayPending.current
            replayPending.current = null
            intro.current?.restart()
            if (mode === 'play') startPlayRef.current(INTRO.length / 1000)
          }
        } else if (proxy.p > 0.002) skip()
        const story = storyAt(proxy.p * SCREENS)
        // Not loaded yet: the film holds just before the chapters whose images are still on their way.
        const limit = !aheadReady.current ? FIRST_ACT_END - 0.05 : !endReady.current ? MIDDLE_END - 0.05 : STORY
        renderer.render(Math.min(story, limit), opening.ms, time * 1000, reduced)
        // Once the credits begin, Watch again is the way back; the Play button steps aside.
        if (playButton.current) playButton.current.style.visibility = story >= BEAT.credits[0] ? 'hidden' : 'visible'
      }
      gsap.ticker.add(tick)
      // Only real size changes count: on phones, the browser bars sliding in and out also fire resize
      // events, but they don't change the stage (sized to the large viewport) or the page height.
      let stage = stageSize()
      const onResize = () => {
        const next = stageSize()
        if (next.width === stage.width && next.height === stage.height) return
        stage = next
        renderer.resize()
        if (restore === null) restore = place
        resizingUntil = performance.now() + 600
      }
      addEventListener('resize', onResize)
      return () => {
        gsap.ticker.remove(tick)
        ScrollTrigger.removeEventListener('refresh', onRefresh)
        removeEventListener('resize', onResize)
        removeEventListener('wheel', onInput)
        removeEventListener('touchstart', onInput)
        removeEventListener('keydown', onKey)
      }
    },
    { scope: root, dependencies: [started, reduced], revertOnUpdate: true },
  )

  // Play scrolls the page; touching, wheeling or keys stop it (autoKill). Wrapped at call time so the
  // tween belongs to this component's GSAP context.
  const startPlay = (delay = 0) =>
    contextSafe(() => {
      const max = document.documentElement.scrollHeight - innerHeight
      setPlaying('playing')
      playTween.current = gsap.to(window, {
        scrollTo: { y: 'max', autoKill: true, onAutoKill: () => setPlaying('idle') },
        duration: Math.max(1, (1 - scrollY / max) * PLAY_SECONDS),
        delay,
        ease: 'none',
        onComplete: () => setPlaying('ended'),
      })
    })()
  useEffect(() => {
    startPlayRef.current = startPlay
  })

  // Replay (the Play button at the end) and Watch again (in the credits) both go back to the top and replay
  // the opening; Replay then plays on by itself.
  const replay = (autoplay: boolean) => {
    playTween.current?.kill()
    replayPending.current = autoplay ? 'play' : 'watch'
    setPlaying(autoplay ? 'playing' : 'idle')
    window.scrollTo(0, 0)
  }

  const togglePlay = () => {
    if (playing === 'playing') {
      playTween.current?.kill()
      setPlaying('idle')
      return
    }
    const max = document.documentElement.scrollHeight - innerHeight
    if (playing === 'ended' || scrollY >= max - 2) return replay(true)
    intro.current?.progress(1)
    startPlay()
  }

  const ref = <K extends keyof Elements>(key: K) => (node: Elements[K] | null) => {
    if (node) els.current[key] = node
  }
  const listRef = (key: 'bloomCanvases' | 'roseImgs' | 'lines', i: number) => (node: HTMLElement | null) => {
    if (node) (els.current[key] as HTMLElement[])[i] = node
  }
  // The stage's images attach only after Begin: they are already preloaded, and painting them
  // underneath the loading screen would only cost the phone work.
  const deepRef = <K extends keyof DeepElements>(key: K) => (node: DeepElements[K] | null) => {
    if (node) (els.current.deep as DeepElements)[key] = node
  }
  const deepList = (key: 'insideImgs' | 'ink', i: number) => (node: HTMLElement | null) => {
    if (node) ((els.current.deep as DeepElements)[key] as HTMLElement[])[i] = node
  }
  const endRef = <K extends keyof EndElements>(key: K) => (node: EndElements[K] | null) => {
    if (node) (els.current.end as EndElements)[key] = node
  }
  const rippleRef = (i: number) => (node: SVGEllipseElement | null) => {
    if (node) (els.current.end as EndElements).ripples[i] = node
  }
  const src = (key: string) => (started ? act.picks[key].url : undefined)

  return (
    <div className="film" ref={root}>
      <div className="stage" ref={ref('stage')} aria-hidden="true">
        <div className="world" ref={ref('world')}>
          <img className="plate" ref={ref('plate')} src={src('plate')} alt="" />
          <div className="ground" ref={ref('ground')} />
          <img className="figure" ref={ref('her')} src={src('her')} alt="" />
          {/* The umbrella sits behind him, so his fist closes around the handle. */}
          <img className="umbrella" ref={ref('umbrellaClosed')} src={src('umbrellaClosed')} alt="" />
          <img className="umbrella" ref={ref('umbrellaOpen')} src={src('umbrellaOpen')} alt="" />
          <img className="figure" ref={ref('himWalk')} src={src('himWalk')} alt="" />
          <img className="figure" ref={ref('him')} src={src('him')} alt="" />
          <svg className="world-svg" viewBox="0 0 1000 1000">
            <defs>
              <filter id="goo" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="b" />
                <feColorMatrix in="b" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" />
              </filter>
            </defs>
            <g className="splashes" ref={ref('splashes')} />
            <g className="canopy-drops" ref={ref('canopy')} filter="url(#goo)" />
          </svg>
          {/* His drop hanging from the rim: photographed, clear, then in his blue. */}
          <img className="drop" ref={ref('hangClear')} src={src('dropClear')} alt="" />
          <img className="drop" ref={ref('hangBlue')} src={src('dropBlue')} alt="" />
        </div>
        <canvas className="rain" ref={ref('rain')} />
        {/* Chapter 2: the fall through the blooms. Rises away above the waterline in chapter 3. */}
        <div className="act2" ref={deepRef('act2')}>
          <canvas className="bloom far" ref={listRef('bloomCanvases', 0)} />
          <canvas className="bloom" ref={listRef('bloomCanvases', 1)} />
          <div className="glow" ref={ref('glow')} />
          <div className="rose" ref={ref('rose')}>
            <img ref={listRef('roseImgs', 0)} src={src('roseBud')} alt="" />
            <img ref={listRef('roseImgs', 1)} src={src('roseOpening')} alt="" />
            <img ref={listRef('roseImgs', 2)} src={src('roseFull')} alt="" />
          </div>
          <svg className="screen-svg" ref={ref('screenSvg')}>
            <ellipse className="ring" ref={ref('ring')} />
          </svg>
          {/* His drop falling: the photograph as he lets go, becoming the painted drop. */}
          <img className="fall-drop" ref={ref('fallPhoto')} src={src('dropBlue')} alt="" />
          <img className="fall-drop" ref={ref('fallPaint')} src={src('dropPainted')} alt="" />
          <canvas className="bloom near" ref={listRef('bloomCanvases', 2)} />
        </div>

        {/* Chapter 3: inside her rose, below the waterline. */}
        <div className="inside" ref={deepRef('inside')}>
          <div className="waterline" />
          <img ref={deepList('insideImgs', 0)} src={src('insideOpen')} alt="" />
          <img ref={deepList('insideImgs', 1)} src={src('insideClosing')} alt="" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="ink" ref={deepList('ink', i)} />
          ))}
          <div className="stain" ref={deepRef('stain')} />
          <div className="petal-glow" ref={deepRef('petalGlow')} />
        </div>

        {/* Chapter 4: her rose curling, her standing strong, his reflection fading. */}
        <div className="outside" ref={deepRef('outside')}>
          {/* Chapters 4–5's picture; in chapter 6 it rises away as he falls into black. */}
          <div className="outside-scene" ref={endRef('scene')}>
            <img
              className="her-strong"
              ref={(node) => {
                deepRef('herStrong')(node)
                endRef('herStrong')(node)
              }}
              src={src('herStrong')}
              alt=""
            />
            <img className="her-leaving" ref={endRef('herLeaving')} src={src('herLeaving')} alt="" />
            <img className="stem" ref={endRef('stem')} src={src('stem')} alt="" />
            <img
              className="curl"
              ref={(node) => {
                deepRef('curl')(node)
                endRef('curl')(node)
              }}
              src={src('curl')}
              alt=""
            />
            <img className="reflection" ref={deepRef('reflection')} src={src('him')} alt="" />
            <img className="dry-petal" ref={deepRef('dryPetal')} src={src('dryPetal')} alt="" />
            <canvas className="storm" ref={endRef('storm')} />
          </div>
          <div className="void" ref={endRef('voidCover')} />
        </div>

        {/* The one ripple in the black, and the last of the water (painted), in screen pixels. */}
        <svg className="end-svg" ref={endRef('svg')}>
          <defs>
            <radialGradient id="impact-flash">
              <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="0.25" stopColor="#cfd9ff" stopOpacity="0.45" />
              <stop offset="1" stopColor="#cfd9ff" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="water-horizon">
              <stop offset="0" stopColor="#b9c6ee" stopOpacity="0" />
              <stop offset="0.5" stopColor="#e8eeff" stopOpacity="1" />
              <stop offset="1" stopColor="#b9c6ee" stopOpacity="0" />
            </linearGradient>
            <filter id="ring-glow" x="-10%" y="-50%" width="120%" height="200%">
              <feGaussianBlur stdDeviation="3" />
            </filter>
          </defs>
          <rect className="horizon" ref={endRef('horizon')} x="0" height="2" fill="url(#water-horizon)" />
          {[0, 1, 2, 3, 4].map((i) => (
            <ellipse key={i} className="ripple" ref={rippleRef(i)} filter={i === 1 ? 'url(#ring-glow)' : undefined} />
          ))}
          <circle className="flash" ref={endRef('flash')} fill="url(#impact-flash)" />
        </svg>
        <div className="end-water">
          <img className="bleed" ref={endRef('bleed')} src={src('bleed')} alt="" />
          <img ref={endRef('cup')} src={src('cup')} alt="" />
          <img ref={endRef('beadRed')} src={src('beadRed')} alt="" />
          <img ref={endRef('beadGrey')} src={src('beadGrey')} alt="" />
          <img className="fall-grey" ref={endRef('fallGrey')} src={src('fallGrey')} alt="" />
        </div>
      </div>

      <h1 className="title" ref={ref('title')}>
        <small>Abraham Naiborhu presents</small>
        <span>A Love Story</span>
      </h1>
      {(['street', 'sky', 'deep'] as const).map((place) => (
        <div key={place} className={`lines ${place}`}>
          {LINES.map((line, i) =>
            line.place === place ? (
              <p key={line.text} className={`line ${line.voice}`} style={{ '--row': line.row } as CSSProperties} ref={listRef('lines', i)}>
                {line.handover === undefined
                  ? line.text
                  : // Each word twice, stacked: his hand (hidden from screen readers) and hers, the sentence they read.
                    line.text.split(' ').map((word, w) => (
                      <span key={w}>
                        {w > 0 && ' '}
                        <span className="w">
                          <span className="his-word" aria-hidden="true">{word}</span>
                          <span className="her-word">{word}</span>
                        </span>
                      </span>
                    ))}
              </p>
            ) : null,
          )}
        </div>
      ))}
      <p className="hint" ref={ref('hint')}>Scroll, or press Play</p>
      <p className="nobody" ref={endRef('nobody')}>Mr. Nobody</p>
      <section className="credits" ref={endRef('credits')} aria-label="Credits">
        <p className="credits-title">A Love Story</p>
        <p className="credits-role">Written &amp; directed by</p>
        <p className="credits-name">Abraham Naiborhu</p>
        <p className="credits-ask">Have a story to tell?</p>
        <a className="credits-link" href="https://abrahamnaiborhu.com/">
          abrahamnaiborhu.com
        </a>
        <button className="credits-again" type="button" onClick={() => replay(false)}>
          Watch again
        </button>
      </section>
      {loaderGone && (
        <button className="play" type="button" ref={playButton} onClick={togglePlay} aria-pressed={playing === 'playing'}>
          {playing === 'playing' ? 'Pause' : playing === 'ended' ? 'Replay' : 'Play'}
        </button>
      )}

      <div className="spacer" ref={spacer} style={{ height: started ? `${(SCREENS + 1) * 100}svh` : '100svh' }} />

      {!loaderGone && (
        <Loader
          progress={progress}
          ready={ready}
          stalled={stalled}
          reducedMotion={reduced}
          onBegin={() => setStarted(true)}
          onGone={() => setLoaderGone(true)}
        />
      )}
    </div>
  )
}
