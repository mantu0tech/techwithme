document.addEventListener('DOMContentLoaded', function () {

  // 1) Paste the access key Web3Forms emails you into the line below.
  const WEB3FORMS_ACCESS_KEY = "1b8c3385-e275-473f-ba25-9eebd031fc2b";
  const CONTACT_EMAIL = "mantashaansari246@gmail.com"; // shown in the email subject only
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
     CONTACT FORM — sends enquiry to BOTH:
     1) Email: via Web3Forms (no activation-click required)
     2) WhatsApp: 918369766855
     ========================================================= */

  var form = document.getElementById('contactForm');
  var note = document.getElementById('formNote');

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      if (WEB3FORMS_ACCESS_KEY === "PASTE_YOUR_ACCESS_KEY_HERE") {
        console.error("Web3Forms access key is missing — get one free at https://web3forms.com and paste it at the top of script.js");
      }

      var name = document.getElementById('cName').value.trim();
      var business = document.getElementById('cBusiness').value.trim();
      var phone = document.getElementById('cPhone').value.trim();
      var email = document.getElementById('cEmail').value.trim();
      var type = document.getElementById('cType').value;
      var need = document.getElementById('cNeed').value;
      var message = document.getElementById('cMessage').value.trim();

      /* =====================================================
         1. SEND EMAIL via Web3Forms
         ===================================================== */
      var emailSent = false;
      var emailResultMessage = '';

      try {
        var response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            access_key: WEB3FORMS_ACCESS_KEY,
            subject: 'New enquiry — ' + business + ' (' + type + ')',
            from_name: name,
            replyto: email || CONTACT_EMAIL,
            Name: name,
            'Business Name': business,
            'Phone / WhatsApp': phone,
            Email: email || 'Not provided',
            'Business Type': type,
            'What they need': need,
            Message: message
          })
        });

        var result = await response.json();
        console.log('WEB3FORMS RESPONSE:', result);

        // Web3Forms returns a real boolean, so this check is reliable.
        if (response.ok && result.success === true) {
          emailSent = true;
        } else {
          emailResultMessage = (result && result.message) ? result.message : 'Unknown response from email service.';
          console.warn('Email may not have been delivered:', emailResultMessage);
        }
      } catch (error) {
        console.error('EMAIL ERROR:', error);
        emailResultMessage = 'Network error — see console for details.';
      }

      /* =====================================================
         2. OPEN WHATSAPP
         ===================================================== */
      var whatsappText =
        'Hi! New enquiry from website:%0A%0A' +
        'Name: ' + encodeURIComponent(name) + '%0A' +
        'Business Name: ' + encodeURIComponent(business) + '%0A' +
        'Phone / WhatsApp: ' + encodeURIComponent(phone) + '%0A' +
        'Email: ' + encodeURIComponent(email || 'Not provided') + '%0A' +
        'Business Type: ' + encodeURIComponent(type) + '%0A' +
        'What they need: ' + encodeURIComponent(need) + '%0A' +
        'Message: ' + encodeURIComponent(message);

      window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + whatsappText, '_blank');

      /* =====================================================
         3. SUCCESS MESSAGE — reflects the real email result
         ===================================================== */
      if (note) {
        if (emailSent) {
          note.textContent =
            'Thank you, ' + name + '! Your request has been received by WhatsApp and email. ' +
            'Our team will contact you within 24 hours.';
        } else {
          note.textContent =
            'Thank you, ' + name + '! Your WhatsApp message has been sent. ' +
            '(Note: email delivery could not be confirmed — check the browser console for details.)';
        }
      }

      /* =====================================================
         4. RESET FORM
         ===================================================== */
      form.reset();
    });
  }

});