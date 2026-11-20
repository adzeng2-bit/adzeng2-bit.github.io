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
│  ├─ js/model-options.js 차종별 트림 옵션·사양 (통합옵션표 2026.11.16)
│  ├─ js/models-specs.js 차종별 공식 제원·색상
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
- 새 차종을 넣으면 이미지 두 장을 `assets/img/models/`에 추가합니다. 사진이 없으면 `image`·`card`를 빈 문자열로 두면 카드·상세 모두 "사진 준비 중" 자리표시자로 그려집니다.
- 트림별 옵션·사양은 `assets/js/model-options.js`(`window.MB_OPTIONS[차종 id] = [{my,title,trims:[...]}]`)에 들어갑니다. 한 차종에 연식별 시트를 여러 개 둘 수 있고, `common.base`는 전 트림 공통 기본 사양으로 한 번만 표시됩니다.
- 메인(`index.html`)의 분류별 개수 표기는 수동 값이므로, 차종 수가 바뀌면 함께 고칩니다.

## 트림별 옵션·사양 (통합옵션표)

`assets/js/model-options.js`는 HS효성더클래스 통합옵션표(2026.11.16, 35쪽)를 차종·트림 단위로 옮긴 데이터입니다.
`model.html`의 **02 — 옵션·사양** 섹션이 이 데이터를 아코디언으로 그립니다(기본 사항 공통 → 트림별 엔진/크기/옵션가/추가사항/휠).
트림 옆 금액은 위 트림·가격표와 **같은 금액 문자열**을 그대로 씁니다(옵션표에만 있던 트림은 트림표에도 함께 추가). 사내 작성자 이니셜·문서 코드는 넣지 않았습니다.

## 가격 기준

`models-data.js`의 가격은 **HS효성더클래스 통합옵션표(2026.11.16)** 의 트림별 금액입니다(2026-11-20 기준 통일).
이전에는 벤츠 코리아 공식 가격표(2026.11.17)를 썼는데, 두 자료의 금액이 17개 트림에서 달라 01 트림표와 02 옵션 아코디언이 서로 다른 금액을 보여 주는 문제가 있어 옵션표 기준으로 통일했습니다.

- 옵션표 시트의 트림은 같은 연식(없으면 가장 가까운 연식) 트림에 옵션표 금액을 적용합니다.
- 옵션표에만 있던 트림은 트림표에 새 줄로 추가했습니다(예: A 220 Sedan, GLS 450 d 4MATIC, GLC 53 4MATIC, E 220 d 4MATIC AVANTGARDE).
- 한 트림이 연식별 시트에서 다른 금액으로 나오면 연식별 줄을 따로 둡니다(예: AMG GT 63 S E PERFORMANCE 26/27년식).
- 옵션표가 없는 트림(예: 25년식 C 200 AMG Line, C 200 Special Edition)은 기존 가격표 금액을 그대로 둡니다. 이 트림은 02 섹션에 나오지 않으므로 두 섹션이 어긋나지 않습니다.
- 금액이 확정되지 않은 트림은 "가격 미정"으로 표시합니다.
- 옵션표 시트의 연식 표기(MY)가 기존 가격표 연식과 다른 차종(G-클래스 27MY, EQS SUV 25MY 등)은 금액만 옵션표를 따르고 연식 표기는 가격표 기준을 유지했습니다.
- 공식 가격표·옵션표 어디에도 없는 모델(예: CLA 쿠페)은 금액을 비우고 "개별 견적 상담"으로 표시합니다. **확인되지 않은 금액이나 제원은 임의로 적지 않습니다.**

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

## 검색 비공개 (2026-11-20)

1:1 전달용 사이트라 **전 페이지에 `<meta name="robots" content="noindex, nofollow">`** 를 넣었습니다.

- 직접 작성한 `index` · `models` · `model` · `new-cars` · `glc-electric` — HTML `<head>`에 직접 들어 있음
- `promotion` · `report` · `cards` · `mou` · `stock` · `benefits` — `_build/build.py`의 `head()`와 리다이렉트 템플릿에서 생성되므로, 빌드하면 자동으로 붙음
- 카카오톡 링크 공유 미리보기(`og:title` · `og:description` · `og:image`)는 그대로 동작함. `noindex`는 검색 색인만 막고 SNS 미리보기와는 무관함
- `robots.txt`로 막지 않은 이유: 크롤러가 `noindex` 메타를 읽지 못하게 되어 이미 색인된 페이지가 계속 남을 수 있음

## 네이버 예약 직링크 (2026-11-19 연결)

- 임정빈 차장 네이버 예약 상품: `https://m.booking.naver.com/booking/13/bizes/1471458/items/7088175`
  (업체 `HS효성더클래스 메르세데스 벤츠 분당정자 전시장`, 상품 `임정빈 차장`, 리뷰 2건)
- 버튼 위치: 메인 히어로 + 메인 `#contact`(`.contact-line`) + `new-cars.html` `.cta-band` / `promotion`·`report`·`cards`·`mou`는 `.cta-band` / `models`·`model`·`glc-electric`은 `#contact`(`.contact-line`).
- `promotion/report/cards/mou`의 버튼은 `_build/build.py`의 `NAVER_BOOKING` 상수와 `cta_band()`에서 생성되므로, 주소를 바꿀 때는 `build.py`를 고치고 다시 빌드한다. 나머지 페이지는 HTML에 직접 적혀 있다.
- 모든 버튼은 `target="_blank" rel="noopener"`로 새 창에서 네이버 예약을 연다.

