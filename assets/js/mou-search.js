/* MOU 체결 기업 검색 — 실시간 회사명(초성·부분 일치) + 업종·가나다 필터 (모듈/fetch 미사용) */
(function () {
  var D = window.MOU_DATA;
  var grid = document.getElementById("mou-grid");
  if (!D || !D.items || !grid) return;

  var input = document.getElementById("mou-search");
  var field = document.querySelector("[data-mou-field]");
  var clearBtn = document.querySelector("[data-mou-clear]");
  var catsEl = document.getElementById("mou-cats");
  var initsEl = document.getElementById("mou-inits");
  var countEl = document.getElementById("mou-count");
  var emptyEl = document.getElementById("mou-empty");
  var moreBtn = document.getElementById("mou-more");
  var emptySms = document.querySelector("[data-mou-empty-sms]");
  var form = document.querySelector("[data-mou-form]");

  var CHO = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
  var PREFIX = ["(유)", "(주)", "(재)", "(사)", "(합)", "㈜", "주식회사", "유한회사", "재단법인", "사단법인", "의료법인", "학교법인"];
  var LATIN = {
    sk: "에스케이", lg: "엘지", cj: "씨제이", gs: "지에스", ls: "엘에스", lx: "엘엑스",
    kt: "케이티", nhn: "엔에이치엔", posco: "포스코", hdc: "에이치디", kb: "케이비",
    ibk: "아이비케이", bnk: "비엔케이", sm: "에스엠", ibm: "아이비엠", asml: "에이에스엠엘",
    nc: "엔씨", hybe: "하이브", sdi: "에스디아이", sds: "에스디에스", pwc: "프라이스워터하우스",
    hmm: "에이치엠엠", hd: "에이치디"
  };
  var PAGE = 60;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function norm(s) {
    return String(s || "").toLowerCase().replace(/[^0-9a-z가-힣ㄱ-ㅎ]/g, "");
  }

  function stripHead(s) {
    var out = String(s).trim();
    var changed = true;
    while (changed) {
      changed = false;
      for (var i = 0; i < PREFIX.length; i++) {
        if (out.indexOf(PREFIX[i]) === 0) {
          out = out.slice(PREFIX[i].length).trim();
          changed = true;
        }
      }
    }
    return out;
  }

  function choOf(s) {
    var src = stripHead(s);
    var out = "";
    for (var i = 0; i < src.length; i++) {
      var ch = src.charAt(i);
      var o = src.charCodeAt(i);
      if (o >= 0xac00 && o <= 0xd7a3) out += CHO[Math.floor((o - 0xac00) / 588)];
      else if (/[0-9a-z]/i.test(ch)) out += ch.toLowerCase();
    }
    return out;
  }

  var CAT_LABEL = {};
  D.cats.forEach(function (c) { CAT_LABEL[c[0]] = c[1]; });

  var items = D.items.map(function (it) {
    return { n: it[0], c: it[1], i: it[2], key: norm(it[0]), cho: choOf(it[0]) };
  });

  var INITS = ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅅ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ", "A-Z"];

  var state = { q: "", cat: "all", ini: "all", limit: PAGE };

  /* ---------- 검색어 → 대체 검색어(영문 약칭 → 한글) ---------- */
  function alternatives(qn) {
    var out = [qn];
    var lead = qn.match(/^[a-z]+/);
    if (lead && LATIN[lead[0]]) out.push(LATIN[lead[0]] + qn.slice(lead[0].length));
    return out;
  }

  function hit(it, alts) {
    for (var i = 0; i < alts.length; i++) {
      var a = alts[i];
      if (!a) return true;
      if (it.key.indexOf(a) > -1) return true;
      if (it.cho.indexOf(a) > -1) return true;
    }
    return false;
  }

  function matches(it, q, cat, ini) {
    if (cat !== "all" && it.c !== cat) return false;
    if (ini !== "all" && it.i !== ini) return false;
    if (!q) return true;
    return hit(it, alternatives(q));
  }

  /* ---------- 필터 칩 ---------- */
  function chip(label, value, active, count, group) {
    return '<button type="button" class="tab" role="tab" data-group="' + group + '" data-value="' + esc(value) +
      '" aria-selected="' + (active ? "true" : "false") + '">' + esc(label) + "<small>" + count + "</small></button>";
  }

  function buildCats() {
    var qn = norm(state.q);
    var html = chip("전체 업종", "all", state.cat === "all", items.filter(function (it) {
      return matches(it, qn, "all", state.ini);
    }).length, "cat");
    D.cats.forEach(function (c) {
      var n = items.filter(function (it) { return matches(it, qn, c[0], state.ini); }).length;
      html += chip(c[1], c[0], state.cat === c[0], n, "cat");
    });
    catsEl.innerHTML = html;
  }

  function buildInits() {
    var qn = norm(state.q);
    var html = chip("전체", "all", state.ini === "all", items.filter(function (it) {
      return matches(it, qn, state.cat, "all");
    }).length, "ini");
    INITS.forEach(function (ch) {
      var n = items.filter(function (it) { return matches(it, qn, state.cat, ch); }).length;
      if (!n) return;
      html += chip(ch, ch, state.ini === ch, n, "ini");
    });
    initsEl.innerHTML = html;
  }

  function onChip(e) {
    var b = e.target.closest ? e.target.closest(".tab") : null;
    if (!b) return;
    if (b.getAttribute("data-group") === "cat") state.cat = b.getAttribute("data-value");
    else state.ini = b.getAttribute("data-value");
    state.limit = PAGE;
    render();
  }

  /* ---------- 결과 ---------- */
  function card(it) {
    return '<button type="button" class="mou-card" data-name="' + esc(it.n) + '" aria-label="' + esc(it.n) + " 확인 요청서에 담기\">" +
      '<span class="mou-name">' + esc(it.n) + "</span>" +
      '<span class="mou-tag">' + esc(CAT_LABEL[it.c] || "기업") + "</span>" +
      "</button>";
  }

  function smsBody(q) {
    var lines = ["[벤츠 MOU 확인] 임정빈 차장님께", ""];
    if (q) lines.push("소속: " + q);
    else lines.push("소속: ");
    lines.push("MOU 임직원 추가할인(2%) 대상인지 확인 부탁드립니다.");
    lines.push("");
    lines.push("성함: ");
    lines.push("연락처: ");
    return lines.join("\n");
  }

  function render() {
    var qn = norm(state.q);
    var list = items.filter(function (it) { return matches(it, qn, state.cat, state.ini); });
    var shown = list.slice(0, state.limit);

    grid.innerHTML = shown.map(card).join("");
    grid.hidden = list.length === 0;

    if (countEl) {
      var parts = [];
      if (qn || state.cat !== "all" || state.ini !== "all") {
        parts.push('전체 <b>' + items.length + "</b>개 기업 중 <b>" + list.length + "</b>개 일치");
        var label = [];
        if (state.q) label.push("‘" + esc(state.q) + "’");
        if (state.cat !== "all") label.push(esc(CAT_LABEL[state.cat] || ""));
        if (state.ini !== "all") label.push(state.ini === "A-Z" ? "영문·숫자" : "‘" + esc(state.ini) + "’");
        if (label.length) parts.push(label.join(" · "));
      } else {
        parts.push('전체 <b>' + items.length + "</b>개 기업");
      }
      countEl.innerHTML = parts.join(" ");
    }

    if (emptyEl) emptyEl.hidden = list.length > 0;
    if (emptySms) emptySms.setAttribute("href", (window.MB && MB.smsHref ? MB.smsHref(smsBody(state.q)) : "sms:01087921080"));
    if (moreBtn) {
      var rest = list.length - shown.length;
      moreBtn.hidden = rest <= 0;
      moreBtn.textContent = rest > 0 ? "더 보기 (" + rest + "개 남음)" : "더 보기";
    }
    if (field) field.setAttribute("data-filled", state.q ? "true" : "false");

    buildCats();
    buildInits();
  }

  /* ---------- 확인 요청서로 담기 ---------- */
  function fillForm(name) {
    if (!form) return;
    var company = form.querySelector("#m-company");
    var memo = form.querySelector("#m-memo");
    var status = form.querySelector("[data-form-status]");
    var nameField = form.querySelector("#m-name");
    if (company) company.value = name;
    if (memo && !memo.value.trim()) memo.value = name + " 소속인데 MOU 임직원 추가할인(2%) 대상인지 확인 부탁드립니다.";
    if (status) status.textContent = "‘" + name + "’을(를) 확인 요청서에 담았습니다. 성함과 연락처를 넣고 버튼을 눌러 주세요.";
    var target = form.getBoundingClientRect().top + window.pageYOffset - 110;
    window.scrollTo({ top: target, behavior: "smooth" });
    if (nameField) setTimeout(function () { nameField.focus({ preventScroll: true }); }, 400);
  }

  /* ---------- 이벤트 ---------- */
  if (input) {
    var timer = null;
    input.addEventListener("input", function () {
      if (timer) clearTimeout(timer);
      timer = setTimeout(function () {
        state.q = input.value;
        state.limit = PAGE;
        render();
      }, 110);
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        state.q = input.value;
        state.limit = PAGE;
        render();
      }
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      if (input) { input.value = ""; input.focus(); }
      state.q = "";
      state.limit = PAGE;
      render();
    });
  }
  if (catsEl) catsEl.addEventListener("click", onChip);
  if (initsEl) initsEl.addEventListener("click", onChip);
  if (moreBtn) {
    moreBtn.addEventListener("click", function () {
      state.limit += PAGE;
      render();
    });
  }
  grid.addEventListener("click", function (e) {
    var b = e.target.closest ? e.target.closest(".mou-card") : null;
    if (!b) return;
    fillForm(b.getAttribute("data-name"));
  });

  /* URL 파라미터 (?q=삼성) 지원 */
  var m = window.location.search.match(/[?&]q=([^&]*)/);
  if (m) {
    state.q = decodeURIComponent(m[1].replace(/\+/g, " "));
    if (input) input.value = state.q;
  }

  render();
})();
