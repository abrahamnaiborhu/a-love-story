# Production Plan — A Love Story

Status: v1.7 — Sprints 1–3 built; Sprint 4 (section 11) approved and built, awaiting the client's device checks and final review; deployment (section 10) ready to start on the client's go-ahead
Date: 2026-10-26
Based on: PROJECT_SCRIPT.md (Checkpoint A), STORYBOARD.md v0.3 (continuous-fall revision), Studies 01–03, Codex Batches 01–02

This plan asks for two approvals:

1. **Checkpoint B, creative direction:** STORYBOARD v0.3 as the story, look and continuity rules for the whole film.
2. **Checkpoint C, Sprint 1:** the build below, its technical setup and how we'll judge it.

Sprints 2–4 are outlined so you can see the whole road. Each gets its own short detailed plan and approval when we reach it.

---

## 1. Technical setup

### What we keep
React 19 + Vite + TypeScript, as scaffolded. No router, state library or backend: it's one page, one story.

### What we add, and why

| Need | Recommendation | Alternatives considered | Why |
|---|---|---|---|
| Scroll-driven timeline with chapters, rests, Play and resize handling | **GSAP 3.15.0** with ScrollTrigger and ScrollToPlugin, plus **@gsap/react 2.1.2** (`useGSAP` for cleanup) | Our hand-written study engine; Motion (Framer) | The film is ~3 minutes of layered, scrubbed timelines with labels per chapter. GSAP handles scrubbing, pinning, resize refresh, reduced-motion media queries and smooth Play-scrolling, all of which the study engine would have to grow by hand. All GSAP plugins are free to use. |
| Smaller, faster images | **sharp 0.35.5** (dev only), in a small script that converts the Codex PNGs to AVIF/WebP at phone and desktop sizes, and bakes in blur/grade for the street | Serving the PNGs as they are | The 20 PNGs total about 40 MB. At phone sizes in AVIF they should be a few hundred KB per chapter. Baking blur and grading in also avoids expensive live filters on phones. |
| Fonts | Self-hosted open-licence fonts via **@fontsource** packages, chosen in Sprint 1's type study | Google Fonts CDN | Self-hosting avoids a third-party request and layout jumps. |
| GSAP know-how for me | **Install the official GreenSock agent skills** (`npx skills add https://github.com/greensock/gsap-skills --agent claude-code`) | Working from the official GSAP docs instead | The skill I'm using asks for them. Installing changes your Claude setup, so it needs your OK. If you'd rather not, I'll use the current official docs and record that. |

### How the page is built

```
Fixed full-screen stage
├── Photo layers: <img>/CSS layers moved with GPU transforms (street, him, her, umbrella)
├── Canvas: rain and petals (hundreds of particles, cheaper than SVG elements)
├── SVG: the drop, water running down the umbrella, ripples, umbrella highlights
└── Text layer: real HTML text for his lines, title and credits
Tall scroll spacer → GSAP ScrollTrigger drives one master timeline, one label per chapter
```

- **Chapters are separate modules** (`Opening`, `FirstSight`, `Falling`, …), each adding its part to the master timeline, so each sprint touches its own chapters.
- **Play** smoothly scrolls the page using ScrollToPlugin; any wheel, touch or key input stops it. This is the same behaviour as the studies.
- **Large images** are preloaded one chapter ahead and released when far behind, to keep phone memory in check.
- **Deployment:** GitHub Pages is proposed for Sprint 4 (section 10). The final URL determines Vite's base path; `abrahamnaiborhu.com/a-love-story` remains a possible later destination, not a configured host.

---

## 2. How visitors experience it (whole-experience rules)

