import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { stringPath } from './redString'

type Props = {
  progress: number // real loading progress, 0..1
  ready: boolean
  stalled: boolean
  reducedMotion: boolean
  onBegin: () => void // the visitor pressed Begin (or Begin anyway)
  onGone: () => void // the loader has finished leaving
}

// The red string: untangles with real progress, then offers Begin. On Begin it gathers at her end,
// falls as the first streak of rain, and the loader fades away.
export function Loader({ progress, ready, stalled, reducedMotion, onBegin, onGone }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const path = useRef<SVGPathElement>(null)
  const begin = useRef<HTMLButtonElement>(null)
  const target = useRef(progress)
  const state = useRef({ shown: 0, fall: 0 })
  useEffect(() => {
    target.current = progress
  }, [progress])

  const { contextSafe } = useGSAP(
    () => {
      const tick = (time: number) => {
        const el = root.current
        if (!el || !path.current) return
        const s = state.current
        // Ease toward the real progress, never backwards.
        s.shown = Math.max(s.shown, s.shown + (target.current - s.shown) * 0.08)
        const geo = { width: el.clientWidth, height: el.clientHeight }
        const { d, end } = stringPath(s.shown, geo, time * 1000, reducedMotion ? 0 : 1, s.fall)
        path.current.setAttribute('d', d)
        if (begin.current) begin.current.style.transform = `translate(${end.x}px, ${end.y}px) translate(18px, -50%)`
      }
      gsap.ticker.add(tick)
      return () => gsap.ticker.remove(tick)
    },
    { scope: root, dependencies: [reducedMotion] },
  )

  // Wrapped at click time so the tweens belong to this component's GSAP context and are cleaned up with it.
  const start = () =>
    contextSafe(() => {
      if (begin.current) begin.current.dataset.visible = 'false'
      onBegin()
      const tl = gsap.timeline({ onComplete: onGone })
      if (!reducedMotion) tl.to(state.current, { shown: 1, fall: 1, duration: 1.1, ease: 'power1.in' })
      tl.to(root.current, { autoAlpha: 0, duration: reducedMotion ? 0.2 : 0.5 }, reducedMotion ? 0 : '-=0.35')
    })()

  const percent = Math.round(progress * 100)
  return (
    <div className="loader" ref={root}>
      <svg className="loader-string" aria-hidden="true">
        <path ref={path} />
      </svg>
      <p className="loader-caption">A Love Story</p>
      <div
        className="loader-status"
        role="progressbar"
        aria-label="Loading the first act"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
      />
      <button ref={begin} className="loader-begin" type="button" onClick={start} disabled={!ready && !stalled} data-visible={ready || stalled}>
        {ready ? 'Begin' : 'Begin anyway'}
      </button>
    </div>
  )
}
