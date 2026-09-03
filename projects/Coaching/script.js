/* ============================================================
   CONFIG — replace these with your real institute details
   ============================================================ */
const CONFIG = {
  whatsappNumber: "919867001234",        // country code + number, no + or spaces
  ownerEmail: "info@zenithachievers.in"  // used by the FormSubmit.co email integration below
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

/* ---------------- Courses tabs (School / Competitive) ---------------- */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.courses-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.querySelector(`.courses-panel[data-panel="${btn.dataset.tab}"]`).classList.add('active');
  });
});

/* ---------------- Gallery tabs (Classroom / Students / Events / Awards) ---------------- */
document.querySelectorAll('.gtab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.gtab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.gallery-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.querySelector(`.gallery-panel[data-gpanel="${btn.dataset.gtab}"]`).classList.add('active');
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

/* ---------------- Count-up animation for stats ---------------- */
function animateCount(el) {
  const target = Number(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const duration = 1400;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased).toLocaleString('en-IN') + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const countEls = document.querySelectorAll('[data-count]');
const countIo = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      countIo.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
countEls.forEach(el => countIo.observe(el));

/* ---------------- Video testimonial play button (placeholder) ---------------- */
document.querySelectorAll('.play-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    alert('Add your video embed (YouTube/Vimeo link or uploaded file) here to replace this placeholder.');
  });
});

/* ============================================================
   FREE DEMO CLASS FORM — sends the request to WhatsApp AND email
   ============================================================ */
const demoForm = document.getElementById('demoForm');
const formMsg = document.getElementById('formMsg');

demoForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    name: document.getElementById('dname').value.trim(),
    phone: document.getElementById('dphone').value.trim(),
    email: document.getElementById('demail').value.trim(),
    course: document.getElementById('dcourse').value,
    batch: document.getElementById('dtime').value
  };

  // 1) Build and open the WhatsApp message
  const waText =
    `New Free Demo Class Request%0A` +
    `Student Name: ${encodeURIComponent(data.name)}%0A` +
    `Phone: ${encodeURIComponent(data.phone)}%0A` +
    `Course / Class: ${encodeURIComponent(data.course)}%0A` +
    `Preferred Batch: ${encodeURIComponent(data.batch)}`;
  const waUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${waText}`;
  window.open(waUrl, '_blank');

  // 2) Also send the same details by email via FormSubmit.co (AJAX, no backend)
  try {
    await fetch(`https://formsubmit.co/ajax/${CONFIG.ownerEmail}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        _subject: 'New Free Demo Class Request — Zenith Achievers Academy website',
        'Student Name': data.name,
        Phone: data.phone,
        Email: data.email || 'Not provided',
        'Course / Class': data.course,
        'Preferred Batch': data.batch
      })
    });
  } catch (err) {
    console.error('Email delivery failed:', err);
  }

  formMsg.classList.add('show');
  demoForm.reset();
  formMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});
