/* ============================================================
   CONFIG — replace these with your real business details
   ============================================================ */
const CONFIG = {
  whatsappNumber: "919845123456",       // country code + number, no + or spaces
  ownerEmail: "hello@aurorahairstudio.in" // used by the FormSubmit.co email integration below
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

/* ---------------- Services tabs (Hair / Skin / Beauty) ---------------- */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.services-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.querySelector(`.services-panel[data-panel="${btn.dataset.tab}"]`).classList.add('active');
  });
});

/* ---------------- Gallery tabs (Colour / Cuts / Bridal) ---------------- */
document.querySelectorAll('.gtab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.gtab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.gallery-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.querySelector(`.gallery-panel[data-gpanel="${btn.dataset.gtab}"]`).classList.add('active');
  });
});

/* ============================================================
   BOOKING FLOW — "Choose Service → Choose Date → WhatsApp"
   ============================================================ */
let selectedService = null;

function goToStep(stepNum) {
  document.querySelectorAll('.flow-panel').forEach(p => p.classList.remove('active'));
  document.querySelector(`.flow-panel[data-step="${stepNum}"]`).classList.add('active');

  document.querySelectorAll('.flow-step').forEach(s => {
    s.classList.toggle('active', Number(s.dataset.stepIndicator) <= stepNum);
  });
}

// Step 1: service chips
const chips = document.querySelectorAll('.chip');
const step1NextBtn = document.querySelector('.flow-panel[data-step="1"] .flow-next');
chips.forEach(chip => {
  chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('selected'));
    chip.classList.add('selected');
    selectedService = chip.dataset.service;
    step1NextBtn.disabled = false;
  });
});

// Step 2: date/time enable check
const dateInput = document.getElementById('bdate');
const timeInput = document.getElementById('btime');
const dateNextBtn = document.getElementById('dateNextBtn');
function checkDateTime() {
  dateNextBtn.disabled = !(dateInput.value && timeInput.value);
}
dateInput.addEventListener('input', checkDateTime);
timeInput.addEventListener('input', checkDateTime);
// default min date = today
dateInput.setAttribute('min', new Date().toISOString().split('T')[0]);

// Next / Back buttons
document.querySelectorAll('.flow-next').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.dataset.next === '2') {
      document.getElementById('selectedServiceLabel').textContent = selectedService;
    }
    goToStep(Number(btn.dataset.next));
  });
});
document.querySelectorAll('.flow-back').forEach(btn => {
  btn.addEventListener('click', () => goToStep(Number(btn.dataset.back)));
});

/* ---------------- Final submit: WhatsApp + email ---------------- */
const formMsg = document.getElementById('formMsg');
const bookSubmitBtn = document.getElementById('bookSubmitBtn');

bookSubmitBtn.addEventListener('click', async () => {
  const name = document.getElementById('bname').value.trim();
  const phone = document.getElementById('bphone').value.trim();
  const email = document.getElementById('bemail').value.trim();
  const date = dateInput.value;
  const time = timeInput.value;

  if (!name || !phone) {
    alert('Please enter your name and phone number.');
    return;
  }

  // 1) Build and open the WhatsApp message
  const waText =
    `New Appointment Request%0A` +
    `Service: ${encodeURIComponent(selectedService || 'Not specified')}%0A` +
    `Date: ${encodeURIComponent(date)}%0A` +
    `Time: ${encodeURIComponent(time)}%0A` +
    `Name: ${encodeURIComponent(name)}%0A` +
    `Phone: ${encodeURIComponent(phone)}`;
  const waUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${waText}`;
  window.open(waUrl, '_blank');

  // 2) Also send the same details by email via FormSubmit.co (AJAX, no backend)
  try {
    await fetch(`https://formsubmit.co/ajax/${CONFIG.ownerEmail}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        _subject: 'New Appointment Request — Aurora Hair Studio website',
        Service: selectedService || 'Not specified',
        Date: date,
        Time: time,
        Name: name,
        Phone: phone,
        Email: email || 'Not provided'
      })
    });
  } catch (err) {
    console.error('Email delivery failed:', err);
  }

  formMsg.classList.add('show');
  formMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});
