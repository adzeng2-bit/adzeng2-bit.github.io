/* 메르세데스-벤츠 신한카드 3종 — 혜택 비교 · 차량 잔금 결제 시뮬레이터 (모듈/fetch 미사용) */
(function () {
  var D = window.MB_CARD_DATA;
  if (!D) return;

  var pickEl = document.getElementById("card-pick");
  var tableEl = document.getElementById("card-table");
  var bracketEl = document.getElementById("card-brackets");
  var limitEl = document.getElementById("limit-links");
  var amountInput = document.getElementById("sim-amount");
  var rangeInput = document.getElementById("sim-range");
  var hintEl = document.getElementById("sim-hint");
  var resultsEl = document.getElementById("sim-results");
  var monthsSel = document.getElementById("sim-months");
  var installOut = document.getElementById("sim-install-out");

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function won(n) {
    return Math.round(n).toLocaleString("ko-KR") + "원";
  }

  function wonShort(n) {
    var v = Math.round(n);
    if (v >= 100000000) {
      var eok = Math.floor(v / 100000000);
      var man = Math.round((v % 100000000) / 10000);
      return eok + "억" + (man ? " " + man.toLocaleString("ko-KR") + "만" : "") + "원";
    }
    if (v >= 10000) {
      var m = Math.round(v / 10000);
      return m.toLocaleString("ko-KR") + "만원";
    }
    return v.toLocaleString("ko-KR") + "원";
  }

  function feeText(c) {
    return wonShort(c.fee.overseas) + " <i>해외겸용</i><br>" + wonShort(c.fee.domestic) + " <i>국내전용</i>";
  }

  /* ---------- 카드 3종 요약 타일 ---------- */
  function renderPick() {
    if (!pickEl) return;
    pickEl.innerHTML = D.cards.map(function (c) {
      return '<article class="cp-tile">' +
        '<p class="cp-tier">' + esc(c.tier) + "</p>" +
        '<h3 class="cp-name">' + esc(c.ko) + ' <i class="serif">' + esc(c.name) + "</i></h3>" +
        '<p class="cp-desc">' + esc(c.desc) + "</p>" +
        '<dl class="cp-spec">' +
          "<div><dt>연회비</dt><dd>" + feeText(c) + "</dd></div>" +
          "<div><dt>국내 할인</dt><dd>첫 달 " + c.rate.first + "% → 최대 " + c.rate.max + "%</dd></div>" +
          "<div><dt>스카이패스</dt><dd>" + (c.mile ? "1,500원당 1마일" : "할인형만 운영") + "</dd></div>" +
          "<div><dt>연간 기프트</dt><dd>" + esc(c.gift) + "</dd></div>" +
        "</dl>" +
        '<a class="cp-link" href="' + esc(c.apply) + '" target="_blank" rel="noopener">카드 신청·조건 확인 <span aria-hidden="true">↗</span></a>' +
        "</article>";
    }).join("");
  }

  /* ---------- 전월 실적별 할인율 ---------- */
  function renderBrackets() {
    if (!bracketEl) return;
    var head = '<div class="cbt-row cbt-head"><span class="cbt-k">전월 이용금액</span>' +
      D.cards.map(function (c) { return "<span>" + esc(c.ko) + "</span>"; }).join("") + "</div>";
    var body = D.brackets.map(function (b) {
      return '<div class="cbt-row"><span class="cbt-k">' + esc(b.label) +
        (b.sub ? '<i>' + esc(b.sub) + "</i>" : "") + "</span>" +
        b.v.map(function (v) {
          return "<span" + (v == null ? ' class="cbt-none"' : "") + ">" + (v == null ? "—" : v + "%") + "</span>";
        }).join("") + "</div>";
    }).join("");
    bracketEl.innerHTML = head + body;
  }

  /* ---------- 혜택 상세 비교 ---------- */
  function row(key, vals, cls) {
    return '<div class="cbt-row' + (cls ? " " + cls : "") + '"><span class="cbt-k">' + key + "</span>" +
      vals.map(function (v) { return "<span>" + v + "</span>"; }).join("") + "</div>";
  }

  function group(label) {
    return '<div class="cbt-group">' + esc(label) + "</div>";
  }

  function renderTable() {
    if (!tableEl) return;
    var head = '<div class="cbt-row cbt-head"><span class="cbt-k">혜택 구분</span>' +
      D.cards.map(function (c) {
        return "<span>" + esc(c.ko) + '<i class="serif">' + esc(c.name) + "</i></span>";
      }).join("") + "</div>";

    var rows = [];
    rows.push(group("연회비"));
    rows.push(row("해외겸용", D.cards.map(function (c) { return won(c.fee.overseas); })));
    rows.push(row("국내전용", D.cards.map(function (c) { return won(c.fee.domestic); })));

    rows.push(group("기본 서비스 · 국내 할인율"));
    rows.push(row("발급 첫 달", D.cards.map(function (c) { return c.rate.first + "%"; }), "is-key"));
    rows.push(row("150만~300만원", D.cards.map(function (c) { return c.rate.mid + "%"; })));
    rows.push(row("300만원 이상", D.cards.map(function (c) { return "<b>" + c.rate.max + "%</b>"; }), "is-key"));
    rows.push(row("해외 일시불", D.cards.map(function (c) { return "최대 " + c.rate.abroad + "%"; })));
    rows.push(row("할인 한도", D.cards.map(function () { return "없음"; })));

    rows.push(group("스카이패스형 선택 시"));
    rows.push(row("기본 적립", D.cards.map(function (c) { return c.mile ? "1,500원당 1마일" : "—"; })));
    rows.push(row("연간 보너스", D.cards.map(function (c) {
      return c.id === "manufaktur" ? "3만 마일" : c.id === "exclusive" ? "6천 마일" : "—";
    })));

    rows.push(group("연간 기프트 (1개 택 1)"));
    rows.push(row("선택 가능", D.cards.map(function (c) { return esc(c.gift); })));
    rows.push(row("2차 주기 조건", D.cards.map(function (c) { return esc(c.giftSecond); })));

    rows.push(group("주유 · 충전"));
    rows.push(row("주유", D.cards.map(function (c) { return esc(c.fuel) + "/L"; })));
    rows.push(row("전기차 충전", D.cards.map(function (c) { return "최대 " + esc(c.charge); })));
    rows.push(row("Energy 월 한도", D.cards.map(function (c) { return esc(c.energyCap); })));

    rows.push(group("생활 · 라운지"));
    rows.push(row("벤츠 스토어", D.cards.map(function (c) { return esc(c.store); })));
    rows.push(row("쿠팡", D.cards.map(function (c) { return esc(c.coupang); })));
    rows.push(row("배달 앱", D.cards.map(function (c) { return esc(c.delivery); })));
    rows.push(row("카카오 T", D.cards.map(function (c) { return esc(c.kakaoT); })));
    rows.push(row("공항 라운지", D.cards.map(function (c) { return esc(c.lounge); })));
    rows.push(row("메탈 플레이트", D.cards.map(function (c) { return esc(c.metal); })));
    rows.push(row("국제 브랜드", D.cards.map(function (c) { return esc(c.network); })));

    tableEl.innerHTML = head + rows.join("");
  }

  /* ---------- 한도·신청 링크 ---------- */
  function renderLimits() {
    if (!limitEl) return;
    limitEl.innerHTML = D.limitLinks.map(function (l, i) {
      return '<a class="lim-link" href="' + esc(l.href) + '" target="_blank" rel="noopener">' +
        '<span class="lim-no">0' + (i + 1) + "</span>" +
        '<span class="lim-t">' + esc(l.t) + "</span>" +
        '<span class="lim-d">' + esc(l.d) + "</span>" +
        '<span class="lim-go" aria-hidden="true">↗</span></a>';
    }).join("") + '<a class="lim-link lim-link--info" href="' + esc(D.productInfo) + '" target="_blank" rel="noopener">' +
      '<span class="lim-no">04</span><span class="lim-t">신한카드 상품안내</span>' +
      '<span class="lim-d">카드별 상세 조건·약관을 신한카드 벤츠 전용 페이지에서 확인합니다.</span>' +
      '<span class="lim-go" aria-hidden="true">↗</span></a>';
  }

  /* ---------- 시뮬레이터 ---------- */
  function parseAmount(v) {
    var n = Number(String(v).replace(/[^0-9]/g, ""));
    return isNaN(n) ? 0 : Math.min(n, 999999999);
  }

  function comma(v) {
    return Number(v).toLocaleString("ko-KR");
  }

  function calc(A) {
    return D.cards.map(function (c) {
      var first = A * c.rate.first / 100;
      var max = A * c.rate.max / 100;
      var miles = c.mile ? Math.floor(A / c.mile) : 0;
      var mileWon = miles * 15;
      return {
        c: c, first: first, max: max, miles: miles, mileWon: mileWon,
        net: first - c.fee.overseas
      };
    });
  }

  function renderResults() {
    if (!resultsEl || !amountInput) return;
    var A = parseAmount(amountInput.value);
    if (A < 100000) A = 100000;

    if (hintEl) hintEl.textContent = wonShort(A) + " 결제 기준";

    var res = calc(A);
    var bestNet = Math.max.apply(null, res.map(function (r) { return r.first - r.c.fee.overseas; }));
    var bestMax = Math.max.apply(null, res.map(function (r) { return r.max; }));

    resultsEl.innerHTML = res.map(function (r) {
      var c = r.c;
      var badge = "";
      if (r.net === bestNet) badge = '<span class="sim-badge">첫 달 실속 1위</span>';
      else if (r.max === bestMax) badge = '<span class="sim-badge sim-badge--alt">최대 할인 1위</span>';

      return '<article class="sim-card">' +
        '<header class="sim-card-h"><h4>' + esc(c.ko) + "</h4>" +
          '<p class="sim-fee">연회비 ' + wonShort(c.fee.overseas) + "</p>" + badge + "</header>" +
        '<dl class="sim-stats">' +
          '<div class="sim-stat sim-stat--main"><dt>발급 첫 달 할인 <i>' + c.rate.first + "%</i></dt><dd>" + won(r.first) + "</dd></div>" +
          "<div class=\"sim-stat\"><dt>최대 할인 <i>300만원 이상 " + c.rate.max + "%</i></dt><dd>" + won(r.max) + "</dd></div>" +
          (c.mile
            ? '<div class="sim-stat"><dt>스카이패스형 <i>1,500원당 1마일</i></dt><dd>' + r.miles.toLocaleString("ko-KR") + "마일" +
              '<span class="sim-sub">참고 환산 약 ' + wonShort(r.mileWon) + "</span></dd></div>"
            : '<div class="sim-stat"><dt>스카이패스형</dt><dd class="sim-none">선택 불가 · 할인형만</dd></div>') +
          '<div class="sim-stat"><dt>연회비 차감 후</dt><dd class="' + (r.net > 0 ? "is-plus" : "is-minus") + '">' + (r.net > 0 ? "+" : "") + won(r.net) + "</dd></div>" +
        "</dl></article>";
    }).join("");

    renderInstall(A);
  }

  function renderInstall(A) {
    if (!installOut || !monthsSel) return;
    var n = Number(monthsSel.value);
    var row = null;
    D.installments.forEach(function (x) { if (x.m === n) row = x; });
    if (!row) row = D.installments[2];
    var i = row.r / 100 / 12;
    var monthly = A * i / (1 - Math.pow(1 + i, -n));
    var total = monthly * n;
    installOut.innerHTML = "월 약 <b>" + won(monthly) + "</b> · " + n + "개월 총 " + won(total) +
      " <span>(총 이자 " + won(total - A) + " · 연 " + row.r + "%)</span>";
  }

  function setAmount(v, fromRange) {
    if (!amountInput) return;
    var A = Math.max(0, Math.min(999999999, Number(v) || 0));
    amountInput.value = comma(A);
    if (rangeInput) rangeInput.value = String(Math.min(A, Number(rangeInput.max)));
    if (rangeInput) rangeInput.setAttribute("aria-valuetext", wonShort(A));
    if (fromRange && hintEl) hintEl.textContent = wonShort(A) + " 결제 기준";
    renderResults();
  }

  if (amountInput) {
    amountInput.addEventListener("input", function () {
      var caretEnd = this.selectionStart === this.value.length;
      var A = parseAmount(this.value);
      this.value = comma(A);
      if (caretEnd) this.setSelectionRange(this.value.length, this.value.length);
      if (rangeInput) rangeInput.value = String(Math.min(A, Number(rangeInput.max)));
      renderResults();
    });
    amountInput.addEventListener("blur", function () {
      var A = parseAmount(this.value);
      if (A < 100000) setAmount(100000);
      else setAmount(A);
    });
  }
  if (rangeInput) {
    rangeInput.addEventListener("input", function () {
      setAmount(this.value, true);
    });
  }
  Array.prototype.forEach.call(document.querySelectorAll("[data-amount]"), function (b) {
    b.addEventListener("click", function () {
      setAmount(Number(b.getAttribute("data-amount")));
    });
  });
  if (monthsSel) monthsSel.addEventListener("change", function () { renderResults(); });

  renderPick();
  renderBrackets();
  renderTable();
  renderLimits();
  setAmount(50000000);
})();
