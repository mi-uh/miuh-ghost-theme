# miuh-ghost-theme

A privacy-focused Ghost theme based on
[TryGhost/Casper](https://github.com/TryGhost/Casper), used on
[michaeluhrich.xyz](https://michaeluhrich.xyz/).

The fork keeps its visual changes separate from Casper and serves selected Ghost
UI assets locally to reduce third-party requests. Overall privacy and GDPR
compliance still depend on the complete Ghost, server, analytics, and content
configuration.

## Highlights

- Warm editorial design with matching light and dark modes
- Custom styling isolated in `assets/css/custom.css` for easier upstream merges
- Local Portal, Search, and Comments assets
- Generated production assets included in `assets/built/`
- Automated validation and deployment to Ghost from `main`
- Compatible with Ghost 6.x; package metadata supports Ghost 5 and newer

## Required Ghost configuration

Configure Ghost to use the local Portal, Search, and Comments assets:

```yaml
portal__url: "/assets/jsdelivr/portal.min.js"
sodoSearch__url: "/assets/jsdelivr/sodo-search.min.js"
sodoSearch__styles: "/assets/jsdelivr/sodo-search.min.css"
comments__url: "/assets/jsdelivr/comments-ui.min.js"
privacy__useGravatar: "false"
privacy__useGoogleFonts: "false"
privacy__useRpcPing: "false"
```

Without these settings, Ghost may load the corresponding resources from its
default external locations.

## Development

Requirements: Node.js 22.12 or newer and Corepack. The pnpm version is pinned in
`package.json`.

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Useful commands:

```bash
pnpm build     # Build CSS and JavaScript into assets/built/
pnpm test      # Build the archive and validate the theme with GScan
pnpm zip       # Create dist/miuh-ghost-theme.zip
```

A VS Code Dev Container is available in `.devcontainer/` and provides the same
Node.js and pnpm toolchain.

## Delivery

Pull requests run the theme test workflow. After a pull request is merged into
`main`, GitHub Actions installs the locked dependencies, builds the theme archive,
validates that exact archive with GScan, and deploys it to the protected
`production` environment in Ghost.

The version shown in Ghost comes from `package.json` and should be updated before
merging a release. The generated ZIP can still be uploaded manually through Ghost
Admin if the automated deployment is unavailable.

## Updating local Ghost assets

  The currently vendored UI assets target Ghost 6.61.0 and were resolved on
  2026-09-01:

  | Asset | Version | SHA-256 |
  | --- | --- | --- |
  | Portal | 2.71.66 | `3b50ace64b19b0ff8df27cbc6ba86349e9941e9fbf411964f646bad87bf70d0e` |
  | Sodo Search JavaScript | 1.8.429 | `5587c82468e994caff2a30f6f1f7ef82d5ed55a58f94080caddd89a5ab326c5d` |
  | Sodo Search CSS | 1.8.429 | `8ccd755b66f88bcac9aee9f9c0a0c97fea3610d71d222f3af122b8ef0a053e67` |
  | Comments UI | 1.6.162 | `ccca5fd0abec8883312d6965914a94b437a3272ef7eefad0479e52b0344062fe` |

  When updating these files:

  1. Determine the Ghost version running in production.
  2. Check [`defaults.json`](https://github.com/TryGhost/Ghost/blob/v6.61.0/ghost/core/core/shared/config/defaults.json) from the matching Ghost release tag.
  3. Resolve jsDelivr's version range and download that exact patch version.
  4. Replace the corresponding files in `assets/jsdelivr/`.
  5. Record the resolved versions and SHA-256 hashes in the table above.
  6. Run `pnpm test:ci` before opening a pull request.

## License

MIT, matching upstream Casper. See [LICENSE](LICENSE).
