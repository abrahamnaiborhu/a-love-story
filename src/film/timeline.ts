// Every beat of the film so far, measured in "screens" of scrolling (1 = one viewport height).
// Timing lives here so it can be tuned without touching the drawing code. See docs/STORYBOARD.md.

// Story time is measured in "story screens"; the visitor scrolls through STORY plus the holds below.
export const STORY = 25 // chapters 1–6 and the credits, in story screens
// Where each loading group ends: the film holds just before a group whose images aren't ready yet.
export const FIRST_ACT_END = 8 // chapters 1–2 (waited for by the red string)
export const MIDDLE_END = 16 // chapters 3–4 (loaded after Begin)

export const BEAT = {
  // Chapter 1 — First sight
  canopyDrops: [0.2, 2.2], // raindrops appear on the umbrella and run to her side
  dropGrows: [0.4, 2.6], // the drop at the rim swells
  dropStretch: [1.4, 2.9],
  dropTurnsBlue: [1.2, 2.6],
  pushIn: [1.8, 2.85], // gentle camera push-in, settled before he lets go
  release: 3.0, // he lets go
  // Chapter 2 — Falling
  accelerate: 0.5, // screens spent speeding up after release
  fallSpeed: 1200, // scene units per screen once falling steadily
  bloomsTurnPurple: [4.5, 7.0],
  roseRises: [6.0, 7.2],
  roseOpen: [6.5, 6.7], // short cross-fades: the three paintings differ, so long blends look ghostly
  roseFull: [6.85, 7.05],
  landing: 7.2, // he lands in the heart of her rose
  burst: [7.2, 7.45], // every flower bursts into full bloom
  petalRain: [7.2, 7.5], // purple rain begins
  // Chapter 3 — Becoming her
  waterline: [8.0, 9.0], // the pool's surface rises up the screen: we sink into her
  insideDrift: [8.0, 12.4], // the inside view drifts as we settle to the bottom of her cup
  ink: [8.7, 10.0], // his blue blooms through her water
  trails: [9.4, 11.0], // blue trails rise up the veins of her petals (and turn purple)
  petalsGlow: [9.6, 11.2],
  walls: [11.3, 11.9], // petals lean in: the view becomes walls
  // Chapter 4 — Losing himself (after a deliberate dissolve: time has passed)
  dissolve: [12.35, 12.9],
  herAppears: [12.9, 13.6],
  reflectionFades: [13.0, 15.6], // his reflection, fainter at every beat
  dryPetal: [15.1, 16.0], // the rest: one dry petal falls
  // Chapter 5 — Losing her
  tearFirst: 16.25, // one petal tears away…
  tearSecond: 16.7, // …then another…
  storm: [17.0, 17.6], // …then all at once
  roseGone: [17.15, 17.8], // her rose gives way to the bare stem
  waterHolds: [17.6, 18.05], // the water keeps the cup's shape a moment, with nothing around it
  slump: [18.05, 18.5],
  herLeaves: [17.5, 18.9], // she turns and walks out of frame
  redDrains: [18.1, 19.0], // the red leaves the water and follows her; he is grey
  // Chapter 6 — Mr. Nobody
  slipOff: 20.2, // the grey water slips off the stem and falls into black
  impact: 21.7,
  flash: [21.7, 21.82], // a pinprick of light where he touches the water
  ripple: [21.7, 22.15], // one bright ring races outward, wider than the screen…
  echoes: [21.78, 22.6], // …followed by slower, fainter echoes
  horizon: [21.72, 22.2], // for an instant, light runs along a vast black water surface
  nobody: [22.65, 22.95], // after a beat of pure black, his name is pressed into the dark
  nobodyOut: [23.0, 23.08],
  // Credits
  credits: [23.1, 24.4], // a cut to black, then the credits roll up and settle
} as const

export const PUSH_IN = 1.35

// Opening (time-based, plays by itself after Begin), in milliseconds.
export const INTRO = {
  length: 6400,
  fadeIn: [0, 900],
  walk: [1500, 3600],
  raise: [3500, 4300], // his pose and the umbrella rise to the grip
  poseSwap: [3780, 3900], // walking → standing photo: a quick swap mid-raise, hidden in the movement
  open: [4200, 5300],
  title: [5000, 6200],
} as const

