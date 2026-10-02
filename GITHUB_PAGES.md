# Hosting the personal guide at the root of a private Enterprise Pages site

The reader has a static GitHub Pages build that keeps the existing theme, contents navigation, Markdown rendering, warnings, figures and print view. The local reader follows saved Markdown files live. The hosted reader is a build-checked snapshot rebuilt from those same files whenever the deployment workflow runs.

No Pages deployment has happened yet.

> **PRIVATE PERSONAL HOSTING ONLY.** The approved target is a private or internal **project repository owned by a GitHub Enterprise Cloud organisation**, with the Pages site visibility set to **Private** and repository access limited to the intended private reader or readers. The current `BurhaanT/bush-survival-au` remote is under a personal account, so it does not qualify for private Enterprise Pages access control. Public or wider sharing remains blocked until the private-copy ICIP, image-rights and disclosure restrictions have been reviewed item by item and any required Traditional Owner direction has been obtained.

## What “at the site root” means

Use **GitHub Actions** as the Pages source. Do not select a branch and `/ (root)` as the publishing source: this project needs its Vite build, not the raw repository files.

The workflow builds `reader/dist-pages` and uploads that directory as the Pages artifact. The *contents* of that artifact become the website root:

- `reader/dist-pages/index.html` is served at `/`;
- `reader/dist-pages/print/index.html` is served at `/print/`; and
- chapters continue to use the reader's hash links beneath `/`.

The workflow asks GitHub for the site's base path and deliberately fails unless GitHub reports the site root. It also asks the Pages API whether the site is private and fails unless the answer is `public: false`. This prevents an accidental deployment to an ordinary public project URL such as `/repository-name/`.

GitHub limits private Pages access control to organisation-owned private or internal **project sites** on GitHub Enterprise Cloud. A personal-account project site does not qualify, and an organisation root site cannot use this access control. A qualifying private project site receives its own Pages address, and a project-specific custom domain can also be used later. See GitHub's [Pages visibility guidance](https://docs.github.com/en/enterprise-cloud@latest/pages/getting-started-with-github-pages/changing-the-visibility-of-your-github-pages-site) and [site-type explanation](https://docs.github.com/en/enterprise-cloud@latest/pages/getting-started-with-github-pages/what-is-github-pages).

People with read access to the repository can access the private site. Keep repository membership and outside-collaborator access as narrow as the personal-use decision requires. `noindex` metadata remains only a search-engine request; the actual protection must come from Enterprise Pages access control.

## What the private snapshot contains

The prepared hosted bundle contains:

- the 15 canonical chapters;
- the separate emergency review draft;
- key control and source documents plus linked project records used by the reader—64 Markdown documents at the time of this check; and
- all 145 registered image files, about 99 MB before deployment packaging.

The 64 Markdown paths are fail-closed in [the hosted publication allowlist](reader/lib/pages-public-documents.mjs). A new link cannot silently add another project record to the JavaScript bundle. Changing that list requires a deliberate disclosure, cultural-authority and rights review, even for the private site.

The interface retains `WORKING DRAFT`, `NOT FOR EMERGENCY USE` and `FIELD_READY_BUILD=NO`. Private hosting does not make the medical, botanical, cultural, legal, survival or equipment content approved. The site has no dependable offline mode.

## One-time Enterprise setup

The current personal-account remote must first be transferred to, or replaced by, a repository in the intended GitHub Enterprise Cloud organisation. Then:

1. Make the organisation-owned repository **Private** (or **Internal** only if that wider enterprise audience is genuinely intended). Keep read access limited.
2. Push the project to its `main` branch. If the default branch has another name, update the `push` branch in [the deployment workflow](.github/workflows/deploy-pages.yml).
3. Open **Settings → Pages** in that repository.
4. Under **Build and deployment**, set **Source** to **GitHub Actions**.
5. Set the Pages site **Visibility** to **Private**. Do not continue if this option is unavailable.
6. Confirm that the site is a project site and that the intended Pages address is rooted at `/`, rather than `/repository-name/`.
7. Open **Settings → Secrets and variables → Actions → Variables** and create `PUBLISH_BOOK_READER` with the exact value `YES`.
8. Push a commit, or run **Deploy book reader to GitHub Pages** manually from the Actions tab.

Set `PUBLISH_BOOK_READER=YES` only after the Enterprise organisation, repository privacy, Pages visibility and reader access have been checked. Without that exact variable, the deployment job is skipped. Even with it, the workflow stops if GitHub reports a non-root base path or a public Pages site.

The workflow installs the locked dependencies, runs the tests and authored-code checks, creates the reader and print pages, verifies all 145 registered images, and uploads only `reader/dist-pages` as the Pages artifact. These technical checks do not clear cultural rights, copyright, factual accuracy, safety or field use. GitHub's workflow arrangement is described in its [custom Pages workflow guide](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Updating the hosted book

1. Edit the canonical Markdown or registered assets in this project.
2. Use the local reader to review the live changes.
3. Run the project checks.
4. Commit and push to `main` in the Enterprise organisation repository.

The workflow rebuilds the saved Markdown snapshot. There is no second hosted manuscript to edit.

If an edit links a new internal Markdown record, the static build leaves it out until its path is deliberately added to `reader/lib/pages-public-documents.mjs`. Review that record before changing the list. Granting wider repository access, changing Pages visibility, copying the site elsewhere or making the repository public also reopens the cultural, image-rights and disclosure review. Public release remains blocked.

## Local site-root check

From `reader`, PowerShell can build the same root-based layout locally:

```powershell
$env:PAGES_BASE_PATH='/'
npm run build:pages
npm run check:pages
npm run preview:pages
```

Open the root URL printed by Vite. The print view is at `/print/`.

The generated `reader/dist-pages` folder is disposable build output. Do not edit it or treat it as book source.

The full print view loads about 99 MB of registered images and 224 image frames. It passed desktop browser review, but it is not suitable evidence of reliable performance on a low-memory phone or tablet. Use the ordinary reader for on-screen review and reserve the full print route for a desktop until a later optimised print/PDF path exists.
