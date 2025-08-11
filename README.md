# Theeb – FormData Upload Fix
- This build uses multipart/form-data from the browser (no manual Content-Type) to avoid CORS preflight issues.
- Worker accepts /ping and /upload and handles FormData.

Steps:
1) Deploy `worker.js` to Cloudflare (add Dropbox Variables).
2) Open your site, click ⚙️, paste your Worker URL ending with /upload.
3) Save PDF → local download + auto-upload to Dropbox.

If something fails, open your Worker /ping and check Cloudflare logs.
