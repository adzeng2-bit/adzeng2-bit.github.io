#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""benz-pages 페이지 분리 빌드 — promotion / stock / report / cards / mou + benefits 리다이렉트 + 내비 링크 갱신."""
import json, re, html as H, io, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def rd(p): return open(os.path.join(ROOT, p), encoding='utf-8').read()
def wr(p, s): open(os.path.join(ROOT, p), 'w', encoding='utf-8').write(s)

CSSV = '20261119m'

NAV = [
    ('index.html', '홈', 'index'),
    ('index.html#launches', '신차·사전예약', 'launches'),
    ('models.html', '차종별 가이드', 'models'),
    ('promotion.html', '가격·프로모션', 'promotion'),
    ('stock.html', '전국 재고', 'stock'),
    ('report.html', '구매전략리포트', 'report'),
    ('cards.html', '카드혜택', 'cards'),
    ('mou.html', 'MOU 확인', 'mou'),
    ('index.html#after-care', '사후관리', 'care'),
]

DRAWER = [
    ('g', '둘러보기'),
    ('index.html', '홈', '임정빈 차장', 'index'),
    ('index.html#launches', '신차·사전예약', '신형·론칭 모델', 'launches'),
    ('models.html', '차종별 가이드', '전체 45종', 'models'),
    ('index.html#after-care', '전담 사후관리', '점검·입고·보증', 'care'),
    ('g', '구매 정보'),
    ('promotion.html', '가격·프로모션', '이달의 조건', 'promotion'),
    ('stock.html', '전국 재고', 'STS 실시간 확인', 'stock'),
    ('report.html', '구매전략리포트', '이달의 판단 기준', 'report'),
    ('cards.html', '카드혜택', '신한카드 3종 비교', 'cards'),
    ('mou.html', 'MOU 확인', '676곳 즉시 검색', 'mou'),
    ('g', '바로 상담'),
    ('index.html#consult', '상담 신청서', '문자 자동 완성', ''),
    ('glc-electric.html', 'GLC Electric', '전기 SUV 가이드', ''),
]

PHONE = '010-8792-1080'

def head(title, desc, page):
    return f'''<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#0E161D">
<meta property="og:type" content="website">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:locale" content="ko_KR">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Marcellus&amp;display=swap">
<link rel="stylesheet" href="assets/css/style.css?v={CSSV}">
<script>document.documentElement.className += ' js';</script>
</head>
<body>
'''

def header(page):
    lis = []
    for href, label, key in NAV:
        cur = ' aria-current="page"' if key == page else ''
        lis.append(f'      <li><a href="{href}"{cur}>{label}</a></li>')
    lis.append(f'      <li class="navbar-tel"><a href="tel:{PHONE}">{PHONE}</a></li>')
    nav = '\n'.join(lis)
    return f'''
<header class="site-header">
  <div class="header-inner">
    <a class="brand" href="index.html">
      <span class="brand-kicker">MERCEDES-BENZ · HS효성더클래스</span>
      <span class="brand-name">임정빈 차장 · HS효성더클래스 분당</span>
    </a>
    <button class="nav-toggle" type="button" data-drawer-toggle aria-expanded="false" aria-controls="drawer">
      <span class="bars" aria-hidden="true"></span> 메뉴
    </button>
    <a class="header-call" href="tel:{PHONE}" aria-label="전화 상담 {PHONE}">
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6.6 3.5c.7-.2 1.4.2 1.7.8l1.2 2.6c.3.6.1 1.3-.4 1.7l-1.1.9c-.3.3-.4.7-.2 1 .9 1.7 2.4 3.2 4.1 4.1.3.2.7.1 1-.2l.9-1.1c.4-.5 1.1-.7 1.7-.4l2.6 1.2c.6.3 1 1 .8 1.7l-.5 2c-.2.8-.9 1.4-1.7 1.4C9.9 19.7 4.3 14.1 4.3 7.7c0-.8.6-1.5 1.4-1.7l.9-.5Z" fill="currentColor"/></svg>
      <span>전화</span>
    </a>
  </div>

  <nav class="navbar" aria-label="주요 메뉴">
    <ul class="navbar-inner">
{nav}
    </ul>
  </nav>
</header>
'''

def drawer(page):
    rows = []
    for item in DRAWER:
        if item[0] == 'g':
            rows.append(f'    <p class="drawer-group">{item[1]}</p>')
        else:
            href, label, small, key = item
            cur = ' aria-current="page"' if key == page else ''
            rows.append(f'    <a class="drawer-link" href="{href}"{cur}>{label} <small>{small}</small></a>')
    body = '\n'.join(rows)
    return f'''
<div class="drawer-scrim" data-drawer-scrim></div>
<aside class="drawer" id="drawer" data-drawer aria-label="전체 메뉴">
  <div class="drawer-head">
    <span class="drawer-title">MENU · HS효성더클래스 분당</span>
    <button class="drawer-close" type="button" data-drawer-close>닫기</button>
  </div>
  <nav class="drawer-nav">
{body}
  </nav>
  <div class="drawer-foot">
    <a href="tel:{PHONE}">전화 상담 · {PHONE}</a>
  </div>
</aside>
'''

def cta_band(title, text):
    return f'''
<section class="cta-band">
  <div class="wrap cta-band-inner">
    <div class="cta-band-copy">
      <p class="tagline">HS효성더클래스 분당지점 · 영업2팀</p>
      <h2 class="cta-band-title">{title}</h2>
      <p class="cta-band-text">{text}</p>
    </div>
    <div class="cta-band-actions">
      <a class="btn" href="tel:{PHONE}">전화 상담 {PHONE}</a>
      <a class="btn btn--outline-light" href="sms:01087921080" data-sms-default>문자로 차종 보내기</a>
    </div>
  </div>
</section>
'''

