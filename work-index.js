/* WORK 목록 — 필터와 썸네일 미리보기.
   필터는 목록 행, 아래 챕터 묶음, 좌측 레일을 함께 거른다. 고른 묶음만 남아야
   목록에서 행을 눌렀을 때 내려간 자리에 그 묶음이 바로 이어진다. */
(() => {
  const root = document.querySelector('.work-index');
  if (!root) return;
  const buttons = [...root.querySelectorAll('[data-filter]')];
  const rows = [...root.querySelectorAll('.work-list li')];
  const groups = [...document.querySelectorAll('.work-group[data-group]')];
  const rail = document.getElementById('chapterIndex');

  function apply(filter) {
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === filter)));
    rows.forEach((li) => { li.hidden = filter !== 'ALL' && li.dataset.group !== filter; });
    groups.forEach((g) => { g.hidden = filter !== 'ALL' && g.dataset.group !== filter; });
    if (!rail) return;
    // site.js가 만든 레일 — 묶음 이름 뒤에 그 묶음의 번호들이 이어진다.
    let current = null;
    [...rail.children].forEach((el) => {
      if (el.classList.contains('chapter-index-group')) current = el.textContent.trim();
      el.hidden = filter !== 'ALL' && current !== filter;
    });
    dispatchEvent(new Event('scroll'));
  }
  buttons.forEach((b) => b.addEventListener('click', () => apply(b.dataset.filter)));

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
