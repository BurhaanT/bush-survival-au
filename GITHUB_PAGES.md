# Hosting the book reader on GitHub Pages

The reader now has a static GitHub Pages build that keeps the existing theme, contents navigation, Markdown rendering, warnings, figures and print view. The local reader still follows saved Markdown files live. The hosted reader is a build-checked snapshot rebuilt from those same files whenever the deployment workflow runs.

> **DO NOT PUBLISH THE CURRENT FULL SNAPSHOT YET.** This personal working edition contains cultural context governed by the project's private-copy ICIP rule and images recorded for the personal/non-commercial edition. Public hosting is broader than the authorised private copy. Complete an item-by-item cultural and image-rights review, obtain relevant Traditional Owner direction where required, and reduce or replace restricted material before deployment. This is a publication-rights gate as well as a privacy choice.

## Before publishing

Treat an ordinary GitHub Pages site as public. A private repository does not by itself make the published site private, and the `noindex` metadata is only a request to search engines—not access control.

If the repository itself is public, every committed project file is also public—not only the 64 Markdown documents embedded in the site. Do not initialise and push this whole working folder to a public repository. Prefer a private source repository where the account and Pages arrangement allow it, or a deliberately limited deployment repository that contains only material cleared for public release. The published Pages site must still be treated as public. If the guide must remain personal, ordinary GitHub Pages is not a suitable host.

The current hosted bundle contains:

- the 15 canonical chapters;
- the separate emergency review draft;
- key control and source documents plus linked project records used by the reader—64 Markdown documents and about 2.17 million source characters at the time of this check; and
- all 145 registered image files, about 99 MB before deployment packaging.

The 64 Markdown paths are fail-closed in [the hosted publication allowlist](reader/lib/pages-public-documents.mjs). A new link cannot silently add another project record to the public JavaScript bundle. Changing that list requires a deliberate disclosure and rights review. This technical boundary does not mean the currently listed documents have been cleared for publication; the block above still controls.

The interface prominently retains `WORKING DRAFT`, `NOT FOR EMERGENCY USE` and `FIELD_READY_BUILD=NO`. Hosting does not make the medical, botanical, cultural, legal, survival or equipment content approved. The site has no dependable offline mode.

## One-time setup — only after the publication gate is cleared

This folder is not currently a Git repository and has no GitHub remote. To deploy it:

1. Complete and record the cultural, image-rights and disclosure review described above.
2. Create an appropriately private source repository or a deliberately limited deployment repository. Do not make the complete working project public by default.
3. Put the cleared project or deployment subset at the repository root and push it to a `main` branch. If the default branch has another name, change the branch under `push` in [the deployment workflow](.github/workflows/deploy-pages.yml).
4. In the repository, open **Settings → Pages**.
5. Under **Build and deployment**, set **Source** to **GitHub Actions**.
6. Only after the publication gate is recorded as cleared, open **Settings → Secrets and variables → Actions → Variables** and create the repository variable `PUBLISH_BOOK_READER` with the value `YES`. Without that exact variable, Actions builds and checks the artifact but the public deployment job is skipped.
7. Push a commit, or run **Deploy book reader to GitHub Pages** manually from the Actions tab.

The workflow obtains the correct Pages base path from GitHub. It therefore supports both:

- a project site such as `https://OWNER.github.io/REPOSITORY/`; and
- a root user/organisation site or custom domain, where the base path is `/`.

It installs the locked dependencies, runs the tests and type/lint checks, creates both the reader and print pages, verifies all 145 registered images and uploads `reader/dist-pages` as a workflow artifact. Public deployment occurs only when those technical checks pass **and** `PUBLISH_BOOK_READER=YES` is present. Neither the checks nor that variable clear cultural rights, copyright, factual accuracy, safety or field use.

GitHub's current setup requirements are described in the [Vite GitHub Pages guide](https://vite.dev/guide/static-deploy#github-pages) and [GitHub's custom Pages workflow guide](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Updating the hosted book

1. Edit the canonical Markdown or registered assets in this project.
2. Use the local reader to review the live changes.
3. Run the project checks.
4. Commit and push to `main`.

The Actions workflow rebuilds the saved Markdown snapshot. There is no second hosted manuscript to edit.

If an edit links a new internal Markdown record, the static build leaves it out until its path is deliberately added to `reader/lib/pages-public-documents.mjs`. Review the record for public disclosure, cultural authority and rights before changing that list.

## Local static-build check

From `reader`, PowerShell can simulate a repository project site:

```powershell
$env:PAGES_BASE_PATH='/test-repository/'
npm run build:pages
npm run check:pages
npm run preview:pages
```

Open the URL printed by Vite, including `/test-repository/`. For a root or custom-domain build, use `PAGES_BASE_PATH=/`.

The generated `reader/dist-pages` folder is disposable build output. Do not edit it or treat it as book source.

The full print view loads about 99 MB of registered images and 224 image frames. It passed desktop browser review, but it is not suitable evidence of reliable performance on a low-memory phone or tablet. Use the ordinary reader for on-screen review and reserve the full print route for a desktop until a later optimized print/PDF path exists.
