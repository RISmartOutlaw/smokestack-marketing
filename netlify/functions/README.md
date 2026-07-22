# Netlify Functions — Backroom

## send-feedback

Receives low-rating (1–4 star) customer feedback and emails it to admin/management
via the [Resend](https://resend.com) REST API.

Endpoint: `/.netlify/functions/send-feedback` (POST only)

### Required environment variables

Set these in the Netlify site's dashboard under **Site configuration > Environment variables**.
Do not commit real values to source control.

| Variable          | Description                                                                 |
| ------------------ | ---------------------------------------------------------------------------- |
| `RESEND_API_KEY`  | API key for your Resend account, used to authenticate outbound email sends.  |
| `FEEDBACK_FROM`   | The "from" sender address. Must be a domain/address verified in Resend.      |
| `FEEDBACK_TO`     | Comma-separated recipient list (admin + management), e.g. `admin@example.com,management@example.com`. |

No npm dependencies are required — the function uses Node's built-in global `fetch`
(Netlify Functions run on Node 18+).
