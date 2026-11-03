// AI VIDEO 띠: 누르면 dialog 를 열어 원본(소리 있음)을 재생하고, 닫으면 멈춘다.
// 미리보기는 무음 반복이며, 움직임 줄이기 설정이면 처음부터 멈춘 채로 둔다.
(() => {
  const bar = document.querySelector('.vf-bar');
  const dlg = document.getElementById('videoDialog');
  if (!bar || !dlg || typeof dlg.showModal !== 'function') return;
  const video = dlg.querySelector('.vf-video');
  const loop = bar.querySelector('video');

  if (loop && matchMedia('(prefers-reduced-motion: reduce)').matches) {
    loop.removeAttribute('autoplay');
    loop.pause();
  }

  bar.addEventListener('click', () => {
    dlg.showModal();
    document.documentElement.classList.add('is-locked');
    video.play().catch(() => {});
  });
  const close = () => dlg.close();
  dlg.querySelector('.vf-close').addEventListener('click', close);
  // 영상 바깥(어두운 배경)을 누르면 닫는다.
  dlg.addEventListener('click', (e) => { if (e.target === dlg) close(); });
  dlg.addEventListener('close', () => {
    video.pause();
    document.documentElement.classList.remove('is-locked');
    bar.focus();
  });
})();
