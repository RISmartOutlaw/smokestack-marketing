// Netlify Function: send-feedback
//
// Receives low-rating (1-4 star) customer feedback from the "Backroom"
// feedback widget and emails it to admin/management via the Resend REST API.
//
// Endpoint: /.netlify/functions/send-feedback
//
// Required environment variables (set in Netlify site settings > Environment):
//   RESEND_API_KEY - Resend API key used to authenticate the send request.
//   FEEDBACK_FROM  - Resend-verified "from" sender address, e.g. "Backroom Feedback <feedback@yourdomain.com>".
//   FEEDBACK_TO    - Comma-separated list of recipient addresses (admin + management),
//                    e.g. "admin@yourdomain.com,management@yourdomain.com".
//
// See netlify/functions/README.md for more detail.

const RATING_MAX_STARS = 5;
const COMMENT_MAX_LEN = 2000;
const NAME_EMAIL_MAX_LEN = 200;

function jsonResponse(statusCode, payload) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  };
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function stripCrLf(value) {
  return String(value).replace(/[\r\n]+/g, " ").trim();
}

function isLikelyValidEmail(value) {
  // Light format check only — never used to hard-fail delivery.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function starDisplay(rating) {
  const filled = "★".repeat(rating);
  const empty = "☆".repeat(RATING_MAX_STARS - rating);
  return filled + empty;
}

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return jsonResponse(405, { ok: false, error: "Method not allowed" });
    }

    let data;
    try {
      data = JSON.parse(event.body || "{}");
    } catch (parseErr) {
      return jsonResponse(400, { ok: false, error: "Bad request" });
    }

    // Honeypot: if filled in, silently pretend success without sending mail.
    if (typeof data.website === "string" && data.website.trim().length > 0) {
      return jsonResponse(200, { ok: true });
    }

    const rating = Number(data.rating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 4) {
      return jsonResponse(400, { ok: false, error: "Invalid rating" });
    }

    const rawComment = typeof data.comment === "string" ? data.comment.trim() : "";
    if (!rawComment) {
      return jsonResponse(400, { ok: false, error: "Comment required" });
    }
    const comment = rawComment.slice(0, COMMENT_MAX_LEN);

    let name = typeof data.name === "string" ? data.name.slice(0, NAME_EMAIL_MAX_LEN) : "";
    let email = typeof data.email === "string" ? data.email.slice(0, NAME_EMAIL_MAX_LEN) : "";
    const page = typeof data.page === "string" ? data.page.slice(0, NAME_EMAIL_MAX_LEN) : "";

    // Strip CR/LF from anything that could end up somewhere headerish.
    name = stripCrLf(name);
    email = stripCrLf(email);

    const emailIsValid = email.length > 0 && isLikelyValidEmail(email);

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const FEEDBACK_FROM = process.env.FEEDBACK_FROM;
    const FEEDBACK_TO = process.env.FEEDBACK_TO;

    if (!RESEND_API_KEY) {
      console.error("send-feedback: missing RESEND_API_KEY environment variable");
      return jsonResponse(500, { ok: false, error: "Email not configured" });
    }
    if (!FEEDBACK_FROM) {
      console.error("send-feedback: missing FEEDBACK_FROM environment variable");
      return jsonResponse(500, { ok: false, error: "Email not configured" });
    }
    if (!FEEDBACK_TO) {
      console.error("send-feedback: missing FEEDBACK_TO environment variable");
      return jsonResponse(500, { ok: false, error: "Email not configured" });
    }

    const toList = FEEDBACK_TO.split(",")
      .map((addr) => addr.trim())
      .filter(Boolean);

    const timestamp = new Date().toISOString().replace("T", " ").replace(/\.\d+Z$/, " UTC");

    const safeComment = escapeHtml(comment).replace(/\n/g, "<br>");
    const safeName = name ? escapeHtml(name) : "(not provided)";
    const safeEmail = email ? escapeHtml(email) : "(not provided)";
    const safePage = page ? escapeHtml(page) : "(not provided)";

    const html = `
      <div style="font-family: -apple-system, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto;">
        <h2 style="margin-bottom: 4px;">New Backroom feedback</h2>
        <p style="font-size: 22px; letter-spacing: 2px; margin: 8px 0;">${starDisplay(rating)} <span style="font-size: 14px; color: #666;">(${rating}/${RATING_MAX_STARS})</span></p>
        <p style="white-space: pre-wrap; background: #f7f7f7; padding: 12px; border-radius: 6px;">${safeComment}</p>
        <table style="font-size: 14px; color: #333; margin-top: 16px;">
          <tr><td style="padding: 2px 8px 2px 0; font-weight: bold;">Name:</td><td>${safeName}</td></tr>
          <tr><td style="padding: 2px 8px 2px 0; font-weight: bold;">Email:</td><td>${safeEmail}</td></tr>
          <tr><td style="padding: 2px 8px 2px 0; font-weight: bold;">Page:</td><td>${safePage}</td></tr>
          <tr><td style="padding: 2px 8px 2px 0; font-weight: bold;">Received:</td><td>${timestamp}</td></tr>
        </table>
      </div>
    `;

    const emailPayload = {
      from: FEEDBACK_FROM,
      to: toList,
      subject: `New ${rating}★ feedback — Backroom`,
      html,
    };

    if (emailIsValid) {
      emailPayload.reply_to = email;
    }

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailPayload),
    });

    if (!resendResponse.ok) {
      const errorBody = await resendResponse.text().catch(() => "");
      console.error(
        `send-feedback: Resend API error, status=${resendResponse.status}, body=${errorBody}`
      );
      return jsonResponse(502, { ok: false, error: "Could not send feedback" });
    }

    return jsonResponse(200, { ok: true });
  } catch (err) {
    console.error("send-feedback: unexpected error", err);
    return jsonResponse(500, { ok: false, error: "Server error" });
  }
};
