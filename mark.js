// 섹션 워드마크(ABOUT · WORK · DESIGN · WITH AI · CAREER · CONTACT): 화면에 들어오면 글자가 한 글자씩 마스크를 뚫고 올라온다.
// JS가 없거나 움직임 줄이기 설정이면 처음부터 그대로 보인다.
(() => {
  const marks = document.querySelectorAll('[data-mark]');
  if (!marks.length) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  marks.forEach((el) => {
    const text = el.textContent.trim();
    el.setAttribute('aria-label', text);
    if (!/^H[1-6]$/.test(el.tagName)) el.setAttribute('role', 'img');
    el.textContent = '';
    [...text].forEach((ch, i) => {
      const o = document.createElement('span');
      o.className = 'mk-ch';
      o.setAttribute('aria-hidden', 'true');
      o.style.setProperty('--i', i);
      o.textContent = ch === ' ' ? ' ' : ch;  // 공백이 접히지 않게
      el.appendChild(o);
    });
    el.classList.add('is-split');
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-on');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -15% 0px' });
  marks.forEach((el) => io.observe(el));
})();