def foot(scripts, extra_js=''):
    tags = '\n'.join(f'<script src="{s}"></script>' for s in scripts)
    return f'''
<footer class="site-footer">
  <div class="wrap footer-inner">
    <p class="footer-brand">HS효성더클래스 분당지점 · 임정빈 차장 · {PHONE}</p>
    <p class="footer-note">
      가격은 메르세데스-벤츠 코리아 공식 차량 가격표(2026.11.17) 기준 권장소비자가격이며,
      프로모션·금융 조건은 본사 및 카드사 정책에 따라 변경됩니다. 확정 금액은 상담 시점에 안내해 드립니다.
    </p>
    <p class="footer-year">© <span class="js-year">2026</span> 임정빈 · HS효성더클래스 분당</p>
  </div>
</footer>

<div class="actionbar" aria-label="빠른 상담">
  <a class="ab-btn ab-btn--ghost" href="sms:01087921080" data-sms-default>문자 상담</a>
  <a class="ab-btn" href="tel:{PHONE}">전화 상담</a>
</div>

{tags}
{extra_js}</body>
</html>
'''

# ────────────────────────────────────────────── promotion
rows = json.load(open(os.path.join(ROOT, '_build/promo_rows.json'), encoding='utf-8'))

GROUP = {
    'pv-e':      ('e', 'E-Class'),
    'pv-glc':    ('glc', 'GLC'),
    'pv-s':      ('s', 'S-Class'),
    'pv-gle':    ('gle', 'GLE'),
    'pv-gls':    ('gle', 'GLS'),
    'pv-c':      ('c', 'C-Class'),
    'pv-acla':   ('acla', 'A · CLA · GLA · GLB'),
    'pv-cle':    ('cle', 'CLE'),
    'pv-amg':    ('amg', 'Mercedes-AMG'),
    'pv-maybach':('maybach', 'Mercedes-Maybach'),
    'pv-v':      ('v', 'V-Class'),
    'pv-eq':     ('eq', 'EQ · 전기차'),
    'pv-etc':    ('etc', '개별 견적'),
}
TAB_ORDER = [
    ('e', 'E-Class'), ('glc', 'GLC'), ('s', 'S-Class'), ('gle', 'GLE · GLS'),
    ('c', 'C-Class'), ('acla', 'A · CLA · GLA · GLB'), ('cle', 'CLE'),
    ('amg', 'AMG'), ('maybach', 'Maybach'), ('v', 'V-Class'), ('eq', 'EQ'),
    ('etc', '개별 견적'),
]
GLABEL = {'gle': 'GLE · GLS'}

def num(s):
    if not s: return None
    d = re.sub(r'[^0-9]', '', s)
    return int(d) if d else None

def prep(r):
    msrp = num(r['msrp'])
    fp = num(r['fin']['amt'])
    r['msrp_n'] = msrp
    published = num(r['price']) if r['price'] else None
    r['cash_price'] = published if published else msrp
    r['fin_price'] = msrp - fp if (msrp and fp) else None
    if r['fin_price'] and r['cash_price'] and r['fin_price'] < r['cash_price'] and r['fin']['amt']:
        # 누적 금액 표기 → 자체 할인분으로 재계산
        r['fin_own'] = r['cash_price'] - r['fin_price']
    else:
        r['fin_own'] = None
    r['final'] = min([x for x in (r['cash_price'], r['fin_price']) if x])
    return r

rows = [prep(r) for r in rows]

def won(n): return f'{n:,}원'

def cash_cell(r):
    c = r['cash']
    if c['rate'] and '%' in c['rate']:
        own = (r['msrp_n'] or 0) - (r['cash_price'] or 0)
        out = f"<b>{H.escape(c['rate'])}</b>"
        if own > 0: out += f'<span class="pv-amt">−{won(own)}</span>'
        return out
    if c['rate']:
        own = (r['msrp_n'] or 0) - (r['cash_price'] or 0)
        if own > 0: return f"<b>−{won(own)}</b>"
        return f"<b>{H.escape(c['rate'])}</b>"

    if c['none']: return f'<span class="pv-none">{H.escape(c["none"])}</span>'
    return '<span class="pv-none">—</span>'

def fin_cell(r):
    f = r['fin']
    out = ''
    if f['rate']:
        out += f"<b>{H.escape(f['rate'])}</b>"
        if r['fin_own']:
            out += f'<span class="pv-amt">−{won(r["fin_own"])}</span>'
        elif f['amt']:
            out += f'<span class="pv-amt">{H.escape(f["amt"])}</span>'
    if f['zero']:
        out += f'<span class="pv-zero">{H.escape(f["zero"])}</span>'
    if not out:
        if f['none']: out = f'<span class="pv-none">{H.escape(f["none"])}</span>'
        else: out = '<span class="pv-none">—</span>'
    return out

def price_cell(r):
    if r['consult']:
        return '<span class="pv-price pv-consult">개별 견적 상담</span>'
    return f'<span class="pv-price">{won(r["final"])}</span>'

def row_html(r):
    name = H.escape(r['name'])
    new = f' <span class="pv-new">{H.escape(r["new"])}</span>' if r['new'] else ''
    my = f'<span class="pv-my">MY{r["my"]}</span> ' if r['my'] else ''
    return (
        '          <tr>\n'
        f'            <th scope="row">{my}{name}{new}</th>\n'
        f'            <td data-label="권장 소비자가">{H.escape(r["msrp"])}</td>\n'
        f'            <td data-label="기본(현금) 할인">{cash_cell(r)}</td>\n'
        f'            <td data-label="금융(MBF) 할인">{fin_cell(r)}</td>\n'
        f'            <td data-label="실구매가">{price_cell(r)}</td>\n'
        '          </tr>\n'
    )

