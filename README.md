# 임정빈 차장 · HS효성더클래스 분당 — 고객 안내 사이트

정적 HTML/CSS/JS 사이트입니다. 빌드 도구 없이 `site/` 폴더를 그대로 올리면 동작합니다.
(현재 `adzeng2-bit/adzeng2-bit.github.io` 저장소 루트로 배포되어 있습니다.)

## 파일 구성

```
site/
├─ index.html            메인 (프로필·전기 GLC/CLA 계약·신차/사전예약·차종별 가이드·상담 연결)
├─ models.html           차종별 가이드 (분류 탭 + 실시간 검색)
├─ model.html            차종 상세 템플릿 — model.html?id=<차종 id>
├─ benefits.html         구 링크 호환용 (자동 이동)
├─ glc-electric.html     GLC 300 4MATIC Electric 상세 가이드
├─ assets/
│  ├─ css/style.css      공통 스타일 (모든 페이지가 함께 사용)
│  ├─ js/models-data.js  차종 데이터 (가격·트림·이미지·설명)
│  ├─ js/site.js         공통: 드로어 메뉴, 등장 애니메이션, 문자 링크, 클립보드
│  ├─ js/models-page.js  라인업 탭·검색
│  ├─ js/model-page.js   차종 상세 렌더
│  ├─ js/consult.js      상담 신청서 → 문자 본문 자동 완성 / 복사
│  ├─ js/benefits.js     구매가이드 페이지 (차종 셀렉트, 목차)
│  ├─ js/index.js        메인 등장 애니메이션
│  ├─ js/glc.js          GLC Electric: 트림 토글, 색상 조합기
│  ├─ img/models/        차종별 공식 이미지 (원본 + -card 축소본)
│  └─ favicon.svg
└─ README.md
```

모든 내부 링크·에셋은 상대 경로입니다. JS는 모듈·fetch를 쓰지 않고 전역 객체(`window.MB_DATA`, `window.MB`)만 사용합니다.

## 차종 추가·수정

`assets/js/models-data.js` 한 곳만 고치면 라인업·검색·상세·상담 폼에 모두 반영됩니다.

```js
{
  id: "glc",                       // model.html?id=glc
  name: "GLC", ko: "GLC",
  brand: "mb",                     // mb | amg | maybach
  brandLabel: "메르세데스-벤츠",
  cat: "suv",                      // sedan | suv | hatchback | coupe | cabriolet | mpv
  fuel: ["가솔린", "디젤"],
  year: "26·27년식",
  image: "assets/img/models/glc.jpg",        // 상세 상단 (1440px)
  card: "assets/img/models/glc-card.jpg",    // 카드 (800px)
  intro: "…", points: ["…", "…"],
  trims: [{ n: "GLC 300 4MATIC AMG Line", p: 92500000, price: "9,250만원", y: "26년식" }],
  priceFrom: 77000000, priceFromLabel: "7,700만원~",
  priceNote: null,                 // 가격 미확인 모델은 사유를 적는다
  official: "https://www.mercedes-benz.co.kr/passengercars/models/suv/glc/overview.html"
}
```

- `cat` 값이 잘못되면 분류 탭에서 빠지고 "전체"에만 나옵니다.
- `trims`가 비어 있으면 목록에 "개별 견적 상담"으로 표시되고, `priceNote`에 사유를 적습니다.
- 새 차종을 넣으면 이미지 두 장을 `assets/img/models/`에 추가해야 합니다.
- 메인(`index.html`)의 분류별 개수 표기는 수동 값이므로, 차종 수가 바뀌면 함께 고칩니다.

## 가격 기준

`models-data.js`의 가격은 **메르세데스-벤츠 코리아 공식 차량 가격표(2026.11.17)** 의 권장소비자가격을 트림 단위로 옮긴 것입니다.
공식 가격표에 없는 모델(예: CLA 쿠페)은 금액을 비우고 "개별 견적 상담"으로 표시합니다. **확인되지 않은 금액이나 제원은 임의로 적지 않습니다.**

## 이미지

