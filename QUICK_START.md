# Backroom Marketing Site — Quick Start

How to update and ship changes to the Backroom landing page.

**Live site:** https://smokestack.outlawsmokevape.com

---

## Update the site

1. Edit `index.html`, `styles.css`, or `script.js`
2. Preview locally:
   ```bash
   python3 -m http.server 8000
   # visit http://localhost:8000
   ```
3. Ship it:
   ```bash
   git add -A
   git commit -m "Describe the change"
   git push origin main
   ```

The site redeploys automatically on push (GitHub Pages via `CNAME`; `netlify.toml` is included if you host on Netlify instead).

---

## Common edits

| What | Where |
|------|-------|
| Pricing tiers | `index.html` → `<section id="pricing">` (Self-Serve $49.99 / Done-For-You $99 / Multi-Location) |
| Testimonials | `index.html` → `<section class="testimonials">` — swap in real customer quotes as they come in |
| Contact email | `index.html` footer + `contactSales()` in `script.js` (currently rogueintelligenceso@gmail.com) |
| Signup API | `API_BASE` at the top of `script.js` (currently `https://smokestacksite.outlawsmokevape.com`) |
| Social preview | `og-image.png` + the `og:`/`twitter:` meta tags in `index.html` |
| Favicon | `favicon.svg` |

---

## Test before shipping

- Open on your phone (same WiFi: `http://<your-computer-ip>:8000`) — check the hamburger menu works
- Submit the intake form and confirm you get an API key back and the lead arrives
- Click every button: both pricing CTAs scroll to the form, Multi-Location "Contact Sales" opens email

---

## Analytics (optional)

`script.js` has a `trackEvent()` stub wired to page views, button clicks, and form events. To turn it on, add your Google Analytics 4 snippet to `<head>` in `index.html` and forward events in `trackEvent()`:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-YOUR-ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-YOUR-ID');
</script>
```

---

## Launch checklist

- [ ] Form submission tested end-to-end on the live site
- [ ] Tested on mobile (menu, buttons, form)
- [ ] Contact email correct everywhere
- [ ] Share a link in a chat app — preview card shows the Backroom image
- [ ] Analytics added (optional)

For hosting alternatives and troubleshooting, see `DEPLOY_MARKETING.md`.
