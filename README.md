# Theeb – Final Pack (Auto Upload + Fallback)
1) Deploy `worker.js` to Cloudflare Workers and set Variables (Production):
   - `DROPBOX_APP_KEY`, `DROPBOX_APP_SECRET`, `DROPBOX_REFRESH_TOKEN`  (recommended)
   - or `DROPBOX_ACCESS_TOKEN` (temporary)
2) Upload `index.html` to GitHub Pages (or open locally to test).
3) On the page, click ⚙️ and paste your Worker URL ending with `/upload`. Optionally paste Dropbox File Request link.
4) Save PDF. It will download locally and auto-upload to Dropbox (if Worker is set). If not set, it will open your File Request tab.

Use `diagnostics.html` to test /ping and a TEST upload quickly.
