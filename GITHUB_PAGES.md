# Hosting the personal guide with GitHub Pages

The reader has a static GitHub Pages build that keeps the existing theme, contents navigation, Markdown rendering, warnings, figures and print view. The local reader follows saved Markdown files live. The hosted reader is a build-checked snapshot rebuilt from those same files whenever the deployment workflow runs.

The currently selected public address is:

`https://burhaantargett.tech/bush-survival-au/`

The site is live. [Actions run 36949573814](https://github.com/BurhaanT/bush-survival-au/actions/runs/36949573814) successfully built and deployed commit `c8eb207`. Post-deployment HTTP checks returned `200` for the reader, `/print/`, `shelter-layers.svg`, and the exact reader, shared JavaScript and CSS asset URLs emitted by that build.

> **PUBLIC DISCLOSURE WARNING.** The repository and Pages site are currently public. Deploying exposes the complete allowlisted hosted bundle, including its manuscript content and registered images, to anyone who has the URL and potentially to search engines, archiving services and automated downloaders. `PUBLISH_BOOK_READER=YES` is the explicit deployment switch; it is not a safety approval. The guide remains marked `FIELD_READY_BUILD=NO`. Unresolved copyright, image-rights, Indigenous Cultural and Intellectual Property (ICIP), cultural-authority, factual and safety questions remain warnings requiring review. The decision to use the current public URL does not clear or waive any of them.

## What the site path means

Use **GitHub Actions** as the Pages source. Do not select a branch and `/ (root)` as the publishing source: this project needs its Vite build, not the raw repository files.

The workflow asks GitHub for the configured Pages base path through `actions/configure-pages` and uses that value for both the build and its checks. At the current project address GitHub reports `/bush-survival-au`, so the generated links and assets are served correctly beneath that path:

- `reader/dist-pages/index.html` becomes `https://burhaantargett.tech/bush-survival-au/`;
- `reader/dist-pages/print/index.html` becomes `https://burhaantargett.tech/bush-survival-au/print/`; and
- chapters continue to use the reader's hash links beneath the same project path.

Do not hard-code `/bush-survival-au/` into the application. If a dedicated custom domain such as `survival.burhaantargett.tech` is configured later, GitHub reports a root base path and the same source builds for:

- `https://survival.burhaantargett.tech/`; and
- `https://survival.burhaantargett.tech/print/`.

That later move should require GitHub Pages and DNS configuration, not source edits. The workflow still uploads only `reader/dist-pages`; its contents become the published site content at whichever base path GitHub reports. The current `/bush-survival-au/` deployment is verified; the future dedicated-subdomain configuration has not yet been tested. GitHub's workflow arrangement is described in its [custom Pages workflow guide](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## What the public snapshot contains

The prepared hosted bundle contains:

- the 15 canonical chapters;
- the separate emergency review draft;
- key control and source documents plus linked project records used by the reader—64 Markdown documents at the time of this check; and
- all 145 registered image files, about 99 MB before deployment packaging.

The 64 Markdown paths are fail-closed in [the hosted publication allowlist](reader/lib/pages-public-documents.mjs). A new link cannot silently add another project record to the JavaScript bundle. Changing that list requires a deliberate disclosure, cultural-authority and rights review. Because the current repository and site are public, an included record or asset should be treated as publicly disclosed once pushed and deployed.

The interface retains `WORKING DRAFT`, `NOT FOR EMERGENCY USE` and `FIELD_READY_BUILD=NO`. Public hosting does not make the medical, botanical, cultural, legal, survival or equipment content approved. The site has no dependable offline mode. `noindex` metadata is only a request to search engines and is not access control or a confidentiality guarantee.

## GitHub setup

1. Keep **Settings → Pages → Build and deployment → Source** set to **GitHub Actions**.
2. Do not create a Jekyll, Static HTML or branch-root Pages workflow; this repository already contains [.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml).
3. Keep the repository Actions variable `PUBLISH_BOOK_READER` set to the exact value `YES` only while public deployment is intended.
4. Push a commit to `main`, or run **Deploy book reader to GitHub Pages** manually from the Actions tab.

The workflow installs the locked dependencies, runs the tests and authored-code checks, reads GitHub's configured base path, creates the reader and print pages, verifies all 145 registered images, and uploads only `reader/dist-pages` as the Pages artifact. Without `PUBLISH_BOOK_READER=YES`, the deployment job is skipped.

These technical checks do not clear cultural rights, copyright, factual accuracy, safety or field use. Removing the deployment variable prevents later deployments but does not retract copies that have already been downloaded, cached or archived.

## Moving to a dedicated subdomain later

When `survival.burhaantargett.tech` is wanted:

1. Add that exact custom domain in **Settings → Pages**.
2. Configure the matching DNS record with the domain provider as directed by GitHub.
3. Wait for GitHub's domain and HTTPS checks to pass.
4. Run the existing deployment workflow again.

No Markdown, React, Vite or asset-path change should be needed. The next build takes its base path from GitHub and checks the generated root deployment before upload. Do not add a hard-coded custom-domain path or edit generated files in `reader/dist-pages`.

## Updating the hosted book

1. Edit the canonical Markdown or registered assets in this project.
2. Use the local reader to review the live changes.
3. Run the project checks.
4. Commit and push to `main`.

The workflow rebuilds the saved Markdown snapshot. There is no second hosted manuscript to edit.

If an edit links a new internal Markdown record, the static build leaves it out until its path is deliberately added to `reader/lib/pages-public-documents.mjs`. Review that record before changing the list. Adding files to the allowlist, expanding the audience, or promoting this as an emergency-ready guide reopens the cultural, image-rights, disclosure and safety review. `FIELD_READY_BUILD=NO` remains controlling.

## Local path checks

From `reader`, PowerShell can check either supported layout.

Current project path:

```powershell
$env:PAGES_BASE_PATH='/bush-survival-au/'
npm run build:pages
npm run check:pages
npm run preview:pages
```

Future dedicated-domain root:

```powershell
$env:PAGES_BASE_PATH='/'
npm run build:pages
npm run check:pages
npm run preview:pages
```

The generated `reader/dist-pages` folder is disposable build output. Do not edit it or treat it as book source.

The full print view loads about 99 MB of registered images and 224 image frames. It passed desktop browser review, but it is not suitable evidence of reliable performance on a low-memory phone or tablet. Use the ordinary reader for on-screen review and reserve the full print route for a desktop until a later optimised print/PDF path exists.
