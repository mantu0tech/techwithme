document.addEventListener('DOMContentLoaded', function () {

  const CONTACT_EMAIL = "ansari0mantasha786@gmail.com";
  const WHATSAPP_NUMBER = "918369766855";

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Sticky header shadow on scroll ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.style.boxShadow = window.scrollY > 8 ? '0 2px 10px rgba(15,36,54,0.1)' : 'none';
    });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var answer = item.querySelector('.faq-a');
      var isOpen = btn.getAttribute('aria-expanded') === 'true';

      document.querySelectorAll('.faq-q').forEach(function (otherBtn) {
        if (otherBtn !== btn) {
          otherBtn.setAttribute('aria-expanded', 'false');
          otherBtn.closest('.faq-item').querySelector('.faq-a').style.maxHeight = null;
        }
      });

      btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
      answer.style.maxHeight = isOpen ? null : answer.scrollHeight + 'px';
    });
  });

  /* =========================================================
     CONTACT FORM — opens a pre-filled email to
     ansari0mantasha786@gmail.com with everything the person typed.
     ========================================================= */
  var form = document.getElementById('contactForm');
  var note = document.getElementById('formNote');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var name = document.getElementById('cName').value.trim();
      var business = document.getElementById('cBusiness').value.trim();
      var phone = document.getElementById('cPhone').value.trim();
      var email = document.getElementById('cEmail').value.trim();
      var type = document.getElementById('cType').value;
      var need = document.getElementById('cNeed').value;
      var message = document.getElementById('cMessage').value.trim();

      var subject = `New enquiry — ${business} (${type})`;
      var body =
        `New enquiry from the TechWithMe website:\n\n` +
        `Name: ${name}\n` +
        `Business Name: ${business}\n` +
        `Phone / WhatsApp: ${phone}\n` +
        (email ? `Email: ${email}\n` : '') +
        `Business Type: ${type}\n` +
        `What they need: ${need}\n` +
        `Message: ${message}`;

      var mailLink = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailLink;

      if (note) {
        note.textContent = `Thanks, ${name}! We've opened your email app with your enquiry ready to send to ${CONTACT_EMAIL} — hit send there and we'll get back to you soon.`;
      }
      form.reset();
    });
  }

});