| Situation | Behaviour |
|---|---|
| **Arrival: the red string** | A loading screen appears instantly (it needs no images): a tangled **red string** on the dark rainy-night colour, a nod to the "red string of fate" that ties two people together. As the **first act** (opening → chapter 2 images, plus fonts) loads, the string **untangles**, driven by **real loading progress** (no fake percentages, never going backwards). When it's ready, a **"Begin"** button appears at the end of the string. On Begin, the string slips downward and thins into the first streak of rain, and the umbrella opening plays (continuing the "everything falls" rule). |
| **While watching** | Chapters 3–6 load quietly in the background, one chapter ahead. If a visitor scrolls faster than loading, the drop hangs in the scene instead of the screen going blank. |
| **Slow connection** | If loading stalls (no progress for about 8 seconds), a **"Begin anyway"** option appears next to the string, starting with whatever has loaded. Nobody is ever stuck behind the loader. |
| **Sound (later)** | The Begin tap is the user gesture browsers require for audio, so the future soundtrack can start with the opening. |
| **Scrolling early** | Any scroll, touch, key or Play skips the opening to its end, as in the studies. |
| **Coming back mid-page** (refresh, back button) | The red string still waits for the first act; after Begin, the opening is skipped and the film shows the current scroll position's frame. |
| **Play** | Scrolls through at a steady pace; manual input pauses it; at the end it becomes "Replay". |
| **Resize / rotate phone** | The layout and timeline re-measure without restarting the story. |
| **Hidden tab** | Animation pauses (rain, opening) and resumes. |
| **Reduced motion** | The string still untangles with progress (it moves only as loading moves), but Begin cuts straight in instead of the falling thread. No opening animation; each chapter becomes still frames that cross-fade at its rests; every line is readable; Play steps between rests. |
| **Keyboard** | Space and arrow keys scroll; Play is a focusable button with a visible focus ring. |

---

## 3. Performance targets

Proposed targets. I'll measure them; the numbers aren't promises until measured.

| Target | Value | How it's measured |
|---|---|---|
| Red string loading screen visible | ≤ 1.5 s |
| First act loaded ("Begin" appears) | ≤ 8 s on simulated slow 4G; much faster on normal connections |
| First readable frame (title on the street colour) | ≤ 2.5 s | Lighthouse mobile run (simulated slow 4G, 4× slower CPU), via `npx lighthouse`, no project dependency |
| Downloaded before "Begin" (the first act) | ≤ 2 MB total (JS ≤ 150 KB gzipped) | Network panel / Lighthouse |
| Images per chapter, phone sizes | ≤ 1.2 MB | Build output |
| Smoothness while scrolling | No visible stutter; no single task over 50 ms during scrubbing | Chrome performance trace with 4× CPU slowdown (emulation) |
| Real phones | Feels smooth on your phone(s) | **You**, on your devices; I can't test real phones |

If a target is missed, I'll show the measurement and propose options, such as smaller images or fewer particles on phones, rather than quietly cutting the story.

---

## 4. Devices and browsers

| Device / browser | Screen | Tested by |
|---|---|---|
| iPhone, Safari (iOS 17+) | 390 × 844 and 375 × 667 | Me (emulated layout); **you** on a real iPhone, if you have one |
| Android, Chrome (recent) | 360 × 800 | Me (emulated); **you** on a real Android, if available |
| Laptop: macOS Safari and Chrome | 1280 × 720 (short) and 1440 × 900 | Me (Chrome); **you** (Safari) |
| Desktop: Windows Chrome / Edge, Firefox (latest) | 1920 × 1080 | Me (Chrome); others **unverified** unless you can check |
| Reduced-motion setting on | phone + laptop | Me (emulated) |

**To confirm:** which phones and browsers you can test on.

---

## 5. Sprint 1 — the connected slice (for approval)

**What visitors get:** the first third of the film, working end to end in the real app. The opening → chapter 1 → chapter 2, ending on the "We." rest in the purple petal rain.

### Scope

1. **Foundations.** The image pipeline (sharp script; AVIF/WebP at two sizes; baked blur/grade for the street). The stage and the chapter structure. The scroll + Play controller. The text layer. The readiness, reduced-motion and resize rules from section 2.
2. **The red string loading screen.** An SVG red thread that untangles with real first-act loading progress, the Begin and "Begin anyway" buttons, and the thread slipping down into the first rain streak. Accessible as a progress bar for screen readers.
3. **Type study (a decision point).** Before building the text layer, I show you 2–3 font pairings for **his handwriting**, **her typeface** and **the neutral label**, set in our real lines on the real street frame. You pick one; I install only that.
4. **Opening.** Street plate (portrait on phones, landscape on laptops), him walking in (A5-2), her (02-her, graded to vermilion), the closed umbrella opening into the clear umbrella (A4 → A3), rain on canvas with his side left in the rain, title.
5. **Chapter 1.** Rain running down the umbrella into one blue drop on her side, his three lines, the push-in and rest.
6. **Chapter 2.** He lets go and falls: the street rises away (no zoom, no reflection). Watercolour buds and roses open around him as he passes, red turning purple. Her rose rises from below (A10 bud → opening → 03B full bloom). He lands in its heart; every flower bursts open; purple petals rain; his lines, then **"We."** and the rest.

