# Release Record — A Love Story

Status: Sprint 4 built (2026-10-26), awaiting the client's real-device checks. Not yet released; publication needs the client's go-ahead (PRODUCTION_PLAN §10).
Build: production build served at `/a-love-story/` with `npm run preview:pages` (static, the way GitHub Pages serves it).

This record separates what was **observed** (and where) from what is **untested**. Emulated phone sizes in desktop Chrome are not real-device evidence.

## What was checked, and where

| Area | Environment | Result | Evidence |
|---|---|---|---|
| Behaviour checks: Sprint 1 (14), Sprint 2 (4), Sprint 3 (7) | Headless Chrome (macOS), emulated 375×812 and others, at `/a-love-story/` | **25/25 pass** on the final build (2026-10-26), and again after the umbrella fixes (walk-in carry, open-umbrella grip; PROJECT_SCRIPT log) | QA scripts (scratch) |
| Smoothness over the whole film, CPU slowed 4× | Headless Chrome, emulated 375×812 | 60 fps average; worst frame 33–50 ms; no long tasks (2 runs on the final build) | Frame-time trace |
| First load (Lighthouse 12.8.2, mobile, simulated slow 4G) | Headless Chrome | Performance 98, accessibility 100, best practices 100; FCP 1.7 s (target 1.5 s, **missed by 0.2 s**), LCP 2.1 s, TBT 0, CLS 0; 1.13 MB before Begin (JS 143 KB gzipped) | Lighthouse JSON |
| Frames: opening, each chapter, ending, credits | Headless Chrome at 375×812, 360×640, 812×375, 1280×720, 1440×900 | Checked across Sprints 1–4; Sprint 4 fixes and the restaged ending re-checked at 375×812, 360×640 and 1440×900 | Screenshots; `docs/release/release-desktop.png`, `release-mobile.png` |
| Reduced motion | Emulated `prefers-reduced-motion` | No opening animation; still frames for every beat; lines unblurred and already in their final typeface; credits static | Behaviour checks and stills |
| Mac Safari | Client's MacBook (M2) | **Untested** until the client runs QA_CHECKLIST.md | — |
| iPhone Safari | Client's iPhone 12 mini | **Untested** until the client runs QA_CHECKLIST.md | — |
| Android Chrome, Windows Chrome/Edge, Firefox | — | **Untested** (no access) | — |

## Code-level Safari review (2026-10-26)

- **Browser bars on phones:** the stage is sized to the large viewport (`100lvh`), resizes that only move the browser bars are ignored, and ScrollTrigger ignores mobile bar resizes, so the scene doesn't jump while scrolling and no stale "place to restore" is recorded.
- **Blurred Play button:** `-webkit-backdrop-filter` added for Safari before 18.
- **Features used:** AVIF images (Safari 16+), `svh`/`lvh` units (Safari 15.4+), individual `translate` (14.1+), CSS `inset`, `mix-blend-mode`, canvas even-odd clipping, `img.decode()`, `document.fonts.load()`; no JavaScript newer than the Safari 16 build target. **Older Safari (before 16) is not supported**: AVIF images would not load there.
- **Watch on the iPhone:** two full-screen canvases carry a CSS blur (the near and far petals). That's cheap on desktop GPUs; its cost on the iPhone 12 mini is unknown until checked.

## Local tooling note

`vite preview` (Vite 8.3.5) answers 404 to script requests (`Sec-Fetch-Dest: script`) under a base path, so it shows a blank page at `/a-love-story/`. `npm run preview:pages` (scripts/serve-pages.mjs, no dependencies) serves the build as plain static files the way GitHub Pages does, and is used for all release checks and the client's device checks.

## Release preflight (cinematic-web-director, release phase, 2026-10-26)

Gate **BLOCKED on check 7 only** (browser and visual testing). Both release screenshots validate (1440×900 and 375×812, 8-bit non-interlaced PNG). The interaction attestation is withheld on purpose: everything above is emulation in headless Chrome, and the protocol attests interactions only after real QA. It is given once the client's Mac Safari and iPhone 12 mini checks (QA_CHECKLIST.md) pass. All other checks reviewed: 1 declared, 2–6 verified, 8 deferred.

## Published-build inventory (section 10, D2)

`dist/`: 82 files, 3.3 MB. One HTML page, one JavaScript bundle, one stylesheet, the favicon, the three fonts (woff2 + woff) and the optimised AVIF images. Searched for prompts, internal notes, agent files, source maps, local file paths and key-like strings: none found (one `sk-` hit was the SVG attribute name `mask-type`).

## Known limitations

- **Real devices untested so far:** Mac Safari and iPhone 12 mini results pending (QA_CHECKLIST.md). Android, Windows and Firefox untested.
- **Safari before 16 unsupported** (AVIF images).
- **iPhone performance unknown:** two full-screen blurred canvases (near and far petals) and the canvas petal storm; desktop emulation can't predict the iPhone 12 mini's GPU.
- **The red string appears at 1.7 s** on a simulated slow 4G phone, against a 1.5 s target.
- **Images the client may still want regenerated:** C2 (red drop could read as a berry) and C5 (red bleed, now kept small and faint). A10's cross-fade is mitigated by alignment and a brief blur rather than a new image.
- **No soundtrack yet** (its prompt is still to be written).