def group_section(gid, gtitle, grs):
    trs = ''.join(row_html(r) for r in grs)
    lead = ''
    if gid == 'gle':
        lead = ('<p class="pv-seg-lead">GLE·GLS MY26은 24·36개월 무이자 대상입니다. 선수금·기간·심사 조건에 따라 적용 여부가 달라집니다.</p>')
    elif gid == 'etc':
        lead = ('<p class="pv-seg-lead">11월 공통 할인 프로그램이 공지되지 않은 트림입니다. 권장 소비자가만 공식 가격표 기준으로 표기하고, 조건은 상담 시점 재고·금융 심사로 확정합니다.</p>')
    elif gid == 'maybach':
        lead = ('<p class="pv-seg-lead">MY26 S 680·GLS 600은 재구매 +9%와 타브랜드 +7% 중 하나를 선택합니다. 재고·출고 일정은 개별 확인이 필요합니다.</p>')
    return f'''        <section class="pv-seg" data-grp="{gid}" id="g-{gid}">
          <div class="pv-seg-head">
            <h2 class="pv-seg-title">{gtitle}</h2>
            <span class="pv-seg-count">{len(grs)}개 트림</span>
          </div>
          {lead}
          <div class="pv-wrap">
            <table class="pv-table">
              <caption class="pv-cap">{gtitle} · 2026년 11월 기준</caption>
              <thead>
                <tr><th scope="col">모델 (연식)</th><th scope="col">권장 소비자가</th><th scope="col">기본(현금) 할인</th><th scope="col">금융(MBF) 할인</th><th scope="col">실구매가</th></tr>
              </thead>
              <tbody>
{trs}              </tbody>
            </table>
          </div>
        </section>
'''

by = {}
for r in rows:
    gid = GROUP[r['seg']][0]
    by.setdefault(gid, []).append(r)

sections = ''
for gid, gtitle in TAB_ORDER:
    grs = by.get(gid, [])
    if not grs: continue
    sections += group_section(gid, gtitle, grs)

tabs = ['      <button class="tab" type="button" role="tab" aria-selected="true" aria-controls="g-e" data-grp="e">E-Class <small>%d</small></button>' % len(by['e'])]
tabs.append('      <button class="tab" type="button" role="tab" aria-selected="false" data-grp="all">전체 <small>%d</small></button>' % len(rows))
for gid, label in TAB_ORDER:
    if gid == 'e' or gid not in by: continue
    tabs.append('      <button class="tab" type="button" role="tab" aria-selected="false" data-grp="%s">%s <small>%d</small></button>' % (gid, GLABEL.get(gid, label), len(by[gid])))
tabs = '\n'.join(tabs)

PROMO_NOTE = '''        <div class="pv-foot">
          <p><b>1.</b> 재구매 <b>+1~2%</b>(마이바흐 S 680·GLS 600은 재구매 <b>+9%</b> 또는 타브랜드 <b>+7%</b> 중 택 1) · 트레이드인 <b>+1%+1%</b> · 콘퀘스트(타브랜드 보유) <b>+1%</b>는 표 가격에 추가로 적용되는 조건입니다. 보유 차량·구매 이력·명의 확인이 필요합니다.</p>
          <p><b>2.</b> 2026년 11월 1일~30일 접수·출고 기준, 부가세 포함 금액입니다. 기본 할인과 금융 할인은 함께 적용되며 실구매가는 두 할인을 모두 적용한 금액입니다. 무이자는 선수금 비율(24개월 40~42% · 36개월 55~57%)과 심사 결과에 따라 달라지고, 취득세·등록비·금융비용은 별도입니다.</p>
        </div>
'''

promo_body = f'''<main class="promo">

  <div class="pbar">
    <div class="wrap pbar-head">
      <div>
        <p class="pbar-kicker">2026년 11월 1일 ~ 11월 30일 · 부가세 포함 · 원</p>
        <h1 class="pbar-title">11월 프로모션</h1>
      </div>
      <a class="pbar-call" href="tel:{PHONE}">임정빈 차장 {PHONE}</a>
    </div>
    <div class="pbar-tabs">
      <div class="wrap">
        <div class="tabs promo-tabs" id="promo-tabs" role="tablist" aria-label="차종 그룹 선택">
{tabs}
        </div>
      </div>
    </div>
    <p class="pbar-note wrap">공식 할인은 전국 동일합니다. 원하는 외장·시트 색상 확보와 배정, 금융 조건 설계는 담당자에게 확인하세요.</p>
  </div>

  <div class="wrap promo-body">
{sections}    <div class="pv-foot-wrap">
{PROMO_NOTE}    </div>
    <noscript><p class="no-script">차종 탭은 자바스크립트로 동작합니다. 아래로 스크롤하면 전체 차종 표를 그대로 보실 수 있습니다.</p></noscript>
  </div>
{cta_band("같은 조건이라면, 끝까지 챙기는 쪽으로.", "전국 공식 할인은 어느 전시장에서나 같습니다. 다른 것은 원하는 외장·시트 색상을 언제 확보하고, 출고 순번을 어떻게 잡고, 그 차에 맞는 금융을 어떻게 설계하느냐입니다. 색상 선점과 배정, 조건 설계, 출고 후 정기점검·경고등·보증 케어까지 분당지점 임정빈 차장이 직접 맡습니다.")}
</main>
'''

page = head('11월 가격·프로모션 | 임정빈 차장 · HS효성더클래스 분당',
            '2026년 11월 메르세데스-벤츠 차종별 권장 소비자가와 현금·MBF 금융 할인, 실구매가를 차종 탭으로 한눈에. HS효성더클래스 분당 임정빈 차장 010-8792-1080.',
            'promotion')
page += header('promotion') + drawer('promotion') + promo_body
page += foot([
    'assets/js/site.js',
    'assets/js/promotion.js?v=20261119a',
])
wr('promotion.html', page)

