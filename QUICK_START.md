# Marketing Site - Quick Start

Deploy your SmokeStack landing page in 5 minutes.

---

## Step 1: Deploy to Netlify (Recommended)

### Option A: Drag & Drop (Fastest)
1. Go to **[netlify.com](https://netlify.com)**
2. Click **"Add new site"** → **"Deploy manually"**
3. Drag & drop the entire `marketing` folder
4. ✅ Your site is LIVE in 30 seconds

**Your URL:** `https://random-name.netlify.app`

### Option B: GitHub (Better)
1. Push this folder to GitHub:
   ```bash
   git push origin main
   ```

2. Go to netlify.com, click **"New site from Git"**
3. Connect GitHub repository
4. Auto-deploys on every push

---

## Step 2: Connect Custom Domain

1. In Netlify dashboard → **Domain management**
2. Click **"Add custom domain"**
3. Enter your domain (e.g., `smokestack.io`)
4. Update DNS at your registrar (Netlify shows exact steps)
5. Wait 5-30 minutes for DNS to propagate

---

## Step 3: Customize Your Site

### Update Links
Edit `marketing/index.html`:

**Find & Replace:**
```
https://docs.smokestack.io       → Your API docs URL
https://app.smokestack.io        → Your signup/app URL
support@smokestack.io            → Your email
```

### Update Pricing
Edit lines 268-280 in `index.html` if you change prices.

### Update Testimonials
Edit lines 440-480 with real customer quotes (after you get them).

---

## Step 4: Test Your Site

### Local Testing (Before Deploying)
```bash
# Simple way - no dependencies needed
cd marketing/

# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js
npx http-server
```

Then visit: **http://localhost:8000**

### On Your Phone
- If on same WiFi: visit `http://your-computer-ip:8000`
- Test on mobile browser
- Verify buttons work
- Test form submission

---

## Step 5: Set Up Analytics

Add Google Analytics (optional but recommended):

1. Get your Google Analytics 4 ID (starts with `G-`)
2. Edit `marketing/index.html`, add to `<head>`:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-YOUR-ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-YOUR-ID');
</script>
```

Replace `G-YOUR-ID` with your actual ID.

---

## Checklist

Deploy when ready:

- [ ] Domain registered & DNS configured
- [ ] API endpoints updated in HTML
- [ ] Email address updated in footer
- [ ] Company name updated
- [ ] Tested on mobile
- [ ] Tested form submission
- [ ] Analytics code added (optional)
- [ ] Analytics GA4 ID verified
- [ ] Netlify deployment successful
- [ ] Domain resolves correctly

---

## Deployment Options

| Platform | Setup | Cost | Best For |
|----------|-------|------|----------|
| **Netlify** ⭐ | 30 sec | Free | Fastest, easiest |
| **Vercel** | 2 min | Free | GitHub integration |
| **GitHub Pages** | 5 min | Free | Developers |
| **AWS S3** | 10 min | $1-5/mo | Maximum control |
| **DigitalOcean** | 20 min | $5/mo | Full server |

**Recommendation:** Start with **Netlify**, upgrade to AWS/DigitalOcean if needed for scale.

---

## Form Integration

The signup form currently just shows a success message.

To actually register users in SmokeStack:

Edit `marketing/script.js`, find `handleSignup()` function:

```javascript
// Replace this:
alert(`Welcome, ${shopName}!\n\nCheck your email at ${email}...`);

// With this:
fetch('https://api.smokestack.io/auth/register', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        name: shopName,
        email: email
    })
})
.then(r => r.json())
.then(data => {
    if (data.api_key) {
        alert(`Success! Your API key: ${data.api_key}`);
        // Redirect to app
        window.location.href = `https://app.smokestack.io/?key=${data.api_key}`;
    }
})
.catch(err => alert('Error: ' + err.message));
```

---

## Troubleshooting

### Domain not working
- DNS takes 5-30 minutes to propagate
- Wait and try again
- Check DNS propagation: `dig yourdomain.com`

### Form doesn't work
- Check if API is running
- Verify API URL is correct
- Check browser console (F12) for errors

### Site looks broken on mobile
- Clear browser cache
- Test in different browser
- Check responsive design in DevTools (F12)

### Site loads slowly
- Files are only 53 KB - should be instant
- Check your internet connection
- Disable browser extensions
- Try in private/incognito mode

---

## Next Steps

1. ✅ Deploy marketing site
2. ✅ Get first visitor
3. Create simple signup flow:
   - Form → API `/auth/register`
   - Send welcome email
   - Show API key in app
   - Direct to API docs
4. Add email collection for mailing list
5. Set up analytics to track conversions

---

## Success Metrics

After launch, track:
- **Visitors/month** - How many people visit
- **Signup rate** - % who sign up
- **Free → Pro conversion** - % who upgrade
- **Bounce rate** - % who leave immediately

Aim for:
- 100+ visitors/month (month 1)
- 10-20% signup rate
- 5% upgrade to Pro (week 2)

---

## Questions?

- **How to deploy?** See DEPLOY_MARKETING.md for 5 options
- **How to customize?** Edit index.html, styles.css, script.js
- **How to add features?** Add HTML to index.html
- **How to improve SEO?** Add Open Graph tags, sitemap.xml

---

**SmokeStack Marketing Site**
Ready to deploy. Ready to convert.
