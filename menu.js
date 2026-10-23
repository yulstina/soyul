/* 모바일 메뉴. 767px 이하에서 .site-nav를 전체 화면 패널로 열고 닫는다.
   모든 페이지 헤더가 같은 마크업이라 버튼은 여기서 한 번만 만든다. */
(() => {
  const header = document.getElementById('siteHeader');
  const nav = header && header.querySelector('.site-nav');
  if (!nav) return;
  nav.id = nav.id || 'siteNav';

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'menu-btn';
  btn.setAttribute('aria-controls', nav.id);
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-label', '메뉴 열기');
  btn.innerHTML = '<i></i><i></i>';
  header.querySelector('.site-header-inner').appendChild(btn);

  const setOpen = (open) => {
    header.classList.toggle('is-menu-open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    document.body.style.overflow = open ? 'hidden' : '';
    if (window.__lenis) open ? window.__lenis.stop() : window.__lenis.start();
  };

  btn.addEventListener('click', () => setOpen(!header.classList.contains('is-menu-open')));
  // 같은 페이지 앵커는 site.js가 Lenis로 스크롤하므로, 그보다 먼저(캡처 단계에서)
  // 닫아 멈춰 둔 Lenis를 풀어 준다.
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); }, true);
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && header.classList.contains('is-menu-open')) { setOpen(false); btn.focus(); }
  });
  matchMedia('(min-width:768px)').addEventListener('change', (m) => { if (m.matches) setOpen(false); });
})();
