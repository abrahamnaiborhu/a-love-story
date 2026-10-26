# A Love Story

A scroll-told film about a man who falls in love and fades away, until he's Mr. Nobody.
Written & directed by Abraham Naiborhu. Lives at **https://abrahamnaiborhu.com/a-love-story/**.

This is the **private source repository**. Pushing to `main` publishes: the Publish workflow builds the film, checks that nothing private is in the build, and pushes only the build to the separate public repository that GitHub Pages serves. See [docs/DEPLOY.md](docs/DEPLOY.md).

## Commands

| Command | What it does |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Develop at `http://localhost:5173/` |
| `npm run media` | Rebuild the optimised images in `src/assets/media/` from the originals in `docs/creative/codex/` |
| `npm run build` | Production build into `dist/`, for the `/a-love-story/` address |
| `npm run preview:pages` | Serve the build like GitHub Pages at `http://localhost:4180/a-love-story/` (add `-- --host` to open it on a phone). Use this, not `vite preview`, which shows a blank page under the base path |
| `npm run release` | Build, check that nothing private is in it, and prepare `release/a-love-story/` (the workflow runs this too; run it before pushing to catch problems early) |
| `npm run lint` | Lint |

## Where things are

- `src/film/`: the film. `timeline.ts` holds every beat and line; `renderer.ts`, `chapters34.ts` and `chapters56.ts` draw them; `Film.tsx` wires scroll, Play and loading.
- `docs/`: the brief (`PROJECT_SCRIPT.md`), storyboard, production plan, release record, device checklist and the image prompts.
- `docs/creative/codex/`: the original artwork. `studies/`: the throwaway motion studies.

React 19, Vite 8, TypeScript, GSAP (ScrollTrigger, ScrollToPlugin), sharp for images. Fonts: Nothing You Could Do, Bodoni Moda, Inter (OFL).
