// Picks the right size of each image for this screen and preloads them with real progress.
// Sizes and byte counts come from the manifest written by `npm run media`.
import manifest from '../assets/media/manifest.json'

type Entry = { width: number; height: number; sizes: Record<string, number> }
const MANIFEST = manifest as Record<string, Entry>
const URLS = import.meta.glob('../assets/media/*.avif', { eager: true, query: '?url', import: 'default' }) as Record<string, string>

export type MediaName = keyof typeof manifest
export type Picked = { name: MediaName; url: string; bytes: number }

// The smallest generated width that covers the displayed width at this screen's pixel density.
export function pick(name: MediaName, cssWidth: number): Picked {
  const entry = MANIFEST[name]
  const widths = Object.keys(entry.sizes).map(Number).sort((a, b) => a - b)
  const needed = cssWidth * Math.min(window.devicePixelRatio || 1, 2)
  const width = widths.find((w) => w >= needed) ?? widths[widths.length - 1]
  return { name, url: URLS[`../assets/media/${name}-${width}.avif`], bytes: entry.sizes[width] }
}

export function aspect(name: MediaName) {
  return MANIFEST[name].width / MANIFEST[name].height
}

export type Loaded = Map<MediaName, HTMLImageElement>

// Loads and decodes every image, reporting progress by bytes so the red string moves honestly.
// Fonts count as a small fixed weight each. Failed images still count as done (the film degrades, never blocks).
// Decoded images are added to `into` as they arrive, so a visitor who chose "Begin anyway" sees them appear.
export async function preload(images: Picked[], fonts: string[], onProgress: (fraction: number) => void, into: Loaded) {
  const FONT_WEIGHT = 30_000
  const total = images.reduce((sum, i) => sum + i.bytes, 0) + fonts.length * FONT_WEIGHT
  let done = 0
  const advance = (bytes: number) => {
    done += bytes
    onProgress(Math.min(1, done / total))
  }
  await Promise.all([
    ...images.map(async (item) => {
      const img = new Image()
      img.src = item.url
      try {
        await img.decode()
        into.set(item.name, img)
      } catch {
        // A missing image leaves its layer empty; the story still plays.
      }
      advance(item.bytes)
    }),
    ...fonts.map(async (font) => {
      try {
        await document.fonts.load(font)
      } catch {
        // Falls back to the system font.
      }
      advance(FONT_WEIGHT)
    }),
  ])
}
