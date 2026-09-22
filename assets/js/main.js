/* King J's Taxi Service and Tours Grenada — site behaviour */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Mobile navigation */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-nav');
  function setNav(open) {
    nav.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Menu');
    document.body.classList.toggle('nav-open', open);
  }
  function syncNav() {
    if (window.innerWidth > 860) {
      nav.hidden = false;
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    } else if (toggle.getAttribute('aria-expanded') !== 'true') {
      nav.hidden = true;
    }
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () { setNav(nav.hidden); });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A' && window.innerWidth <= 860) setNav(false);
    });
    window.addEventListener('resize', syncNav);
    syncNav();
  }

  /* Hero slider */
  var slides = [].slice.call(document.querySelectorAll('.slide'));
  var dotWrap = document.querySelector('.hero__dots');
  var playBtn = document.querySelector('.hero__play');
  if (slides.length > 1 && dotWrap) {
    var i = 0, timer = null, paused = reduce;

    slides.forEach(function (s, n) {
      var b = document.createElement('button');
      b.type = 'button'; b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', 'Slide ' + (n + 1));
      b.addEventListener('click', function () { go(n); if (!paused) restart(); });
      dotWrap.appendChild(b);
    });
    var dots = [].slice.call(dotWrap.children);

    function go(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, k) {
        s.classList.toggle('is-active', k === i);
      });
      dots.forEach(function (d, k) { d.setAttribute('aria-selected', String(k === i)); });
    }
    function restart() { clearInterval(timer); timer = setInterval(function () { go(i + 1); }, 8000); }
    function setPaused(p) {
      paused = p;
      if (playBtn) {
        playBtn.textContent = p ? 'Play' : 'Pause';
        playBtn.setAttribute('aria-pressed', String(p));
        playBtn.setAttribute('aria-label', p ? 'Play the slideshow' : 'Pause the slideshow');
      }
      if (p) { clearInterval(timer); } else { restart(); }
    }
    go(0);
    setPaused(reduce);
    if (playBtn) playBtn.addEventListener('click', function () { setPaused(!paused); });
  }

  /* Filter pills */
  var tabWrap = document.querySelector('.tabs');
  if (tabWrap) {
    var tabs = [].slice.call(tabWrap.querySelectorAll('button'));
    var items = [].slice.call(document.querySelectorAll('[data-cat]'));
    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        var f = t.dataset.filter;
        tabs.forEach(function (x) { x.setAttribute('aria-selected', String(x === t)); });
        items.forEach(function (c) {
          c.hidden = !(f === 'all' || (c.dataset.cat || '').split(' ').indexOf(f) > -1);
        });
      });
    });
  }

  /* Carousel arrows */
  [].forEach.call(document.querySelectorAll('.rail-nav'), function (navEl) {
    var rail = document.getElementById(navEl.dataset.rail);
    if (!rail) return;
    [].forEach.call(navEl.querySelectorAll('button'), function (b) {
      b.addEventListener('click', function () {
        var step = rail.firstElementChild ? rail.firstElementChild.offsetWidth + 20 : 320;
        rail.scrollBy({ left: b.dataset.dir === 'next' ? step : -step, behavior: reduce ? 'auto' : 'smooth' });
      });
    });
  });

  /* Island map pins */
  var pins = [].slice.call(document.querySelectorAll('.pin'));
  var titleEl = document.getElementById('stop-title');
  var descEl = document.getElementById('stop-desc');
  if (pins.length && titleEl && descEl) {
    var pick = function (pin) {
      pins.forEach(function (p) { p.setAttribute('aria-pressed', String(p === pin)); });
      titleEl.textContent = pin.dataset.name;
      descEl.textContent = pin.dataset.desc;
    };
    pins.forEach(function (pin) {
      pin.addEventListener('click', function () { pick(pin); });
      pin.addEventListener('mouseenter', function () { pick(pin); });
      pin.addEventListener('focus', function () { pick(pin); });
      pin.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); pick(pin); }
      });
    });
  }

  /* Forms hand off to WhatsApp */
  function wa(number, lines) {
    return 'https://wa.me/' + number + '?text=' + encodeURIComponent(lines.filter(Boolean).join('\n'));
  }
  var quick = document.getElementById('quick-form');
  if (quick) {
    quick.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(quick);
      window.open(wa(quick.dataset.whatsapp || '', [
        'Hi King J\u2019s Taxi Service and Tours Grenada \u2014 I\u2019d like to book.',
        'Service: ' + (d.get('service') || ''),
        'Date: ' + (d.get('date') || ''),
        'People: ' + (d.get('guests') || '')
      ]), '_blank', 'noopener');
    });
  }
  var form = document.getElementById('booking-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      window.open(wa(form.dataset.whatsapp || '', [
        'Booking request for King J\u2019s Taxi Service and Tours Grenada',
        'Name: ' + (d.get('name') || ''),
        'Service: ' + (d.get('service') || ''),
        'Date: ' + (d.get('date') || ''),
        'Guests: ' + (d.get('guests') || ''),
        'Staying at: ' + (d.get('where') || ''),
        'Notes: ' + (d.get('notes') || '')
      ]), '_blank', 'noopener');
    });
  }

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
