// ============================================
// BACKROOM FEEDBACK FUNNEL — CSAT star rating
// 5 stars -> public Google review
// 1-4 stars -> private feedback form (with a visible link out to Google too)
// ============================================

function escF(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
}

function fbGoogleUrl() {
    return window.REVIEW_CONFIG && window.REVIEW_CONFIG.googleReviewUrl;
}

function fbSetStars(v) {
    document.querySelectorAll('#fbStars button').forEach(function (b) {
        b.classList.toggle('on', parseInt(b.dataset.v, 10) <= v);
    });
}

function fbHandleRating(v) {
    fbSetStars(v);

    var promptStatus = document.getElementById('fbPromptStatus');

    if (v === 5) {
        var url = fbGoogleUrl();
        if (url) {
            window.location.href = url;
        } else if (promptStatus) {
            promptStatus.textContent = "Thanks for the 5 stars! We couldn't find our review link right now — please check back soon.";
            promptStatus.className = 'fb-prompt-status fb-status-error';
        }
        return;
    }

    if (promptStatus) { promptStatus.textContent = ''; promptStatus.className = 'fb-prompt-status'; }

    var ratingField = document.getElementById('fbRating');
    if (ratingField) { ratingField.value = v; }

    var wrap = document.getElementById('fbFormWrap');
    if (wrap) { wrap.hidden = false; }
}

function fbSubmitFeedback(event) {
    event.preventDefault();
    var form = event.target;
    var btn = form.querySelector('button[type="submit"]');
    var status = document.getElementById('fbStatus');

    if (status) { status.textContent = ''; status.className = 'form-status'; }
    if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

    var rating = parseInt((document.getElementById('fbRating') || {}).value, 10) || 0;
    var comment = form.elements.comment.value.trim().slice(0, 2000);
    var name = form.elements.name.value.trim();
    var email = form.elements.email.value.trim();
    var website = form.elements.website ? form.elements.website.value : '';

    fetch('/.netlify/functions/send-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            rating: rating,
            comment: comment,
            name: name,
            email: email,
            page: 'feedback',
            website: website
        })
    })
        .then(function (r) {
            return r.json().catch(function () { return {}; }).then(function (data) {
                return { ok: r.ok, data: data };
            });
        })
        .then(function (res) {
            if (!res.ok || !res.data || res.data.ok !== true) {
                throw new Error((res.data && res.data.error) || 'Something went wrong sending your feedback.');
            }
            return res.data;
        })
        .then(function () {
            form.hidden = true;
            var thanksText = document.getElementById('fbThanksText');
            if (thanksText) {
                thanksText.innerHTML = name
                    ? 'Thank you, ' + escF(name) + ' — your feedback goes straight to our team.'
                    : 'Thank you — your feedback goes straight to our team.';
            }
            var thanks = document.getElementById('fbThanks');
            if (thanks) { thanks.hidden = false; }
        })
        .catch(function (err) {
            if (status) {
                status.textContent = err.message;
                status.className = 'form-status form-status-error';
            }
        })
        .finally(function () {
            if (btn) { btn.disabled = false; btn.textContent = 'Submit Feedback'; }
        });
}

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('#fbStars button').forEach(function (b) {
        b.addEventListener('click', function () { fbHandleRating(parseInt(b.dataset.v, 10)); });
    });

    var googleLink = document.getElementById('fbGoogleLink');
    var url = fbGoogleUrl();
    if (googleLink && url) { googleLink.href = url; }

    var form = document.getElementById('fbForm');
    if (form) { form.addEventListener('submit', fbSubmitFeedback); }
});
