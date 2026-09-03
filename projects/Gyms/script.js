/* ============================================================
   CONFIG — replace these with your real business details
   ============================================================ */
const CONFIG = {
  whatsappNumber: "919812345670",      // country code + number, no + or spaces
  ownerEmail: "hello@powertrackfitness.in" // used by the FormSubmit.co email integration below
};

/* ---------------- Header shadow on scroll ---------------- */
const header = document.getElementById('siteHeader');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
});

/* ---------------- Mobile menu toggle ---------------- */
const burger = document.getElementById('burgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
mobileMenu.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => mobileMenu.classList.remove('open'))
);

/* ---------------- FAQ accordion ---------------- */
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');
  q.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(openItem => {
      openItem.classList.remove('open');
      openItem.querySelector('.faq-a').style.maxHeight = null;
    });
    if (!isOpen) {
      item.classList.add('open');
      a.style.maxHeight = a.scrollHeight + 'px';
    }
  });
});

/* ---------------- Reveal on scroll ---------------- */
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));

/* ---------------- Before / After compare slider ---------------- */
document.querySelectorAll('[data-compare]').forEach(compare => {
  const before = compare.querySelector('.compare-before');
  const handle = compare.querySelector('.compare-handle');
  const range = compare.querySelector('.compare-range');

  function update(val) {
    before.style.clipPath = `inset(0 ${100 - val}% 0 0)`;
    handle.style.left = val + '%';
  }
  range.addEventListener('input', (e) => update(e.target.value));
  update(range.value);
});

/* ============================================================
   FREE TRIAL FORM — sends the request to WhatsApp AND email
   ============================================================
   How it works:
   1. WhatsApp: builds a pre-filled wa.me link from the form fields
      and opens it in a new tab. This works immediately, with no
      backend or setup required.
   2. Email: sends the same details to CONFIG.ownerEmail using
      FormSubmit.co's free AJAX endpoint (no backend needed).
      IMPORTANT: the first time a submission is sent, FormSubmit
      emails CONFIG.ownerEmail a confirmation link — someone must
      click that link once to activate email delivery for this form.
      After that, all future submissions arrive by email automatically.
   ============================================================ */
const trialForm = document.getElementById('trialForm');
const formMsg = document.getElementById('formMsg');

trialForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    name: document.getElementById('tname').value.trim(),
    phone: document.getElementById('tphone').value.trim(),
    email: document.getElementById('temail').value.trim(),
    time: document.getElementById('ttime').value,
    goal: document.getElementById('tgoal').value.trim()
  };

  // 1) Build and open the WhatsApp message
  const waText =
    `New Free Trial Request%0A` +
    `Name: ${encodeURIComponent(data.name)}%0A` +
    `Phone: ${encodeURIComponent(data.phone)}%0A` +
    `Preferred time: ${encodeURIComponent(data.time)}` +
    (data.goal ? `%0AGoal: ${encodeURIComponent(data.goal)}` : '');
  const waUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${waText}`;
  window.open(waUrl, '_blank');

  // 2) Also send the same details by email via FormSubmit.co (AJAX, no backend)
  try {
    await fetch(`https://formsubmit.co/ajax/${CONFIG.ownerEmail}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        _subject: 'New Free Trial Request — Power Track Fitness Gym website',
        Name: data.name,
        Phone: data.phone,
        Email: data.email || 'Not provided',
        'Preferred Time': data.time,
        Goal: data.goal || 'Not provided'
      })
    });
  } catch (err) {
    // Email delivery failed silently — WhatsApp already opened above, so the
    // lead isn't lost. Log for debugging in the browser console.
    console.error('Email delivery failed:', err);
  }

  formMsg.classList.add('show');
  trialForm.reset();
  formMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});
