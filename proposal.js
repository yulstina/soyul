/* 13 MONTHS PROPOSAL 슬라이더: 가로 스크롤 스냅 + 이전/다음 버튼 + 카운터 */
(function () {
  var track = document.getElementById('ppTrack');
  if (!track) return;
  var slides = track.children;
  var cur = document.getElementById('ppCur');
  var prev = document.getElementById('ppPrev');
  var next = document.getElementById('ppNext');
  var i = 0;

  function index() { return Math.round(track.scrollLeft / slides[0].getBoundingClientRect().width); }
  function update() {
    i = Math.max(0, Math.min(slides.length - 1, index()));
    cur.textContent = String(i + 1).padStart(2, '0');
    prev.disabled = i === 0;
    next.disabled = i === slides.length - 1;
  }
  function go(n) {
    n = Math.max(0, Math.min(slides.length - 1, n));
    track.scrollTo({ left: slides[n].offsetLeft, behavior: 'smooth' });
  }
  prev.addEventListener('click', function () { go(i - 1); });
  next.addEventListener('click', function () { go(i + 1); });
  track.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1); }
  });
  var t;
  track.addEventListener('scroll', function () { clearTimeout(t); t = setTimeout(update, 60); }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
