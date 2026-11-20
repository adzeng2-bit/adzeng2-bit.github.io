/* 전체 라인업 페이지 — 차체 유형 그룹 · 탭 · 실시간 검색 (모듈/fetch 미사용) */
(function () {
  var DATA = window.MB_DATA;
  if (!DATA || !DATA.models) return;

  var groupsEl = document.getElementById("lineup-groups");
  var empty = document.getElementById("lineup-empty");
  var countEl = document.getElementById("lineup-count");
  var tabsEl = document.getElementById("model-tabs");
  var input = document.getElementById("model-search");
  var field = document.querySelector("[data-search-field]");
  var clearBtn = document.querySelector("[data-search-clear]");
  var metaEl = document.getElementById("lineup-meta");
  var filterBar = document.getElementById("model-filterbar");

  if (!groupsEl) return;

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

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------- 그룹 ---------------------------------------------- */
  var GROUPS = (DATA.groups || []).slice().sort(function (a, b) {
    return String(a.no).localeCompare(String(b.no));
  });
  var GROUP_BY_ID = {};
  GROUPS.forEach(function (g) { GROUP_BY_ID[g.id] = g; });

  function groupOf(m) {
    if (m.group && GROUP_BY_ID[m.group]) return m.group;
    return GROUPS.length ? GROUPS[0].id : "";
  }

  /* 그룹 안의 클래스 순서 — groups[].ids 순서를 그대로 따른다 */
  var RANK = {};
  GROUPS.forEach(function (g) {
    (g.ids || []).forEach(function (id, i) { RANK[g.id + "|" + id] = i; });
  });

  var BY_GROUP = {};
  GROUPS.forEach(function (g) { BY_GROUP[g.id] = []; });
  DATA.models.forEach(function (m) { BY_GROUP[groupOf(m)].push(m); });
  GROUPS.forEach(function (g) {
    BY_GROUP[g.id].sort(function (a, b) {
      var ra = RANK[g.id + "|" + a.id], rb = RANK[g.id + "|" + b.id];
      ra = ra == null ? 999 : ra;
      rb = rb == null ? 999 : rb;
      return ra - rb;
    });
  });

  /* ---------- 탭 ------------------------------------------------ */
  var TABS = [{ id: "all", label: "전체" }].concat(GROUPS.map(function (g) {
    return { id: g.id, label: g.label };
  }));

  TABS.forEach(function (t) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "tab";
    b.setAttribute("role", "tab");
    b.setAttribute("data-filter", t.id);
    b.textContent = t.label;
    b.addEventListener("click", function () {
      state.filter = t.id;
      syncTabs();
      render();
      if (history.replaceState) {
        var url = window.location.pathname + (t.id === "all" ? "" : "?g=" + encodeURIComponent(t.id));
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

  /* ---------- 검색 문자열 --------------------------------------- */
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

  function groupLabel(m) {
    var g = GROUP_BY_ID[groupOf(m)];
    return g ? g.label : "";
  }

  function searchText(m) {
    var parts = [m.name, m.ko, m.brandLabel, m.year, (m.fuel || []).join(" "), groupLabel(m)];
    (m.trims || []).forEach(function (t) { parts.push(t.n); });
    return (parts.join(" ").toLowerCase() + optionText(m.id));
  }

  /* ---------- 카드 ---------------------------------------------- */
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
          '<span class="car-brand">' + esc(groupLabel(m)) + ' · ' + esc(m.year) + '</span>' +
          '<h3 class="car-name serif">' + esc(m.name) + '</h3>' +
          '<div class="car-fuel">' + fuel + '</div>' +
          '<p class="car-price"><b>' + esc(m.priceFromLabel) + '</b><span>' + sub + '</span></p>' +
        '</div>' +
      '</a>';
  }

  function section(g, list) {
    return '' +
      '<section class="group" id="group-' + esc(g.id) + '" aria-labelledby="group-' + esc(g.id) + '-title">' +
        '<header class="group-head">' +
          '<div class="group-top">' +
            '<p class="group-no">' + esc(g.no) + ' · ' + list.length + '개 차종</p>' +
            '<button class="group-jump" type="button" data-jump-filter>차종 선택 <span aria-hidden="true">↑</span></button>' +
          '</div>' +
          '<h2 class="group-title" id="group-' + esc(g.id) + '-title">' + esc(g.label) + '</h2>' +
          (g.order ? '<p class="group-order">' + esc(g.order) + '</p>' : '') +
          '<span class="group-rule" aria-hidden="true"></span>' +
        '</header>' +
        '<div class="lineup-grid">' + list.map(card).join("") + '</div>' +
      '</section>';
  }

  /* ---------- 렌더 ---------------------------------------------- */
  function render() {
    var q = state.q.toLowerCase().replace(/\s+/g, " ").trim();
    var tokens = q ? q.split(" ") : [];
    var html = "";
    var total = 0;

    GROUPS.forEach(function (g) {
      if (state.filter !== "all" && state.filter !== g.id) return;
      var list = BY_GROUP[g.id].filter(function (m) {
        if (!tokens.length) return true;
        var hay = searchText(m);
        return tokens.every(function (tk) { return hay.indexOf(tk) > -1; });
      });
      if (!list.length) return;
      total += list.length;
      html += section(g, list);
    });

    groupsEl.innerHTML = html;
    if (countEl) {
      countEl.innerHTML = "<b>" + total + "</b>개 차종 가이드" +
        (q ? ' <span class="lineup-q">· ‘' + esc(state.q) + '’ 검색 결과</span>' : "");
    }
    if (empty) empty.hidden = total > 0;
    if (field) field.setAttribute("data-filled", state.q ? "true" : "false");
  }

  /* 차종 선택 ↑ — 필터바로 이동 */
  groupsEl.addEventListener("click", function (e) {
    var btn = e.target.closest ? e.target.closest("[data-jump-filter]") : null;
    if (!btn) return;
    e.preventDefault();
    var target = filterBar || document.querySelector(".filterbar");
    if (target && target.scrollIntoView) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  /* ---------- 초기 상태: URL 파라미터 --------------------------- */
  var LEGACY = { "cat:sedan": "sedan", "cat:hatchback": "sedan", "cat:suv": "suv", "cat:mpv": "mpv",
    "cat:coupe": "coupe", "cat:cabriolet": "coupe", "brand:amg": "amg", "brand:maybach": "maybach", "fuel:전기": "ev" };
  var want = params.g || params.cat || "";
  if (want) {
    var cand = want.indexOf(":") > -1 ? (LEGACY[want] || "") : (want.indexOf("cat:") === 0 ? want.slice(4) : want);
    if (GROUP_BY_ID[cand]) state.filter = cand;
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
