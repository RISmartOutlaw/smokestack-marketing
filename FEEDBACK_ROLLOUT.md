# Feedback Funnel — Rollout Guide

How to actually get customers into the feedback funnel after an interaction.
The funnel page itself is `feedback.html`:

- **5 stars** → sent to your public Google review page.
- **1–4 stars** → private feedback form → emailed to admin + management.

Full URL: `https://smokestack.outlawsmokevape.com/feedback.html`

---

## Before it works end-to-end (one-time config)

1. **Google Place ID** — in `review-config.js`, replace `GOOGLE_PLACE_ID_HERE`
   with your real Google Business Profile Place ID.
   Find it: https://developers.google.com/maps/documentation/places/web-service/place-id
2. **Netlify environment variables** (Site settings → Environment) for the
   low-rating emails:
   - `RESEND_API_KEY` — your Resend API key (resend.com)
   - `FEEDBACK_FROM` — a Resend-verified sender, e.g. `Backroom Feedback <feedback@yourdomain.com>`
   - `FEEDBACK_TO` — comma-separated recipients, e.g. `admin@yourdomain.com,management@yourdomain.com`

---

## Ways to prompt customers

### 1. In person — printed card / QR
- `feedback-card.html` is a print-ready counter card / table tent. Open it and
  print (Ctrl/Cmd + P).
- `feedback-qr.svg` is the standalone QR code (encodes the feedback URL) if you
  want to drop it into other print material, receipts, or signage.
- If your domain ever changes, regenerate the QR so it still points to the right
  place (see "Regenerating the QR" below).

### 2. Post-visit text message (SMS)
> Thanks for stopping by! How did we do? Leave us a quick review here:
> https://smokestack.outlawsmokevape.com/feedback.html

Short version:
> Hi {first_name}, thanks for your visit today. 10-sec review? https://smokestack.outlawsmokevape.com/feedback.html

### 3. Post-visit email
**Subject:** How did we do today?

> Hi {first_name},
>
> Thanks for coming in. We'd love a quick word on how it went — it takes about
> ten seconds:
>
> 👉 Leave a review: https://smokestack.outlawsmokevape.com/feedback.html
>
> Thank you,
> The Backroom team

### 4. Receipt / invoice footer (one line)
> Rate your visit: smokestack.outlawsmokevape.com/feedback.html

Send #2 and #3 from your POS / CRM / booking tool's automated follow-up so every
interaction gets the prompt without manual effort.

---

## Compliance reminder

Do **not** rewrite these prompts to promise a discount/reward only for 5-star or
positive reviews, and don't hide the funnel from unhappy customers — that
violates Google's review policies and FTC endorsement guidance. The funnel is
already designed to stay compliant: low-rating customers see the private form
first but are still shown the public Google review link.

---

## Regenerating the QR

The QR in the repo was generated with the pure-Python `segno` library:

```bash
pip install segno
python3 -c "import segno; segno.make('https://smokestack.outlawsmokevape.com/feedback.html', error='q').save('feedback-qr.svg', kind='svg', scale=8, border=2, dark='#111111', light=None)"
```

Change the URL if your feedback page moves to a different domain or path.
