// 접기/펼치기 띠(.fold). 띠를 누르거나, 메뉴의 같은 id 링크로 오거나, 주소 해시가
// 그 id 이면 펼친다. JS가 없으면 .is-ready 가 붙지 않아 펼친 채로 보인다.
(() => {
  document.querySelectorAll('.fold').forEach((fold) => {
    const bar = fold.querySelector('.fold-bar');
    if (!bar) return;
    const set = (open) => {
      fold.classList.toggle('is-open', open);
      bar.setAttribute('aria-expanded', String(open));
    };
    fold.classList.add('is-ready');
    bar.addEventListener('click', () => set(!fold.classList.contains('is-open')));
    if (fold.id) {
      document.querySelectorAll(`a[href="#${fold.id}"]`).forEach((a) => {
        a.addEventListener('click', () => set(true), true);
      });
      if (location.hash === `#${fold.id}`) set(true);
    }
  });
})();
