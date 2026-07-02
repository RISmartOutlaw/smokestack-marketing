# Deploy SmokeStack Marketing Site

The marketing site is a static HTML/CSS/JS landing page. Deploy it anywhere.

---

## Option 1: Netlify (Recommended - FREE)

### Step 1: Prepare Files
```bash
cd marketing/
# Files needed: index.html, styles.css, script.js
```

### Step 2: Connect to Netlify
- Go to **netlify.com**
- Click "Add new site" → "Deploy manually"
- Drag & drop the `marketing` folder
- Done! Your site is live at a Netlify subdomain

### Step 3: Custom Domain
- In Netlify dashboard → Domain management
- Add your custom domain (e.g., `smokestack.io`)
- Update DNS records (Netlify will provide)

**Cost:** Free (with option to upgrade)

---

## Option 2: Vercel (FREE)

### Step 1: Create Repository
```bash
git init
git add marketing/
git commit -m "Add marketing site"
git push -u origin main
```

### Step 2: Deploy on Vercel
- Go to **vercel.com**
- Click "New Project"
- Import your GitHub repository
- Select `marketing` as root directory
- Click Deploy

**Cost:** Free

---

## Option 3: AWS S3 + CloudFront (Cheapest - $1-5/month)

### Step 1: Create S3 Bucket
```bash
aws s3 mb s3://smokestack-marketing --region us-east-1
```

### Step 2: Upload Files
```bash
aws s3 sync marketing/ s3://smokestack-marketing/ --acl public-read
```

### Step 3: Enable Static Website Hosting
```bash
aws s3 website s3://smokestack-marketing/ \
    --index-document index.html \
    --error-document index.html
```

### Step 4: CloudFront Distribution
- Create CloudFront distribution
- Set S3 bucket as origin
- Enable HTTPS
- Add your custom domain

**Cost:** ~$1-5/month

---

## Option 4: GitHub Pages (FREE)

### Step 1: Create Repository
```bash
git init
git remote add origin https://github.com/yourusername/smokestack-marketing.git
git add .
git commit -m "Initial commit"
git push -u origin main
```

### Step 2: Enable GitHub Pages
- Go to repo → Settings → Pages
- Select "Deploy from branch"
- Choose `main` branch, `marketing` folder
- Save

### Step 3: Custom Domain
- In Settings → Pages, add custom domain
- Update DNS CNAME record

**Cost:** Free

---

## Option 5: Self-Hosted (DigitalOcean - $5-10/month)

### Step 1: Create Droplet
```bash
# 512MB droplet with Ubuntu 22.04
# SSH into droplet
ssh root@your-ip
```

### Step 2: Install Nginx
```bash
apt update && apt install nginx -y
systemctl start nginx
```

### Step 3: Upload Files
```bash
scp -r marketing/ root@your-ip:/var/www/html/
```

### Step 4: Configure Nginx
Edit `/etc/nginx/sites-available/default`:
```nginx
server {
    listen 80;
    server_name smokestack.io;
    
    root /var/www/html/marketing;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Step 5: Enable HTTPS
```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d smokestack.io
```

**Cost:** ~$5/month

---

## Configuration for Each Option

### Update API Endpoints in `index.html`
Find these lines and update to your API URL:

```html
<!-- Line ~120 -->
<a href="https://docs.smokestack.io" class="btn btn-secondary">View Docs</a>

<!-- Line ~400 -->
<a href="https://app.smokestack.io/signup?plan=free">

<!-- Line ~420 -->
<a href="https://app.smokestack.io/signup?plan=pro">
```

Replace:
- `https://docs.smokestack.io` → Your API docs URL
- `https://app.smokestack.io` → Your app/signup URL

### Update Email in Footer
Find this line (bottom of file):
```html
<p class="footer-contact">support@smokestack.io</p>
```

Replace with your email address.

---

## Domain Setup

### Example: deploying to subdomain

If your main site is `example.com`, deploy marketing to `smokestack.example.com`:

1. **DNS Record** (in your registrar):
   ```
   Type: CNAME
   Name: smokestack
   Value: your-deployment-url.netlify.app
   ```

