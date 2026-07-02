// ============================================
// SMOKESTACK LANDING PAGE - JAVASCRIPT
// ============================================

// Scroll to section
function scrollTo(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Handle signup form submission
function handleSignup(event) {
    event.preventDefault();
    
    const shopName = document.getElementById('shopName').value;
    const email = document.getElementById('email').value;
    
    // For now, just show success message and redirect
    // In production, this would call your backend API
    
    alert(`Welcome, ${shopName}!\n\nCheck your email at ${email} to get started.\n\nYou have 14 days free.`);
    
    // Redirect to API register endpoint (simulated)
    // window.location.href = `https://api.smokestack.io/auth/register?name=${encodeURIComponent(shopName)}&email=${encodeURIComponent(email)}`;
    
    // Clear form
    document.getElementById('signupForm').reset();
}

// Navigate to pricing
function goToPricing() {
    window.location.href = 'https://app.smokestack.io/signup?plan=pro';
}

// Start free tier
function startFree() {
    window.location.href = 'https://app.smokestack.io/signup?plan=free';
}

// Contact sales
function contactSales() {
    window.location.href = 'mailto:sales@smokestack.io?subject=Enterprise%20Plan%20Inquiry';
}

// Add scroll animation for elements
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements that should fade in
    document.querySelectorAll('.feature, .solution-item, .testimonial, .price-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Track analytics (if you add analytics later)
function trackEvent(eventName, data) {
    // Placeholder for analytics tracking
    console.log('Event:', eventName, data);
    
    // You can add Google Analytics, Mixpanel, etc. here
    // if (window.gtag) {
    //     gtag('event', eventName, data);
    // }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupScrollAnimations();
    
    // Track page view
    trackEvent('page_view', {
        page_title: document.title,
        page_location: window.location.href
    });
    
    // Track button clicks
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const buttonText = e.target.textContent;
            trackEvent('button_click', {
                button_text: buttonText
            });
        });
    });
    
    // Track form interactions
    const form = document.getElementById('signupForm');
    if (form) {
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                trackEvent('form_focus', {
                    field_name: input.id
                });
            });
        });
        
        form.addEventListener('submit', () => {
            trackEvent('form_submit', {
                form_name: 'signup'
            });
        });
    }
});

// Mobile menu toggle (for future navbar enhancement)
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        navMenu.classList.toggle('active');
    }
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Highlight active nav item based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Add CSS for active nav item
const style = document.createElement('style');
style.textContent = `
    .nav-menu a.active {
        color: var(--primary);
        font-weight: 700;
        border-bottom: 2px solid var(--primary);
        padding-bottom: 2px;
    }
`;
document.head.appendChild(style);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Press ? to show help
    if (e.key === '?') {
        alert('SmokeStack Keyboard Shortcuts:\n\n' +
              '? - Show this help\n' +
              's - Scroll to signup\n' +
              'p - Scroll to pricing\n' +
              'f - Scroll to features\n');
    }
    
    // Press s for signup
    if (e.key === 's' && e.ctrlKey === false && e.metaKey === false) {
        const input = document.getElementById('shopName');
        if (input) input.focus();
    }
    
    // Press p for pricing
    if (e.key === 'p' && e.ctrlKey === false && e.metaKey === false) {
        scrollTo('#pricing');
    }
    
    // Press f for features
    if (e.key === 'f' && e.ctrlKey === false && e.metaKey === false) {
        scrollTo('#features');
    }
});

console.log('%cSmokeStack', 'font-size:20px; font-weight:bold; color:#ff6b35;');
console.log('%cInventory API for Alternative Retail', 'font-size:14px; color:#666;');
console.log('%cPress ? for keyboard shortcuts', 'font-size:12px; color:#999;');
