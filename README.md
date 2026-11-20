# miuh-ghost-theme

Privacy-focused Ghost theme based on [Casper](https://github.com/TryGhost/Casper),
used on [michaeluhrich.xyz](https://michaeluhrich.xyz/). Fonts and Ghost UI
assets are served locally to reduce third-party requests. This alone does not
make a site GDPR compliant; see the [privacy checklist](#privacy-checklist).

<a href="https://michaeluhrich.xyz/">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/screenshot-desktop-dark.jpg">
    <img alt="Desktop preview of the miuh Ghost theme" src="assets/screenshot-desktop.jpg">
  </picture>
</a>

## Features

- Warm editorial design, light and dark mode
- Self-hosted Source Serif 4, local Portal, Search and Comments
- **Blog** page template (`custom-blog.hbs`): posts grouped by primary tag
- **Homepage subheadline** setting below the site description
- Custom styles isolated in `assets/css/custom.css`

## Requirements

**Ghost 6.x**, **Node.js ≥ 22.12** with Corepack (pnpm is pinned in
`package.json`). Optional: Dev Container in `.devcontainer/`.

## Build

Run in the repository root:

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev       # watch and rebuild assets/built/
pnpm test:ci   # build dist/miuh-ghost-theme.zip and validate with GScan
```

Manual install: Ghost Admin → **Settings → Site → Theme → Change theme → Upload theme**.

## Ghost setup

### Server configuration

Environment variables for the Ghost container (e.g. `docker-compose.yml`).
Without them Ghost loads these resources from external CDNs.

```yaml
portal__url: "/assets/jsdelivr/portal.min.js"
sodoSearch__url: "/assets/jsdelivr/sodo-search.min.js"
sodoSearch__styles: "/assets/jsdelivr/sodo-search.min.css"
comments__url: "/assets/jsdelivr/comments-ui.min.js"
privacy__useGravatar: "false"
privacy__useGoogleFonts: "false"
privacy__useRpcPing: "false"
```

Apply in the Ghost compose directory with `docker compose up -d ghost`. **The
container is recreated; the site is briefly offline.**

### Admin settings

| Where | Setting | Value |
| --- | --- | --- |
| General | Publication language | `de` |
| Design & branding → Brand | Accent color | `#8a4f25` |
| Design & branding → Site wide | Navigation layout | Stacked |
| | Title font / Body font | Elegant serif |
| | Color scheme | Auto |
| Design & branding → Homepage | Header style | Hidden |
| | Feed layout | Classic |

### Privacy checklist

With the server configuration above, fonts, Portal, Search and Comments are
served from your own domain. **Still to check per site** (no legal advice):

| Area | Check |
| --- | --- |
| Newsletter | Mail provider (e.g. Mailgun) needs a data processing agreement; disable open/click tracking in **Settings → Analytics** if unused |
| Paid members | Stripe checkout loads Stripe's own scripts |
| Content | Embeds (YouTube, X, …) and Unsplash images load from third parties |
| Analytics | Ghost's web analytics and scripts added via Code injection need a legal basis |
| Server | Retention of logs with IP addresses; hosting agreement |
| Legal pages | Privacy policy and imprint reflect all of the above |

## Release

Deployment runs from a published GitHub release (workflow *Deploy Ghost Theme*,
environment `production`). **The new theme is active immediately.**

1. Bump `version` in `package.json` on a branch `release/vX.Y.Z`, open a PR and
   merge it.
2. Publish the release:

   ```bash
   gh release create vX.Y.Z --repo mi-uh/miuh-ghost-theme --target main --generate-notes
   gh run watch --repo mi-uh/miuh-ghost-theme
   ```

3. Check the version in Ghost Admin and reload the site without cache.

Fallback: upload `dist/miuh-ghost-theme.zip` manually.

## Maintenance

### Dependency updates

Dependabot opens weekly PRs for npm packages and GitHub Actions. Merge them
once the checks pass.

### Syncing with Casper

Prerequisite: remote `upstream` → `https://github.com/TryGhost/Casper.git`.

```bash
git switch main && git pull
git fetch upstream
git switch -c chore/sync-casper-upstream
git merge upstream/main
# lockfile conflict: take Casper's version, then reinstall
git checkout --theirs pnpm-lock.yaml && pnpm install
pnpm test:ci   # rebuilds assets/built/, commit the result
```

In `package.json`, keep the fork's name, version and metadata and the higher
dependency versions. **Merge the PR with a merge commit**, never squash or
rebase, or the next sync repeats the same conflicts.

### Ghost UI assets

Vendored for **Ghost 6.78.0** (resolved 2026-11-20):

| File in `assets/jsdelivr/` | Version | SHA-256 |
| --- | --- | --- |
| `portal.min.js` | 2.72.36 | `bf97c0a94eb564f0d3192d9ee1ea7534a0ed82c109c5111630076aed1e715583` |
| `sodo-search.min.js` | 1.9.7 | `5ff29320840e94565b12c15d90a4ab9c884a7e01783e17ac329f27dba3395688` |
| `sodo-search.min.css` | 1.9.7 | `8351196b62e6c27858441427a27c8be4d08f0e2b3684c4c280de7bbfe2a2160a` |
| `comments-ui.min.js` | 1.6.456 | `af76fd41bd86e030ddff5b7bfa627da0ae1aa7f4534184fb92270c0209a33c34` |

Update after each Ghost upgrade:

1. Read the version ranges in `ghost/core/shared/config/defaults.json` of the
   production Ghost tag
   ([v6.78.0](https://github.com/TryGhost/Ghost/blob/v6.78.0/ghost/core/shared/config/defaults.json);
   older tags such as v6.65.0 use `ghost/core/core/shared/…`).
2. Download the resolved patch versions from
   `https://cdn.jsdelivr.net/npm/@tryghost/<package>@<version>/umd/`
   (Search CSS: `main.css` → `sodo-search.min.css`).
3. Update the table, run `pnpm test:ci`.

### Font

Source Serif 4 from `@fontsource-variable/source-serif-4` **5.3.1** (`opsz`
builds, downloaded 2026-11-20):

| File in `assets/fonts/` | SHA-256 |
| --- | --- |
| `source-serif-4-latin-opsz-normal.woff2` | `f2ea9c12d2fe9bd3a9589b02ad2c0909da88f30938c91adc838c4f4098f9f9e0` |
| `source-serif-4-latin-opsz-italic.woff2` | `96e6393209728ab93c334ae739af8a040cd2006c82e8614d6465a8084db88f89` |
| `source-serif-4-latin-ext-opsz-normal.woff2` | `155f6e701097cc269cf8d5d7ac86795f263f1afbeb47c14d1d747108c9335389` |
| `source-serif-4-latin-ext-opsz-italic.woff2` | `2078240cee94e627d0e180d56d74a11b2a1d387bbd61a9b7269f0a43df756896` |

Update: download from
`https://cdn.jsdelivr.net/npm/@fontsource-variable/source-serif-4@<version>/files/`,
compare `unicode-range` in the package's `opsz.css` / `opsz-italic.css` with
`assets/css/custom.css`, update the table.

## License

Theme: **MIT**, like Casper ([LICENSE](LICENSE)). Source Serif 4: **SIL Open
Font License 1.1** (`assets/fonts/OFL.txt`). Files in `assets/jsdelivr/`:
**MIT**, © Ghost Foundation.
