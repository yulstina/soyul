// 지원 직무별 첫 화면: 주소 끝에 ?role=design 을 붙이면 DESIGN을 먼저 보여준다.
// (상세페이지·콘텐츠 디자인 직무 지원용 링크. 일반 링크는 그대로 WORK 우선.)
(() => {
  const role = (new URLSearchParams(location.search).get('role') || '').toLowerCase();
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