`assets/img/models/*.jpg`는 `mercedes-benz.co.kr` 모델 페이지가 사용하는 메르세데스-벤츠 공식 차량 이미지(asia/KR)를
내려받아 배경(`#F6F4EF`)에 합성하고, 원본(최대 1440px)과 카드용(800px) 두 크기로 저장한 것입니다.
같은 차종이라도 연식·트림에 따라 실제 차량과 다를 수 있습니다. 딜러·제3자 사이트 이미지는 사용하지 않았습니다.

## 확인해 둔 동작

- 카카오톡 인앱 브라우저(iOS WKWebView / Android WebView) 기준으로 `position: sticky`, `aspect-ratio`, CSS 변수, `IntersectionObserver`만 사용했습니다. (모듈·fetch·외부 API 없음)
- 상단 메뉴(9개 항목)는 모바일에서도 항상 노출되며, 폭이 좁으면 바 안에서만 가로 스크롤됩니다(현재 페이지는 알약형으로 강조). 760px 이하에서 하단 고정 상담 바(전화/문자)가 나타납니다. `env(safe-area-inset-bottom)`으로 아이폰 홈 인디케이터를 피합니다.
- 390 / 768 / 1440px 세 폭에서 가로 스크롤 0, 이미지 깨짐 0을 확인했습니다.
- 상담 신청서는 서버로 전송하지 않습니다. `sms:010-87921080` 링크(iOS는 `&body=`, 안드로이드는 `?body=`)로 문자 본문을 채우고, 복사 버튼은 `navigator.clipboard` → `execCommand('copy')` 순서로 시도합니다.
- 자바스크립트가 꺼져 있으면 라인업·상세 목록이 보이지 않으므로, 각 페이지에 안내 문구(`noscript`)를 넣어 두었습니다.

**프로필 사진 교체** — `index.html`의 `id="profile-photo"` 블록 안 주석을 풀고 `.profile-placeholder` 블록을 지웁니다.
사진은 세로 4:5 비율(예: 800×1000px)을 권장합니다.

**폰트** — Pretendard(CDN) + Marcellus(Google Fonts)를 불러옵니다. 외부 요청이 막힌 환경에서는 시스템 폰트로 대체되며 레이아웃은 유지됩니다.

## 페이지 구성 (2026-11-20 개편)

- `index.html` — 홈 (히어로 → 사후관리 밴드 → 전기 GLC·CLA 계약 → 상담 영역으로 마무리)
- `new-cars.html` — 신차·사전예약 (페이지 최상단에서 바로 시작, 사전예약 7종 + 전기 GLC·CLA, 상담 CTA)
- `models.html` / `model.html` — 차종별 가이드
- `glc-electric.html` — GLC Electric
- `promotion.html` — 11월 프로모션 (차종 탭 · 권장가/현금/MBF/실구매가)
- `stock.html` — 내림 (2026-11-20). 예전 링크·북마크는 홈으로 자동 이동
- `report.html` — 11월 구매전략리포트
- `cards.html` — 신한카드 3종 비교 · 결제 계산기
- `mou.html` — MOU 676개 기업 검색
- `benefits.html` — 예전 링크 호환용(자동 이동)

`_build/` 는 프로모션 표 생성 스크립트이며 배포 대상이 아니다.

## 네이버 예약 직링크 (2026-11-19 연결)

- 임정빈 차장 네이버 예약 상품: `https://m.booking.naver.com/booking/13/bizes/1471458/items/7088175`
  (업체 `HS효성더클래스 메르세데스 벤츠 분당정자 전시장`, 상품 `임정빈 차장`, 리뷰 2건)
- 버튼 위치: 메인 히어로 + 메인 `#contact`(`.contact-line`) + `new-cars.html` `.cta-band` / `promotion`·`report`·`cards`·`mou`는 `.cta-band` / `models`·`model`·`glc-electric`은 `#contact`(`.contact-line`).
- `promotion/report/cards/mou`의 버튼은 `_build/build.py`의 `NAVER_BOOKING` 상수와 `cta_band()`에서 생성되므로, 주소를 바꿀 때는 `build.py`를 고치고 다시 빌드한다. 나머지 페이지는 HTML에 직접 적혀 있다.
- 모든 버튼은 `target="_blank" rel="noopener"`로 새 창에서 네이버 예약을 연다.

