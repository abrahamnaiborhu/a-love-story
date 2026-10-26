import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Where the film lives once published: abrahamnaiborhu.com/a-love-story (see docs/PRODUCTION_PLAN.md §10).
// The production build (and `vite preview`) use this path; local development stays at the root.
const PUBLISHED_PATH = '/a-love-story/'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? PUBLISHED_PATH : '/',
  plugins: [react()],
  build: {
    sourcemap: false, // the published build carries no source maps (§10)
  },
}))