# ────────────────────────────────────────────── stock
stock_body = f'''<main>

  <div class="pbar">
    <div class="wrap pbar-head">
      <div>
        <p class="pbar-kicker">2026년 11월 19일 16:07 기준 · 사내 전산(STS) 지점 위탁 재고</p>
        <h1 class="pbar-title">지금 배정 가능한 재고 <b class="pbar-num" id="stock-total">180</b>대</h1>
      </div>
      <a class="pbar-call" href="sms:01087921080">임정빈 차장 {PHONE}</a>
    </div>
  </div>

  <div class="wrap stock-body">
    <div class="stock-filters">
      <label class="stock-field stock-field--q">
        <span>검색</span>
        <input type="search" id="st-q" placeholder="차종 · 색상 · 전시장" aria-label="재고 검색" autocomplete="off">
      </label>
      <label class="stock-field">차종<select id="st-model"><option value="">차종 전체</option></select></label>
      <label class="stock-field">연식<select id="st-year"><option value="">연식 전체</option></select></label>
      <label class="stock-field">외장색<select id="st-ext"><option value="">외장색 전체</option></select></label>
      <label class="stock-field">내장색<select id="st-int"><option value="">내장색 전체</option></select></label>
      <label class="stock-field">전시장<select id="st-loc"><option value="">전시장 전체</option></select></label>
      <label class="stock-check"><input type="checkbox" id="st-only-avail" checked> <span>배정 가능만 보기</span></label>
      <button class="btn btn--ghost stock-reset" type="button" id="st-reset">조건 초기화</button>
    </div>

    <p class="stock-count" id="stock-count" aria-live="polite">전체 180대</p>
    <div class="stock-list" id="stock-list"></div>

    <noscript><p class="no-script">재고 목록은 자바스크립트가 필요합니다. 차종·색상을 문자로 주시면 재고를 확인해 회신드립니다. {PHONE}</p></noscript>

    <p class="sr-note stock-note">
      효성더클래스 전 지점의 판매 가능 재고를 차종·연식·외장/내장 색상 단위로 묶은 목록입니다.
      재고는 계약·배정·이동으로 하루에도 여러 번 바뀌므로 보시는 시점과 실제 배정 가능 여부가 다를 수 있습니다.
      전국 다른 전시장 재고와 생산 배정 일정은 문자 주시면 사내 전산으로 다시 조회해 드립니다.
    </p>
  </div>
{cta_band("재고는 목록보다, 확보가 먼저입니다.", "같은 재고 목록을 봐도 원하는 색상과 출고일을 실제로 잡아 두는 것은 담당자 몫입니다. 희망 외장·시트 1·2순위를 알려주시면 배정 가능 여부를 확인해 후보 2~3대를 정리해 드리고, 금융 조건과 출고 후 정기점검·경고등·보증 케어까지 이어서 맡습니다.")}
</main>
'''

page = head('전국 재고 조회 | 임정빈 차장 · HS효성더클래스 분당',
            '효성더클래스 전 지점 판매 가능 재고 180대를 차종·연식·외장·내장 색상·전시장으로 바로 조회. 2026-11-19 STS 기준. 임정빈 차장 010-8792-1080.',
            'stock')
page += header('stock') + drawer('stock') + stock_body
page += foot([
    'assets/js/stock-data.js?v=20261119a',
    'assets/js/site.js',
    'assets/js/stock.js?v=20261119c',
])
wr('stock.html', page)

