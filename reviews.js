// ============================================
// BACKROOM REVIEWS — public list + API-key-verified submission
// ============================================

var REVIEWS_API = 'https://smokestacksite.outlawsmokevape.com';
if (['localhost', '127.0.0.1'].includes(window.location.hostname)) {
    REVIEWS_API = window.location.origin.replace(/:\d+$/, ':8000');
}

function escR(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
}

function starsR(n) {
    return '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5 - n);
}

function loadReviews() {
    var list = document.getElementById('reviewsList');
    fetch(REVIEWS_API + '/api/reviews?site=backroom&limit=50')
        .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
        .then(function (reviews) {
            if (!reviews.length) {
                list.innerHTML = '<p class="reviews-empty">No reviews yet — if your shop runs on Backroom, yours can be the first.</p>';
                return;
            }
            list.innerHTML = reviews.map(function (rv) {
                return '<div class="review-card">'
                    + '<div class="review-stars" aria-label="' + rv.rating + ' out of 5 stars">' + starsR(rv.rating) + '</div>'
                    + '<p class="review-text">' + escR(rv.text) + '</p>'
                    + '<p class="review-author">&mdash; ' + escR(rv.author_name)
                    + (rv.verified ? ' <span class="verified-badge" title="Verified customer">&#10003; Verified customer</span>' : '')
                    + ' &middot; ' + new Date(rv.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
                    + '</p></div>';
            }).join('');
        })
        .catch(function () {
            list.innerHTML = '<p class="reviews-empty">Couldn\'t load reviews right now — try refreshing.</p>';
        });
}

function submitReview(event) {
    event.preventDefault();
    var form = event.target;
    var btn = form.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.textContent = 'Posting…'; }

    var status = document.getElementById('reviewStatus');
    fetch(REVIEWS_API + '/api/reviews', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': form.elements.api_key.value.trim()
        },
        body: JSON.stringify({
            site: 'backroom',
            author_name: form.elements.author_name.value.trim(),
            rating: parseInt(form.elements.rating.value, 10) || 5,
            text: form.elements.text.value.trim(),
            website: form.elements.website ? form.elements.website.value : ''
        })
    })
        .then(async function (r) {
            var data = await r.json().catch(function () { return {}; });
            if (!r.ok) { throw new Error(data.detail || ('Failed (' + r.status + ')')); }
            return data;
        })
        .then(function () {
            status.textContent = 'Thanks! Your review is live.';
            status.className = 'form-status form-status-ok';
            form.reset();
            setRating(5);
            loadReviews();
        })
        .catch(function (err) {
            status.textContent = err.message;
            status.className = 'form-status form-status-error';
        })
        .finally(function () { if (btn) { btn.disabled = false; btn.textContent = 'Post Review'; } });
}

function setRating(v) {
    var form = document.getElementById('reviewForm');
    if (form) { form.elements.rating.value = v; }
    document.querySelectorAll('#starInput button').forEach(function (b) {
        b.classList.toggle('on', parseInt(b.dataset.v, 10) <= v);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    loadReviews();
    document.querySelectorAll('#starInput button').forEach(function (b) {
        b.addEventListener('click', function () { setRating(parseInt(b.dataset.v, 10)); });
    });
    setRating(5);
});