### Not in Sprint 1
Chapters 3–6, credits, sound, deployment, the thorns idea.

### Done when (acceptance criteria)

| # | Criterion | Evidence |
|---|---|---|
| 1 | The slice plays end to end by scrolling and by Play, on phone and laptop sizes, with no zoom or reflection in the fall | My recorded checks at 390×844, 360×800, 1280×720 and 1440×900; your viewing |
| 2 | The opening skips correctly on scroll, touch, key and Play, and is skipped when returning mid-page | My runtime checks |
| 2b | The red string appears instantly, untangles only as real loading progresses, shows Begin when the first act is ready, and offers "Begin anyway" when loading stalls | My runtime checks, including a throttled-network run and a blocked-image run |
| 3 | Play pauses on manual input and becomes Replay at the end of the slice | My runtime checks |
| 4 | Resizing or rotating mid-story keeps the right frame | My runtime checks |
| 5 | Reduced motion gives readable still frames for every beat | Emulated check |
| 6 | Every line is real, readable text with enough contrast, and keyboard-reachable controls | Inspection + keyboard pass |
| 7 | Performance targets in section 3 met, or misses reported with options | Lighthouse + trace numbers |
| 8 | You confirm it feels like the film we agreed on (the umbrella, the fall, the bloom, the "We.") | Your review |

### Allowed without asking you again
Timing, easing, sizes and positions inside each beat. Image crops and grading. Particle counts. Bug fixes. Small alignment fixes to images.

### I'll stop and ask if
A beat can't work as storyboarded. A new dependency is needed. Performance can't meet targets without changing the story. Anything changes what the visitor sees beyond the allowed adjustments above. Three refinement rounds on one item don't improve it.

### Who does the work
All design and code: Claude (Opus 5.5, `claude-opus-5-5`) in Claude Code; the reasoning setting isn't exposed to me (unverified). No handoff to another model is planned. Images: generated by you with Codex from my prompts.

---

## 6. Later sprints (outline only; each gets its own plan)

| Sprint | Visitors get | Main risks |
|---|---|---|
| **2** | Chapters 3–4: inside her rose (open → closing), his blue rising through her petals, his letters turning into her typeface, her rose curling, her strong, his reflection fading | Letter-shape morphing between two fonts (may become a blur-and-swap instead) |
| **3** | Chapters 5–6 + credits: torn-petal storm, the water holding the cup's shape, her leaving, the red draining, the bare stem, the fall into black, one ripple, "Mr. Nobody", credits, Watch again | Many particles at once on phones |
| **4** | Whole-film pass: pacing across all chapters, performance on every chapter, the full device matrix, `/a-love-story` build, deployment prep (publishing needs your separate go-ahead and host details) | Unknown host setup |

---

## 7. What I need from you

1. **Approve Checkpoint B:** STORYBOARD v0.3 as the creative direction.
2. **Approve Sprint 1** as described, including adding **GSAP 3.15.0, @gsap/react 2.1.2 and sharp 0.35.5**.
3. **GSAP agent skills:** install them, or should I work from the official docs instead?
4. **Devices:** which phones and browsers you can test on.

---

## 8. Sprint 2 — detailed plan (for approval)

Status: approved 2026-10-25 and built the same day; see PROJECT_SCRIPT "Sprint 2 build result". One change within the allowed adjustments: the blue veins became a colour wash rising up her petals.

**What visitors get:** chapters 3 and 4, continuing straight on from "We." in the purple rain. The film grows from 8 to about 16 screens of scrolling, and Play lengthens to match (about 2 minutes 20 seconds so far).

