/* 상세페이지를 원본 HTML 그대로(iframe) 넣을 때 쓴다. 원본의 등장 효과·카운트업·애니메이션을 살리기 위해서다.
   - iframe 높이를 원본 문서 높이에 맞춘다(내부 스크롤 없음)
   - 원본의 section 위치에 맞춰 부모 쪽 #s1… 앵커를 옮겨 SECTIONS 목차가 그대로 동작한다
   - iframe 위에서 휠을 굴려도 부모(Lenis) 스크롤로 넘긴다 */
(() => {
  document.querySelectorAll('[data-embed]').forEach((frame) => {
    const paper = frame.parentElement;
    const anchors = [...paper.querySelectorAll('.dd-anchor')];
    const sync = () => {
      const doc = frame.contentDocument;
      if (!doc || !doc.body) return;
      frame.style.height = `${doc.documentElement.scrollHeight}px`;
      const secs = doc.querySelectorAll('section');
      anchors.forEach((a, i) => {
        const s = secs[i];
        if (!s) return;
        a.style.top = `${s.offsetTop}px`;
        a.style.height = `${s.offsetHeight}px`;
      });
    };
    const init = () => {
      const win = frame.contentWindow;
      const doc = frame.contentDocument;
      if (!doc) return;
      sync();
      if ('ResizeObserver' in window) new ResizeObserver(sync).observe(doc.body);
      win.addEventListener('load', sync);
      doc.fonts?.ready.then(sync);
      win.addEventListener('wheel', (e) => {
        const lenis = window.__lenis;
        e.preventDefault();
        if (lenis) lenis.scrollTo(lenis.targetScroll + e.deltaY);
        else window.scrollBy(0, e.deltaY);
      }, { passive: false });
    };
    if (frame.contentDocument?.readyState === 'complete') init();
    frame.addEventListener('load', init);
    window.addEventListener('resize', sync);
  });
})();
