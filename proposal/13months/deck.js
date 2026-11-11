/* 13 MONTHS 제안서 덱: 뷰포트 맞춤 축소, 버튼 · 키보드 · 스와이프 이동, #3 같은 해시로 특정 장 열기 */
(function () {
  var deck = document.getElementById('deck');
  var slides = Array.prototype.slice.call(deck.querySelectorAll('.slide'));
  var cur = document.getElementById('dnCur');
  var total = slides.length;
  var i = 0;

  function fit() {
    var navSpace = window.innerWidth < 720 ? 72 : 88;
    var s = Math.min(window.innerWidth / 1920, (window.innerHeight - navSpace) / 1080);
    deck.style.setProperty('--s', s.toFixed(4));
    deck.style.transform = 'translateY(' + (-navSpace / 2 + 10) + 'px)';
  }

  function go(n, push) {
    i = Math.max(0, Math.min(total - 1, n));
    slides.forEach(function (el, k) {
      var on = k === i;
      el.classList.toggle('is-active', on);
      el.setAttribute('aria-hidden', on ? 'false' : 'true');
    });
    cur.textContent = String(i + 1).padStart(2, '0');
    if (push !== false) history.replaceState(null, '', '#' + (i + 1));
  }

  document.querySelector('.dn-prev').addEventListener('click', function () { go(i - 1); });
  document.querySelector('.dn-next').addEventListener('click', function () { go(i + 1); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); go(i + 1); }
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(i - 1); }
    if (e.key === 'Home') go(0);
    if (e.key === 'End') go(total - 1);
  });

  var x0 = null, y0 = null;
  deck.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
  deck.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(i + (dx < 0 ? 1 : -1));
    x0 = y0 = null;
  });

  window.addEventListener('resize', fit);
  fit();
  var h = parseInt(location.hash.slice(1), 10);
  go(isNaN(h) ? 0 : h - 1, false);
})();
