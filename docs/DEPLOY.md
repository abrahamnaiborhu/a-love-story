# Deploying A Love Story

Written for: Abraham, publishing from this Mac. Plan and boundaries: PRODUCTION_PLAN §10.

**The idea:** two GitHub repositories, and publishing is automatic.

| Repository | Visibility | Holds | Purpose |
|---|---|---|---|
| `a-love-story-source` (suggested name) | **Private** | This whole folder: source, docs, prompts, artwork | Your working project and its history. You push here. |
| `a-love-story` | **Public** | Only the checked build: `index.html`, `favicon.svg`, `.nojekyll`, `assets/` | Served by GitHub Pages at **abrahamnaiborhu.com/a-love-story/**. Only the workflow writes here. |

Every push to `main` of the private repository runs the **Publish** workflow (`.github/workflows/publish.yml`). It builds the film, refuses to continue if anything private slipped into the build, and pushes only the build to `a-love-story`.

Why two repositories: on the free GitHub plan, Pages can't serve a private repository, and the source (prompts, notes, artwork) must stay private. The public repository never receives the source or its history.

The username below is `abrahamnaiborhu`; replace it if yours differs. The workflow finds the public repository by itself (same account, named `a-love-story`).

---

## One-time setup

### 1. Create the two repositories

On GitHub, create both **empty** (no README, no .gitignore, no licence):

- `a-love-story-source`: **Private**
- `a-love-story`: **Public**, named exactly that (it becomes the `/a-love-story/` address)

### 2. Make the publishing key

The workflow needs permission to push to `a-love-story`. A **deploy key** gives it exactly that: write access to that one repository, nothing else on your account.

```bash
ssh-keygen -t ed25519 -N "" -C "a-love-story publish" -f ~/Desktop/a-love-story-deploy
```

This makes two files on your Desktop: `a-love-story-deploy` (private half) and `a-love-story-deploy.pub` (public half).

1. **Public half → the public repository.** `a-love-story` → **Settings → Deploy keys → Add deploy key**.
   Title: `Publish workflow`. Key: run `pbcopy < ~/Desktop/a-love-story-deploy.pub` and paste. Tick **Allow write access**. **Add key**.
2. **Private half → the private repository.** `a-love-story-source` → **Settings → Secrets and variables → Actions → New repository secret**.
   Name: `SITE_DEPLOY_KEY`. Secret: run `pbcopy < ~/Desktop/a-love-story-deploy` and paste (including the `BEGIN` and `END` lines). **Add secret**.
3. Delete both files: `rm ~/Desktop/a-love-story-deploy ~/Desktop/a-love-story-deploy.pub`. GitHub keeps what it needs. If the key ever leaks, delete it under Deploy keys and repeat this step.

### 3. Push this folder to the private repository

```bash
cd ~/Documents/Development/Falling_in_love
git status        # review: ~166 files; there must be no .env, node_modules, dist or release
git add -A
git commit -m "A Love Story: chapters 1–6, credits and release tooling"
git remote add origin https://github.com/abrahamnaiborhu/a-love-story-source.git
git push -u origin main
```

Git is already initialised here (branch `main`), with nothing committed yet. The first commit is about 59 MB, mostly the original artwork in `docs/creative/codex/`.

The push starts the first publish. On GitHub: `a-love-story-source` → **Actions** → **Publish**. A green tick after 1–2 minutes means the build is now in `a-love-story`.

### 4. Turn on GitHub Pages (after the first publish)

`a-love-story` → **Settings → Pages → Build and deployment** → Source: **Deploy from a branch** → Branch: **main**, folder **/ (root)** → **Save**. (The branch only exists after the first publish, so do this after step 3.) The first deployment takes a minute or two.

### 5. Check the address you'll get

Open the repository that serves abrahamnaiborhu.com (usually `abrahamnaiborhu.github.io`) → **Settings → Pages** and confirm its custom domain is `abrahamnaiborhu.com`. If it is, `a-love-story` lives at **https://abrahamnaiborhu.com/a-love-story/**. If not, it lives at **https://abrahamnaiborhu.github.io/a-love-story/**, and the film works there too (it's built for the `/a-love-story/` path either way).

**Don't** add a `CNAME` file to `a-love-story`: it would try to give the film its own domain.

---

## Each release

Commit and push:

```bash
git add -A
git commit -m "Describe the change"
git push
```

The Publish workflow then:

1. installs exactly the locked dependencies (`npm ci`, Node 24) and lints;
2. runs `npm run release`: builds for `/a-love-story/` and **stops** if the build contains prompts, notes, local paths, source maps or key-like strings;
3. pushes the build to `a-love-story` as one commit, tagged `release-YYYY-MM-DD-HHMM-<commit>`.

GitHub Pages republishes a minute or two later. abrahamnaiborhu.com is behind Cloudflare, which caches pages for about 10 minutes; if you still see the old version, wait or purge the cache in Cloudflare.

- **If the workflow fails, nothing is published**, and the live film stays as it was. Open the failed run on the Actions tab to see which step stopped it. Running `npm run release` here before pushing shows the same checks.
- Pushes that only change `docs/`, `studies/` or Markdown files don't publish (they can't change the film).
- To publish without a new commit: **Actions → Publish → Run workflow**.
- Actions minutes on a private repository come from your plan's monthly allowance; a publish takes about 1–2 minutes.

---

## Check the live film

Open **https://abrahamnaiborhu.com/a-love-story/** (or the github.io address from step 5) on your Mac and iPhone:

- [ ] It loads over HTTPS; the red string and "A Love Story" appear, then **Begin**.
- [ ] The opening plays; scrolling and **Play** work; touching pauses Play.
- [ ] The ending, the credits link to abrahamnaiborhu.com, and **Watch again** work.
- [ ] Reloading mid-film brings you back to the same moment.
- [ ] On GitHub, the `a-love-story` repository contains only `index.html`, `favicon.svg`, `.nojekyll` and `assets/`.

---

## Undo a release

**Usual way:** undo the change in the private repository and push. The workflow publishes the previous version.

```bash
cd ~/Documents/Development/Falling_in_love
git revert --no-edit HEAD   # undoes your most recent commit
git push
```

**Fastest way** (no rebuild, e.g. if the workflow itself is broken): put an earlier release back in the public repository. Each release is a tagged commit there.

```bash
cd ~/Documents/Development
git clone https://github.com/abrahamnaiborhu/a-love-story.git a-love-story-site   # first time only
cd a-love-story-site
git pull --tags
git tag --list 'release-*'                    # pick the release to restore
git rm -rq . && git checkout release-2026-10-26-1542-abc1234 -- .
git commit -m "Roll back to release-2026-10-26-1542-abc1234"
git push
```

Then fix or revert the source too: the next push to `a-love-story-source` publishes again.

---

## Publishing by hand (only if Actions is unavailable)

```bash
cd ~/Documents/Development/Falling_in_love
npm run release
rsync -a --delete --exclude .git release/a-love-story/ ../a-love-story-site/
cd ../a-love-story-site
git status        # review: only index.html, favicon.svg, .nojekyll and assets/
git add -A
git commit -m "Release by hand"
git push
```
