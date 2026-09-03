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
      header.style.boxShadow = window.scrollY > 8 ? '0 2px 10px rgba(36,23,18,0.1)' : 'none';
    });
  }

  /* ---------- Menu tabs ---------- */
  var tabs = document.querySelectorAll('.menu-tab');
  var panels = document.querySelectorAll('.menu-panel');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var cat = tab.getAttribute('data-cat');

      tabs.forEach(function (t) {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      panels.forEach(function (panel) {
        panel.classList.toggle('active', panel.getAttribute('data-cat') === cat);
      });
    });
  });

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

  /* ---------- Reservation form ---------- */
  var form = document.getElementById('reserveForm');
  var note = document.getElementById('formNote');
  if (form) {
    var dateInput = document.getElementById('rdate');
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

      var name = document.getElementById('rname').value.trim();
      var people = document.getElementById('rpeople').value;
      var phone = document.getElementById('rphone').value.trim();
      var date = document.getElementById('rdate').value;
      var time = document.getElementById('rtime').value;
      var notes = document.getElementById('rnote').value.trim();

      // In production this would POST to a backend or reservation system.
      // For now, hand off to WhatsApp with the details pre-filled so
      // no booking request is ever lost even without a server integration.
      var text = 'Reservation request:%0AName: ' + encodeURIComponent(name) +
        '%0AGuests: ' + encodeURIComponent(people) +
        '%0APhone: ' + encodeURIComponent(phone) +
        '%0ADate: ' + encodeURIComponent(date) +
        '%0ATime: ' + encodeURIComponent(time) +
        (notes ? '%0ANotes: ' + encodeURIComponent(notes) : '');

      note.textContent = 'Thanks, ' + name + '! Opening WhatsApp to confirm your table…';
      window.open('https://wa.me/919820011223?text=' + text, '_blank', 'noopener');
      form.reset();
    });
  }

});
