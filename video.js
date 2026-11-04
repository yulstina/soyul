// AI VIDEO 띠: 누르면 dialog 를 열어 원본(소리 있음)을 재생하고, 닫으면 멈춘다.
// 영상이 늘면 VIDEOS 에 한 항목을 더하고, 띠(index.html)에 .vf-thumb 를 하나 더 둔다.
// 미리보기는 무음 반복이며, 움직임 줄이기 설정이면 처음부터 멈춘 채로 둔다.
(() => {
  const bar = document.querySelector('.vf-bar');
  let opener = null;
  const dlg = document.getElementById('videoDialog');
  if (!bar || !dlg || typeof dlg.showModal !== 'function') return;

  const ICON = {
    flow: '<img class="tool-logo" src="assets/icons/flow.webp" alt="" width="16" height="16" />Flow',
    gpt: '<i class="tool-icon" style="--icon:url(assets/icons/openai.svg)" aria-hidden="true"></i>ChatGPT',
    capcut: '<i class="tool-icon is-text" aria-hidden="true">CC</i>CapCut',
  };
  const VIDEOS = [
    { src: 'assets/video/coffee.mp4', poster: 'assets/video/coffee-poster.webp', thumb: 'assets/video/coffee-loop.webp',
      ratio: '16 / 9', meta: '29초영화제 · 주제 커피 · 0:29', title: '모든 순간의 커피',
      desc: '설레던 첫 만남부터 함께 나이 든 오늘까지, 한 사람의 인생을 커피 한 잔의 장면들로 이었습니다.',
      tools: ['flow', 'capcut'] },
    { src: 'assets/video/career.mp4?v=2', poster: 'assets/video/career-poster.webp', thumb: 'assets/video/career-loop.webp',
      ratio: '9 / 16', meta: '2026 경력단절 예방·극복 콘텐츠 공모전 · 0:46', title: '경력에 쉼표는 있어도, 마침표는 없습니다.',
      desc: '돌봄으로 잠시 멈춘 경력도 다시 이어질 수 있다는 메시지를 담았습니다. 경력단절 예방과 일·생활 균형의 중요성을 AI 영상 및 모션그래픽을 통해 전달하는 공익 캠페인 콘텐츠입니다.',
      tools: ['gpt', 'flow', 'capcut'] },
    { src: 'assets/video/babambi-ad.mp4', poster: 'assets/video/babambi-ad-poster.webp', thumb: 'assets/video/babambi-ad-loop.webp',
      ratio: '9 / 16', meta: 'BABAMBI · 동결건조 간식 광고 영상 · 0:27', title: '자연 그대로의 채소를, 사료 위에 톡톡.',
      desc: '강아지 동결건조 간식 바밤비의 광고 영상입니다. 채소 원물에서 시작해 한 끼가 특별해지는 장면까지 AI 영상으로 만들었습니다.',
      tools: [] },
  ];

  const video = dlg.querySelector('.vf-video');
  const stage = dlg.querySelector('.vf-stage');
  const tabs = dlg.querySelector('.vf-tabs');
  const $ = (id) => document.getElementById(id);

  const tabEls = VIDEOS.map((v, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'vf-tab';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', `${i + 1}번 영상 ${v.title}`);
    b.innerHTML = `<img src="${v.thumb}" alt="" loading="lazy" /><span>${String(i + 1).padStart(2, '0')}</span>`;
    b.addEventListener('click', () => show(i, true));
    tabs.appendChild(b);
    return b;
  });

  function show(i, play) {
    const v = VIDEOS[i];
    video.pause();
    video.poster = v.poster;
    video.src = v.src;
    stage.style.setProperty('--ratio', v.ratio);
    stage.classList.toggle('is-tall', v.ratio === '9 / 16');
    $('vfMeta').textContent = v.meta;
    $('vfTitle').textContent = v.title;
    $('vfDesc').textContent = v.desc;
    $('vfTools').innerHTML = v.tools.map((t) => `<span>${ICON[t]}</span>`).join('');
    $('vfTools').hidden = !v.tools.length;
    tabEls.forEach((el, n) => el.setAttribute('aria-selected', String(n === i)));
    if (play) video.play().catch(() => {});
  }

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    bar.querySelectorAll('video').forEach((l) => { l.removeAttribute('autoplay'); l.pause(); });
  }

  // 제목·썸네일·재생 버튼 어디서든 data-vf 번호의 영상부터 연다.
  bar.querySelectorAll('[data-vf]').forEach((el) => {
    el.addEventListener('click', () => {
      opener = el;
      show(Number(el.dataset.vf), true);
      dlg.showModal();
      document.documentElement.classList.add('is-locked');
    });
  });
  const close = () => dlg.close();
  dlg.querySelector('.vf-close').addEventListener('click', close);
  // 영상 바깥(어두운 배경)을 누르면 닫는다.
  dlg.addEventListener('click', (e) => { if (e.target === dlg) close(); });
  dlg.addEventListener('close', () => {
    video.pause();
    video.removeAttribute('src');
    video.load();
    document.documentElement.classList.remove('is-locked');
    if (opener) opener.focus();
  });
})();
