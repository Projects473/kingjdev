/*
  King J's — content renderer
  ---------------------------------------------------------------
  The words, photos and prices on the site live in /content/*.json.
  The client edits those files in Pages CMS (app.pagescms.org).
  This script reads them and draws the matching parts of each page.

  The HTML already contains a copy of the content, so the site still
  looks right if a file can't be loaded. When a file loads, its
  version replaces the built-in copy.
*/
(function () {
  var cache = {};

  function load(name) {
    if (window.KJ_CONTENT && window.KJ_CONTENT[name]) return Promise.resolve(window.KJ_CONTENT[name]);
    if (cache[name]) return cache[name];
    cache[name] = fetch('content/' + name + '.json', { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error(name); return r.json(); });
    return cache[name];
  }

  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function src(p) {
    var v = String(p || '').replace(/^\//, '');
    if (window.KJ_ASSETS) {                       /* offline preview: inlined copies */
      v = v.replace(/__A__([\w\/.-]+?)__/g, function (_, k) { return window.KJ_ASSETS[k] || ''; });
    }
    return esc(v);
  }
  function list(a) { return Array.isArray(a) ? a.filter(function (x) { return x != null && x !== ''; }) : []; }
  function digits(s) { return String(s || '').replace(/\D/g, ''); }

  function strip(photos, cls, label) {
    photos = list(photos).filter(function (p) { return p && p.image; });
    if (!photos.length) return '';
    return '<div class="tourgal ' + (cls || '') + '"' + (label ? ' aria-label="' + esc(label) + '"' : '') + '>' +
      photos.map(function (p) {
        return '<figure><img src="' + src(p.image) + '" alt="' + esc(p.alt) + '" loading="lazy"></figure>';
      }).join('') + '</div>';
  }

  /* ---------- Site settings: phone, email, pop-up ---------- */
  function renderSite(site) {
    if (!site) return;
    var wa = digits(site.whatsapp_number);
    var tel = digits(site.phone_display) || wa;
    document.querySelectorAll('a[href*="wa.me/"]').forEach(function (a) {
      if (wa) a.href = a.href.replace(/wa\.me\/\d+/, 'wa.me/' + wa);
      if (/\(\d{3}\)/.test(a.textContent) && site.phone_display) a.textContent = site.phone_display;
    });
    document.querySelectorAll('a[href^="tel:"]').forEach(function (a) {
      if (tel) a.href = 'tel:+' + tel;
      if (/\d/.test(a.textContent) && site.phone_display) a.textContent = site.phone_display;
    });
    if (site.email) document.querySelectorAll('a[href^="mailto:"]').forEach(function (a) {
      a.href = 'mailto:' + site.email;
      if (a.textContent.indexOf('@') > -1) a.textContent = site.email;
    });
    if (site.instagram) document.querySelectorAll('a[href*="instagram.com/"]').forEach(function (a) {
      if (/\/reel\//.test(a.href)) return;
      a.href = 'https://www.instagram.com/' + site.instagram.replace(/^@/, '');
      if (a.textContent.trim().charAt(0) === '@') a.textContent = '@' + site.instagram.replace(/^@/, '');
    });
    ['address_short', 'address_full', 'hours'].forEach(function (k) {
      if (!site[k]) return;
      document.querySelectorAll('[data-kj-site="' + k + '"]').forEach(function (el) { el.textContent = site[k]; });
    });

    var pop = document.getElementById('kj-welcome'), p = site.popup;
    if (pop && p) {
      if (p.show === false) { pop.remove(); return; }
      var set = function (sel, v) { var el = pop.querySelector(sel); if (el && v) el.textContent = v; };
      set('.kj-pop__eyebrow', p.eyebrow); set('.kj-pop__title', p.title); set('.kj-pop__text', p.text);
      var reel = pop.querySelector('a[href*="/reel/"]');
      if (reel && p.reel_url) reel.href = p.reel_url;
      var v = pop.querySelector('video'), s = v && v.querySelector('source');
      if (v && s && p.video && s.getAttribute('src') !== src(p.video)) {
        s.setAttribute('src', src(p.video));
        if (p.poster) v.setAttribute('poster', src(p.poster));
        v.load();
      }
    }
  }

  /* ---------- Tours page + home page tour cards ---------- */
  function tourArticle(t, i) {
    var body = '<div>' +
      (t.eyebrow ? '<p class="eyebrow">' + esc(t.eyebrow) + '</p>' : '') +
      '<h2 style="font-size:clamp(1.7rem,3.2vw,2.35rem)">' + esc(t.title) + '</h2>' +
      (t.intro ? '<p class="sub">' + esc(t.intro) + '</p>' : '') +
      list(t.paragraphs).map(function (x) { return '<p class="sub">' + esc(x) + '</p>'; }).join('');
    var stops = list(t.stops);
    if (stops.length) {
      body += '<h3 style="font-size:1.05rem;margin:1.6rem 0 .5rem">The stops</h3>' +
        '<ol style="margin:0 0 1.2rem;padding-left:1.25rem;color:var(--black);font-size:1rem;line-height:1.6">' +
        stops.map(function (s) {
          return '<li><strong>' + esc(s.name) + '</strong><ul style="margin:.35rem 0 1rem;padding-left:1.15rem;color:var(--gray);font-size:.9375rem;line-height:1.7">' +
            list(s.details).map(function (d) { return '<li>' + esc(d) + '</li>'; }).join('') + '</ul></li>';
        }).join('') + '</ol>';
    }
    var inc = list(t.included);
    if (inc.length) {
      body += '<h3 style="font-size:1.05rem;margin:1.6rem 0 .5rem">Included</h3>' +
        '<ul style="margin:0 0 1.4rem;padding-left:1.15rem;color:var(--gray);font-size:.9688rem;line-height:1.7">' +
        inc.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>';
    }
    if (t.route || t.note || t.closing) {
      body += '<p class="fine" style="margin-bottom:1.4rem">' +
        (t.route ? '<strong>' + esc(t.route_label || 'Tour flow') + ':</strong> ' + esc(t.route) : '') +
        (t.note ? ' ' + esc(t.note) : '') + (t.closing ? esc(t.closing) : '') + '</p>';
    }
    body += '<p style="margin:0;font-weight:600;font-size:1.05rem">' + esc(t.price || 'Price on request') + '</p>' +
      '<div class="chev-row" style="margin-top:1rem"><a class="chev" href="contact.html">Check availability</a></div></div>';
    var fig = t.photo ? '<figure class="photo "><img src="' + src(t.photo) + '" alt="' + esc(t.photo_alt) + '" loading="lazy"></figure>' : '';
    var inner = i % 2 === 0 ? fig + body : body + fig;
    return '<article class="split" id="' + esc(t.id || ('tour-' + (i + 1))) + '" style="margin-bottom:clamp(2.5rem,5vw,4rem)">' + inner + '</article>' +
      strip(t.gallery, list(t.gallery).length > 8 ? 'tourgal--many' : list(t.gallery).length === 2 ? 'tourgal--two' : 'tourgal--six', t.title);
  }

  function renderTours(data) {
    if (!data) return;
    var host = document.querySelector('[data-kj="tours"]');
    if (host && list(data.tours).length) host.innerHTML = list(data.tours).map(tourArticle).join('');

    var sm = data.spicemas, smHost = document.querySelector('[data-kj="spicemas"]');
    if (sm && smHost) {
      smHost.innerHTML = '<div class="band__head center">' +
        (sm.eyebrow ? '<p class="eyebrow">' + esc(sm.eyebrow) + '</p>' : '') +
        '<h2 style="font-size:clamp(1.7rem,3.2vw,2.35rem)">' + esc(sm.title) + '</h2>' +
        (sm.text ? '<p class="sub">' + esc(sm.text) + '</p>' : '') + '</div>' +
        strip(sm.photos, 'tourgal--six', sm.title) +
        '<p class="center" style="margin-top:1.6rem"><a class="btn btn--primary" href="contact.html">' + esc(sm.button || 'Ask about dates') + '</a></p>';
    }

    list(data.tours).forEach(function (t) {
      var tile = document.querySelector('[data-kj-tile="' + t.id + '"]');
      if (!tile) return;
      var img = tile.querySelector('img');
      if (img && t.photo) { img.src = src(t.photo); img.alt = t.photo_alt || ''; }
      var k = tile.querySelector('.tile__kicker'); if (k && t.card_kicker) k.textContent = t.card_kicker;
      var h = tile.querySelector('h3'); if (h && t.title) h.textContent = t.title;
      var ps = tile.querySelectorAll('.tile__body > p:not(.tile__kicker)');
      if (ps[0] && t.card_text) ps[0].textContent = t.card_text;
      var pr = tile.querySelector('.tile__price'); if (pr && t.card_price) pr.textContent = t.card_price;
    });
  }

  /* ---------- Drivers ---------- */
  function renderDrivers(data) {
    var host = document.querySelector('[data-kj="drivers"]');
    if (!data || !host || !list(data.drivers).length) return;
    var ds = list(data.drivers);
    var lead = ds.filter(function (d) { return d.featured; })[0];
    var rest = ds.filter(function (d) { return d !== lead; });
    function bodyOf(d) {
      return '<div class="person__body"><h3>Meet ' + esc(d.name) + '</h3>' +
        (d.role ? '<p class="person__role">' + esc(d.role) + '</p>' : '') +
        '<p>' + esc(d.bio) + '</p>' +
        (d.tagline ? '<p class="person__tag"><em>' + esc(d.tagline) + '</em></p>' : '') + '</div>';
    }
    var html = '<div class="band__head center"><h2>' + esc(data.title) + '</h2>' +
      (data.intro ? '<p class="sub">' + esc(data.intro) + '</p>' : '') + '</div>';
    if (lead) {
      html += '<div class="person person--lead"><div class="storycar">' +
        strip(lead.photos, 'tourgal--solo', lead.name) + '</div>' + bodyOf(lead) + '</div>';
    }
    if (rest.length) {
      html += '<div class="people people--pair">' + rest.map(function (d) {
        var ph = list(d.photos)[0] || {};
        return '<div class="person">' +
          (ph.image ? '<figure class="photo"><img src="' + src(ph.image) + '" alt="' + esc(ph.alt) + '" loading="lazy"></figure>' : '') +
          bodyOf(d) + '</div>';
      }).join('') + '</div>';
    }
    host.innerHTML = html;
  }

  /* ---------- Gallery page ---------- */
  function renderGallery(data) {
    var host = document.querySelector('[data-kj="gallery"]');
    if (!data || !host) return;
    var html = '', v = data.video;
    if (v && v.file) {
      html += '<h2 class="gal__head">' + esc(v.title) + '</h2><figure class="gal-video">' +
        '<video controls playsinline preload="metadata"' + (v.poster ? ' poster="' + src(v.poster) + '"' : '') + '>' +
        '<source src="' + src(v.file) + '" type="video/mp4"></video>' +
        (v.caption ? '<figcaption class="fine">' + esc(v.caption) + '</figcaption>' : '') + '</figure>';
    }
    list(data.albums).forEach(function (a) {
      if (!list(a.photos).length) return;
      html += '<h2 class="gal__head">' + esc(a.title) + '</h2>' + strip(a.photos, 'tourgal--many', a.title);
    });
    host.innerHTML = html;
  }

  function render() {
    var jobs = [load('site').then(renderSite).catch(function () {})];
    if (document.querySelector('[data-kj="tours"],[data-kj="spicemas"],[data-kj-tile]'))
      jobs.push(load('tours').then(renderTours).catch(function () {}));
    if (document.querySelector('[data-kj="drivers"]'))
      jobs.push(load('drivers').then(renderDrivers).catch(function () {}));
    if (document.querySelector('[data-kj="gallery"]'))
      jobs.push(load('gallery').then(renderGallery).catch(function () {}));
    return Promise.all(jobs).then(function () {
      if (window.kjCarouselInit) window.kjCarouselInit();
      if (location.hash) {
        var t = document.getElementById(location.hash.slice(1));
        if (t) t.scrollIntoView();
      }
      document.dispatchEvent(new CustomEvent('kj:content'));
    });
  }

  window.kjRenderContent = render;
  if (!window.KJ_PREVIEW) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
    else render();
  }
})();
