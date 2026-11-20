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
      : "HS효성더클래스 통합옵션표 기준 금액이며, 실제 판매 가격은 옵션·색상·구매 방법에 따라 달라집니다.";
  }

  var img = $("#m-image");
  if (img) {
    if (model.image) {
      img.src = model.image;
      img.alt = "메르세데스-벤츠 " + model.name + " 공식 차량 이미지";
    } else {
      var media = img.parentNode;
      if (media) {
        media.className += " m-media--empty";
        media.innerHTML = '<span class="m-media-empty"><b>' + esc(model.name) + '</b><i>차량 사진 준비 중</i></span>';
      }
    }
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
    trimNote.innerHTML = "가격은 <b>HS효성더클래스 통합옵션표(2026.11.16)</b> 기준 금액입니다. " +
      "옵션·색상·구매 방법에 따라 실제 조건이 달라지며, 최종 가격은 계약 시점 기준으로 다시 확인해 드립니다.";
  }

  /* 트림별 옵션·사양 (통합옵션표) */
  var OPT = (window.MB_OPTIONS || {})[model.id] || [];
  var optEl = $("#m-options");
  var optNote = $("#m-options-note");

  function optLines(title, lines) {
    if (!lines || !lines.length) return "";
    return '<div class="opt-block"><h4>' + esc(title) + '</h4><ul class="opt-lines">' +
      lines.map(function (l) { return "<li>" + esc(l) + "</li>"; }).join("") + "</ul></div>";
  }

  function optCats(title, pairs) {
    if (!pairs || !pairs.length) return "";
    return '<div class="opt-block"><h4>' + esc(title) + '</h4><dl class="opt-cats">' +
      pairs.map(function (p) { return "<dt>" + esc(p[0]) + "</dt><dd>" + esc(p[1]) + "</dd>"; }).join("") +
      "</dl></div>";
  }

  function optBase(title, cats) {
    if (!cats || !cats.length) return "";
    return optCats(title, cats.map(function (c) { return [c[0], c[1]]; }));
  }

  function optTrimBody(t, sh) {
    var cm = sh.common || {};
    var html = "";
    html += optLines("엔진 · 성능", t.eng || cm.eng);
    html += optLines("크기", t.size || cm.size);
    var pairs = [];
    if (t.opt || cm.opt) pairs.push(["옵션가", t.opt || cm.opt]);
    if (t.ext) pairs.push(["외장", t.ext]);
    if (t.int) pairs.push(["내장 · 트림", t.int]);
    if (t.susp) pairs.push(["서스펜션", t.susp]);
    if (t.wheel) pairs.push(["휠", t.wheel]);
    html += optCats("옵션가 · 사양", pairs);
    if (t.base) html += optBase("기본 사항", t.base);
    if (t.extra && t.extra.length) {
      html += '<div class="opt-block"><h4>추가 사항</h4><ul class="opt-chips">' +
        t.extra.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div>";
    }
    return html || '<p class="opt-none">이 트림의 세부 사양은 상담 시 옵션표로 확인해 드립니다.</p>';
  }

  function normName(v) {
    return String(v || "").toLowerCase().replace(/[\s·]/g, "").replace(/^mercedes-?amg/, "").replace(/^mercedes-?maybach/, "");
  }
  var OFFICIAL = {};
  (model.trims || []).forEach(function (t) { OFFICIAL[normName(t.n)] = t.price; });

  if (optEl) {
    if (!OPT.length) {
      var sec = document.getElementById("options");
      if (sec) sec.hidden = true;
      var navOpt = document.querySelector('.subnav-item[href="#options"]');
      if (navOpt) navOpt.hidden = true;
      /* 옵션 섹션이 없으면 뒤 섹션 번호를 하나씩 당긴다 (03 → 02 …) */
      var seqNo = 0;
      Array.prototype.forEach.call(document.querySelectorAll(".eyebrow"), function (el) {
        var m = /^(0\d)(\s*—)(.*)$/.exec(el.textContent);
        if (!m) return;
        var host = el.closest ? el.closest("[hidden]") : null;
        if (host) return;
        seqNo += 1;
        el.textContent = (seqNo < 10 ? "0" + seqNo : String(seqNo)) + m[2] + m[3];
      });
    } else {
      var ohtml = "";
      OPT.forEach(function (sh, si) {
        var n = sh.trims.length;
        ohtml += '<div class="opt-sheet">' +
          '<div class="opt-head"><span class="opt-my">' + esc(sh.my) + '</span>' +
          "<h3>" + esc(sh.title) + "</h3>" +
          '<span class="opt-count">트림 ' + n + "개</span></div>";
        if (sh.common && sh.common.base) {
          ohtml += '<details class="opt-common"><summary><span class="on">기본 사항 — 전 트림 공통</span>' +
            '<span class="oi"></span></summary><div class="opt-body">' +
            optBase("기본 사항", sh.common.base) + "</div></details>";
        }
        ohtml += '<div class="opt-list">';
        sh.trims.forEach(function (t, i) {
          var open = (si === 0 && i === 0 && n <= 3) ? " open" : "";
          var offPrice = t.price || OFFICIAL[normName(t.name)] || "";
          ohtml += '<details class="opt-trim"' + open + '><summary>' +
            '<span class="on">' + esc(t.name) + "</span>" +
            '<span class="op">' + esc(offPrice) + "</span>" +
            '<span class="oi" aria-hidden="true"></span></summary>' +
            '<div class="opt-body">' + optTrimBody(t, sh) + "</div></details>";
        });
        ohtml += "</div></div>";
      });
      optEl.innerHTML = ohtml;
      if (optNote) {
        optNote.innerHTML = "금액은 위 <b>트림·가격</b>과 같은 기준(HS효성더클래스 통합옵션표 2026.11.16)입니다. " +
          "실제 출고 사양과 조건은 계약 시점 기준으로 다시 확인해 드립니다.";
      }
    }
  }

  /* 제원·색상 */
  var SPECS = window.MB_SPECS || {};
  var spec = SPECS[model.id];
  var specEl = $("#m-spec");
  var colorsEl = $("#m-colors");
  var specNote = $("#m-spec-note");

  var SPEC_ROWS = [
    ["engine", "엔진·모터"],
    ["disp", "배기량"],
    ["battery", "배터리 용량"],
    ["power", "최고출력"],
    ["torque", "최대토크"],
    ["trans", "변속기"],
    ["drive", "구동 방식"],
    ["accel", "0 → 100km/h"],
    ["top", "최고속도"],
    ["eff", "복합연비"],
    ["cityHigh", "도심 / 고속 연비"],
    ["range", "1회 충전 주행거리"],
    ["co2", "CO₂ 배출"],
    ["weight", "공차중량"],
    ["size", "전장 × 전폭 × 전고"],
    ["wheelbase", "휠베이스"]
  ];

  function splitToCats(value, cats) {
    if (value == null) return null;
    var parts = String(value).split(" · ");
    return parts.length === cats.length ? parts : [String(value)];
  }

  if (specEl) {
    var cats = (spec && spec.cats && spec.cats.length) ? spec.cats : [];
    var rows = [];

    SPEC_ROWS.forEach(function (row) {
      var key = row[0];
      var label = row[1];
      var values = null;

      if (key === "cityHigh" && spec) {
        var cities = splitToCats(spec.city, cats.length ? cats : [""]);
        var highs = splitToCats(spec.high, cats.length ? cats : [""]);
        if (cities && highs) {
          values = cities.map(function (c, i) {
            var h = highs[i] == null ? "—" : String(highs[i]).replace(/\s*km\/ℓ/, "");
            return String(c).replace(/\s*km\/ℓ/, "") + " / " + h + "km/ℓ";
          });
        }
      } else if (spec && spec[key] != null && String(spec[key]).length) {
        values = splitToCats(spec[key], cats.length ? cats : [""]);
      }

      if (!values || !values.length) return;
      values = values.map(function (v) { return String(v).replace(/^복합\s*/, ""); });
      rows.push({ label: label, values: values });
    });

    if (rows.length) {
      var html = '<div class="spec-wrap"><div class="spec-rows">';
      rows.forEach(function (r) {
        html += '<div class="spec-row"><div class="spec-key">' + esc(r.label) + '</div><div class="spec-vals">';
        r.values.forEach(function (v, i) {
          var catName = (cats.length > 1 && cats.length === r.values.length && cats[i]) ? cats[i] : "";
          html += '<div class="spec-val">' + (catName ? '<span class="sv-cat">' + esc(catName) + '</span>' : "") +
            '<span class="sv-num">' + esc(v) + "</span></div>";
        });
        html += "</div></div>";
      });
      html += "</div></div>";
      specEl.innerHTML = html;
    } else {
      specEl.innerHTML = '<div class="spec-empty">이 차종의 세부 제원은 메르세데스-벤츠 코리아 공식 카탈로그·보도자료에서 확인되지 않았습니다.<br>' +
        "최신 제원표는 상담 시 문자로 보내드립니다.</div>";
    }

    if (specNote) {
      specNote.textContent = (spec && spec.src)
        ? "출처 · " + spec.src + ". 인증용 차량 기준 제원으로 실제 출고 차량과 다를 수 있으며, 연식·트림에 따라 달라집니다."
        : "제원은 계약 시점의 공식 자료로 다시 확인해 드립니다.";
    }
  }

  if (colorsEl) {
    var ext = (spec && spec.colorsExt && spec.colorsExt.length) ? spec.colorsExt : null;
    var int = (spec && spec.colorsInt && spec.colorsInt.length) ? spec.colorsInt : null;
    if (ext || int) {
      var ch = '<h3 class="spec-subhead">주요 색상</h3><div class="color-grid">';
      if (ext) {
        ch += '<div class="color-col"><h4>외장</h4><ul class="color-list">';
        ext.forEach(function (c) { ch += "<li>" + esc(c) + "</li>"; });
        ch += "</ul></div>";
      }
      if (int) {
        ch += '<div class="color-col"><h4>내장</h4><ul class="color-list">';
        int.forEach(function (c) { ch += "<li>" + esc(c) + "</li>"; });
        ch += "</ul></div>";
      }
      ch += "</div>";
      colorsEl.innerHTML = ch;
    }
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
      var media = m.card
        ? '<img src="' + esc(m.card) + '" alt="' + esc(m.name) + ' 공식 차량 이미지" loading="lazy" decoding="async">'
        : '<span class="rel-media-empty"><b>' + esc(m.name) + '</b></span>';
      return '<a class="rel-card" href="model.html?id=' + encodeURIComponent(m.id) + '">' +
        media +
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
