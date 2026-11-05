// 지원 직무별 첫 화면: ?role=design 은 DESIGN을 먼저, ?role=clinic 은 LUCENT(병원 홈페이지)를 먼저 보여준다.
// (상세페이지·콘텐츠 디자인 직무 지원용 링크. 일반 링크는 그대로 WORK 우선.)
(() => {
  const role = (new URLSearchParams(location.search).get('role') || '').toLowerCase();

  // ?role=clinic : 병원 홈페이지·랜딩 직무 지원용. LUCENT(가상 피부과)를 목록 맨 위로 올리고
  // 한 줄 소개를 병원 홈페이지 관점으로 바꾼다. 번호(09)는 그대로 둔다.
  if (role === 'clinic') {
    const row = document.querySelector('.work-list a[href="work-lucent.html"]');
    const li = row && row.closest('li');
    if (li && li.parentElement) {
      li.parentElement.prepend(li);
      const purpose = row.querySelector('.wr-purpose');
      if (purpose) purpose.textContent = '병원 홈페이지 · 상담 흐름 · SEO·AEO';
    }
    return;
  }

  if (role !== 'design') return;

  // 히어로 버튼: DESIGN을 앞에
  const ctas = [...document.querySelectorAll('.identity-reveal .identity-cta')];
  const design = ctas.find((a) => a.getAttribute('href') === 'design.html');
  const work = ctas.find((a) => a.getAttribute('href') === '#work');
  if (design && work) {
    work.before(design);
  }

  // 목록 위로 DESIGN 안내 카드를 올림
  const teaser = document.querySelector('.design-teaser');
  const list = document.querySelector('.work-index');
  if (teaser && list) {
    teaser.classList.add('is-first');
    const meta = teaser.querySelector('.dt-meta');
    if (meta) meta.textContent = 'FEATURED — DESIGN';
    list.before(teaser);
  }

  // 메뉴에서 DESIGN을 WORK 앞으로
  document.querySelectorAll('.site-nav, nav').forEach((nav) => {
    const d = nav.querySelector('a[href="design.html"]');
    const w = nav.querySelector('a[href="#work"]');
    if (d && w && d.parentElement === w.parentElement) w.before(d);
  });
})();
