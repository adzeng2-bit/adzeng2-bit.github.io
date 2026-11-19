/* 구매 가이드 페이지 — 차종 선택 목록 · 목차 표시 (모듈/fetch 미사용) */
(function () {
  var DATA = window.MB_DATA;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* 차종 셀렉트 채우기 */
  if (DATA && DATA.models) {
    var opts = DATA.models.map(function (m) {
      return '<option value="' + esc(m.name) + '">' + esc(m.name) + " · " + esc(m.priceFromLabel) + "</option>";
    }).join("");

    Array.prototype.forEach.call(document.querySelectorAll("[data-model-select]"), function (sel) {
      sel.innerHTML = '<option value="">아직 미정</option>' + opts;
      sel.setAttribute("data-field-label", "차종");
    });
  }

  /* 구매전략리포트 문자 CTA */
  Array.prototype.forEach.call(document.querySelectorAll("[data-sms-report]"), function (a) {
    var body = [
      "[벤츠 구매전략 리포트] 임정빈 차장님께",
      "",
      "관심 차종: ",
      "구매 시기: (11월 / 12월 / 1월 중)",
      "궁금한 점: ",
      "",
      "성함: ",
      "연락처: "
    ].join("\n");
    a.setAttribute("href", window.MB && MB.smsHref ? MB.smsHref(body) : "sms:01087921080");
  });

  /* 목차 현재 위치 */
  var nav = document.getElementById("bnav");
  if (nav && "IntersectionObserver" in window) {
    var links = Array.prototype.slice.call(nav.querySelectorAll("a"));
    var map = {};
    links.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (a) { a.removeAttribute("aria-current"); });
          var a = map[en.target.id];
          if (a) a.setAttribute("aria-current", "true");
        }
      });
    }, { rootMargin: "-25% 0px -65% 0px" });
    Object.keys(map).forEach(function (k) {
      var sec = document.getElementById(k);
      if (sec) io.observe(sec);
    });
  }
})();
