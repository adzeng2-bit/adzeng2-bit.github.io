/* 간편 상담 신청 — 문자 본문 자동 완성 · 복사 (모듈/fetch 미사용) */
(function () {
  var MB = window.MB || (window.MB = {});

  function val(form, name) {
    var el = form.querySelector('[name="' + name + '"]');
    if (!el) return "";
    var v = String(el.value || "").replace(/\s+/g, " ").trim();
    if (el.tagName === "SELECT" && (v === "미정" || v === "선택해 주세요")) return "";
    return v;
  }

  function labelFor(form, name, fallback) {
    var el = form.querySelector('[name="' + name + '"]');
    if (!el) return fallback;
    return el.getAttribute("data-field-label") || fallback;
  }

  MB.buildConsultBody = function (form) {
    var model = form.getAttribute("data-model") || "";
    var lines = [];
    lines.push("[벤츠 상담] 임정빈 차장님께");
    lines.push("");
    if (model) lines.push("문의: " + model);

    var pick = val(form, "trim");
    if (pick) lines.push(labelFor(form, "trim", "관심 트림") + ": " + pick);

    var method = val(form, "method");
    if (method) lines.push(labelFor(form, "method", "구매 방법") + ": " + method);

    var name = val(form, "name");
    if (name) lines.push("성함: " + name);
    var phone = val(form, "phone");
    if (phone) lines.push("연락처: " + phone);

    var memo = val(form, "memo");
    var memo2 = val(form, "memo2");
    if (memo2) memo = memo ? memo + " / " + memo2 : memo2;
    if (memo) {
      lines.push("");
      lines.push("요청: " + memo);
    }
    lines.push("");
    lines.push("(사이트 상담 신청서에서 보냅니다)");
    return lines.join("\n");
  };

  function bind(form) {
    if (form.getAttribute("data-bound") === "true") return;
    form.setAttribute("data-bound", "true");

    var status = form.querySelector("[data-form-status]");
    var copyBtn = form.querySelector("[data-copy]");

    function setStatus(msg) {
      if (status) status.textContent = msg;
    }

    function check() {
      var name = val(form, "name");
      var phone = val(form, "phone");
      if (!name) { setStatus("성함을 입력해 주세요."); return false; }
      if (phone.replace(/[^0-9]/g, "").length < 9) { setStatus("연락처를 정확히 입력해 주세요."); return false; }
      return true;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!check()) return;
      setStatus("문자 앱으로 이동합니다. 보내기 버튼을 눌러 전송해 주세요.");
      window.location.href = MB.smsHref(MB.buildConsultBody(form));
    });

    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        if (!check()) return;
        MB.copy(MB.buildConsultBody(form), function (ok) {
          setStatus(ok
            ? "문의 내용을 복사했습니다. 문자 앱에 붙여넣어 보내 주세요."
            : "복사가 되지 않았습니다. 010-8792-1080 으로 직접 문자 주세요.");
        });
      });
    }
  }

  function init() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-consult-form]"), bind);
  }

  MB.initConsult = init;
  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