# ────────────────────────────────────────────── report
report_body = f'''<main class="report">

  <div class="pbar">
    <div class="wrap pbar-head">
      <div>
        <p class="pbar-kicker">BUYING STRATEGY · 2026년 11월 · 임정빈 차장 · HS효성더클래스 분당지점</p>
        <h1 class="pbar-title">11월 구매전략리포트</h1>
      </div>
      <a class="pbar-call" href="tel:{PHONE}">{PHONE}</a>
    </div>
    <p class="pbar-note wrap">E200은 원하는 색상으로, 대형 SUV는 무이자 조건으로. 11월에 실제로 확인할 것만 정리했습니다.</p>
  </div>

  <div class="wrap report-body">

    <h2 class="chk-title">핵심 요약 4포인트</h2>
    <div class="info-grid">
      <div class="info-card">
        <h3>① 할인율보다 선택의 폭</h3>
        <p>MY27 E200은 재고가 53대(EXCLUSIVE 29 · AMG Line 24) 있고, 외장·시트 조합을 원하는 대로 고를 수 있습니다. MY26 E200은 재고가 소진되어 지금은 색상을 고르는 단계입니다.</p>
      </div>
      <div class="info-card">
        <h3>② 이번 달의 핵심은 무이자</h3>
        <p>MY26 GLE·GLS와 AMG GLE 53·GLS 63, 마이바흐 GLS 600이 24·36개월 무이자 대상입니다. AMG E53은 24·36개월 무이자·초저금리 선택지가 있습니다.</p>
      </div>
      <div class="info-card">
        <h3>③ 직접 타보고 결정</h3>
        <p>신형 S클래스는 즉시 출고 가능한 재고가 4대 있습니다(S 350 d 1 · S 450 Long 3). 원하시는 트림과 날짜를 알려주시면 시승 일정을 맞춰 드립니다.</p>
      </div>
      <div class="info-card">
        <h3>④ 달라진 MY27 라인업</h3>
        <p>GLC는 엔트리부터 AMG Line까지 선택지가 넓어졌고, AMG Line에는 에어매틱과 후륜조향이 들어갑니다. E450 4MATIC 6기통도 MY27로 들어왔습니다.</p>
      </div>
    </div>

    <h2 class="chk-title">E200 — MY26 소진, 이제 MY27에서 색상을 고를 때</h2>
    <p class="sec-text">
      MY27 E200은 차량가격 인상 없이 무이자 조건이 유지되고 있습니다. 현금 할인은 두 트림 모두 14%이고,
      금융을 함께 쓰면 EXCLUSIVE는 총 18%, AMG Line은 총 17%까지 내려갑니다.
      MY26 E200 EXCLUSIVE는 금융 이용 시 총 20%였지만, 11월 19일 재고 기준으로 MY26 E200은 남아 있지 않습니다.
    </p>
    <div class="cmp-wrap">
      <table class="pv-table pv-table--wide">
        <caption class="pv-cap">E200 트림별 조건 비교</caption>
        <thead>
          <tr><th scope="col">트림</th><th scope="col">권장 소비자가</th><th scope="col">기본 할인</th><th scope="col">금융 포함</th><th scope="col">실구매가</th><th scope="col">재고</th></tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row"><span class="pv-my">MY27</span> E 200 EXCLUSIVE</th>
            <td data-label="권장 소비자가">77,500,000원</td>
            <td data-label="기본 할인"><b>14%</b></td>
            <td data-label="금융 포함"><b>총 18%</b><span class="pv-zero">무이자 24개월</span></td>
            <td data-label="실구매가"><span class="pv-price">63,550,000원</span></td>
            <td data-label="재고">29대</td>
          </tr>
          <tr>
            <th scope="row"><span class="pv-my">MY27</span> E 200 AMG Line</th>
            <td data-label="권장 소비자가">81,000,000원</td>
            <td data-label="기본 할인"><b>14%</b></td>
            <td data-label="금융 포함"><b>총 17%</b><span class="pv-zero">무이자 24개월</span></td>
            <td data-label="실구매가"><span class="pv-price">67,230,000원</span></td>
            <td data-label="재고">24대</td>
          </tr>
          <tr>
            <th scope="row"><span class="pv-my">MY26</span> E 200 EXCLUSIVE</th>
            <td data-label="권장 소비자가">77,500,000원</td>
            <td data-label="기본 할인"><b>15%</b></td>
            <td data-label="금융 포함"><b>총 20%</b></td>
            <td data-label="실구매가"><span class="pv-price">62,000,000원</span></td>
            <td data-label="재고">소진</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="cmp-note"><span class="dot"></span>MY27은 지금 차량가격 인상 없이 무이자가 유지되고, 색상은 원하는 조합으로 고를 수 있습니다. 희망 외장·시트 1순위와 2순위를 알려주시면 그 조합으로 후보를 잡아 드립니다.</p>

    <h2 class="chk-title">E클래스 — 지금 남은 것과 새로 들어온 것</h2>
    <div class="cmp-grid">
      <article class="cmp-card">
        <header><h3>E 220 d · E 350 e</h3><p>각 1대</p></header>
        <dl>
          <div><dt>E 220 d</dt><dd>장거리 주행이 많다면 디젤. 4MATIC EXCLUSIVE 1대 남았습니다.</dd></div>
          <div><dt>E 350 e</dt><dd>집이나 회사에서 충전이 된다면 플러그인 하이브리드. EXCLUSIVE 1대 남았습니다.</dd></div>
          <div><dt>확인</dt><dd>색상·옵션은 재고 1대 기준이라 먼저 확인이 필요합니다.</dd></div>
        </dl>
      </article>
      <article class="cmp-card">
        <header><h3>E 300 4MATIC</h3><p>MY26 11대 · MY27 29대</p></header>
        <dl>
          <div><dt>MY26</dt><dd>EXCLUSIVE 7대 · AMG Line 4대. 기본 10%, 금융 포함 총 14%.</dd></div>
          <div><dt>MY27</dt><dd>EXCLUSIVE 14대 · AMG Line 15대. 기본 8%, 금융 포함 총 12%.</dd></div>
          <div><dt>확인</dt><dd>같은 이름이라도 연식에 따라 조건이 다릅니다. 두 연식을 나란히 놓고 비교하세요.</dd></div>
        </dl>
      </article>
      <article class="cmp-card">
        <header><h3>E 450 4MATIC</h3><p>6기통 · MY27</p></header>
        <dl>
          <div><dt>트림</dt><dd>EXCLUSIVE와 AMG Line이 MY27로 들어왔습니다.</dd></div>
          <div><dt>조건</dt><dd>기본 10% · 금융 할인은 별도 확인이 필요합니다.</dd></div>
          <div><dt>확인</dt><dd>6기통을 기다리셨다면 원하는 트림·색상을 먼저 알려주세요.</dd></div>
        </dl>
      </article>
      <article class="cmp-card">
        <header><h3>AMG E 53</h3><p>24·36개월 무이자·초저금리</p></header>
        <dl>
          <div><dt>조건</dt><dd>24·36개월 무이자와 초저금리 중 선택. 기본 할인 10%.</dd></div>
          <div><dt>구성</dt><dd>나이트 패키지·블랙 단조휠 적용 차량이 있습니다.</dd></div>
          <div><dt>확인</dt><dd>선수금 비율에 따라 금리가 달라집니다. 희망 선수금을 알려주세요.</dd></div>
        </dl>
      </article>
    </div>

    <h2 class="chk-title">이번 달 포커스 모델 4선</h2>
    <div class="cmp-grid cmp-grid--focus">
      <article class="cmp-card cmp-card--focus">
        <header><h3>E 200</h3><p>FOCUS 01</p></header>
        <dl>
          <div><dt>지금</dt><dd>MY27 재고 53대. 원하는 외장·시트 조합으로 선택</dd></div>
          <div><dt>조건</dt><dd>기본 14% · 금융 포함 18%(EXCLUSIVE) / 17%(AMG Line) · 무이자 24개월</dd></div>
        </dl>
      </article>
      <article class="cmp-card cmp-card--focus">
        <header><h3>AMG E 53</h3><p>FOCUS 02</p></header>
        <dl>
          <div><dt>지금</dt><dd>24·36개월 무이자·초저금리, 나이트 패키지 차량</dd></div>
          <div><dt>조건</dt><dd>기본 10% · 선수금·기간별 금리 견적</dd></div>
        </dl>
      </article>
      <article class="cmp-card cmp-card--focus">
        <header><h3>GLC SUV · 쿠페</h3><p>FOCUS 03</p></header>
        <dl>
          <div><dt>지금</dt><dd>MY27 44대(SUV 26 · 쿠페 18). AMG Line에 에어매틱·후륜조향</dd></div>
          <div><dt>조건</dt><dd>기본 7% · 금융 포함 8% · 쿠페 무이자 24개월</dd></div>
        </dl>
      </article>
      <article class="cmp-card cmp-card--focus">
        <header><h3>대형 SUV</h3><p>FOCUS 04</p></header>
        <dl>
          <div><dt>지금</dt><dd>GLE 16대 · GLS 450 6대 · AMG G 63 1대</dd></div>
          <div><dt>조건</dt><dd>GLE·GLS 무이자 24/36개월 · G63은 개별 견적</dd></div>
        </dl>
      </article>
    </div>

    <h2 class="chk-title">신형 S클래스와 마이바흐</h2>
    <div class="info-grid info-grid--two">
      <div class="info-card">
        <h3>신형 S클래스 — 즉시 출고 4대</h3>
        <p>S 350 d 1대, S 450 4MATIC Long AMG Line 2대, S 450 4MATIC Long Exclusive 1대가 바로 나갈 수 있습니다.
          MY26 S 450은 기본 10%에 무이자 24개월이 붙습니다.</p>
        <ul>
          <li>트림·색상 조합에 따라 출고 시점이 달라집니다</li>
          <li>시승은 원하시는 날짜와 트림을 알려주시면 일정을 맞춰 드립니다</li>
        </ul>
      </div>
      <div class="info-card">
        <h3>재구매+ 보증연장</h3>
        <p>신형 S클래스는 기존 벤츠 구매 이력에 따라 보증연장이 달라지는 재구매+ 프로그램이 적용됩니다.</p>
        <ul>
          <li>두 번째 재구매(세 번째 구매) — 1년 / 3만 km</li>
          <li>세 번째 이상 재구매 — 2년 / 7만 km</li>
        </ul>
        <p class="sr-note" style="margin-top:10px">E클래스 이상 보유 요건 등 프로그램 조건에 따라 대상 여부가 달라집니다. 구매 이력을 알려주시면 확인해 드립니다.</p>
      </div>
    </div>

    <h3 class="chk-title chk-title--sub">마이바흐 S 680 · GLS 600 — 재구매와 타브랜드 중 택 1</h3>
    <div class="cmp-wrap">
      <table class="pv-table pv-table--wide">
        <caption class="pv-cap">마이바흐 MY26 특별 조건</caption>
        <thead>
          <tr><th scope="col">모델</th><th scope="col">권장 소비자가</th><th scope="col">재구매 (+9%)</th><th scope="col">타브랜드 (+7%)</th></tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row"><span class="pv-my">MY26</span> Maybach S 680</th>
            <td data-label="권장 소비자가">403,000,000원</td>
            <td data-label="재구매"><span class="pv-price">330,450,000원</span></td>
            <td data-label="타브랜드"><span class="pv-price">338,510,000원</span></td>
          </tr>
          <tr>
            <th scope="row"><span class="pv-my">MY26</span> Maybach GLS 600</th>
            <td data-label="권장 소비자가">295,000,000원</td>
            <td data-label="재구매"><span class="pv-price">253,690,000원</span></td>
            <td data-label="타브랜드"><span class="pv-price">259,590,000원</span></td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="cmp-note"><span class="dot"></span>재구매 +9%와 타브랜드 +7%는 둘 중 하나만 선택합니다. 운용리스·장기렌트는 별도 조건이며, 보유 브랜드와 명의·보유 이력에 따라 적용 금액이 달라집니다.</p>

    <h2 class="chk-title">출고 전에 확인할 것</h2>
    <div class="cmp-wrap">
      <table class="fin-table">
        <thead>
          <tr><th scope="col">차종</th><th scope="col">지금 확인할 1줄</th></tr>
        </thead>
        <tbody>
          <tr><th scope="row">MY27 E 200</th><td>희망 외장·시트 1순위와 2순위, 출고 가능일 (재고 53대)</td></tr>
          <tr><th scope="row">MY26 E 300 · E 220 d · E 350 e</th><td>잔여 차량의 트림·색상·선택 사양 (11대 · 1대 · 1대)</td></tr>
          <tr><th scope="row">GLC SUV · 쿠페</th><td>SUV·쿠페 색상 조합과 쿠페 무이자 적용 여부 (44대)</td></tr>
          <tr><th scope="row">GLE · GLS · AMG G 63</th><td>무이자 대상 여부와 선수금·기간별 금리 (23대)</td></tr>
          <tr><th scope="row">신형 S클래스</th><td>즉시 출고 4대의 트림·색상, 시승 일정</td></tr>
          <tr><th scope="row">마이바흐 S 680 · GLS 600</th><td>재구매 +9%와 타브랜드 +7% 중 선택, 재고·출고 일정</td></tr>
        </tbody>
      </table>
    </div>

    <div class="note">
      <p><b>숫자를 보는 순서</b> ① 원하는 차와 색상을 먼저 정합니다 ② 현금 조건과 금융 조건을 각각 받습니다 ③ 금융은 총이자까지 더해 총 지출로 바꿉니다 ④ 카드 결제·MOU·재구매 우대가 어디에 붙는지 확인합니다. 이 네 단계를 거치면 비교할 것이 두세 개로 줄어듭니다.</p>
    </div>

    <p class="sr-note" style="margin-top:18px">기준일 2026년 11월 19일. 재고는 사내 전산(STS) 16:07 추출본, 조건은 본사 11월 프로모션표 기준입니다. 프로모션·재고는 본사 사정에 따라 바뀌므로 계약 시점에 다시 확인합니다.</p>
  </div>
{cta_band("같은 할인, 다른 결과.", "전국 공식 할인은 어느 전시장에서나 같습니다. 원하는 외장·시트 색상을 먼저 확보하고, 출고 순번을 잡고, 고객님 상황에 맞는 금융을 설계하는 것은 담당자의 일입니다. 출고 후 정기점검·경고등·보증 케어까지 분당지점 임정빈 차장이 끝까지 맡습니다.")}
</main>
'''

