# Deploying A Love Story

Written for: Abraham, publishing from this Mac. Plan and boundaries: PRODUCTION_PLAN §10.

**The idea:** two GitHub repositories.

| Repository | Visibility | Holds | Purpose |
|---|---|---|---|
| `a-love-story-source` (suggested name) | **Private** | This whole folder: source, docs, prompts, artwork | Your working project and its history |
| `a-love-story` | **Public** | Only the reviewed build: `index.html`, `favicon.svg`, `.nojekyll`, `assets/` | Served by GitHub Pages at **abrahamnaiborhu.com/a-love-story/** |

The public repository never receives the source or its history. The username below is `abrahamnaiborhu`; replace it if yours differs.

Built and checked with Node 24.8 and npm 11.6 (Vite 8 needs Node 20.19 or newer).

---

## One-time setup

### 1. Push this folder to your private repository

Create an **empty, private** repository on GitHub named `a-love-story-source` (no README, no .gitignore, no licence). Then:

```bash
cd ~/Documents/Development/Falling_in_love
git status        # review: ~164 files; there must be no .env, node_modules, dist or release
git add -A
git commit -m "A Love Story: chapters 1–6, credits and release tooling"
git remote add origin https://github.com/abrahamnaiborhu/a-love-story-source.git
git push -u origin main
```

Git is already initialised here (branch `main`), with nothing committed yet. The first commit is about 59 MB, mostly the original artwork in `docs/creative/codex/`.

### 2. Create the public repository and clone it next to this folder

Create an **empty, public** repository named exactly `a-love-story` (no README). Then:

```bash
cd ~/Documents/Development
git clone https://github.com/abrahamnaiborhu/a-love-story.git a-love-story-site
```

(Git warns that you cloned an empty repository; that's expected.)

### 3. Check the address you'll get

Open the repository that serves abrahamnaiborhu.com (usually `abrahamnaiborhu.github.io`) → **Settings → Pages** and confirm its custom domain is `abrahamnaiborhu.com`. If it is, every public project repository with Pages turned on appears under it, so `a-love-story` will live at **https://abrahamnaiborhu.com/a-love-story/**. If not, it lives at **https://abrahamnaiborhu.github.io/a-love-story/**, and the film works there too (it's built for the `/a-love-story/` path either way).

**Don't** add a `CNAME` file to `a-love-story`: it would try to give the film its own domain.

---

## Each release

```bash
cd ~/Documents/Development/Falling_in_love
npm run release
```

This builds the film and **stops** if anything private slipped into the build (prompts, notes, local paths, source maps, key-like strings) or if the build isn't made for `/a-love-story/`. When it passes, `release/a-love-story/` is ready. Copy it into the public clone and publish:

```bash
rsync -a --delete --exclude .git release/a-love-story/ ../a-love-story-site/
cd ../a-love-story-site
git status        # review: only index.html, favicon.svg, .nojekyll and assets/
git add -A
git commit -m "Release 2026-10-26"
git tag release-2026-10-26
git push origin main --tags
```

### First release only: turn on GitHub Pages

On GitHub: `a-love-story` → **Settings → Pages → Build and deployment** → Source: **Deploy from a branch** → Branch: **main**, folder **/ (root)** → **Save**. The first deployment takes a minute or two; the **Actions** tab shows "pages build and deployment".

---

## Check the live film

Open **https://abrahamnaiborhu.com/a-love-story/** (or the github.io address from step 3) on your Mac and iPhone:

- [ ] It loads over HTTPS; the red string and "A Love Story" appear, then **Begin**.
- [ ] The opening plays; scrolling and **Play** work; touching pauses Play.
- [ ] The ending, the credits link to abrahamnaiborhu.com, and **Watch again** work.
- [ ] Reloading mid-film brings you back to the same moment.
- [ ] On GitHub, the `a-love-story` repository contains only `index.html`, `favicon.svg`, `.nojekyll` and `assets/`.

abrahamnaiborhu.com is behind Cloudflare, which caches pages for about 10 minutes. If you still see an old version after publishing, wait, or purge the cache in Cloudflare.

---

## Undo a release

Each release is a commit (and a tag) in the public repository, so going back is one revert:

```bash
cd ~/Documents/Development/a-love-story-site
git log --oneline           # find the release you want to undo
git revert --no-edit HEAD   # undoes the most recent release
git push origin main
```

To restore a specific earlier release instead:

```bash
git checkout release-2026-10-26 -- .
git commit -m "Roll back to release-2026-10-26"
git push origin main
```

GitHub Pages republishes within a couple of minutes (plus Cloudflare's cache).