### Chapter 3 — Becoming her (about 4.5 screens)

1. **Into her (continuing the fall, no zoom):** after "We.", the camera keeps sinking. The surface of the pool in her rose's heart rises up the screen as a waterline. Above it, the purple rain fades; below it, **inside her rose** (B1) opens up, petals glowing like a lantern. The motion is the same downward fall, now underwater.
2. **His blue in her water:** his colour blooms through the water as ink (like Study 01), then **thin blue trails rise up the veins of her petals**. As they rise, the petals glow brighter and the blue turns purple. She drinks him.
3. **His words become hers:** *"We like the same songs now." / "We wake at the same time." / "I think I like that."* Each line starts in his handwriting (blue). Then, word by word from left to right, each word blurs out of his hand and condenses into **her Bodoni italic**, turning red. In the last line the first word, "I", is already in her letters.
4. **The walls:** at the end of the chapter, the view cross-fades from B1 to **B2**. The petals lean in, the opening above narrows, and the camera eases in slightly. Rest: perfectly still, walls all around.

### Chapter 4 — Losing himself (about 3.5 screens)

5. **Time has passed (a deliberate cut):** a slow dissolve from inside to outside. **Her rose curling and drying** (B3) is vivid red at its heart, with dry edges and thorns.
6. **Her, strong; him, fading:** her upright photograph (B6) stands faintly within the rose's red glow, clear and certain. His photograph appears only as a **faint, rippling reflection** at the bottom of the frame, a little fainter each time the visitor scrolls past a beat.
7. **She finishes his sentence:** *"I used to…"* in his handwriting, then *"…you don't do that anymore."* in hers, red.
8. **Rest:** **one dry petal** (from B4) falls slowly, the only thing moving.

### Technical scope

- **Images:** add B1, B2, B3, B4 (cut into 9 petals) and B6 to the image pipeline; check sizes against the 1.2 MB-per-chapter phone target.
- **Loading ahead:** after Begin, chapters 3–4 load quietly in the background (the red string still waits only for the first act). If a visitor scrolls into chapter 3 before its images are ready, his drop holds in the purple rain instead of showing an empty frame.
- **The waterline and ink:** SVG and canvas, like the drops and blooms.
- **Word handover:** each word exists twice (his font, her font) stacked in place; scrolling blurs one out while the other condenses in. Real text throughout, readable by screen readers as the final sentence.
- **Reduced motion:** new still frames for each beat (the waterline, the glowing trails, each finished line, the curled rose, the falling petal), with no word-by-word animation (each line simply appears in her typeface).
- **No new dependencies.**

### Why the word handover isn't true letter morphing

Morphing his letter shapes into hers would need every glyph of both fonts converted to vector paths, plus a morphing library: heavy, fragile on phones, and hard to keep readable mid-morph. Blurring each word out of his hand and condensing it into hers reads as one voice being replaced by another, stays readable at every moment, and costs nothing. If you'd still like true morphing, it would be a separate experiment first.

### Done when

| # | Criterion | Evidence |
|---|---|---|
| 1 | Chapters 3–4 play on from "We." by scrolling and by Play, phone and laptop, with no zoom-in and one deliberate dissolve (ch3 → ch4) | Frames at 375×812, 360×640, 1280×720, 1440×900, rotated phone; your viewing |
| 2 | Every line is readable at every scroll position during the handover (never two half-legible copies of the same word) | Frame sweep through each line |
| 3 | Reaching chapter 3 before its images load shows the holding drop, never a blank frame; the images appear when ready | Throttled run, blocked-image run |
| 4 | Sprint 1's 14 behaviour checks still pass, plus Play/Replay over the longer film | Behaviour script |
| 5 | Reduced motion gives readable still frames for the new beats | Emulated check |
| 6 | Chapter 3–4 images ≤ 1.2 MB on phones; smooth scrolling at 4× CPU slowdown; Lighthouse first-load numbers unchanged | Build output, trace, Lighthouse |
| 7 | You confirm it feels right: belonging turning into walls, then him fading | Your review |