page = head('11월 구매전략리포트 | 임정빈 차장 · HS효성더클래스 분당',
            '2026년 11월 벤츠 구매전략리포트 — E200 MY27 색상 선택, 무이자 대상 차종, GLC·대형 SUV·신형 S클래스·마이바흐 조건을 실전 기준으로 정리했습니다. 임정빈 차장 010-8792-1080.',
            'report')
page += header('report') + drawer('report') + report_body
page += foot([
    'assets/js/site.js',
])
wr('report.html', page)

print('promotion/stock/report written')

# ────────────────────────────────────────────── cards
cards_body = f'''<main>

  <div class="pbar">
    <div class="wrap pbar-head">
      <div>
        <p class="pbar-kicker">메르세데스-벤츠 신한카드 3종 · 2026년 11월 기준</p>
        <h1 class="pbar-title">카드혜택 · 결제 계산기</h1>
      </div>
      <a class="pbar-call" href="tel:{PHONE}">임정빈 차장 {PHONE}</a>
    </div>
    <p class="pbar-note wrap">아방가르드 · 익스클루시브 · 마누팍투어. 결제 금액을 넣으면 카드별 할인액과 적립액이 바로 계산됩니다.</p>
  </div>

  <div class="wrap cards-body">

    <div class="cardpick" id="card-pick"></div>

    <div class="sim" id="sim">
      <div class="sim-head">
        <p class="tagline">SIMULATOR</p>
        <h2 class="sim-title">차량 잔금 카드 결제 시뮬레이터</h2>
        <p class="sim-desc">결제 금액을 넣으면 3종 카드별로 발급 첫 달 할인액, 전월 300만원 이상일 때의 최대 할인액, 스카이패스 마일리지를 바로 계산합니다.</p>
      </div>

      <div class="sim-form">
        <label class="sim-label" for="sim-amount">차량 잔금 결제 금액</label>
        <div class="sim-input">
          <input id="sim-amount" type="text" inputmode="numeric" value="50,000,000" aria-describedby="sim-hint" autocomplete="off">
          <span class="sim-unit">원</span>
        </div>
        <p class="sim-hint" id="sim-hint" aria-live="polite">5,000만원 결제 기준</p>
        <input class="sim-range" id="sim-range" type="range" min="1000000" max="200000000" step="1000000" value="50000000" aria-label="결제 금액 조절">
        <div class="sim-presets" role="group" aria-label="금액 빠른 선택">
          <button type="button" data-amount="30000000">3천만</button>
          <button type="button" data-amount="50000000">5천만</button>
          <button type="button" data-amount="100000000">1억</button>
          <button type="button" data-amount="150000000">1억 5천</button>
        </div>
      </div>

      <div class="sim-results" id="sim-results" aria-live="polite"></div>

      <div class="sim-install">
        <label class="sim-label" for="sim-months">카드 할부로 돌린다면</label>
        <select id="sim-months" autocomplete="off">
          <option value="12">12개월 · 연 4.3%</option>
          <option value="24">24개월 · 연 4.4%</option>
          <option value="36" selected>36개월 · 연 4.5%</option>
          <option value="48">48개월 · 연 4.6%</option>
          <option value="60">60개월 · 연 4.7%</option>
        </select>
        <p class="sim-install-out" id="sim-install-out" aria-live="polite"></p>
      </div>

      <p class="sim-note">
        · 카드 기본 서비스(국내 일시불·할부)의 전월 실적 구간별 할인율을 그대로 적용한 단순 계산입니다. 실제 청구 할인액은 카드사 심사·이용 내역에 따라 달라집니다.<br>
        · 발급 첫 달은 전월 실적이 없어 최소 구간(0.5~0.7%)이 적용되고, 전월 300만원 이상일 때 최대 구간(1.2~1.5%)이 적용됩니다. 전월 50만원 미만이면 서비스가 제공되지 않습니다.<br>
        · 할인형과 스카이패스형은 택 1입니다. 스카이패스형은 결제일 할인 대신 마일리지가 적립되며, 마일리지의 원 환산은 1마일 15원 기준 참고치입니다.
      </p>
    </div>

    <h2 class="chk-title">전월 이용금액별 국내 할인율</h2>
    <div class="cbt cbt--brackets" id="card-brackets"></div>

    <h2 class="chk-title">혜택 상세 비교</h2>
    <div class="cbt" id="card-table"></div>

    <h2 class="chk-title">결제 한도 · 발급 신청</h2>
    <div class="limit-links" id="limit-links"></div>

    <div class="cmp-wrap" style="margin-top:26px">
      <table class="fin-table">
        <thead><tr><th scope="col">카드 할부 기간</th><th scope="col">연 금리</th><th scope="col">메모</th></tr></thead>
        <tbody>
          <tr><th scope="row">12개월</th><td>연 4.3%</td><td>총 이자 최소, 월 납입 최대</td></tr>
          <tr><th scope="row">24개월</th><td>연 4.4%</td><td>무이자 프로모션과 비교 권장</td></tr>
          <tr><th scope="row">36개월</th><td>연 4.5%</td><td>일반적인 선택 구간</td></tr>
          <tr><th scope="row">48개월</th><td>연 4.6%</td><td>월 납입 낮춤, 총 이자 증가</td></tr>
          <tr><th scope="row">60개월</th><td>연 4.7%</td><td>총 이자 최대, 차량 잔존가치 확인</td></tr>
        </tbody>
      </table>
    </div>
    <p class="cmp-note"><span class="dot"></span>카드 할부는 신용카드사 할부 개월별 금리이며, 벤츠 파이낸셜(MBF) 금리와는 별개입니다. 두 가지를 같은 총지출 기준으로 비교해 드립니다.</p>
    <p class="sr-note">세 카드 모두 개인 신용카드로 발급되며 법인 명의로는 사용할 수 없습니다. 카드 발급에 며칠이 걸리므로 결제일 3~4일 전에는 신청을 마쳐야 하고, 카드 한도가 차량 대금보다 작으면 가상계좌 선입금으로 한도를 채운 뒤 입금일 포함 3영업일 안에 결제합니다.</p>
  </div>
{cta_band("카드는 결제 직전보다, 견적 단계에서.", "카드 한도·실적 구간·발급 일정은 차량 조건과 함께 봐야 실제 할인액이 나옵니다. 결제 예정 금액과 보유 카드를 알려주시면 어떤 조합이 유리한지 계산해 드리고, 출고 후 정기점검·경고등·보증 케어까지 분당지점 임정빈 차장이 맡습니다.")}
</main>
'''

