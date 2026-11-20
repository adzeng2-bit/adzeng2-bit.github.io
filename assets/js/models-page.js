/* 전체 라인업 페이지 — 탭 · 실시간 검색 (모듈/fetch 미사용) */
(function () {
  var DATA = window.MB_DATA;
  if (!DATA || !DATA.models) return;

  var grid = document.getElementById("lineup-grid");
  var empty = document.getElementById("lineup-empty");
  var countEl = document.getElementById("lineup-count");
  var tabsEl = document.getElementById("model-tabs");
  var input = document.getElementById("model-search");
  var field = document.querySelector("[data-search-field]");
  var clearBtn = document.querySelector("[data-search-clear]");
  var metaEl = document.getElementById("lineup-meta");

  var state = { filter: "all", q: "" };

  var params = (function () {
    var out = {};
    var s = window.location.search.replace(/^\?/, "");
    if (!s) return out;
    s.split("&").forEach(function (pair) {
      var kv = pair.split("=");
      if (kv[0]) out[decodeURIComponent(kv[0])] = decodeURIComponent((kv[1] || "").replace(/\+/g, " "));
    });
    return out;
  })();

  var CAT_LABEL = {};
  DATA.categories.forEach(function (c) { CAT_LABEL[c.id] = c.label; });

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function matches(m, filter) {
    if (filter === "all") return true;
    if (filter.indexOf("cat:") === 0) return m.cat === filter.slice(4);
    if (filter.indexOf("brand:") === 0) return m.brand === filter.slice(6);
    if (filter.indexOf("fuel:") === 0) return (m.fuel || []).indexOf(filter.slice(5)) > -1;
    return true;
  }

  function countFor(filter) {
    return DATA.models.filter(function (m) { return matches(m, filter); }).length;
  }

  var TABS = [{ id: "all", label: "전체" }]
    .concat(DATA.categories.map(function (c) { return { id: "cat:" + c.id, label: c.label }; }))
    .concat([{ id: "brand:amg", label: "AMG" }, { id: "brand:maybach", label: "마이바흐" }, { id: "fuel:전기", label: "전기차" }]);

  TABS.forEach(function (t) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "tab";
    b.setAttribute("role", "tab");
    b.setAttribute("data-filter", t.id);
    b.innerHTML = esc(t.label) + "<small>" + countFor(t.id) + "</small>";
    b.addEventListener("click", function () {
      state.filter = t.id;
      syncTabs();
      render();
      if (history.replaceState) {
        var url = window.location.pathname + (t.id === "all" ? "" : "?cat=" + encodeURIComponent(t.id));
        history.replaceState(null, "", url);
      }
    });
    tabsEl.appendChild(b);
  });

  function syncTabs() {
    Array.prototype.forEach.call(tabsEl.querySelectorAll(".tab"), function (b) {
      var on = b.getAttribute("data-filter") === state.filter;
      b.setAttribute("aria-selected", on ? "true" : "false");
    });
  }

  var OPT = window.MB_OPTIONS || {};
  var optHayCache = {};
  function optionText(id) {
    if (optHayCache[id] != null) return optHayCache[id];
    var out = [];
    (OPT[id] || []).forEach(function (sh) {
      if (sh.common) {
        if (sh.common.opt) out.push(sh.common.opt);
        (sh.common.eng || []).forEach(function (x) { out.push(x); });
        (sh.common.size || []).forEach(function (x) { out.push(x); });
        (sh.common.base || []).forEach(function (c) { out.push(c[0] + " " + c[1]); });
      }
      sh.trims.forEach(function (t) {
        ["name", "price", "opt", "ext", "int", "susp", "wheel"].forEach(function (f) { if (t[f]) out.push(t[f]); });
        (t.eng || []).forEach(function (x) { out.push(x); });
        (t.size || []).forEach(function (x) { out.push(x); });
        (t.extra || []).forEach(function (x) { out.push(x); });
        (t.base || []).forEach(function (c) { out.push(c[0] + " " + c[1]); });
      });
    });
    optHayCache[id] = " " + out.join(" ").toLowerCase();
    return optHayCache[id];
  }

  function searchText(m) {
    var parts = [m.name, m.ko, m.brandLabel, m.year, (m.fuel || []).join(" "), CAT_LABEL[m.cat] || ""];
    (m.trims || []).forEach(function (t) { parts.push(t.n); });
    return (parts.join(" ").toLowerCase() + optionText(m.id));
  }

  function card(m) {
    var badgeClass = "car-badge";
    if (m.brand === "amg") badgeClass += " car-badge--amg";
    if (m.brand === "maybach") badgeClass += " car-badge--maybach";
    var fuel = (m.fuel || []).map(function (f) { return "<i>" + esc(f) + "</i>"; }).join("");
    var trims = (m.trims || []).length;
    var sub = trims
      ? esc(m.year) + " · " + trims + "개 트림"
      : "가격 확인은 상담으로";
    if (OPT[m.id]) sub += " · 옵션표 수록";
    return '' +
      '<a class="car-card" href="model.html?id=' + encodeURIComponent(m.id) + '">' +
        '<div class="car-media">' +
          '<span class="' + badgeClass + '">' + esc(m.brandLabel) + '</span>' +
          (m.card
            ? '<img src="' + esc(m.card) + '" alt="' + esc(m.name) + ' 공식 차량 이미지" loading="lazy" decoding="async">'
            : '<span class="car-media-empty"><b>' + esc(m.name) + '</b><i>사진 준비 중</i></span>') +
        '</div>' +
        '<div class="car-body">' +
          '<span class="car-brand">' + esc(CAT_LABEL[m.cat] || "") + ' · ' + esc(m.year) + '</span>' +
          '<h3 class="car-name serif">' + esc(m.name) + '</h3>' +
          '<div class="car-fuel">' + fuel + '</div>' +
          '<p class="car-price"><b>' + esc(m.priceFromLabel) + '</b><span>' + sub + '</span></p>' +
        '</div>' +
      '</a>';
  }

  function render() {
    var q = state.q.toLowerCase().replace(/\s+/g, " ").trim();
    var tokens = q ? q.split(" ") : [];
    var list = DATA.models.filter(function (m) {
      if (!matches(m, state.filter)) return false;
      if (!tokens.length) return true;
      var hay = searchText(m);
      return tokens.every(function (tk) { return hay.indexOf(tk) > -1; });
    });

    grid.innerHTML = list.map(card).join("");
    countEl.innerHTML = "<b>" + list.length + "</b>개 모델" + (q ? " · ‘" + esc(state.q) + "’ 검색 결과" : "");
    empty.hidden = list.length > 0;
    if (field) field.setAttribute("data-filled", state.q ? "true" : "false");
  }

  /* 초기 상태: URL 파라미터 */
  if (params.cat) {
    var cand = params.cat.indexOf(":") > -1 ? params.cat : "cat:" + params.cat;
    var exists = TABS.some(function (t) { return t.id === cand; });
    if (exists) state.filter = cand;
  }
  if (params.q) { state.q = params.q; if (input) input.value = params.q; }
  syncTabs();

  if (metaEl) {
    metaEl.textContent = "국내 판매 " + DATA.models.length + "개 모델 · 기준 " +
      DATA.updated.replace(/-/g, ".") + " 통합옵션표 · 이미지 메르세데스-벤츠 공식 모델 페이지";
  }

  if (input) {
    var timer = null;
    input.addEventListener("input", function () {
      if (timer) clearTimeout(timer);
      timer = setTimeout(function () {
        state.q = input.value;
        render();
      }, 110);
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); state.q = input.value; render(); }
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      if (input) { input.value = ""; input.focus(); }
      state.q = "";
      render();
    });
  }

  render();
})();
