/* 차종 상세 페이지 — model.html?id=... (모듈/fetch 미사용) */
(function () {
  var DATA = window.MB_DATA;
  if (!DATA || !DATA.models) return;

  var CAT_LABEL = {};
  DATA.categories.forEach(function (c) { CAT_LABEL[c.id] = c.label; });

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function qs(name) {
    var m = new RegExp("[?&]" + name + "=([^&]*)").exec(window.location.search);
    return m ? decodeURIComponent(m[1].replace(/\+/g, " ")) : "";
  }

  var id = qs("id");
  var model = null;
  for (var i = 0; i < DATA.models.length; i++) {
    if (DATA.models[i].id === id) { model = DATA.models[i]; break; }
  }

  var $ = function (sel) { return document.querySelector(sel); };

  if (!model) {
    document.title = "차종을 찾을 수 없습니다 | 임정빈 차장";
    var root = $("#model-root");
    if (root) {
      root.innerHTML = '<section class="section"><div class="wrap">' +
        '<h1 class="sec-title">차종을 찾을 수 없습니다.</h1>' +
        '<p class="sec-lead">주소가 바뀌었거나 없는 차종입니다. 전체 라인업에서 다시 선택해 주세요.</p>' +
        '<div class="form-actions" style="margin-top:26px">' +
        '<a class="btn" href="models.html">전체 라인업 보기</a>' +
        '<a class="btn btn--ghost" href="tel:010-8792-1080">전화 상담</a></div>' +
        '</div></section>';
    }
    return;
  }

  function setText(sel, text) {
    var el = $(sel);
    if (el) el.textContent = text;
  }

  var yearLine = model.year;
  var fuelLine = (model.fuel || []).join(" · ");
  var subLine = [model.brandLabel, CAT_LABEL[model.cat] || "", fuelLine, yearLine]
    .filter(Boolean).join(" · ");

  document.title = model.name + " 가격·트림 안내 | 임정빈 차장 · HS효성더클래스 분당";

  setText("#crumb-name", model.name);
  setText("#m-brand", model.brandLabel);
  setText("#m-name", model.name);
  setText("#m-sub", subLine);
  setText("#m-intro", model.intro);
  setText("#m-price", model.priceFromLabel);

  var priceNote = $("#m-price-note");
  if (priceNote) {
    priceNote.textContent = model.priceNote
      ? model.priceNote
      : "공식 권장소비자가격 기준이며, 실제 판매 가격은 옵션·색상·구매 방법에 따라 달라집니다.";
  }

  var img = $("#m-image");
  if (img) {
    img.src = model.image;
    img.alt = "메르세데스-벤츠 " + model.name + " 공식 차량 이미지";
  }

  /* 상단 칩 */
  var chips = $("#m-chips");
  if (chips) {
    var chipsHtml = [];
    chipsHtml.push('<span class="m-chip">' + esc(CAT_LABEL[model.cat] || "") + "</span>");
    (model.fuel || []).forEach(function (f) { chipsHtml.push('<span class="m-chip">' + esc(f) + "</span>"); });
    chipsHtml.push('<span class="m-chip">' + esc(model.year) + "</span>");
    if ((model.trims || []).length) chipsHtml.push('<span class="m-chip">트림 ' + model.trims.length + "개</span>");
    chips.innerHTML = chipsHtml.join("");
  }

  /* 트림 표 */
  var trimsEl = $("#m-trims");
  if (trimsEl) {
    if (model.trims && model.trims.length) {
      trimsEl.innerHTML = model.trims.map(function (t) {
        return '<div class="trim-row">' +
          '<div><div class="tn">' + esc(t.n) + '</div><div class="ty">' + esc(t.y) + "</div></div>" +
          '<div class="tp">' + esc(t.price) + "</div>" +
          "</div>";
      }).join("");
    } else {
      trimsEl.innerHTML = '<div class="trim-row"><div><div class="tn">공식 가격표에 표기된 트림이 없습니다</div>' +
        '<div class="ty">재고와 가격은 상담으로 확인해 드립니다</div></div>' +
        '<div class="tp">개별 견적</div></div>';
    }
  }

  var trimNote = $("#m-trim-note");
  if (trimNote) {
    trimNote.innerHTML = "가격은 <b>메르세데스-벤츠 코리아 공식 차량 가격표(2026.11.17)</b> 기준 권장소비자가격입니다. " +
      "옵션·색상·구매 방법에 따라 실제 조건이 달라지며, 최종 가격은 계약 시점 기준으로 다시 확인해 드립니다.";
  }

  /* 차종 포인트 */
  var pointsEl = $("#m-points");
  if (pointsEl) {
    pointsEl.innerHTML = (model.points || []).map(function (p) {
      return "<li><span>" + esc(p) + "</span></li>";
    }).join("");
  }

  /* 관련 차종 — 같은 분류에서 가격이 가까운 순 */
  var relEl = $("#m-related");
  if (relEl) {
    var base = model.priceFrom || 0;
    var rel = DATA.models.filter(function (m) {
      return m.id !== model.id && m.cat === model.cat;
    }).sort(function (a, b) {
      var da = Math.abs((a.priceFrom || 0) - base);
      var db = Math.abs((b.priceFrom || 0) - base);
      return da - db;
    }).slice(0, 4);

    relEl.innerHTML = rel.map(function (m) {
      return '<a class="rel-card" href="model.html?id=' + encodeURIComponent(m.id) + '">' +
        '<img src="' + esc(m.card) + '" alt="' + esc(m.name) + ' 공식 차량 이미지" loading="lazy" decoding="async">' +
        "<b>" + esc(m.name) + "</b>" +
        "<span>" + esc(m.priceFromLabel) + "</span>" +
        "</a>";
    }).join("");
  }

  /* 상담 폼 기본값 */
  var form = document.querySelector("[data-consult-form]");
  if (form) {
    form.setAttribute("data-model", model.name + " (" + (CAT_LABEL[model.cat] || "") + ")");
    var memo = form.querySelector('[name="memo"]');
    if (memo) memo.placeholder = "예: " + model.name + " 견적과 재고가 궁금합니다. 다음 주 시승도 가능할까요?";
  }

  setText("#m-contact-title", model.name + ",\n얼마에 나올까요.");
  var ct = $("#m-contact-title");
  if (ct) ct.innerHTML = esc(model.name) + ",<br>얼마에 나올까요.";

  /* 서브내비 현재 위치 표시 */
  var items = document.querySelectorAll(".subnav-item");
  if ("IntersectionObserver" in window && items.length) {
    var map = {};
    Array.prototype.forEach.call(items, function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          Array.prototype.forEach.call(items, function (a) { a.removeAttribute("aria-current"); });
          if (map[en.target.id]) map[en.target.id].setAttribute("aria-current", "true");
        }
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    Object.keys(map).forEach(function (k) {
      var sec = document.getElementById(k);
      if (sec) io.observe(sec);
    });
  }
})();