page = head('카드혜택 · 결제 계산기 | 임정빈 차장 · HS효성더클래스 분당',
            '메르세데스-벤츠 신한카드 3종(아방가르드·익스클루시브·마누팍투어) 혜택 비교와 차량 잔금 결제 시뮬레이터, 카드 할부 금리 요약. 임정빈 차장 010-8792-1080.',
            'cards')
page += header('cards') + drawer('cards') + cards_body
page += foot([
    'assets/js/site.js',
    'assets/js/cards-data.js?v=20261119b',
    'assets/js/cards.js?v=20261119b',
])
wr('cards.html', page)

# ────────────────────────────────────────────── mou
mou_body = f'''<main>

  <div class="pbar">
    <div class="wrap pbar-head">
      <div>
        <p class="pbar-kicker">벤츠코리아 MOU 체결 기업 · 2026년 9월 기준</p>
        <h1 class="pbar-title">MOU 혜택 확인</h1>
      </div>
      <a class="pbar-call" href="tel:{PHONE}">임정빈 차장 {PHONE}</a>
    </div>
    <p class="pbar-note wrap">676개 기업·병원·법무법인·협회입니다. 회사명 또는 초성만 넣어도 찾을 수 있고, 소속이 확인되면 임직원 추가할인 2% 대상입니다.</p>
  </div>

  <div class="wrap mou-body">
    <div class="mou-tool">
      <div class="search-field" data-mou-field>
        <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="m16 16 4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
        <input type="search" id="mou-search" placeholder="회사명 검색 — 예: 삼성, 네이버, 법무법인, ㅅㅅㅈㅈ" aria-label="MOU 체결 기업 검색" autocomplete="off">
        <button class="search-clear" type="button" data-mou-clear>지우기</button>
      </div>
      <div class="tabs mou-tabs" id="mou-cats" role="tablist" aria-label="업종 필터"></div>
      <div class="tabs mou-tabs mou-tabs--ini" id="mou-inits" role="tablist" aria-label="가나다 필터"></div>
      <p class="mou-count" id="mou-count" aria-live="polite">전체 676개 기업</p>
      <div class="mou-grid" id="mou-grid"></div>
      <div class="mou-more-wrap"><button class="mou-more" type="button" id="mou-more" hidden>더 보기</button></div>
      <div class="empty-state" id="mou-empty" hidden>
        <b>목록에서 찾지 못했습니다</b>
        리스트에 없다고 제외되는 것은 아닙니다. 회사명을 문자로 보내주시면 제휴 여부를 직접 확인해 드립니다.
        <a class="mou-empty-cta" data-mou-empty-sms href="sms:01087921080">임정빈 차장에게 문자로 확인</a>
      </div>
      <noscript><p class="no-script">회사명 검색은 자바스크립트가 필요합니다. {PHONE} 으로 회사명을 문자 주시면 제휴 여부를 확인해 드립니다.</p></noscript>
      <p class="sr-note mou-note">
        2026년 9월 기준 벤츠코리아 MOU 체결 기업 리스트 · 임직원 추가할인 2% 적용 대상.
        업종 구분은 회사명을 기준으로 묶은 참고 분류입니다. 같은 계열사라도 법인·구매 명의에 따라 적용이 달라질 수 있어,
        최종 적용 여부는 계약 시 확인합니다.
      </p>
    </div>
  </div>
{cta_band("우리 회사가 목록에 없어도 확인할 수 있습니다.", "MOU는 재직 사실과 구매 명의로 적용이 갈립니다. 회사명과 재직 형태만 알려주시면 대상 여부와 필요 서류를 확인해 드리고, 차량 조건·금융 설계, 출고 후 정기점검·경고등·보증 케어까지 분당지점 임정빈 차장이 맡습니다.")}
</main>
'''

