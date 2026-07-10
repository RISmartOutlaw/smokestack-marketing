# Backroom Marketing Site

Landing page for **Backroom** — the back-office behind your counter. Inventory, orders, and analytics for vape shops, smoke shops, and alternative retail. By Rogue Intelligence.

**Live site:** https://smokestack.outlawsmokevape.com
**Backend API:** https://smokestacksite.outlawsmokevape.com (signup + 17 REST endpoints, docs at `/docs`)

---

## What's in this repo

| File | Purpose |
|------|---------|
| `index.html` | Complete landing page |
| `styles.css` | Black/gold/red brand styling, responsive |
| `script.js` | Signup form → `/signup` API, mobile menu, scroll effects |
| `favicon.svg` | Browser tab icon |
| `og-image.png` | Social link preview card (1200×630) |
| `robots.txt` | Crawler rules + sitemap pointer |
| `sitemap.xml` | Sitemap for search engines |
| `CNAME` | Custom domain for GitHub Pages |
| `netlify.toml` | Netlify config (alternative host) |
| `QUICK_START.md` | How to update and deploy the site |
| `DEPLOY_MARKETING.md` | Hosting options in detail |

No build step — plain HTML/CSS/JS. Edit, push, deployed.

---

## Page sections

1. **Hero** — headline, stats, CTAs
2. **Problem / Solution** — pain points and value props
3. **Features** — 8 core product features
4. **How It Works** — 6-step onboarding
5. **Pricing** — Self-Serve $49.99/mo · Done-For-You $99/mo (+ setup from $299) · Multi-Location (custom)
6. **Comparison** — Backroom vs Shopify / Square / custom POS
7. **Testimonials & FAQ**
8. **Site-build intake form** — posts to the Backroom API, returns the customer's API key
9. **Footer** — contact: rogueintelligenceso@gmail.com

---

## The signup flow

The intake form (`#signupForm`) POSTs JSON to `https://smokestacksite.outlawsmokevape.com/signup`. On success the form is replaced with a confirmation showing the new API key (used in the `X-API-Key` header against the Backroom API). On failure the form re-enables with an inline error.

---

## Making changes

```bash
# edit index.html / styles.css / script.js
git add -A && git commit -m "Describe the change"
git push origin main
```

The live site updates automatically on push. See `QUICK_START.md` for details.
