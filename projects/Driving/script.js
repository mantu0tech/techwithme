document.addEventListener('DOMContentLoaded', function () {

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
      header.style.boxShadow = window.scrollY > 8 ? '0 2px 10px rgba(28,36,48,0.08)' : 'none';
    });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var answer = item.querySelector('.faq-a');
      var isOpen = btn.getAttribute('aria-expanded') === 'true';

      // close all others (single-open accordion)
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

  /* ---------- Review carousel (simple slide, mobile-only controls) ---------- */
  var track = document.getElementById('reviewTrack');
  var prevBtn = document.getElementById('reviewPrev');
  var nextBtn = document.getElementById('reviewNext');
  if (track && prevBtn && nextBtn) {
    var cards = track.querySelectorAll('.review-card');
    var index = 0;

    function updateCarousel() {
      if (window.innerWidth > 760) {
        track.style.transform = 'none';
        return;
      }
      var cardWidth = cards[0].getBoundingClientRect().width + 20;
      track.style.transform = 'translateX(' + (-index * cardWidth) + 'px)';
    }

    function showControlsIfNeeded() {
      var controls = document.querySelector('.review-controls');
      if (!controls) return;
      controls.style.display = window.innerWidth <= 760 ? 'flex' : 'none';
      if (window.innerWidth <= 760) {
        track.style.transition = 'transform .3s ease';
        track.style.display = 'flex';
        track.style.gap = '20px';
        cards.forEach(function (c) { c.style.minWidth = '100%'; });
      } else {
        track.style.display = 'grid';
      }
    }

    prevBtn.addEventListener('click', function () {
      index = Math.max(0, index - 1);
      updateCarousel();
    });
    nextBtn.addEventListener('click', function () {
      index = Math.min(cards.length - 1, index + 1);
      updateCarousel();
    });
    window.addEventListener('resize', function () {
      showControlsIfNeeded();
      updateCarousel();
    });
    showControlsIfNeeded();
    updateCarousel();
  }

  /* ---------- Booking form ---------- */
  var form = document.getElementById('bookingForm');
  var note = document.getElementById('formNote');
  if (form) {
    // sensible default: don't allow booking a date in the past
    var dateInput = document.getElementById('fdate');
    if (dateInput) {
      var today = new Date().toISOString().split('T')[0];
      dateInput.setAttribute('min', today);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var name = document.getElementById('fname').value.trim();
      var phone = document.getElementById('fphone').value.trim();
      var date = document.getElementById('fdate').value;
      var time = document.getElementById('ftime').value;
      var transmission = document.getElementById('ftrans').value;
      var location = document.getElementById('flocation').value.trim();
      var message = document.getElementById('fmsg').value.trim();

      // In production this would POST to a backend or booking API.
      // For now, hand off to WhatsApp with the details pre-filled so
      // no lead is ever lost even without a server integration.
      var text = 'Trial lesson request:%0AName: ' + encodeURIComponent(name) +
        '%0APhone: ' + encodeURIComponent(phone) +
        '%0ADate: ' + encodeURIComponent(date) +
        '%0ATime: ' + encodeURIComponent(time) +
        '%0ATransmission: ' + encodeURIComponent(transmission) +
        '%0AArea: ' + encodeURIComponent(location) +
        (message ? '%0ANotes: ' + encodeURIComponent(message) : '');

      note.textContent = 'Thanks, ' + name + '! Opening WhatsApp to confirm your trial lesson…';
      window.open('https://wa.me/919876543210?text=' + text, '_blank', 'noopener');
      form.reset();
    });
  }

});
