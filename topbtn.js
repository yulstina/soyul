/* Back-to-top button. Shared by the home page and every case study, so the
   markup is built here rather than repeated in nine HTML files. */
(() => {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'to-top';
  btn.setAttribute('aria-label', '맨 위로');
  btn.innerHTML = '<span aria-hidden="true">↑</span>';
  document.body.appendChild(btn);

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  btn.addEventListener('click', () => {
    // Lenis owns the scroll position when it is running; a native scrollTo
    // would be fought by its animation loop.
    if (window.__lenis) window.__lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  });

  // Appears once there is somewhere to go back to.
  let ticking = false;
  const sync = () => {
    ticking = false;
    btn.classList.toggle('is-visible', scrollY > innerHeight * 0.9);
  };
  addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(sync);
  }, { passive: true });
  sync();
})();
