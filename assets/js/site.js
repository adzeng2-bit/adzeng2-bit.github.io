/* 임정빈 차장 · 벤츠 안내 사이트 — 공통 스크립트 (모듈/fetch 미사용) */
(function () {
  var PHONE = "010-8792-1080";
  var PHONE_TEL = "01087921080";

  var MB = window.MB || (window.MB = {});

  MB.PHONE = PHONE;

  /* ---------- 모바일 문자 보내기 ---------- */
  MB.isIOS = function () {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  };

  MB.smsHref = function (body) {
    var text = body ? encodeURIComponent(body) : "";
    if (!text) return "sms:" + PHONE_TEL;
    /* iOS는 &body=, 안드로이드는 ?body= 를 사용한다. */
    return "sms:" + PHONE_TEL + (MB.isIOS() ? "&" : "?") + "body=" + text;
  };

  MB.goSms = function (body) {
    window.location.href = MB.smsHref(body);
  };

  /* ---------- 클립보드 복사 ---------- */
  MB.copy = function (text, done) {
    var ok = function () { if (done) done(true); };
    var fail = function () {
      try {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.top = "-1000px";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        ta.setSelectionRange(0, text.length);
        var r = document.execCommand("copy");
        document.body.removeChild(ta);
        if (done) done(!!r);
      } catch (e) {
        if (done) done(false);
      }
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(ok, fail);
    } else {
      fail();
    }
  };

  /* ---------- 상단 메뉴 바 (가로 스크롤 · 현재 페이지 위치 노출) ---------- */
  MB.initNavBar = function () {
    var nav = document.querySelector("[data-nav]");
    var list = document.querySelector("[data-nav-list]");
    if (!nav || !list) return;

    var sync = function () {
      var more = list.scrollWidth - list.clientWidth - list.scrollLeft > 2;
      nav.setAttribute("data-more", more ? "true" : "false");
    };

    var reveal = function () {
      if (list.scrollWidth <= list.clientWidth + 2) return;
      var cur = list.querySelector('[aria-current="page"]');
      if (!cur) return;
      var offset = cur.getBoundingClientRect().left - list.getBoundingClientRect().left;
      var centered = offset - (list.clientWidth - cur.offsetWidth) / 2;
      list.scrollLeft = Math.max(0, Math.min(centered, list.scrollWidth - list.clientWidth));
    };

    list.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", function () { reveal(); sync(); });
    reveal();
    sync();
  };

  /* ---------- 등장 애니메이션 ---------- */
  MB.initReveal = function () {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      Array.prototype.forEach.call(items, function (el) { el.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("is-in");
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
    Array.prototype.forEach.call(items, function (el) { io.observe(el); });
  };

  MB.initYear = function () {
    Array.prototype.forEach.call(document.querySelectorAll(".js-year"), function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  };

  /* ---------- 전화번호 링크가 없는 곳 보정 ---------- */
  MB.initCallLinks = function () {
    Array.prototype.forEach.call(document.querySelectorAll("[data-sms-default]"), function (el) {
      el.setAttribute("href", MB.smsHref(""));
    });
  };

  MB.init = function () {
    MB.initNavBar();
    MB.initReveal();
    MB.initYear();
    MB.initCallLinks();
  };

  if (document.readyState !== "loading") {
    MB.init();
  } else {
    document.addEventListener("DOMContentLoaded", MB.init);
  }
})();
