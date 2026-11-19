/* 11월 프로모션 — 차종 그룹 탭 (모듈/fetch 미사용) */
(function () {
  var tabs = document.getElementById("promo-tabs");
  if (!tabs) return;
  var btns = Array.prototype.slice.call(tabs.querySelectorAll("[data-grp]"));
  var segs = Array.prototype.slice.call(document.querySelectorAll(".pv-seg[data-grp]"));

  function apply(grp, push) {
    btns.forEach(function (b) {
      b.setAttribute("aria-selected", b.getAttribute("data-grp") === grp ? "true" : "false");
    });
    segs.forEach(function (s) {
      s.hidden = !(grp === "all" || s.getAttribute("data-grp") === grp);
    });
    if (push && window.history && history.replaceState) {
      var url = grp === "e" ? location.pathname + location.search : location.pathname + location.search + "#" + grp;
      history.replaceState(null, "", url);
    }
  }

  tabs.addEventListener("click", function (e) {
    var b = e.target.closest ? e.target.closest("[data-grp]") : null;
    if (!b) return;
    apply(b.getAttribute("data-grp"), true);
    /* 탭을 고르면 표 시작 위치로 (sticky 바에 가리지 않게) */
    var first = document.querySelector('.pv-seg[data-grp="' + b.getAttribute("data-grp") + '"]') || document.querySelector(".pv-seg");
    if (first) {
      var y = first.getBoundingClientRect().top + window.pageYOffset - 130;
      window.scrollTo({ top: y > 0 ? y : 0, behavior: "smooth" });
    }
  });

  tabs.addEventListener("keydown", function (e) {
    var i = btns.indexOf(document.activeElement);
    if (i < 0) return;
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      var n = (i + (e.key === "ArrowRight" ? 1 : -1) + btns.length) % btns.length;
      btns[n].focus();
      apply(btns[n].getAttribute("data-grp"), true);
    }
  });

  /* 처음 열 때: 해시로 그룹을 지정할 수 있게 (#glc, #e ... / 구 링크 #promotion 대비) */
  var h = (location.hash || "").replace("#", "");
  var known = ["all", "e", "glc", "s", "gle", "c", "acla", "cle", "amg", "maybach", "v", "eq", "etc"];
  apply(known.indexOf(h) >= 0 ? h : "e", false);
})();
