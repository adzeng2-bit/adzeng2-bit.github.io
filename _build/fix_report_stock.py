#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""report.html 의 어제자 재고 수치 문구를 '재고는 상담으로 확인' 중립 문구로 교체 (build.py 원본 수정)."""
import io, sys

P = 'build.py'
s = io.open(P, encoding='utf-8').read()
orig = s

R = [
 # ① 요약 카드
 ('<p>MY27 E200은 재고가 53대(EXCLUSIVE 29 · AMG Line 24) 있고, 외장·시트 조합을 원하는 대로 고를 수 있습니다. MY26 E200은 재고가 소진되어 지금은 색상을 고르는 단계입니다.</p>',
  '<p>MY27 E200은 원하는 외장·시트 조합으로 고를 수 있습니다. 트림별 재고와 색상은 상담으로 바로 확인해 드리고, MY26 E200은 남은 차량이 있는지 함께 확인해 드립니다.</p>'),
 # ③ 요약 카드
 ('<p>신형 S클래스는 즉시 출고 가능한 재고가 4대 있습니다(S 350 d 1 · S 450 Long 3). 원하시는 트림과 날짜를 알려주시면 시승 일정을 맞춰 드립니다.</p>',
  '<p>신형 S클래스는 트림별로 즉시 출고 가능한 차량이 있는지 상담으로 바로 확인해 드립니다. 원하시는 트림과 날짜를 알려주시면 시승 일정을 맞춰 드립니다.</p>'),
 # 섹션 제목
 ('<h2 class="chk-title">E200 — MY26 소진, 이제 MY27에서 색상을 고를 때</h2>',
  '<h2 class="chk-title">E200 — 연식이 바뀌는 시점, 지금은 MY27에서 색상을 고를 때</h2>'),
 # 본문 문단
 ('      MY26 E200 EXCLUSIVE는 금융 이용 시 총 20%였지만, 11월 19일 재고 기준으로 MY26 E200은 남아 있지 않습니다.',
  '      MY26 E200 EXCLUSIVE는 금융 이용 시 총 20%였던 조건입니다. MY26은 연식이 넘어가며 재고가 빠르게 줄고 있어, 남아 있는 차량과 색상은 상담으로 바로 확인해 드립니다.'),
 # 표 헤더
 ('<th scope="col">실구매가</th><th scope="col">재고</th></tr>',
  '<th scope="col">실구매가</th><th scope="col">재고·색상</th></tr>'),
 ('            <td data-label="실구매가"><span class="pv-price">63,550,000원</span></td>\n            <td data-label="재고">29대</td>',
  '            <td data-label="실구매가"><span class="pv-price">63,550,000원</span></td>\n            <td data-label="재고·색상">원하는 조합 선택</td>'),
 ('            <td data-label="실구매가"><span class="pv-price">67,230,000원</span></td>\n            <td data-label="재고">24대</td>',
  '            <td data-label="실구매가"><span class="pv-price">67,230,000원</span></td>\n            <td data-label="재고·색상">원하는 조합 선택</td>'),
 ('            <td data-label="실구매가"><span class="pv-price">62,000,000원</span></td>\n            <td data-label="재고">소진</td>',
  '            <td data-label="실구매가"><span class="pv-price">62,000,000원</span></td>\n            <td data-label="재고·색상">잔여 상담 확인</td>'),
 # 표 아래 노트
 ('색상은 원하는 조합으로 고를 수 있습니다. 희망 외장·시트 1순위와 2순위를 알려주시면 그 조합으로 후보를 잡아 드립니다.</p>',
  '색상은 원하는 조합으로 고를 수 있습니다. 희망 외장·시트 1순위와 2순위를 알려주시면 그 조합으로 후보를 잡아 드리고, 트림별 재고는 상담으로 바로 확인해 드립니다.</p>'),
 # E220d/E350e 카드
 ('<header><h3>E 220 d · E 350 e</h3><p>각 1대</p></header>',
  '<header><h3>E 220 d · E 350 e</h3><p>재고 상담 확인</p></header>'),
 ('<div><dt>E 220 d</dt><dd>장거리 주행이 많다면 디젤. 4MATIC EXCLUSIVE 1대 남았습니다.</dd></div>',
  '<div><dt>E 220 d</dt><dd>장거리 주행이 많다면 디젤. 4MATIC EXCLUSIVE 재고와 색상은 상담으로 확인해 드립니다.</dd></div>'),
 ('<div><dt>E 350 e</dt><dd>집이나 회사에서 충전이 된다면 플러그인 하이브리드. EXCLUSIVE 1대 남았습니다.</dd></div>',
  '<div><dt>E 350 e</dt><dd>집이나 회사에서 충전이 된다면 플러그인 하이브리드. EXCLUSIVE 재고와 색상은 상담으로 확인해 드립니다.</dd></div>'),
 ('<div><dt>확인</dt><dd>색상·옵션은 재고 1대 기준이라 먼저 확인이 필요합니다.</dd></div>',
  '<div><dt>확인</dt><dd>색상·옵션은 재고 상황에 따라 달라지므로 상담으로 먼저 확인해 드립니다.</dd></div>'),
 # E300 카드
 ('<header><h3>E 300 4MATIC</h3><p>MY26 11대 · MY27 29대</p></header>',
  '<header><h3>E 300 4MATIC</h3><p>MY26 · MY27 함께 비교</p></header>'),
 ('<div><dt>MY26</dt><dd>EXCLUSIVE 7대 · AMG Line 4대. 기본 10%, 금융 포함 총 14%.</dd></div>',
  '<div><dt>MY26</dt><dd>EXCLUSIVE · AMG Line 모두 기본 10%, 금융 포함 총 14%. 재고는 상담으로 확인.</dd></div>'),
 ('<div><dt>MY27</dt><dd>EXCLUSIVE 14대 · AMG Line 15대. 기본 8%, 금융 포함 총 12%.</dd></div>',
  '<div><dt>MY27</dt><dd>EXCLUSIVE · AMG Line 모두 기본 8%, 금융 포함 총 12%. 재고는 상담으로 확인.</dd></div>'),
 # E클래스 섹션 제목
 ('<h2 class="chk-title">E클래스 — 지금 남은 것과 새로 들어온 것</h2>',
  '<h2 class="chk-title">E클래스 — 연식별 조건과 새로 들어온 모델</h2>'),
 # FOCUS 카드
 ('<div><dt>지금</dt><dd>MY27 재고 53대. 원하는 외장·시트 조합으로 선택</dd></div>',
  '<div><dt>지금</dt><dd>MY27 재고·색상은 상담으로 확인, 원하는 외장·시트 조합으로 선택</dd></div>'),
 ('<div><dt>지금</dt><dd>MY27 44대(SUV 26 · 쿠페 18). AMG Line에 에어매틱·후륜조향</dd></div>',
  '<div><dt>지금</dt><dd>MY27 SUV·쿠페 재고는 상담으로 확인. AMG Line에 에어매틱·후륜조향</dd></div>'),
 ('<div><dt>지금</dt><dd>GLE 16대 · GLS 450 6대 · AMG G 63 1대</dd></div>',
  '<div><dt>지금</dt><dd>GLE · GLS 450 · AMG G 63 재고는 상담으로 확인</dd></div>'),
 # S클래스 카드
 ('<h3>신형 S클래스 — 즉시 출고 4대</h3>',
  '<h3>신형 S클래스 — 즉시 출고 차량 상담 확인</h3>'),
 ('<p>S 350 d 1대, S 450 4MATIC Long AMG Line 2대, S 450 4MATIC Long Exclusive 1대가 바로 나갈 수 있습니다.',
  '<p>S 350 d, S 450 4MATIC Long(AMG Line·Exclusive) 중 지금 바로 출고 가능한 차량이 있는지 상담으로 확인해 드립니다.'),
 # 출고 전 확인 표
 ('<td>희망 외장·시트 1순위와 2순위, 출고 가능일 (재고 53대)</td>',
  '<td>희망 외장·시트 1순위와 2순위, 출고 가능일 (재고·색상 상담 확인)</td>'),
 ('<td>잔여 차량의 트림·색상·선택 사양 (11대 · 1대 · 1대)</td>',
  '<td>남은 차량의 트림·색상·선택 사양 (재고 상담 확인)</td>'),
 ('<td>SUV·쿠페 색상 조합과 쿠페 무이자 적용 여부 (44대)</td>',
  '<td>SUV·쿠페 색상 조합과 쿠페 무이자 적용 여부 (재고 상담 확인)</td>'),
 ('<td>무이자 대상 여부와 선수금·기간별 금리 (23대)</td>',
  '<td>무이자 대상 여부와 선수금·기간별 금리 (재고 상담 확인)</td>'),
 ('<tr><th scope="row">신형 S클래스</th><td>즉시 출고 4대의 트림·색상, 시승 일정</td></tr>',
  '<tr><th scope="row">신형 S클래스</th><td>즉시 출고 가능 차량의 트림·색상, 시승 일정</td></tr>'),
 # 하단 기준 문구
 ('기준일 2026년 11월 19일. 재고는 2026년 11월 19일 기준, 조건은 본사 11월 프로모션표 기준입니다. 프로모션·재고는 본사 사정에 따라 바뀌므로 계약 시점에 다시 확인합니다.',
  '기준일 2026년 11월 19일. 조건은 본사 11월 프로모션표 기준입니다. 재고·출고 일정은 본사 사정에 따라 수시로 바뀌므로, 원하시는 차종·트림·색상의 재고는 상담으로 바로 확인해 드립니다.'),
]

for old, new in R:
    n = s.count(old)
    if n != 1:
        print('FAIL count=%d: %s' % (n, old[:60]))
        sys.exit(1)
    s = s.replace(old, new)

io.open(P, 'w', encoding='utf-8').write(s)
print('build.py updated: %d replacements' % len(R))