page = head('MOU 혜택 확인 | 임정빈 차장 · HS효성더클래스 분당',
            '벤츠코리아 MOU 체결 기업 676곳 실시간 검색 — 회사명·초성·업종·가나다로 바로 확인. 임직원 추가할인 2% 대상 여부 확인. 임정빈 차장 010-8792-1080.',
            'mou')
page += header('mou') + drawer('mou') + mou_body
page += foot([
    'assets/js/mou-data.js?v=20261119c',
    'assets/js/site.js',
    'assets/js/mou-search.js?v=20261119b',
])
wr('mou.html', page)

# ────────────────────────────────────────────── benefits.html → promotion.html 리다이렉트
redirect = f'''<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>가격·프로모션으로 이동합니다 | 임정빈 차장</title>
<meta name="robots" content="noindex">
<link rel="canonical" href="promotion.html">
<meta http-equiv="refresh" content="0; url=promotion.html">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
<style>
  html,body{{margin:0;height:100%;background:#F6F4EF;color:#12161B;
    font-family:Pretendard,"Apple SD Gothic Neo",system-ui,sans-serif}}
  .r{{max-width:520px;margin:0 auto;padding:18vh 24px 0;text-align:center}}
  .r p{{font-size:13px;line-height:1.8;color:#5a6270}}
  .r h1{{font-size:20px;letter-spacing:-.03em;margin:0 0 10px}}
  .r a{{display:inline-block;margin-top:22px;padding:12px 20px;background:#12161B;color:#F6F4EF;
    font-size:12.5px;letter-spacing:.02em;text-decoration:none}}
</style>
</head>
<body>
<div class="r">
  <h1>가격·프로모션 페이지로 이동합니다</h1>
  <p>메뉴를 차종별 페이지로 나누었습니다. 자동으로 넘어가지 않으면 아래를 눌러 주세요.</p>
  <a href="promotion.html">가격·프로모션 보기</a>
</div>
<script>
(function () {{
  var h = (location.hash || "").replace("#", "");
  var map = {{ stock: "stock.html", report: "report.html", cards: "cards.html", mou: "mou.html" }};
  var to = map[h] || "promotion.html";
  if (window.history && history.replaceState) history.replaceState(null, "", to);
  window.location.replace(to);
}})();
</script>
</body>
</html>
'''
wr('benefits.html', redirect)

print('cards/mou/redirect written')