2. **Or use root domain** `smokestack.io`:
   ```
   Type: A
   Name: @
   Value: your-server-ip
   ```

---

## SEO & Meta Tags

The site includes:
- ✓ Meta description
- ✓ Meta keywords
- ✓ Responsive viewport
- ✓ Open Graph tags (add in future)

To add Open Graph:
```html
<meta property="og:title" content="SmokeStack - Inventory API">
<meta property="og:description" content="Inventory management for vape shops">
<meta property="og:image" content="https://smokestack.io/og-image.png">
<meta property="og:url" content="https://smokestack.io">
```

---

## Analytics Setup

The site has hooks for Google Analytics and custom events. Add:

```html
<!-- In <head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-YOUR-ID');
</script>
```

Replace `G-YOUR-ID` with your Google Analytics ID.

---

## Testing Before Deployment

### Local Testing
```bash
# Simple HTTP server
python3 -m http.server 8000

# Open browser to http://localhost:8000/marketing
```

### Checklist
- [ ] All links work
- [ ] Buttons point to correct URLs
- [ ] Mobile responsive (test on phone)
- [ ] Forms submit properly
- [ ] Images load (if any)
- [ ] Dark theme looks good
- [ ] Text is readable

---

## Performance Tips

### Optimize Images (if added later)
```bash
# Compress PNG
pngquant image.png

# Compress JPG
jpegoptim image.jpg --max=85
```

### Minify CSS & JS (optional)
```bash
# Using npm
npm install -g csso-cli uglify-js

# Minify
csso styles.css -o styles.min.css
uglifyjs script.js -o script.min.js
```

Then update HTML:
```html
<link rel="stylesheet" href="styles.min.css">
<script src="script.min.js"></script>
```

### Enable Gzip Compression (on server)
Most hosting auto-enables this. Check:
```bash
curl -I https://smokestack.io | grep -i encoding
# Should show: Content-Encoding: gzip
```

---

## Monitoring & Updates

### Track Conversions
Add event tracking to buttons:
```html
<button onclick="trackEvent('signup_click'); goToPricing()">
    Get Started Free
</button>
```

### Monitor Traffic
- Use Google Analytics
- Check platform analytics (Netlify, Vercel, etc.)
- Monitor bounce rate
- Track email signups

### Update Content
- Update pricing if tiers change
- Update features as you add them
- Keep testimonials fresh
- Update status page link

---

## Troubleshooting

### Site Loads Slowly
- Check file sizes (should be <100 KB total)
- Enable gzip compression
- Use CDN (Netlify, Vercel, CloudFront)
- Reduce JavaScript if added

### Forms Don't Work
- Check `script.js` - update API endpoints
- Verify backend API is running
- Test with curl: `curl -X POST https://api.smokestack.io/auth/register`

### Mobile Looks Bad
- Test on iPhone, Android
- Check viewport meta tag
- Use Firefox DevTools (Responsive Design Mode)

### Domain Not Resolving
- Check DNS propagation: `dig smokestack.io`
- Wait 24 hours for DNS to propagate
- Verify CNAME/A record is correct

---

## Next Steps

1. **Deploy site** (choose option above)
2. **Set up analytics** (Google Analytics)
3. **Create API app** (for signups)
4. **Test end-to-end** (signup → email confirmation)
5. **Launch social** (Twitter, Reddit, LinkedIn)

---

## Cost Summary

| Platform | Setup | Monthly | Total/Year |
|----------|-------|---------|-----------|
| Netlify | Free | Free | $0 |
| Vercel | Free | Free | $0 |
| GitHub Pages | Free | Free | $0 |
| AWS | Free | $1-5 | $12-60 |
| DigitalOcean | Free | $5 | $60 |

**Recommendation:** Start with Netlify or Vercel (free), scale to AWS if needed.

---

## Files Included

- `index.html` (21.5 KB) - Landing page
- `styles.css` (18.1 KB) - Styling
- `script.js` (6.5 KB) - Interactivity
- `DEPLOY_MARKETING.md` - This file

**Total:** ~46 KB (very fast loading)

---

Built for SmokeStack
Version 1.0.0