// place: 'street' sits clear of the umbrella (below the couple on phones, beside them on wider screens);
// 'sky' sits at the top, for the fall; 'deep' sits low and centred, inside and around her rose.
// row stacks the lines of one beat. handover: the screen at which his words start turning into hers,
// word by word; herFrom: how many leading words are already hers.
export type Line = {
  text: string
  voice: 'his' | 'her'
  in: number
  out?: number
  place: 'street' | 'sky' | 'deep'
  row: number
  handover?: number
  herFrom?: number
}

// His voice. Lines condense like breath on glass as they come in (see renderer).
export const LINES: Line[] = [
  { text: 'It was raining.', voice: 'his', in: 0.3, out: 2.95, place: 'street', row: 0 },
  { text: 'She had no umbrella.', voice: 'his', in: 0.9, out: 2.95, place: 'street', row: 1 },
  { text: 'I had one.', voice: 'his', in: 1.5, out: 2.95, place: 'street', row: 2 },
  { text: 'I fell.', voice: 'his', in: 4.0, out: 6.6, place: 'sky', row: 0 },
  { text: 'I kept falling.', voice: 'his', in: 4.7, out: 6.6, place: 'sky', row: 1 },
  { text: "I didn't want to land anywhere but you.", voice: 'his', in: 5.5, out: 6.9, place: 'sky', row: 2 },
  { text: 'We.', voice: 'his', in: 7.35, out: 8.3, place: 'sky', row: 0 },
  { text: 'We like the same songs now.', voice: 'his', in: 9.3, out: 12.1, place: 'deep', row: 0, handover: 9.9 },
  { text: 'We wake at the same time.', voice: 'his', in: 10.0, out: 12.1, place: 'deep', row: 1, handover: 10.6 },
  { text: 'I think I like that.', voice: 'his', in: 10.7, out: 12.1, place: 'deep', row: 2, handover: 11.3, herFrom: 1 },
  { text: 'I used to…', voice: 'his', in: 13.6, out: 15.5, place: 'deep', row: 1 },
  { text: "…you don't do that anymore.", voice: 'her', in: 14.3, out: 15.5, place: 'deep', row: 2 },
  // After she has gone, alone at the top of an empty screen.
  { text: 'Take care of yourself.', voice: 'her', in: 18.9, out: 19.95, place: 'sky', row: 0 },
]
export const LINE_FADE_IN = 0.5
export const LINE_FADE_OUT = 0.25
export const WORD_HANDOVER = { stagger: 0.12, each: 0.24 } // per word, in screens

// Reduced motion: still frames shown one at a time, each holding a complete beat and its lines.
export const STILLS = [0.05, 2.9, 4.95, 6.35, 7.9, 9.05, 10.65, 11.95, 13.95, 15.0, 15.9, 16.9, 17.85, 18.95, 19.9, 21.2, 22.97, 24.5]

// Pacing: rests where the story stands still while the visitor keeps scrolling (or Play keeps going).
// Each hold freezes story time at `at` for `screens` of scrolling; rain and petals keep moving.
// Tuned in the Sprint 4 whole-film pass: timing only, nothing that happens changes.
export const HOLDS = [
  { at: 2.95, screens: 0.5 }, // chapter 1: the drop hangs, his three lines
  { at: 7.9, screens: 0.4 }, // chapter 2: "We." in the purple rain
  { at: 11.95, screens: 0.3 }, // chapter 3: the walls
  { at: 20.19, screens: 0.6 }, // chapter 5: the bare stem and the grey drop, after her last line (the longest rest)
  { at: 22.97, screens: 0.7 }, // chapter 6: "Mr. Nobody", held in silence
]
export const SCREENS = STORY + HOLDS.reduce((sum, h) => sum + h.screens, 0)

// Scroll position (in screens) → story time.
export function storyAt(scroll: number) {
  let shift = 0
  for (const h of HOLDS) {
    const start = h.at + shift
    if (scroll <= start) break
    if (scroll <= start + h.screens) return h.at
    shift += h.screens
  }
  return scroll - shift
}

// Play scrolls the whole film in this many seconds (about 8.8 s per screen of scrolling).
export const PLAY_SECONDS = 240
