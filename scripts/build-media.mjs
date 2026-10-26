// Turns the Codex PNGs in docs/creative/codex into small AVIF files the site loads.
// Bakes in the grading and softening found in Study 03, so phones don't run live filters,
// and cuts the grid sheets (buds, roses, petals) into one file per item.
// Run with `npm run media`. Writes src/assets/media/*.avif and src/assets/media/manifest.json.

import sharp from 'sharp'
import { mkdir, rm, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'

const SRC = 'docs/creative/codex'
const OUT = 'src/assets/media'
const QUALITY = 52

// Colour grades as 3×3 RGB matrices (rows are output R, G, B), same values as Study 03.
const COOL = [[0.85, 0, 0], [0, 0.93, 0], [0, 0, 1.12]]
const VERMILION = [[1.25, 0.05, 0], [0.14, 0.92, 0], [0, 0, 0.85]]

// One entry per asset the first act needs. `widths` are the sizes generated; the app picks one per screen.
const ASSETS = [
  { name: 'street-landscape', file: 'a1-street-landscape.png', widths: [1024, 1536], blur: 2.2, grade: COOL },
  { name: 'street-portrait', file: 'a2-street-portrait.png', widths: [640, 1024], blur: 2.2, grade: COOL },
  { name: 'him-walking', file: 'a5-him-walking-2.png', widths: [512, 1024], blur: 0.8, grade: COOL },
  { name: 'him', file: '01-him.png', widths: [512, 1024], blur: 0.8, grade: COOL },
  { name: 'her', file: '02-her.png', widths: [512, 1024], blur: 0.8, grade: VERMILION },
  // The umbrellas stay on black: the page composites them by brightness (screen blending).
  { name: 'umbrella-open', file: 'a3-umbrella-open.png', widths: [640, 1254] },
  { name: 'umbrella-closed', file: 'a4-umbrella-closed.png', widths: [512, 1024] },
  { name: 'her-rose-bud', file: 'a10-her-rose-bud.png', widths: [640, 1254] },
  { name: 'her-rose-opening', file: 'a10-her-rose-opening.png', widths: [640, 1254] },
  { name: 'her-rose-full', file: '03b-rose-watercolour.png', widths: [640, 1254] },
  // His drop: photographed while it hangs from the umbrella, painted once he falls (Batch 03).
  { name: 'drop-clear', file: 'd1a-drop-clear.png', widths: [160, 320] },
  { name: 'drop-blue', file: 'd1b-drop-blue.png', widths: [160, 320] },
  { name: 'drop-painted', file: 'd2-drop-falling-painted.png', widths: [160, 320] },
  // Chapters 3–4 (loaded in the background after Begin).
  { name: 'inside-open', file: 'b1-inside-open.png', widths: [768, 1254] },
  { name: 'inside-closing', file: 'b2-inside-closing.png', widths: [768, 1254] },
  { name: 'her-rose-curling', file: 'b3-her-rose-curling.png', widths: [640, 1254] },
  { name: 'her-strong', file: 'b6-her-strong.png', widths: [512, 1024], blur: 0.8 },
  // Chapters 5–6 (loaded in the background after chapters 3–4).
  { name: 'bare-stem', file: 'b5-bare-stem.png', widths: [512, 1024] },
  { name: 'her-leaving', file: 'b7-her-leaving.png', widths: [512, 1024], blur: 0.8 },
  // The last of the water (Batch 03), painted.
  { name: 'water-cup', file: 'c1-water-cup.png', widths: [256, 512] },
  { name: 'bead-red', file: 'c2-drop-red.png', widths: [128, 256] },
  { name: 'bead-grey', file: 'c3-drop-grey.png', widths: [128, 256] },
  { name: 'drop-grey-falling', file: 'c4-drop-falling.png', widths: [128, 256] },
  { name: 'red-bleed', file: 'c5-red-bleed.png', widths: [768, 1536] },
]

// Grid sheets: each cell holds one item on transparency; cells are trimmed to the item.
const SHEETS = [
  { name: 'bud', file: 'a6-buds.png', grid: 2, size: 384 },
  { name: 'half', file: 'a7-half-open.png', grid: 2, size: 384 },
  { name: 'bloom', file: 'a8-full-purple.png', grid: 2, size: 384 },
  { name: 'petal', file: 'a9-petals.png', grid: 3, size: 192 },
  { name: 'torn', file: 'b4-torn-petals.png', grid: 3, size: 256 },
]

const manifest = {}

async function write(pipeline, name, width) {
  const file = path.join(OUT, `${name}-${width}.avif`)
  await pipeline.avif({ quality: QUALITY, effort: 6 }).toFile(file)
  return (await stat(file)).size
}

function prepare(input, { blur, grade }) {
  let img = sharp(input)
  if (grade) img = img.recomb(grade)
  if (blur) img = img.blur(blur)
  return img
}

async function buildAsset(asset) {
  const input = path.join(SRC, asset.file)
  const { width, height } = await sharp(input).metadata()
  const entry = { width, height, sizes: {} }
  // Grade and soften once at full size, then scale down, so softness is consistent across sizes.
  const master = await prepare(input, asset).png().toBuffer()
  for (const w of asset.widths) {
    entry.sizes[w] = await write(sharp(master).resize({ width: Math.min(w, width) }), asset.name, w)
  }
  manifest[asset.name] = entry
}

async function buildSheet(sheet) {
  const input = path.join(SRC, sheet.file)
  const { width, height } = await sharp(input).metadata()
  const cw = Math.floor(width / sheet.grid), ch = Math.floor(height / sheet.grid)
  let n = 0
  for (let row = 0; row < sheet.grid; row++) {
    for (let col = 0; col < sheet.grid; col++) {
      const name = `${sheet.name}-${++n}`
      const cell = await sharp(input)
        .extract({ left: col * cw, top: row * ch, width: cw, height: ch })
        .png()
        .toBuffer()
      const trimmed = await sharp(cell).trim().png().toBuffer({ resolveWithObject: true })
      const { width: tw, height: th } = trimmed.info
      const scale = Math.min(1, sheet.size / Math.max(tw, th))
      const ow = Math.round(tw * scale), oh = Math.round(th * scale)
      manifest[name] = { width: ow, height: oh, sizes: { [ow]: await write(sharp(trimmed.data).resize({ width: ow }), name, ow) } }
    }
  }
}

await rm(OUT, { recursive: true, force: true })
await mkdir(OUT, { recursive: true })
for (const asset of ASSETS) await buildAsset(asset)
for (const sheet of SHEETS) await buildSheet(sheet)
await writeFile(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n')

const total = Object.values(manifest).flatMap((m) => Object.values(m.sizes)).reduce((a, b) => a + b, 0)
console.log(`${Object.keys(manifest).length} assets, ${(total / 1024).toFixed(0)} KB across all sizes`)
