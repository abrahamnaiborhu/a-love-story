# Deploying A Love Story

Written for: Abraham, publishing from this Mac. Plan and boundaries: PRODUCTION_PLAN §10.

**How it works:** one public repository, `abrahamnaiborhu/a-love-story`, holds this whole folder. Every push to `main` runs the **Publish** workflow (`.github/workflows/publish.yml`), which:

1. installs exactly the locked dependencies (`npm ci`, Node 24) and lints;
2. runs `npm run release`: builds for `/a-love-story/` and **stops** if the build contains prompts, notes, local paths, source maps or key-like strings;
3. hands only that checked build (`release/a-love-story/`) to GitHub Pages.

The film lives at **https://abrahamnaiborhu.com/a-love-story/**. Your user site (`abrahamnaiborhu.github.io`) holds the abrahamnaiborhu.com domain, so this repository's site appears under it.

**Public means public.** Visitors to the film get only the build, but anyone can browse the repository: the source, `docs/` (including the Codex prompts in `docs/prompts/`), the original artwork, the studies and `.claude/`. Don't commit anything you'd mind people reading. `.gitignore` keeps the usual secrets (`.env`, keys) out.

---

## Setup (already done)

- The repository exists and this folder is pushed (`origin` is `git@github-personal:abrahamnaiborhu/a-love-story.git`).
- **Settings → Pages → Build and deployment → Source: GitHub Actions** is set.
- **Don't** add a custom domain or `CNAME` file to this repository: it inherits abrahamnaiborhu.com from the user site.

---

## Each release

```bash
cd ~/Documents/Development/Falling_in_love
git add -A
git commit -m "Describe the change"
git push
```

On GitHub: **Actions → Publish**. The **build** job, then the **deploy** job; a green tick after 1–2 minutes, and the deploy job links the live address. abrahamnaiborhu.com is behind Cloudflare, which caches pages for about 10 minutes; if you still see the old version, wait or purge the cache in Cloudflare.

- **If any step fails, nothing is published**, and the live film stays as it was. Open the failed run to see which step stopped it. Running `npm run release` here before pushing shows the same checks.
- Pushes that only change `docs/`, `studies/` or Markdown files don't publish (they can't change the film).
- To publish without a new commit: **Actions → Publish → Run workflow**.
- Pull requests into `main` get the build and checks, but don't publish.

---

## Check the live film

Open **https://abrahamnaiborhu.com/a-love-story/** on your Mac and iPhone:

- [ ] It loads over HTTPS; the red string and "A Love Story" appear, then **Begin**.
- [ ] The opening plays; scrolling and **Play** work; touching pauses Play.
- [ ] The ending, the credits link to abrahamnaiborhu.com, and **Watch again** work.
- [ ] Reloading mid-film brings you back to the same moment.

---

## Undo a release

Undo the change and push; the workflow publishes the previous version:

```bash
cd ~/Documents/Development/Falling_in_love
git revert --no-edit HEAD   # undoes your most recent commit
git push
```
