/* King J's — welcome video pop-up. Shows once per browser visit; closes on ×, backdrop, Esc or a button. */
(function () {
  var pop = document.getElementById('kj-welcome');
  if (!pop) return;
  var KEY = 'kj-welcome-seen';
  var video = pop.querySelector('video');
  var closeBtn = pop.querySelector('.kj-pop__close');
  var lastFocus = null;

  try { if (sessionStorage.getItem(KEY)) return; } catch (e) {}

  function open() {
    lastFocus = document.activeElement;
    pop.hidden = false;
    requestAnimationFrame(function () { pop.classList.add('is-open'); });
    document.body.classList.add('kj-pop-open');
    if (video && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      var p = video.play(); if (p && p.catch) p.catch(function () {});
    }
    closeBtn.focus();
    document.addEventListener('keydown', onKey);
  }
  function close(keepFocus) {
    pop.classList.remove('is-open');
    document.body.classList.remove('kj-pop-open');
    document.removeEventListener('keydown', onKey);
    if (video) video.pause();
    try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
    setTimeout(function () { pop.hidden = true; }, 350);
    if (!keepFocus && lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function onKey(e) {
    if (e.key === 'Escape') close();
    if (e.key === 'Tab') { // keep focus inside the pop-up
      var f = pop.querySelectorAll('button, a[href]'), first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }
  pop.addEventListener('click', function (e) {
    var hit = e.target.closest('[data-kj-close]');
    if (e.target !== pop && !hit) return;
    // a link inside the pop-up (e.g. "Watch the video") jumps to its section
    var jump = hit && hit.getAttribute('href');
    close(!!jump);
    if (jump && jump.charAt(0) === '#') {
      e.preventDefault();
      var target = document.querySelector(jump);
      if (target) setTimeout(function () {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        var v = target.querySelector('video');
        if (v) v.focus({ preventScroll: true });
      }, 360);
    }
  });
  setTimeout(open, 1200); // let the hero start first
})();
