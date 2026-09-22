/* Click any photo on the page to open it full size. */
(function () {
  var box = document.getElementById('kj-lightbox');
  if (!box) return;
  var img = box.querySelector('img');
  var cap = box.querySelector('figcaption');
  var prevBtn = box.querySelector('.kj-lb__nav--prev');
  var nextBtn = box.querySelector('.kj-lb__nav--next');
  var shots = [], at = 0, lastFocus = null;

  function collect() {
    shots = [].slice.call(document.querySelectorAll('img')).filter(function (el) {
      return !el.closest('#kj-lightbox') && !el.closest('.brand') && !el.closest('.foot__logo')
             && !el.closest('.wa-float') && el.naturalWidth !== 1 && el.width > 60;
    });
  }
  function show(i) {
    if (!shots.length) return;
    at = (i + shots.length) % shots.length;
    var el = shots[at];
    img.src = el.currentSrc || el.src;
    img.alt = el.alt || '';
    cap.textContent = el.alt || '';
    cap.hidden = !el.alt;
    var many = shots.length > 1;
    prevBtn.hidden = !many; nextBtn.hidden = !many;
  }
  function open(el) {
    collect();
    var i = shots.indexOf(el);
    if (i < 0) return;
    lastFocus = document.activeElement;
    box.hidden = false;
    document.body.classList.add('kj-lb-open');
    show(i);
    requestAnimationFrame(function () { box.classList.add('is-open'); });
    box.querySelector('.kj-lb__close').focus();
  }
  function close() {
    box.classList.remove('is-open');
    document.body.classList.remove('kj-lb-open');
    setTimeout(function () { box.hidden = true; img.removeAttribute('src'); }, 200);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.addEventListener('click', function (e) {
    var el = e.target;
    if (el.tagName !== 'IMG' || el.closest('#kj-lightbox')) return;
    if (el.closest('.brand') || el.closest('.foot__logo') || el.closest('.wa-float')) return;
    var link = el.closest('a');
    if (link && !link.classList.contains('photo')) return;   // let real links work
    e.preventDefault();
    open(el);
  });
  box.addEventListener('click', function (e) {
    if (e.target === box || e.target.closest('.kj-lb__close')) { close(); return; }
    if (e.target.closest('.kj-lb__nav--prev')) show(at - 1);
    if (e.target.closest('.kj-lb__nav--next')) show(at + 1);
  });
  document.addEventListener('keydown', function (e) {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(at - 1);
    if (e.key === 'ArrowRight') show(at + 1);
  });
})();