**Allowed without asking:** timing, sizes, positions, glow strength, ink and trail shapes, particle counts, image crops, bug fixes.
**I'll stop and ask if:** a beat can't work as described, a new dependency is needed, or performance can't be met without changing the story.

---

## 9. Sprint 3 — detailed plan (for approval)

Status: approved 2026-10-25 ("yes i am gonna be away for a bit, continue") and built the same day; see PROJECT_SCRIPT "Sprint 3 build result". One refinement within scope: the Play button steps aside during the credits, so Watch again is the single way back.

**What visitors get:** the end of the film, chapters 5 and 6, and the credits. The film grows from 16 to about 25 screens, and Play to about 3 minutes 40 seconds. Everything continues from the dry petal falling in chapter 4.

### Chapter 5 — Losing her (about 4 screens)

1. **The tearing:** one torn petal rips off her rose and is carried away on the wind, then another, then **all at once**: a storm of torn red petals (B4) flying across the screen. They're sharp and fast, like the glass in Study 01, not drifting. As the storm passes, her rose is gone and only the **bare stem** (B5) is left.
2. **The water keeps her shape (from Study 01):** for one beat, the last of the water in her cup **still holds the cup's shape** in mid-air, with nothing around it. Then it slumps.
3. **She leaves:** her standing photograph gives way to **her walking away** (B7), coat lifted by the wind. She moves out of frame, and **the red drains out of the water and follows her** as a red drop pulling away. What's left of him is grey.
4. **Her last line, fading:** *"Take care of yourself."*
5. **Rest, the longest in the film:** the bare stem, a little grey water, empty space.

### Chapter 6 — Mr. Nobody (about 3 screens)

6. **He falls again:** the grey water slips off the stem and falls. The camera follows it down and the stem rises away: the same continuous fall as chapter 2, now into black. No flowers, no words.
7. **One ripple:** it lands in the dark, makes a single ripple that spreads and fades, then stillness.
8. **The label:** *Mr. Nobody* appears, cold and neutral in Inter, as if someone else wrote it. Silence held.

### Credits (about 2 screens)

9. **A cut to black, then the credits roll** up the screen as you scroll: *A Love Story*, *Written & directed by Abraham Naiborhu*, *Have a story to tell? → abrahamnaiborhu.com* (a real link), and a **Watch again** button that returns to the top and replays the opening.

### Technical scope

- **Images:** add B5 (bare stem) and B7 (her walking away) to the pipeline; B4's torn petals are already in. Chapters 5–6 load in the background after chapters 3–4, and the film holds at the end of chapter 4 until they're ready.
- **Petal storm:** canvas particles, like the blooms. **Water shapes, red drop and ripple:** SVG.
- **Credits:** real text and a real link, reachable by keyboard; Watch again and Replay do the same thing.
- **Reduced motion:** still frames for each new beat; the credits appear without rolling.
- **No new dependencies.**

### Done when

| # | Criterion | Evidence |
|---|---|---|
| 1 | The whole film plays from the red string to the credits, by scrolling and by Play, on phone and laptop | Frames at 375×812, 360×640, 1280×720, 1440×900, rotated phone; your viewing |
| 2 | Watch again and Replay return to the top and replay the opening; the credits link opens abrahamnaiborhu.com | Behaviour checks |
| 3 | Reaching chapter 5 before its images load holds at chapter 4's rest, never a blank frame | Withheld-image run |
| 4 | Sprint 1–2 checks still pass over the full film | Behaviour scripts |
| 5 | Reduced motion gives readable still frames for the new beats and static credits | Emulated check |
| 6 | Chapters 5–6 images ≤ 1.2 MB on phones; smooth scrolling at 4× CPU slowdown, including the petal storm; Lighthouse first-load numbers unchanged | Build output, trace, Lighthouse |
| 7 | You confirm the ending lands: the tearing hurts, the silence holds, "Mr. Nobody" is cold | Your review |

**Allowed without asking:** timing, sizes, positions, particle counts, wind direction, water shapes, image crops, bug fixes.
**I'll stop and ask if:** a beat can't work as described, a new dependency is needed, or performance can't be met without changing the story.

---

## 10. Sprint 4 — deployment phase: GitHub Pages

