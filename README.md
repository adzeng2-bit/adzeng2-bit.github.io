# 임정빈 차장 · HS효성더클래스 분당 — 고객 안내 사이트

정적 HTML/CSS/JS로만 만든 2페이지 사이트입니다. 빌드 도구 없이 `site/` 폴더를 그대로 올리면 동작합니다.

## 파일 구성

```
site/
├─ index.html              메인 (프로필·쇼케이스·라인업·상담 안내)
├─ glc-electric.html       GLC 300 4MATIC Electric 상세 가이드
├─ assets/
│  ├─ css/style.css        공통 스타일 (두 페이지가 함께 사용)
│  ├─ js/index.js          메인: 등장 애니메이션, 연도 표시
│  ├─ js/glc.js            상세: 트림 토글, 색상 조합기, 조합 복사
│  └─ favicon.svg
└─ README.md
```

모든 내부 링크·에셋은 상대 경로입니다. (`index.html`, `glc-electric.html`, `assets/...`)

## GitHub Pages 배포

1. `site/` 폴더 내용을 저장소 루트(또는 `docs/`)에 올립니다.
2. 저장소 **Settings → Pages → Source**에서 브랜치와 폴더를 선택합니다.
3. `https://<아이디>.github.io/<저장소>/index.html` 로 열립니다.

`site/` 폴더 자체를 루트로 올리면 `index.html`이 자동으로 첫 화면이 됩니다.

## 자주 고칠 곳

**프로필 사진 교체** — `index.html`의 `id="profile-photo"` 블록 안 주석을 풀고 `.profile-monogram` 블록을 지웁니다.

```html
<div class="profile-photo" id="profile-photo">
  <img src="assets/photo/profile.jpg" alt="임정빈 차장" loading="lazy">
</div>
```

사진은 세로 4:5 비율(예: 800×1000px)을 권장합니다. `object-fit: cover`로 잘려 들어가며, 얼굴 위치는 `.profile-photo img`의 `object-position`으로 조정합니다.

**가격·제원 수정** — `glc-electric.html` 본문(표·제원 카드)과 `assets/js/glc.js`의 `TRIMS`(가격·실내 장식재) 두 곳을 함께 고쳐야 화면이 어긋나지 않습니다.

**색상 추가** — `assets/js/glc.js`의 `EXTERIOR` / `INTERIOR` 배열에 항목을 추가하면 목록과 미리보기가 자동으로 반영됩니다.

**폰트** — Pretendard(CDN) + Marcellus(Google Fonts)를 불러옵니다. 외부 요청이 막힌 환경에서는 시스템 폰트로 자동 대체되며 레이아웃은 유지됩니다.

## 확인해 둔 동작

- 카카오톡 인앱 브라우저(iOS WKWebView / Android WebView) 기준으로 `position: sticky`, `aspect-ratio`, CSS 변수, `IntersectionObserver`만 사용했습니다. (모듈·fetch·외부 API 없음)
- 화면 폭 760px 이하에서 하단 고정 상담 바(전화/문자)가 나타납니다. `env(safe-area-inset-bottom)`으로 아이폰 홈 인디케이터를 피합니다.
- 링크: 전화 `tel:010-8792-1080`, 문자 `sms:010-8792-1080`.
- 조합 복사는 `navigator.clipboard` → 실패 시 `execCommand('copy')` 순서로 시도합니다.
- 자바스크립트가 꺼져 있어도 본문과 표는 그대로 읽히고, 트림은 AMG Line 기준으로 표시됩니다.

## 안내 문구 기준

가격·제원은 2026년 11월 기준 참고 자료이며, 페이지 하단에 "최종 조건은 공식 가이드 우선" 문구를 넣어 두었습니다. 계약·출고 안내 시에는 최신 가이드로 다시 확인해 주세요.
