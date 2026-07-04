# Deploy the Backroom Marketing Site

The site is static HTML/CSS/JS with no build step — it can be hosted anywhere. It currently lives at **https://smokestack.outlawsmokevape.com**.

---

## Current setup: GitHub Pages + custom domain

- The `CNAME` file in this repo pins the custom domain `smokestack.outlawsmokevape.com`
- Pushing to `main` redeploys automatically
- DNS: a CNAME record for `smokestack` on `outlawsmokevape.com` points at GitHub Pages

Nothing else to do — push and it ships.

---

## Alternative: Netlify

`netlify.toml` is already configured (publish root, SPA redirect).

1. Go to **netlify.com** → "Add new site" → "Import from Git"
2. Connect this repository — auto-deploys on every push
3. Domain management → add `smokestack.outlawsmokevape.com` and update the DNS record at your registrar

**Cost:** free tier is plenty for this site.

## Alternative: Vercel

1. Go to **vercel.com** → import this repo
2. Framework preset: "Other" (static) — no build command
3. Add the custom domain in project settings

**Cost:** free.

## Alternative: any VPS (nginx)

```nginx
server {
    listen 80;
    server_name smokestack.outlawsmokevape.com;
    root /var/www/backroom-marketing;
    index index.html;
}
```

```bash
certbot --nginx -d smokestack.outlawsmokevape.com   # free HTTPS
```

Only worth it if you're already running a VPS for the Backroom API.

---

## Things that must stay true on any host

- **HTTPS required** — the signup form posts to `https://smokestacksite.outlawsmokevape.com/signup`; browsers block that call from an insecure page
- **`CNAME` file** — only used by GitHub Pages; harmless elsewhere
- **All files at site root** — `index.html`, `styles.css`, `script.js`, `favicon.svg`, `og-image.png`

---

## Troubleshooting

**Form says "Something went wrong"**
- Check the backend is up: `curl -s https://smokestacksite.outlawsmokevape.com/docs -o /dev/null -w "%{http_code}\n"` (expect 200)
- Check the browser console for CORS errors — the API must allow the marketing site's origin

**Domain not resolving**
- `dig smokestack.outlawsmokevape.com` — verify the CNAME record
- DNS changes can take up to 24 hours

**Social preview not showing**
- The `og:image` URL in `index.html` must be absolute and publicly reachable
- Re-scrape after changes: Facebook Sharing Debugger / x.com card validator

---

## Cost summary

| Platform | Monthly |
|----------|---------|
| GitHub Pages (current) | $0 |
| Netlify / Vercel | $0 |
| VPS (nginx) | $5+ |

Stay on GitHub Pages unless you need something it can't do.