Status: planned 2026-10-26 at the client's request; owned by the director (project manager) from 2026-10-26. Implementation and publication outstanding. This covers deployment; the whole-film pass in section 11 is a release prerequisite.

**Chosen deployment destination (revised 2026-10-26, client: "we are choosing a love story instead of love story"):** public build-output repository `abrahamnaiborhu/a-love-story`. Required Vite base: `/a-love-story/`. Expected address: **`https://abrahamnaiborhu.com/a-love-story/`**. abrahamnaiborhu.com is served by GitHub Pages behind Cloudflare (response headers, 2026-10-26), and a project repository is served under the account's custom domain when the user site holds that domain; until that is verified, `https://abrahamnaiborhu.github.io/a-love-story/` is the fallback address, which redirects to the custom domain if one is set. The GitHub account name, the repository's existence, Pages settings and the private source repository name are unverified.

**Outcome:** publish the film while keeping AI prompts, agent instructions and production documents private. Assumption: “AI logic” means the project's authoring materials. Any actual private AI inference, API keys or proprietary runtime logic must live on a separate backend; GitHub Pages serves static files and cannot hide code delivered to a visitor.

### Publication boundary

Recommended arrangement: keep the working project in a **private source repository**, and publish only the reviewed contents of `dist/` to a **separate public Pages repository**. The public repository starts with build output, never a copy of the source repository's history. This works without requiring Pages support for private repositories. Alternatively, a GitHub plan supporting Pages from private repositories can deploy a `dist/` artifact directly from private source. The website's delivered files are public in either arrangement.

| Keep in private source / local storage | Publish after review |
|---|---|
| `docs/`, including `docs/prompts/`, storyboards and production notes | Built `index.html`, JavaScript and CSS needed by the film |
| `AGENTS.md`, `CLAUDE.md`, `.agents/`, `.codex/`, skill metadata and conversation logs, if present | Optimized images, fonts and other assets actually needed at runtime |
| Original artwork, experiments, studies, screenshots and test reports not used by the film | Required licence notices and optional Pages configuration |
| Environment files, credentials and private AI prompts | No secrets, raw source, source maps, internal documents or tooling |

`.gitignore` controls untracked files added to Git. It does not control Vite output, protect browser code, or remove files already committed or present in history. Keep useful docs versioned in private source rather than ignoring all of `docs/`. Audit `public/` especially: Vite copies its contents into the build. Check imports and build scripts too; a private file can enter the output through either route. Minification and disabling source maps reduce source detail but provide no confidentiality for browser logic. `VITE_*` values used in client code are public after bundling.

### Ordered tasks and exit criteria

#### D1 — confirm destination and private/public boundary

Dependencies: none. Scope: repository setup and deployment notes.

- [x] Record the requested GitHub destination: `abrahamnaiborhu/a-love-story`, expected address `https://abrahamnaiborhu.com/a-love-story/`, base `/a-love-story/` (revised from `love-story` on 2026-10-26).
- [ ] Verify the GitHub account, the destination repository and its Pages settings, that the account's user site holds the abrahamnaiborhu.com custom domain, and the private source location.
- [x] Inventory authoring materials, original media, secrets and runtime assets; identify anything that must be excluded from the public artifact. If private runtime AI behaviour is required, define its separate backend before deployment. (2026-10-26: no secrets or env files; no runtime AI; the private source keeps docs, prompts, original artwork, studies and skills; the public artifact is the build only. `.gitignore` written; `npm run release` enforces the exclusions.)
- [ ] Review the prospective first commit and destination history before uploading. (2026-10-26: git initialised locally on `main`, nothing committed; prospective first commit reviewed: 164 files, ≈59 MB, no secrets or generated folders. The client creates the remote repositories; their history is not yet inspected.)

Verification: record the chosen URL and repository arrangement, and a reviewed list of publishable files. Do not upload the working directory to a public repository.

#### D2 — produce and inspect the Pages build

Dependencies: D1. Likely files: `vite.config.ts`, asset URL callers if needed, `.gitignore` and deployment instructions. No new dependency expected.

