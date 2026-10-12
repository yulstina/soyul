/* WORK 목록 — 필터(슬라이드 전환)와 썸네일 미리보기.
   행은 각 프로젝트 상세 페이지로 바로 이어진다. */
(() => {
  const root = document.querySelector('.work-index');
  if (!root) return;
  const buttons = [...root.querySelectorAll('[data-filter]')];
  const rows = [...root.querySelectorAll('.work-list li')];

  const bar = root.querySelector('.work-filter');
  const thumbBar = bar.querySelector('.work-filter-thumb');
  const list = root.querySelector('.work-list');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const EASE = 'cubic-bezier(.22,1,.36,1)';
  let index = 0;
  let busy = null;

  // 흰 바탕을 고른 버튼 크기·위치에 맞춘다.
  function moveThumb(btn) {
    thumbBar.style.width = `${btn.offsetWidth}px`;
    thumbBar.style.transform = `translateX(${btn.offsetLeft}px)`;
  }

  function filterTo(filter) {
    rows.forEach((li) => { li.hidden = filter !== 'ALL' && li.dataset.group !== filter; });
  }

  // 오른쪽 버튼으로 가면 목록이 왼쪽으로 밀려나고 새 목록이 오른쪽에서 들어온다.
  async function apply(next) {
    const to = buttons.indexOf(next);
    if (to === index) return;
    const dir = to > index ? 1 : -1;
    index = to;
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === next)));
    moveThumb(next);

    const filter = next.dataset.filter;
    if (reduce.matches || !list.animate) { filterTo(filter); return; }

    if (busy) busy.cancel();
    const out = list.animate(
      [{ transform: 'translateX(0)', opacity: 1 },
       { transform: `translateX(${-dir * 8}%)`, opacity: 0 }],
      { duration: 240, easing: 'cubic-bezier(.4,0,1,1)', fill: 'forwards' });
    busy = out;
    try { await out.finished; } catch { return; } // 더 빠른 클릭이 이 전환을 끊었다
    filterTo(filter);
    out.cancel();
    busy = list.animate(
      [{ transform: `translateX(${dir * 8}%)`, opacity: 0 },
       { transform: 'translateX(0)', opacity: 1 }],
      { duration: 520, easing: EASE });
  }

  buttons.forEach((b) => b.addEventListener('click', () => apply(b)));
  moveThumb(buttons[0]);
  requestAnimationFrame(() => bar.classList.add('is-ready'));
  addEventListener('resize', () => moveThumb(buttons[index]));
  document.fonts?.ready.then(() => moveThumb(buttons[index]));

  // 썸네일 미리보기 ---------------------------------------------------------
  const thumb = root.querySelector('.work-thumb');
  const img = thumb.querySelector('img');
  if (!matchMedia('(hover: hover)').matches) return;
  let x = 0, y = 0, raf = 0;
  const place = () => {
    raf = 0;
    thumb.style.transform = `translate3d(${x + 28}px,${y + 20}px,0)`;
  };
  root.querySelectorAll('.work-row').forEach((a) => {
    a.addEventListener('mouseenter', () => {
      if (img.getAttribute('src') !== a.dataset.thumb) img.src = a.dataset.thumb;
      thumb.classList.add('is-on');
    });
    a.addEventListener('mouseleave', () => thumb.classList.remove('is-on'));
  });
  root.addEventListener('mousemove', (e) => {
    x = e.clientX; y = e.clientY;
    if (!raf) raf = requestAnimationFrame(place);
  });
})();
