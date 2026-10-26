// Serves the production build (dist/) the way GitHub Pages will: as plain static files under /a-love-story/.
// Used for local and iPhone testing instead of `vite preview`, which (Vite 8.3.5) answers 404 to script
// requests under a base path. Text files are gzip-compressed, as GitHub Pages does. No dependencies.
//   npm run preview:pages               → http://localhost:4180/a-love-story/
//   npm run preview:pages -- --host     → also reachable from a phone on the same Wi-Fi
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { networkInterfaces } from 'node:os'
import { gzipSync } from 'node:zlib'
import path from 'node:path'

const BASE = '/a-love-story/' // keep in step with vite.config.ts
const ROOT = path.resolve('dist')
const PORT = Number(process.argv[process.argv.indexOf('--port') + 1]) || 4180
const HOST = process.argv.includes('--host') ? '0.0.0.0' : '127.0.0.1'
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml', '.avif': 'image/avif', '.png': 'image/png', '.woff2': 'font/woff2', '.woff': 'font/woff',
  '.json': 'application/json',
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://local')
  if (url.pathname === '/' || url.pathname === BASE.slice(0, -1)) {
    res.writeHead(302, { Location: BASE }).end()
    return
  }
  if (!url.pathname.startsWith(BASE)) {
    res.writeHead(404).end('Not found')
    return
  }
  let file = path.join(ROOT, decodeURIComponent(url.pathname.slice(BASE.length)))
  if (!file.startsWith(ROOT)) {
    res.writeHead(403).end()
    return
  }
  try {
    if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html')
    let body = await readFile(file)
    const type = TYPES[path.extname(file)] ?? 'application/octet-stream'
    const headers = { 'Content-Type': type, 'Cache-Control': 'no-cache', Vary: 'Accept-Encoding' }
    if (/text|javascript|svg|json/.test(type) && /\bgzip\b/.test(req.headers['accept-encoding'] ?? '')) {
      body = gzipSync(body)
      headers['Content-Encoding'] = 'gzip'
    }
    res.writeHead(200, headers)
    res.end(body)
  } catch {
    res.writeHead(404).end('Not found')
  }
})

server.listen(PORT, HOST, () => {
  console.log(`A Love Story → http://localhost:${PORT}${BASE}`)
  if (HOST === '0.0.0.0') {
    for (const nets of Object.values(networkInterfaces())) {
      for (const n of nets ?? []) if (n.family === 'IPv4' && !n.internal) console.log(`  on your phone → http://${n.address}:${PORT}${BASE}`)
    }
  }
})
