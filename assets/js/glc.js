/* GLC 300 4MATIC Electric — 트림 토글 · 색상 조합기 */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
     데이터
     ------------------------------------------------------------------ */
  var TRIMS = {
    line: {
      name: 'AMG Line Launch Edition',
      short: 'AMG Line',
      price: '9,000만원',
      trimName: '브라운 오픈포어 파인라인 버치 우드',
      trimCode: '26H',
      trimShort: '버치 우드 26H',
      swatch: 'repeating-linear-gradient(92deg,#8A5C39 0px,#8A5C39 4px,#7E5232 4px,#7E5232 6px,#93663F 6px,#93663F 10px,#7F5333 10px,#7F5333 12px)'
    },
    plus: {
      name: 'AMG Line+ Launch Edition',
      short: 'AMG Line+',
      price: '9,480만원',
      trimName: '블랙 / 실버 메탈릭 혼방 패브릭',
      trimCode: 'H75',
      trimShort: '메탈릭 패브릭 H75',
      swatch: 'repeating-linear-gradient(45deg,#2E3037 0px,#2E3037 2px,#3B3E45 2px,#3B3E45 3px),repeating-linear-gradient(-45deg,rgba(200,206,212,.22) 0px,rgba(200,206,212,.22) 1px,rgba(0,0,0,0) 1px,rgba(0,0,0,0) 4px)'
    }
  };

  var EXTERIOR = [
    { code: '149U', name: '폴라 화이트', base: '#F1F0EA', hi: '#FBFAF5', lo: '#DBDAD3', type: 'solid', badge: '선택' },
    { code: '197U', name: '옵시디안 블랙', base: '#16181B', hi: '#3C4248', lo: '#08090B', type: 'metal', badge: '선택' },
    { code: '922U', name: '하이 테크 실버', base: '#B7BCC1', hi: '#E7EAEC', lo: '#868C92', type: 'metal', badge: '기본' },
    { code: '689U', name: '라벤더 실버', base: '#BEB6C0', hi: '#E9E3EB', lo: '#948C99', type: 'metal', badge: '신규' },
    { code: '809U', name: '시어 블루', base: '#A6BAC9', hi: '#DCE7EE', lo: '#7A91A4', type: 'metal', badge: '신규' },
    { code: '842U', name: '소달라이트 블루', base: '#2C4A6B', hi: '#5D82A6', lo: '#1A2D42', type: 'metal', badge: '선택' },
    { code: '885U', name: 'MANUFAKTUR 오팔라이트 화이트', base: '#F4F0E3', hi: '#FFFDF3', lo: '#DCD5C3', type: 'metal', badge: '유료' },
    { code: '956U', name: 'MANUFAKTUR 알파인 그레이', base: '#6E757B', hi: '#A8AFB4', lo: '#4A5055', type: 'metal', badge: '유료' }
  ];

  var INTERIOR = [
    { code: '114A', name: '비치 브라운 / 블랙', main: '#A58265', alt: '#1C1B1A', badge: '기본' },
    { code: '111A', name: '블랙', main: '#232220', alt: '#232220', badge: '선택' },
    { code: '115A', name: '아이보리 베이지 / 블랙', main: '#D6C9B4', alt: '#1C1B1A', badge: '선택' }
  ];

  var state = { trim: 'line', ext: '922U', int: '114A' };

  /* ------------------------------------------------------------------
     도우미
     ------------------------------------------------------------------ */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return [].slice.call((root || document).querySelectorAll(sel)); }

  function luminance(hex) {
    var c = String(hex).replace('#', '');
    if (c.length === 3) { c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2]; }
    var rgb = [0, 2, 4].map(function (i) {
      var v = parseInt(c.substr(i, 2), 16) / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  }
  function inkFor(hex) { return luminance(hex) > 0.46 ? '#12161B' : '#FFFFFF'; }
  function softInkFor(hex) { return luminance(hex) > 0.46 ? 'rgba(18,22,27,.7)' : 'rgba(255,255,255,.82)'; }

  function paintBg(c) {
    if (c.type === 'solid') {
      return 'linear-gradient(150deg,' + c.lo + ' 0%,' + c.base + ' 46%,' + c.hi + ' 62%,' + c.base + ' 100%)';
    }
    return 'linear-gradient(150deg,' + c.lo + ' 0%,' + c.base + ' 38%,' + c.hi + ' 52%,' + c.base + ' 68%,' + c.lo + ' 100%)';
  }

  function findExt(code) {
    for (var i = 0; i < EXTERIOR.length; i++) { if (EXTERIOR[i].code === code) { return EXTERIOR[i]; } }
    return EXTERIOR[2];
  }
  function findInt(code) {
    for (var i = 0; i < INTERIOR.length; i++) { if (INTERIOR[i].code === code) { return INTERIOR[i]; } }
    return INTERIOR[0];
  }

  /* ------------------------------------------------------------------
     트림
     ------------------------------------------------------------------ */
  function applyTrim(key, silent) {
    var t = TRIMS[key];
    if (!t) { return; }
    state.trim = key;
    document.body.setAttribute('data-trim', key);

    $all('[data-trim-btn]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-trim-btn') === key ? 'true' : 'false');
    });

    var nameEl = $('.js-trim-name');
    if (nameEl) { nameEl.textContent = t.name; }
    var priceEl = $('.js-trim-price');
    if (priceEl) { priceEl.textContent = t.price; }

    var tmName = $('[data-tm-name]');
    var tmCode = $('[data-tm-code]');
    var tmTrim = $('[data-tm-trim]');
    var tmSwatch = $('[data-tm-swatch]');
    if (tmName) { tmName.textContent = t.trimName; }
    if (tmCode) { tmCode.textContent = t.trimCode; }
    if (tmTrim) { tmTrim.textContent = t.short; }
    if (tmSwatch) { tmSwatch.style.setProperty('--tm-bg', t.swatch); }

    var previewTrim = $('[data-preview-trim]');
    if (previewTrim) { previewTrim.style.setProperty('--tm-bg', t.swatch); }
    var ppTrim = $('[data-pp-trim]');
    if (ppTrim) { ppTrim.textContent = t.trimShort; }

    renderSummary();
    if (!silent) { flashTrim(); }
  }

  var trimFlashTimer = null;
  function flashTrim() {
    var wrap = $('.diff-grid');
    if (!wrap) { return; }
    wrap.classList.remove('is-flash');
    /* reflow 후 클래스 재적용 → 강조 애니메이션 */
    void wrap.offsetWidth;
    wrap.classList.add('is-flash');
    clearTimeout(trimFlashTimer);
    trimFlashTimer = setTimeout(function () { wrap.classList.remove('is-flash'); }, 700);
  }

  /* ------------------------------------------------------------------
     색상 목록 생성
     ------------------------------------------------------------------ */
  var extList = $('#ext-list');
  var intList = $('#int-list');

  function buildExterior() {
    if (!extList) { return; }
    var frag = document.createDocumentFragment();
    EXTERIOR.forEach(function (c) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'color-opt';
      btn.setAttribute('data-ext', c.code);
      btn.setAttribute('aria-pressed', c.code === state.ext ? 'true' : 'false');
      btn.innerHTML =
        '<span class="chip" style="--chip:' + paintBg(c) + '"></span>' +
        '<span class="color-text"><span class="color-name">' + c.name + '</span>' +
        '<span class="color-code">' + c.code + '</span></span>' +
        '<span class="color-badge' + (c.badge === '기본' || c.badge === '신규' || c.badge === '유료' ? '' : ' color-badge--dim') + '">' + c.badge + '</span>';
      btn.addEventListener('click', function () { applyColor('ext', c.code); });
      frag.appendChild(btn);
    });
    extList.appendChild(frag);
  }

  function buildInterior() {
    if (!intList) { return; }
    var frag = document.createDocumentFragment();
    INTERIOR.forEach(function (c) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'color-opt';
      btn.setAttribute('data-int', c.code);
      btn.setAttribute('aria-pressed', c.code === state.int ? 'true' : 'false');
      btn.innerHTML =
        '<span class="chip chip--two" style="--chip:' + c.main + ';--chip-2:' + c.alt + '"></span>' +
        '<span class="color-text"><span class="color-name">' + c.name + '</span>' +
        '<span class="color-code">' + c.code + '</span></span>' +
        '<span class="color-badge' + (c.badge === '기본' ? '' : ' color-badge--dim') + '">' + c.badge + '</span>';
      btn.addEventListener('click', function () { applyColor('int', c.code); });
      frag.appendChild(btn);
    });
    intList.appendChild(frag);
  }

  function applyColor(kind, code) {
    state[kind] = code;

    if (kind === 'ext') {
      $all('[data-ext]').forEach(function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-ext') === code ? 'true' : 'false');
      });
      var c = findExt(code);
      var paint = $('[data-preview-paint]');
      if (paint) {
        paint.style.setProperty('--paint-bg', paintBg(c));
        paint.style.setProperty('--paint-ink', inkFor(c.base));
        paint.setAttribute('data-type', c.type);
      }
      var en = $('[data-pp-ext]');
      var ec = $('[data-pp-ext-code]');
      if (en) { en.textContent = c.name; }
      if (ec) { ec.textContent = c.code; }
    } else {
      $all('[data-int]').forEach(function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-int') === code ? 'true' : 'false');
      });
      var d = findInt(code);
      var seat = $('[data-preview-seat]');
      if (seat) {
        seat.style.setProperty('--int-main', d.main);
        seat.style.setProperty('--int-alt', d.alt);
        seat.style.setProperty('--int-ink', softInkFor(d.main));
      }
      var inn = $('[data-pp-int]');
      if (inn) { inn.textContent = d.name; }
    }
    renderSummary();
  }

  function comboText() {
    var t = TRIMS[state.trim];
    var e = findExt(state.ext);
    var i = findInt(state.int);
    return '[GLC 300 4MATIC Electric 견적 문의]\n' +
      '· 트림 : ' + t.name + ' (' + t.price + ')\n' +
      '· 외장 : ' + e.name + ' ' + e.code + '\n' +
      '· 내장 : ' + i.name + ' ' + i.code + '\n' +
      '· 실내 장식 : ' + t.trimName + ' ' + t.trimCode;
  }

  function renderSummary() {
    var t = TRIMS[state.trim];
    var e = findExt(state.ext);
    var i = findInt(state.int);
    var line = $('[data-pp-summary]');
    if (line) {
      line.textContent = t.short + ' · ' + e.name + ' ' + e.code + ' · ' + i.name + ' ' + i.code + ' · ' + t.trimShort;
    }
  }

  /* ------------------------------------------------------------------
     복사
     ------------------------------------------------------------------ */
  var toastEl = $('#copy-toast');
  var toastTimer = null;
  function toast(msg) {
    if (!toastEl) { return; }
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-on'); }, 3200);
  }

  function legacyCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', 'readonly');
    ta.style.position = 'fixed';
    ta.style.top = '0';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  var copyBtn = $('#copy-combo');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var text = comboText();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          toast('조합을 복사했습니다. 문자에 붙여넣어 보내주세요.');
        }, function () {
          toast(legacyCopy(text) ? '조합을 복사했습니다.' : '복사가 막혀 있어요. 조합을 그대로 알려주시면 확인해 드립니다.');
        });
      } else {
        toast(legacyCopy(text) ? '조합을 복사했습니다.' : '복사가 막혀 있어요. 조합을 그대로 알려주시면 확인해 드립니다.');
      }
    });
  }

  /* ------------------------------------------------------------------
     트림 버튼 · 초기화
     ------------------------------------------------------------------ */
  $all('[data-trim-btn]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyTrim(btn.getAttribute('data-trim-btn'));
    });
  });

  buildExterior();
  buildInterior();
  applyTrim('line', true);
  applyColor('ext', state.ext);
  applyColor('int', state.int);

  /* ------------------------------------------------------------------
     서브 내비 현재 위치 표시
     ------------------------------------------------------------------ */
  var subItems = $all('.subnav-item');
  var sections = subItems.map(function (a) {
    return document.querySelector(a.getAttribute('href'));
  }).filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) { return; }
        subItems.forEach(function (a) {
          var on = a.getAttribute('href') === '#' + entry.target.id;
          if (on) { a.setAttribute('aria-current', 'true'); }
          else { a.removeAttribute('aria-current'); }
        });
      });
    }, { rootMargin: '-42% 0px -52% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ------------------------------------------------------------------
     등장 애니메이션
     ------------------------------------------------------------------ */
  var reveals = $all('.reveal');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window) || reduce) {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) { return; }
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  var yearEl = document.getElementById('year');
  if (yearEl) { yearEl.textContent = String(new Date().getFullYear()); }
})();