- [x] Set Vite's base to `/a-love-story/` and verify image, font, favicon and dynamically constructed URLs under that path. Keep production source maps disabled. (Done 2026-10-26: `vite.config.ts`; verified served at `/a-love-story/` by `npm run preview:pages`; no source maps.)
- [x] Add environment-file exclusions (with an explicitly safe example-file exception if needed); retain dependency/build/cache exclusions. Keep internal docs in private source. (2026-10-26.)
- [x] Run `npm ci`, `npm run lint` and `npm run build`; document whether `npm run media` must run first and ensure its original-media inputs are available privately. (2026-10-26: lint and build clean; `src/assets/media/` is committed, so `npm run media` is only needed when artwork changes; its originals are in the private source.)

Verification: inspect the complete `dist/` file list and relevant bundle contents for prompts, internal notes, secrets, source maps and unused originals. (First inventory 2026-10-26: 82 files, 3.3 MB; HTML, one JS, one CSS, favicon, fonts and optimised AVIF images only; no prompts, docs, agent files, source maps, local paths or key-like strings. Repeat on the final release build.) Serve that build at the actual proposed base path and check for missing assets. Archive the reviewed artifact and results.

**Checkpoint:** the build is reviewable, contains only approved public material, and loads at its intended path before any upload.

#### D3 — prepare repeatable publication and rollback

Dependencies: D2. Likely files: deployment instructions and, if automation is chosen, one workflow in private source plus destination Pages configuration.

- [x] Prepare a manual first release from the reviewed artifact into the separate public repository. (2026-10-26: `npm run release` builds, checks and prepares `release/a-love-story/` with `.nojekyll`; docs/DEPLOY.md gives the copy, commit, tag and Pages steps.) Publish the contents of `dist/` at its root, with `.nojekyll` for branch-based Pages publishing; do not copy the parent working directory or source history. For private-source artifact deployment instead, configure Pages to use GitHub Actions and upload only `dist/`.
- [x] Record exact build steps, runtime/Node version and release identifier. (docs/DEPLOY.md: Node 24.8 / npm 11.6; releases are tagged `release-YYYY-MM-DD`.) If automating cross-repository publication later, use a credential scoped to the destination, stored in private source repository secrets; never embed it in browser code or release files.
- [x] Retain the previous approved artifact or public release commit, and document how to restore and redeploy it. (docs/DEPLOY.md, "Undo a release": each release is a tagged commit in the public repository.)
- [x] **Automate publication (client request 2026-10-26: "set the action so when i push to github it works").** **Arrangement changed by the client:** a single **public** repository, `abrahamnaiborhu/a-love-story`, holding the whole project (pushed by the client 2026-10-26, Pages source set to GitHub Actions; client: "i thought we can just add a github public repo"). This supersedes the private-source / public-build split above: the source, docs, Codex prompts, original artwork, studies and `.claude/` are public; the served site is still only the checked build. `.github/workflows/publish.yml`: on push to `main` (not for `docs/`, `studies/` or Markdown-only changes), pull requests (build only) or on demand, it runs `npm ci` (Node 24), `npm run lint` and `npm run release`, uploads only `release/a-love-story/` and deploys it with `actions/deploy-pages`, using the workflow's own token (no keys or secrets). Actions pinned to commits (checkout v7.0.1, setup-node v7.1.0, upload-pages-artifact v5.0.0, deploy-pages v5.0.1). Evidence: the client's first push ran the earlier two-repository version on GitHub, where `npm ci`, lint and release passed on the Linux runner (it stopped at the missing deploy key, as designed); the `github-pages` environment allows `main`. Rollback: revert and push. Each push to `main` is a publication, so the client's push is the go-ahead.

Verification: review the destination file list and publication procedure, including the rollback steps. Publishing requires the user's separate go-ahead, as already specified in section 6; no publication is authorized by this planning request.

#### D4 — release and verify the live film

Dependencies: D3, the whole-film pass, and publication authorization.

- [ ] Publish the reviewed release; verify HTTPS, the final URL, refresh, asset requests and absence of console errors on the live site.
- [ ] Check Begin, scrolling, Play/Replay, Watch again, credits link, loading holds and reduced motion at phone and desktop sizes. Record real-device gaps from section 4.
- [ ] Check that internal documents and source maps are absent from the public repository and deployed artifact; retain release evidence and the rollback target.

