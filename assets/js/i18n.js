/*
  King J's — language switcher
  ---------------------------------------------------------------
  English is what's written in the pages. The other languages live in
  /content/i18n/<code>.json as a plain list of "English phrase": "translation".

  On load, every piece of text on the page is looked up in that list and
  swapped. Anything not in the list stays in English, so nothing ever
  disappears — a new tour typed into the CMS simply shows in English until
  its translation is added.
*/
(function () {
  var LANGS = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'nl', label: 'Nederlands' },
    { code: 'de', label: 'Deutsch' }
  ];
  var KEY = 'kj-lang';
  var dict = null, current = 'en', loading = {};

  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function remember(code) {
    try { localStorage.setItem(KEY, code); } catch (e) {}
  }
  function fromBrowser() {
    var l = (navigator.language || 'en').slice(0, 2).toLowerCase();
    return LANGS.some(function (x) { return x.code === l; }) ? l : 'en';
  }

  function load(code) {
    if (code === 'en') return Promise.resolve(null);
    if (window.KJ_I18N && window.KJ_I18N[code]) return Promise.resolve(window.KJ_I18N[code]);
    if (loading[code]) return loading[code];
    loading[code] = fetch('content/i18n/' + code + '.json', { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error(code); return r.json(); })
      .catch(function () { return null; });
    return loading[code];
  }

  /* Remember the English original so switching back is lossless. */
  function original(node, kind) {
    var host = node.nodeType === 3 ? node.parentNode : node;
    if (!host) return null;
    var key = 'kjEn' + String(kind || 'Text').replace(/(^|-)([a-z])/g, function (_, d, c) { return c.toUpperCase(); });
    if (node.nodeType === 3) {
      if (node.__kjEn === undefined) node.__kjEn = node.nodeValue;
      return node.__kjEn;
    }
    if (host.dataset[key] === undefined) host.dataset[key] = node.getAttribute(kind) || '';
    return host.dataset[key];
  }

  /* "Photo 3 of 17" and friends share one pattern rather than 300 entries. */
  function lookup(text) {
    if (!dict) return null;
    if (dict[text]) return dict[text];
    var m = text.match(/^Photo (\d+) of (\d+)$/);
    if (m && dict['Photo {n} of {m}']) {
      return dict['Photo {n} of {m}'].replace('{n}', m[1]).replace('{m}', m[2]);
    }
    return null;
  }

  function translate(root) {
    root = root || document.body;
    var skip = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, CODE: 1 };
    var walk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var n, changed = [];
    while ((n = walk.nextNode())) {
      if (skip[n.parentNode.nodeName]) continue;
      if (n.parentNode.closest && n.parentNode.closest('[data-kj-no-translate]')) continue;
      changed.push(n);
    }
    changed.forEach(function (node) {
      var en = original(node);
      var trimmed = en.replace(/\s+/g, ' ').trim();
      if (!trimmed) return;
      var out = lookup(trimmed);
      var lead = en.match(/^\s*/)[0], tail = en.match(/\s*$/)[0];
      node.nodeValue = out ? lead + out + tail : en;
    });
    ['placeholder', 'aria-label', 'title', 'alt', 'content'].forEach(function (attr) {
      var sel = attr === 'content' ? 'meta[name="description"]' : '[' + attr + ']';
      document.querySelectorAll(sel).forEach(function (el) {
        var en = original(el, attr);
        if (!en) return;
        var out = lookup(en.replace(/\s+/g, ' ').trim());
        el.setAttribute(attr, out || en);
      });
    });
    document.documentElement.lang = current;
  }

  function apply(code) {
    current = code;
    return load(code).then(function (d) {
      dict = d;
      translate();
      document.querySelectorAll('.kj-lang__btn').forEach(function (b) {
        b.setAttribute('aria-current', b.dataset.lang === code ? 'true' : 'false');
      });
      document.querySelectorAll('.kj-lang__now').forEach(function (s) {
        s.textContent = code.toUpperCase();
      });
    });
  }

  function buildSwitcher() {
    document.querySelectorAll('.masthead__inner').forEach(function (bar) {
      if (bar.querySelector('.kj-lang')) return;
      var wrap = document.createElement('div');
      wrap.className = 'kj-lang';
      wrap.setAttribute('data-kj-no-translate', '');
      wrap.innerHTML =
        '<button class="kj-lang__toggle" type="button" aria-expanded="false" aria-label="Choose a language">' +
        '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">' +
        '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.8 2.5 15 0 18M12 3c-2.5 2.8-2.5 15 0 18"/></svg>' +
        '<span class="kj-lang__now">EN</span></button>' +
        '<div class="kj-lang__menu" hidden>' +
        LANGS.map(function (l) {
          return '<button class="kj-lang__btn" type="button" data-lang="' + l.code + '">' + l.label + '</button>';
        }).join('') + '</div>';
      var nav = bar.querySelector('.nav');
      bar.insertBefore(wrap, nav ? nav.nextSibling : null);

      var toggle = wrap.querySelector('.kj-lang__toggle');
      var menu = wrap.querySelector('.kj-lang__menu');
      toggle.addEventListener('click', function () {
        var open = menu.hidden;
        menu.hidden = !open;
        toggle.setAttribute('aria-expanded', String(open));
      });
      menu.addEventListener('click', function (e) {
        var b = e.target.closest('.kj-lang__btn');
        if (!b) return;
        remember(b.dataset.lang);
        apply(b.dataset.lang);
        menu.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
      });
      document.addEventListener('click', function (e) {
        if (!wrap.contains(e.target)) { menu.hidden = true; toggle.setAttribute('aria-expanded', 'false'); }
      });
    });
  }

  function start() {
    buildSwitcher();
    apply(stored() || fromBrowser());
  }

  /* Re-translate whenever the CMS content is drawn or a page is swapped in. */
  document.addEventListener('kj:content', function () {
    buildSwitcher();
    if (current !== 'en' || dict) translate();
    document.querySelectorAll('.kj-lang__now').forEach(function (s) { s.textContent = current.toUpperCase(); });
  });

  window.kjTranslate = apply;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
