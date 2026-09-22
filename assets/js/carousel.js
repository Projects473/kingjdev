/* Photo strips scroll sideways, with arrows and dots underneath. */
(function () {
  function init() {
  document.querySelectorAll('.tourgal').forEach(function (strip) {
    if (strip.dataset.carousel) return;
    strip.dataset.carousel = '1';
    var items = [].slice.call(strip.children);
    if (items.length < 2) return;

    var nav = document.createElement('div');
    nav.className = 'gal-nav';
    var prev = document.createElement('button');
    var next = document.createElement('button');
    prev.type = next.type = 'button';
    prev.className = next.className = 'gal-nav__arrow';
    prev.innerHTML = '&#8249;'; next.innerHTML = '&#8250;';
    prev.setAttribute('aria-label', 'Previous photos');
    next.setAttribute('aria-label', 'Next photos');

    var dots = document.createElement('div');
    dots.className = 'gal-dots';
    items.forEach(function (item, i) {
      var d = document.createElement('button');
      d.type = 'button';
      d.className = 'gal-dots__dot' + (i ? '' : ' is-on');
      d.setAttribute('aria-label', 'Photo ' + (i + 1) + ' of ' + items.length);
      d.addEventListener('click', function () { goTo(i); });
      dots.appendChild(d);
    });

    nav.appendChild(prev); nav.appendChild(dots); nav.appendChild(next);
    strip.insertAdjacentElement('afterend', nav);

    function left(i) { return items[i].offsetLeft - strip.offsetLeft; }
    function goTo(i) {
      i = Math.max(0, Math.min(items.length - 1, i));
      strip.scrollTo({ left: left(i), behavior: 'smooth' });
    }
    function current() {                     /* the first card in view */
      var edge = strip.scrollLeft, best = 0, gap = Infinity;
      items.forEach(function (item, i) {
        var d = Math.abs(left(i) - edge);
        if (d < gap) { gap = d; best = i; }
      });
      return best;
    }
    prev.addEventListener('click', function () { goTo(current() - perView()); });
    next.addEventListener('click', function () { goTo(current() + perView()); });
    function perView() {
      return Math.max(1, Math.round(strip.clientWidth / (items[0].offsetWidth + 14)));
    }

    var ticking = false;
    function sync() {
      var i = current();
      [].slice.call(dots.children).forEach(function (d, n) { d.classList.toggle('is-on', n === i); });
      prev.disabled = strip.scrollLeft < 4;
      next.disabled = strip.scrollLeft + strip.clientWidth > strip.scrollWidth - 4;
    }
    strip.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { ticking = false; sync(); });
    }, { passive: true });
    window.addEventListener('resize', sync);
    sync();
  });
  }
  window.kjCarouselInit = init;
  init();
})();
