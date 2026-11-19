/* 메르세데스-벤츠 신한카드 3종 — 상품 스펙 (신한카드 상품안내 / 여신금융협회 심의필 기준, 2026-11-14 확인) */
/* 금액 단위: 원. 할인율 단위: %(국내 일시불·할부) */
window.MB_CARD_DATA = {
  updated: "2026-11-14",
  launch: "2026-04",
  cards: [
    {
      id: "avantgarde",
      name: "Avantgarde",
      ko: "아방가르드",
      tier: "엔트리",
      desc: "월 100만원 수준의 소비에 맞춘 시작 모델",
      fee: { overseas: 80000, domestic: 77000 },
      network: "Mastercard Platinum",
      rate: { first: 0.5, mid: 0.7, max: 1.2, abroad: 2 },
      mile: null,
      gift: "마이신한포인트 5만 P",
      giftSecond: "100만원 이상",
      lounge: "월 3회",
      fuel: "리터당 150원",
      charge: "20%",
      energyCap: "월 2만원",
      store: "최대 10%",
      coupang: "2%",
      delivery: "2%",
      kakaoT: "3천원 · 월 3회",
      lifestyleCap: "월 3만원",
      metal: "미제공",
      apply: "https://www.shinhancard.com/pconts/html/card/apply/family/1238016_2215.html"
    },
    {
      id: "exclusive",
      name: "Exclusive",
      ko: "익스클루시브",
      tier: "미들",
      desc: "할인형·스카이패스형을 고르는 중간 모델",
      fee: { overseas: 200000, domestic: 197000 },
      network: "Mastercard World",
      rate: { first: 0.7, mid: 1.0, max: 1.2, abroad: 3 },
      mile: 1500,
      gift: "마이신한포인트 12만 P · 신세계 12만원 · 다이닝 15만원",
      giftSecond: "300만원 이상",
      lounge: "월 3회",
      fuel: "리터당 150원",
      charge: "30%",
      energyCap: "월 3만원",
      store: "최대 20%",
      coupang: "최대 3%",
      delivery: "최대 5%",
      kakaoT: "3천원 · 월 3회",
      lifestyleCap: "월 5만원",
      metal: "유료 8만원",
      apply: "https://www.shinhancard.com/pconts/html/card/apply/family/1238021_2215.html"
    },
    {
      id: "manufaktur",
      name: "MANUFAKTUR",
      ko: "마누팍투어",
      tier: "톱",
      desc: "기프트·할인·마일리지를 가장 크게 가져가는 상위 모델",
      fee: { overseas: 700000, domestic: 697000 },
      network: "Mastercard World",
      rate: { first: 0.7, mid: 1.0, max: 1.5, abroad: 3 },
      mile: 1500,
      gift: "55만 P · 대한항공 3만 마일 · 신세계 55만원 · 호텔 60만원 · 다이닝 65만원",
      giftSecond: "700만원 이상",
      lounge: "월 5회",
      fuel: "리터당 200원",
      charge: "40%",
      energyCap: "월 5만원",
      store: "최대 50%",
      coupang: "최대 3%",
      delivery: "최대 5%",
      kakaoT: "3천원 · 월 5회",
      lifestyleCap: "월 7만원",
      metal: "기본 제공",
      apply: "https://www.shinhancard.com/pconts/html/card/apply/family/1238025_2215.html"
    }
  ],
  /* 전월 이용금액 구간별 국내 일시불·할부 할인율 (%) — 첫 칸이 발급 첫 달 실적 유예 구간 */
  brackets: [
    { label: "50만원 미만", sub: "서비스 미제공", v: [null, null, null] },
    { label: "50만~150만원", sub: "발급 첫 달 적용", v: [0.5, 0.7, 0.7] },
    { label: "150만~300만원", sub: "", v: [0.7, 1.0, 1.0] },
    { label: "300만원 이상", sub: "최대 할인", v: [1.2, 1.2, 1.5] }
  ],
  /* 벤츠 신한카드 할부 금리 (연 %) */
  installments: [
    { m: 12, r: 4.3 }, { m: 24, r: 4.4 }, { m: 36, r: 4.5 },
    { m: 48, r: 4.6 }, { m: 60, r: 4.7 }
  ],
  /* 차량대금 결제 한도 — 신한카드 마이카 신청 페이지 */
  limitLinks: [
    { t: "선입금 카드결제", d: "가상계좌에 먼저 입금해 결제 한도를 확보합니다.", href: "https://mycar.shinhancard.com/adp/ADPFM206N/ADPFM206R02.shc" },
    { t: "자동차 추가한도", d: "차량 구매용 일시 한도를 별도로 신청합니다.", href: "https://mycar.shinhancard.com/adp/ADPFM206N/ADPFM206R07.shc" },
    { t: "카드 할부 신청", d: "결제 금액을 카드 할부로 전환합니다.", href: "https://mycar.shinhancard.com/adp/ADPFM206N/ADPFM206R12.shc" }
  ],
  productInfo: "https://shcard.io/benz"
};