Verification: record live URL, release identifier, browser results and remaining limitations. A failed release is rolled back to the last approved artifact.

### Inspection limits for this plan

Reviewed the production plan, package scripts, Vite configuration and ignore rules. jcodemunch identified the matching local project index (last indexed 2026-10-25); no source-symbol exploration was needed for this documentation-only change. Runtime source, build output, GitHub account settings, remote history and live hosting have not been audited. All deployment checks above remain unticked until executed.

### Official references

- [GitHub Pages availability and site creation](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)
- [Vite deployment and GitHub Pages base paths](https://vite.dev/guide/static-deploy.html)
- [Vite public assets and build inclusion](https://vite.dev/guide/assets)
- [Vite client environment-variable exposure](https://vite.dev/guide/env-and-mode)
- [Git ignore semantics](https://git-scm.com/docs/gitignore)

---

## 11. Sprint 4 — whole-film pass and release readiness (for approval)

Status: approved 2026-10-26 ("i approve you") and built the same day; results in PROJECT_SCRIPT "Sprint 4 build result" and docs/RELEASE_RECORD.md. Deployment itself is planned in section 10 (D1–D4: private source repository, public build-output repository, nothing published without the client's go-ahead); this section covers the whole-film pass that section 10 lists as a release prerequisite, and does not repeat or override it.

**What visitors get:** the finished film, polished as one piece and ready for section 10's release steps.

### Scope

1. **Whole-film pacing pass.** Watch the full film as one piece, by scroll and by Play, and even out its rhythm: how long each rest holds, line timing, the storm and the silences, and Play's overall speed. Timing and spacing only, not the story.
2. **Carried issues:**
   - **Small phones (360 × 640):** chapter 1's lines touch the couple's feet during the push-in; reframe for short screens.
   - **The bud → opening rose cross-fade:** measure the three rose paintings and align position and scale so the blend doesn't ghost; if that can't fix it, write an A10 regeneration prompt.
   - **His walking → standing photo swap:** tighten it so it hides inside the umbrella-raising movement.
3. **Safari and iPhone readiness.** Review the code for known Safari differences and fix them (for example, the `-webkit-` prefix the blurred Play button needs), then give the client a short checklist for Mac Safari and the iPhone 12 mini. Results go into the device record as real-device evidence; reported problems are fixed in this sprint.
4. **Base-path readiness.** Make the build's base path a single setting (production value per section 10, local development at `/`), and check the loader, images, fonts, favicon and credits link when the build is served under that path locally. This is section 10's D2 asset check, done locally; it publishes nothing.
5. **Final release checks:** all behaviour checks, Lighthouse, smoothness over the whole film, phone and desktop captures, and the skill's release preflight, in one release record of what was tested where and what remains untested.

### Not in this sprint
Anything in section 10 beyond the local base-path check (repositories, git history, uploads, Pages settings, publication); the soundtrack; new images unless the A10 fix needs one; any change to the story.

### Done when

| # | Criterion | Evidence |
|---|---|---|
| 1 | The film plays start to finish with consistent pacing, by scrolling and by Play | Full-film captures; client viewing |
| 2 | The three carried issues are fixed (or A10 has a ready regeneration prompt) | Before/after frames |
| 3 | Known Safari differences are handled in code; the client's Mac Safari and iPhone checks are recorded, and reported problems fixed | Code review notes; checklist results |
| 4 | The production build works locally under the chosen base path: loader, images, fonts, favicon, credits link | Local preview at that path |
| 5 | All behaviour checks pass; Lighthouse ≥ 95 performance and 100 accessibility on mobile; 60 fps average at 4× CPU slowdown | Scripts, Lighthouse, trace |
| 6 | The client confirms the finished film is ready for section 10's release steps | Client review |

**Allowed without asking:** timing and spacing adjustments, framing on small screens, Safari fixes, the base-path setting, bug fixes.
**Stop and ask if:** pacing changes would alter what happens in the story, a new dependency is needed, or anything would publish the site.
