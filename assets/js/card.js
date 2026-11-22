/* card.html — 라인업 탭 · 명함 정보 복사 */
(function () {
  var MB = window.MB || (window.MB = {});

  /* ---------- 라인업 탭 ---------- */
  function initTabs() {
    var tabs = [].slice.call(document.querySelectorAll("[data-tab]"));
    if (!tabs.length) return;

    var select = function (id) {
      tabs.forEach(function (t) {
        var on = t.getAttribute("data-tab") === id;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
      });
      [].slice.call(document.querySelectorAll("[data-panel]")).forEach(function (p) {
        if (p.getAttribute("data-panel") === id) { p.removeAttribute("hidden"); }
        else { p.setAttribute("hidden", ""); }
      });
    };

    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(t.getAttribute("data-tab")); });
      t.addEventListener("keydown", function (e) {
        var next = null;
        if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
        if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
        if (next) {
          e.preventDefault();
          next.focus();
          select(next.getAttribute("data-tab"));
        }
      });
    });
  }

  /* ---------- 복사 ---------- */
  var toastTimer = null;
  function toast(msg) {
    var el = document.querySelector(".c-toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove("is-on"); }, 1700);
  }

  function initCopy() {
    [].slice.call(document.querySelectorAll("[data-copy]")).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var text = btn.getAttribute("data-copy");
        if (!text) return;
        var label = btn.getAttribute("data-copy-label") || "복사되었습니다";
        if (MB.copy) MB.copy(text, function (ok) { toast(ok ? label : "복사가 되지 않았습니다. 길게 눌러 선택해 주세요"); });
      });
    });
  }

  function init() {
    initTabs();
    initCopy();
  }

  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
