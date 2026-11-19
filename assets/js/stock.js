/* 전국 판매가능 재고 — 차종·연식·외장/내장 색상·전시장 필터 (모듈/fetch 미사용) */
(function () {
  var D = window.STOCK_DATA;
  var listEl = document.getElementById("stock-list");
  if (!D || !D.items || !listEl) return;

  var modelSel = document.getElementById("st-model");
  var yearSel = document.getElementById("st-year");
  var extSel = document.getElementById("st-ext");
  var intSel = document.getElementById("st-int");
  var locSel = document.getElementById("st-loc");
  var onlyAvail = document.getElementById("st-only-avail");
  var countEl = document.getElementById("stock-count");
  var totalEl = document.getElementById("stock-total");
  var resetBtn = document.getElementById("st-reset");

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function uniq(arr) {
    var seen = {}, out = [];
    for (var i = 0; i < arr.length; i++) {
      var k = arr[i];
      if (!seen[k]) { seen[k] = 1; out.push(k); }
    }
    return out;
  }

  function fillOptions(sel, values, allLabel) {
    if (!sel) return;
    var html = '<option value="">' + allLabel + "</option>";
    for (var i = 0; i < values.length; i++) {
      html += '<option value="' + esc(values[i]) + '">' + esc(values[i]) + "</option>";
    }
    sel.innerHTML = html;
  }

  function sortKo(a, b) {
    return String(a).localeCompare(String(b), "ko");
  }

  fillOptions(modelSel, uniq(D.items.map(function (r) { return r[0]; })).sort(sortKo), "차종 전체");
  fillOptions(yearSel, uniq(D.items.map(function (r) { return r[1]; })).sort(), "연식 전체");
  fillOptions(extSel, uniq(D.items.map(function (r) { return r[2]; })).sort(sortKo), "외장색 전체");
  fillOptions(intSel, uniq(D.items.map(function (r) { return r[4]; })).sort(sortKo), "내장색 전체");
  fillOptions(locSel, (D.showrooms || []).map(function (s) { return s[0]; }), "전시장 전체");

  /* 차종을 고르면 그 차종에 있는 연식·색상만 남긴다 */
  function refreshDependent() {
    var m = modelSel ? modelSel.value : "";
    var rows = D.items.filter(function (r) { return !m || r[0] === m; });
    var y = yearSel ? yearSel.value : "";
    if (y) {
      var years = uniq(rows.map(function (r) { return r[1]; }));
      if (years.indexOf(y) < 0) yearSel.value = "";
      refreshDependent();
      return;
    }
    fillOptions(yearSel, uniq(rows.map(function (r) { return r[1]; })).sort(), "연식 전체");
    fillOptions(extSel, uniq(rows.map(function (r) { return r[2]; })).sort(sortKo), "외장색 전체");
    fillOptions(intSel, uniq(rows.map(function (r) { return r[4]; })).sort(sortKo), "내장색 전체");
  }

  function currentRows() {
    var m = modelSel ? modelSel.value : "";
    var y = yearSel ? yearSel.value : "";
    var e = extSel ? extSel.value : "";
    var t = intSel ? intSel.value : "";
    var l = locSel ? locSel.value : "";
    var availOnly = onlyAvail ? onlyAvail.checked : true;
    return D.items.filter(function (r) {
      if (m && r[0] !== m) return false;
      if (y && r[1] !== y) return false;
      if (e && r[2] !== e) return false;
      if (t && r[4] !== t) return false;
      if (l && r[5] !== l) return false;
      if (availOnly && r[7]) return false;
      return true;
    });
  }

  function smsBody(r) {
    return "[재고 문의] " + r[0] + " " + r[1] + "년식 / 외장 " + r[2] +
      (r[3] ? " (" + r[3] + ")" : "") + " / 내장 " + r[4] + " / " + r[5] +
      " " + r[6] + "대 — 배정 가능한지 확인 부탁드립니다.";
  }

  function smsHref(r) {
    var body = smsBody(r);
    if (window.MB && MB.smsHref) return MB.smsHref(body);
    return "sms:01087921080?body=" + encodeURIComponent(body);
  }

  function render() {
    var rows = currentRows();
    var units = rows.reduce(function (a, r) { return a + r[6]; }, 0);

    rows.sort(function (a, b) {
      return sortKo(a[0], b[0]) || String(a[1]).localeCompare(String(b[1])) ||
        sortKo(a[5], b[5]) || sortKo(a[2], b[2]) || sortKo(a[4], b[4]);
    });

    var html = "";
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      html += '<article class="stock-row">' +
        '<div class="stock-row-main">' +
          '<h4>' + esc(r[0]) + ' <span class="stock-my">' + esc(r[1]) + "</span></h4>" +
          '<p class="stock-colors"><span class="stock-chip">외장</span>' + esc(r[2]) +
            (r[3] ? ' <span class="stock-tone">' + esc(r[3]) + "</span>" : "") +
            '<span class="stock-chip">내장</span>' + esc(r[4]) + "</p>" +
        "</div>" +
        '<div class="stock-row-side">' +
          '<span class="stock-loc">' + esc(r[5]) + "</span>" +
          '<span class="stock-qty">' + r[6] + "대</span>" +
          (r[7] ? '<span class="stock-hold">배정 제한</span>' : "") +
          '<a class="stock-sms" href="' + esc(smsHref(r)) + '">문의</a>' +
        "</div>" +
      "</article>";
    }
    listEl.innerHTML = html || '<div class="empty-state"><b>조건에 맞는 재고가 없습니다</b>색상·전시장 조건을 바꾸거나, 원하시는 사양을 문자로 남겨 주시면 전국에서 다시 찾아 드립니다.</div>';

    if (countEl) {
      var filtered = modelSel.value || yearSel.value || extSel.value || intSel.value || locSel.value;
      countEl.innerHTML = filtered
        ? "전체 <b>" + D.total + "</b>대 중 <b>" + units + "</b>대 표시"
        : "전체 <b>" + units + "</b>대";
    }
  }

  [modelSel, yearSel, extSel, intSel, locSel].forEach(function (el) {
    if (!el) return;
    el.addEventListener("change", function () {
      if (el === modelSel) refreshDependent();
      render();
    });
  });
  if (onlyAvail) onlyAvail.addEventListener("change", render);
  if (resetBtn) resetBtn.addEventListener("click", function () {
    [modelSel, yearSel, extSel, intSel, locSel].forEach(function (el) { if (el) el.value = ""; });
    if (onlyAvail) onlyAvail.checked = true;
    refreshDependent();
    render();
  });

  if (totalEl) totalEl.textContent = String(D.total);
  render();
})();
