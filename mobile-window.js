/* Mobile-size window ------------------------------------------------------
   모바일 웹앱 링크(data-mobile-window)는 PC에서 휴대폰 크기의 새 창으로 연다.
   휴대폰에서는 화면이 이미 모바일 크기라 평소처럼 새 탭으로 열린다.
   팝업이 막히면 링크 기본 동작대로 새 탭으로 연다. */
(() => {
  document.querySelectorAll('a[data-mobile-window]').forEach((link) => {
    link.addEventListener('click', (e) => {
      if (innerWidth < 768 || matchMedia('(pointer:coarse)').matches) return;
      // 화면 크기를 알려주지 않는 환경도 있어, 값이 없으면 창 크기로 대신한다.
      const sw = screen.availWidth || outerWidth || innerWidth;
      const sh = screen.availHeight || outerHeight || innerHeight;
      const w = 390, h = Math.max(600, Math.min(844, sh - 40));
      const left = Math.max(0, Math.round((sw - w) / 2));
      const top = Math.max(0, Math.round((sh - h) / 2));
      const win = window.open(link.href, 'mobileWebApp',
        `popup,width=${w},height=${h},left=${left},top=${top}`);
      if (win) { e.preventDefault(); win.focus(); }
    });
  });
})();
