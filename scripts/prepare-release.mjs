// Prepares the folder that GitHub Pages serves (see docs/DEPLOY.md).
// Run with `npm run release`, which builds first; the Publish workflow runs it on every push to main. Copies dist/ to release/a-love-story/, adds .nojekyll,
// and refuses to finish if anything private slipped into the build: prompts, internal notes, local paths,
// source maps, key-like strings, or a page that isn't built for the /a-love-story/ address.
import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'

const BASE = '/a-love-story/' // keep in step with vite.config.ts
const DIST = path.resolve('dist')
const OUT = path.resolve('release/a-love-story')
const ALLOWED = new Set(['.html', '.js', '.css', '.svg', '.avif', '.woff2', '.woff'])
const TEXT = new Set(['.html', '.js', '.css', '.svg'])
// Things that must never reach the public site.
const FORBIDDEN = [
  [/sourceMappingURL/, 'a source map reference'],
  [/\/Users\/|\/home\/[a-z]/, 'a local file path'],
  [/docs\/prompts|REFERENCE IMAGE|Written for: Codex|PROJECT_SCRIPT|CODEX_BATCH/, 'production notes or image prompts'],
  [/sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|AKIA[0-9A-Z]{16}/, 'a key-like string'],
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'a private key'],
]

async function files(dir) {
  const out = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await files(full)))
    else out.push(full)
  }
  return out
}

const problems = []
const list = await files(DIST).catch(() => {
  console.error('No dist/ folder. Run `npm run release` (it builds first).')
  process.exit(1)
})

let bytes = 0
for (const file of list) {
  const ext = path.extname(file)
  const name = path.relative(DIST, file)
  bytes += (await stat(file)).size
  if (!ALLOWED.has(ext)) problems.push(`${name}: unexpected file type ${ext || '(none)'}`)
  if (!TEXT.has(ext)) continue
  const text = await readFile(file, 'utf8')
  for (const [pattern, what] of FORBIDDEN) if (pattern.test(text)) problems.push(`${name}: contains ${what}`)
}
const index = await readFile(path.join(DIST, 'index.html'), 'utf8')
if (!index.includes(`src="${BASE}assets/`)) problems.push(`index.html: not built for ${BASE} (check vite.config.ts)`)

if (problems.length) {
  console.error('Release stopped: the build contains things that must not be published.\n')
  for (const p of problems) console.error('  - ' + p)
  process.exit(1)
}

await rm(OUT, { recursive: true, force: true })
await mkdir(OUT, { recursive: true })
await cp(DIST, OUT, { recursive: true })
await writeFile(path.join(OUT, '.nojekyll'), '') // serve files exactly as built, no Jekyll processing

console.log(`Ready to publish: release/a-love-story/ (${list.length} files, ${(bytes / 1024 / 1024).toFixed(1)} MB)`)
console.log('Checked: file types, source maps, local paths, prompts and notes, key-like strings, base path.')
console.log('Next: push to main; the Publish workflow runs these same checks and publishes (docs/DEPLOY.md, "Each release").')
