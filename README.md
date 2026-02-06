# miuh-ghost-theme

A GDPR-compliant (DSGVO) fork of [TryGhost/Casper](https://github.com/TryGhost/Casper) 5.9.0.

All external CDN requests have been removed so the theme can run without any third-party network calls.

Repository: [github.com/mi-uh/miuh-ghost-theme](https://github.com/mi-uh/miuh-ghost-theme)


## What changed vs. upstream Casper

1. **jQuery loaded locally** -- served from `assets/js/lib/jquery-3.5.1.min.js` instead of `code.jquery.com`.
2. **Local GDPR assets** in `assets/jsdelivr/`:
   - `portal.min.js` (v2.58.1)
   - `sodo-search.min.js` (v1.8.4)
   - `sodo-search.min.css`
   - `comments-ui.min.js` (v1.1.4)
3. **`package.json`** -- name changed to `miuh-ghost-theme`, version `1.0.0`.
4. **`gulpfile.js`** -- line 10 changed to `require('gulp-zip').default` (required for the zip task to work with gulp-zip 6.x).


## Required Ghost configuration

Ghost must be told to load portal, search, and comments from the local theme assets instead of jsDelivr. Add these environment variables to your `docker-compose.yml` (or Ghost config):

```yaml
portal__url: "/assets/jsdelivr/portal.min.js"
sodoSearch__url: "/assets/jsdelivr/sodo-search.min.js"
sodoSearch__styles: "/assets/jsdelivr/sodo-search.min.css"
comments__url: "/assets/jsdelivr/comments-ui.min.js"
privacy__useGravatar: "false"
privacy__useGoogleFonts: "false"
privacy__useRpcPing: "false"
```

Without these settings, Ghost will still fetch scripts from external CDNs, defeating the purpose of the local assets.


## Build

```bash
npm install        # or: yarn install
npx gulp build     # compiles CSS + JS into assets/built/
npx gulp zip       # packages theme into dist/miuh-ghost-theme.zip
```

Upload the resulting zip file via Ghost Admin > Settings > Design > Change theme > Upload.


## Development

```bash
npx gulp           # starts dev server with livereload
```

Edit files in `assets/css/` and `assets/js/` -- they compile to `assets/built/` automatically.


## Syncing upstream Casper changes

```bash
# one-time setup
git remote add upstream https://github.com/TryGhost/Casper.git

# pull latest changes
git fetch upstream
git merge upstream/main
```

Resolve any conflicts in the files listed above (jQuery path in templates, package.json, gulpfile.js). The `assets/jsdelivr/` directory will never conflict since it does not exist upstream.


## Updating the local GDPR assets

When Ghost releases a new version, the bundled portal/search/comments versions may change. To update:

1. Check current versions:
   - https://cdn.jsdelivr.net/ghost/portal@latest
   - https://cdn.jsdelivr.net/ghost/sodo-search@latest
   - https://cdn.jsdelivr.net/ghost/comments-ui@latest
   - Or check [Ghost's defaults.json](https://github.com/TryGhost/Ghost/blob/main/ghost/core/core/shared/config/defaults.json) for the version ranges Ghost expects.
2. Download the new files into `assets/jsdelivr/`, replacing the old ones.
3. Rebuild and re-upload the theme.


## License

MIT -- same as upstream Casper. See [LICENSE](LICENSE).
