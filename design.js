/* DESIGN 목록·상세 페이지. 데이터는 design-data.js.
   - 목록: 공통 툴 띠, 분류 필터, 상세페이지 롱폼 카드, 콘텐츠 매스너리, 뷰어
   - 상세: 섹션 미니맵의 현재 위치 표시 */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ITEMS = window.DESIGN_ITEMS || [];
  const toolsFor = (brand) => (window.designToolsFor ? window.designToolsFor(brand) : window.DESIGN_TOOLS || []);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const toolIcon = ([name, src, kind]) => {
    if (kind === 'text') return `<i class="tool-icon is-text" aria-hidden="true">${src}</i>`;
    if (kind === 'mask') return `<i class="tool-icon" style="--icon:url(${src})" aria-hidden="true"></i>`;
    return `<img class="tool-logo" src="${src}" alt="" width="16" height="16" />`;
  };
  const toolRow = (brand) => {
    const all = toolsFor(brand).flatMap((s) => s.tools);
    return `<span class="tool-row" role="img" aria-label="${all.map((t) => t[0]).join(', ')}">${all.map(toolIcon).join('')}</span>`;
  };

  // 공통 툴 띠 — 목록과 상세 페이지가 같은 마크업을 쓴다.
  document.querySelectorAll('[data-tool-steps]').forEach((el) => {
    el.innerHTML = toolsFor(el.dataset.brand).map((s, i) => `
      <div class="tool-step">
        <span class="meta">${String(i + 1).padStart(2, '0')} · ${s.step}</span>
        <div class="tool-step-tags">${s.tools.map((t) => `<span>${toolIcon(t)}${t[0]}</span>`).join('')}</div>
      </div>`).join('');
  });

  initMap();

  const root = document.querySelector('.design-index');
  if (!root) return;

  /* 상세페이지 롱폼 카드 ------------------------------------------------------ */
  const details = ITEMS.filter((it) => it.type === 'detail');
  const longList = root.querySelector('.long-list');
  longList.innerHTML = details.map((it) => `
    <a class="long-card" href="${it.href}">
      <span class="long-win"><img src="${it.thumb}" width="${it.w}" height="${it.h}" alt="${esc(it.title)} 상세페이지 미리보기" /><span class="long-bar" aria-hidden="true"><i></i></span></span>
      <span class="long-text">
        <span class="meta">${it.kicker}</span>
        <h3>${esc(it.title)}</h3>
        <p>${esc(it.desc)}</p>
        ${toolRow(it.brand)}
        <span class="long-go"><i aria-hidden="true">→</i>상세페이지 보기</span>
      </span>
    </a>`).join('');

  // 올렸을 때 흘러갈 거리와 시간. 길이에 비례시켜 체감 속도를 맞춘다.
  const longShift = () => longList.querySelectorAll('.long-card').forEach((card) => {
    const win = card.querySelector('.long-win');
    const d = card.querySelector('img').getBoundingClientRect().height - win.getBoundingClientRect().height;
    if (d <= 0) return;
    card.style.setProperty('--shift', `${-d}px`);
    card.style.setProperty('--dur', `${Math.min(14, Math.max(5, d / 320)).toFixed(1)}s`);
  });
  longList.querySelectorAll('img').forEach((img) => {
    if (img.complete) longShift(); else img.addEventListener('load', longShift, { once: true });
  });
  addEventListener('resize', longShift, { passive: true });

  /* 콘텐츠 매스너리 ---------------------------------------------------------- */
  const contents = ITEMS.filter((it) => it.type !== 'detail');
  const mason = root.querySelector('.mason');
  mason.innerHTML = contents.map((it, i) => {
    const many = it.slides.length > 1;
    const cls = ['cell', it.wide && 'is-wide', it.type === 'card' && 'is-deck'].filter(Boolean).join(' ');
    return `
      <button class="${cls}" type="button" data-type="${it.type}" data-i="${i}" aria-label="${esc(it.brand)} ${esc(it.title)}, 크게 보기">
        <span class="cell-media"><img src="${it.thumb}" width="${it.w}" height="${it.h}" alt="" loading="lazy" />${many ? `<span class="cell-count">${it.slides.length}</span>` : ''}</span>
        <span class="cell-cap"><b>${esc(it.title)}</b><span>${esc(it.brand)}</span></span>
      </button>`;
  }).join('');
  const cells = [...mason.querySelectorAll('.cell')];

  const layout = () => {
    const row = parseFloat(getComputedStyle(mason).gridAutoRows) || 6;
    cells.forEach((c) => {
      if (c.hidden) return;
      c.style.gridRowEnd = `span ${Math.ceil((c.getBoundingClientRect().height + 28) / row)}`;
    });
  };
  mason.querySelectorAll('img').forEach((img) => img.addEventListener('load', layout));
  addEventListener('resize', layout, { passive: true });

  /* 분류 필터 ---------------------------------------------------------------- */
  const bar = root.querySelector('.design-filter');
  const thumbBar = bar.querySelector('.design-filter-thumb');
  const zoneLong = root.querySelector('#zone-detail');
  const zoneContent = root.querySelector('#zone-content');
  const count = (type) => (type === 'all' ? ITEMS : ITEMS.filter((it) => it.type === type)).length;
  const pad = (n) => String(n).padStart(2, '0');
  // 개수가 0인 분류는 버튼을 만들지 않는다.
  [...bar.querySelectorAll('button')].forEach((b) => {
    const n = count(b.dataset.filter);
    if (!n) b.remove(); else b.querySelector('span').textContent = pad(n);
  });
  root.querySelector('.design-total').textContent = pad(ITEMS.length);
  const buttons = [...bar.querySelectorAll('button')];
  let current = 'all';

  const moveThumb = (btn) => {
    thumbBar.style.width = `${btn.offsetWidth}px`;
    thumbBar.style.transform = `translateX(${btn.offsetLeft}px)`;
  };
  const apply = (filter, animate = true) => {
    current = filter;
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === filter)));
    const on = buttons.find((b) => b.dataset.filter === filter);
    moveThumb(on);
    on.scrollIntoView?.({ inline: 'nearest', block: 'nearest' });
    zoneLong.hidden = !(filter === 'all' || filter === 'detail');
    zoneContent.hidden = filter === 'detail';
    cells.forEach((c) => {
      const show = filter === 'all' || c.dataset.type === filter;
      c.hidden = !show;
      if (show && animate && !reduced) {
        c.classList.add('is-leave');
        requestAnimationFrame(() => requestAnimationFrame(() => c.classList.remove('is-leave')));
      }
    });
    layout();
    longShift();
  };
  bar.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b || b.dataset.filter === current) return;
    apply(b.dataset.filter);
    // 분류별 링크를 바로 보낼 수 있게 해시로 남긴다.
    history.replaceState(null, '', b.dataset.filter === 'all' ? location.pathname : `#${b.dataset.filter}`);
  });
  const fromHash = location.hash.slice(1);
  apply(buttons.some((b) => b.dataset.filter === fromHash) ? fromHash : 'all', false);
  const settle = () => { moveThumb(buttons.find((b) => b.dataset.filter === current)); layout(); };
  addEventListener('resize', settle, { passive: true });
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => {
    settle();
    requestAnimationFrame(() => bar.classList.add('is-ready'));
  });

  /* 뷰어 --------------------------------------------------------------------- */
  const dlg = root.querySelector('.viewer');
  const stage = dlg.querySelector('.viewer-stage');
  const counter = dlg.querySelector('.viewer-count');
  const titleEl = dlg.querySelector('.viewer-title');
  const metaEl = dlg.querySelector('.viewer-meta');
  let idx = 0;
  let lastCell = null;
  let track = null;

  const visible = () => cells.filter((c) => !c.hidden).map((c) => +c.dataset.i);
  const render = () => {
    const it = contents[idx];
    const list = visible();
    stage.querySelector('.viewer-media, .viewer-track')?.remove();
    let media;
    if (it.slides.length > 1) {
      media = document.createElement('div');
      media.className = 'viewer-track';
      media.setAttribute('data-lenis-prevent', '');
      media.innerHTML = it.slides.map((src, k) =>
        `<div><img src="${src}" alt="${esc(it.title)} ${k + 1}장" ${k > 1 ? 'loading="lazy"' : ''} /></div>`).join('');
      media.addEventListener('scroll', syncCount, { passive: true });
      track = media;
    } else {
      media = document.createElement('img');
      media.className = 'viewer-media';
      media.src = it.slides[0];
      media.alt = `${it.brand} ${it.title}`;
      track = null;
    }
    stage.prepend(media);
    counter.textContent = `${pad(list.indexOf(idx) + 1)} / ${pad(list.length)}`;
    titleEl.innerHTML = `<span class="meta">${esc(it.brand)}</span><h2>${esc(it.title)}</h2>`;
    metaEl.innerHTML = `<div><dt>FORMAT</dt><dd>${esc(it.fmt)}</dd></div><div><dt>SIZE</dt><dd>${esc(it.size)}</dd></div>`
      + `<div><dt>PAGE</dt><dd class="viewer-page">${it.slides.length > 1 ? `01 / ${pad(it.slides.length)}` : '—'}</dd></div>`
      + `<div><dt>TOOLS</dt><dd>${toolRow(it.brand)}</dd></div>`;
  };
  function syncCount() {
    if (!track) return;
    const k = Math.round(track.scrollLeft / track.clientWidth);
    const n = track.children.length;
    dlg.querySelector('.viewer-page').textContent = `${pad(k + 1)} / ${pad(n)}`;
  }
  const go = (dir) => {
    // 여러 장짜리는 장을 먼저 넘기고, 끝에 닿으면 다음 작업으로 간다.
    if (track) {
      const k = Math.round(track.scrollLeft / track.clientWidth) + dir;
      if (k >= 0 && k < track.children.length) {
        track.scrollTo({ left: k * track.clientWidth, behavior: reduced ? 'auto' : 'smooth' });
        return;
      }
    }
    const list = visible();
    idx = list[(list.indexOf(idx) + dir + list.length) % list.length];
    render();
    if (track && dir < 0) track.scrollLeft = track.scrollWidth;
  };
  const open = (cell) => {
    lastCell = cell;
    idx = +cell.dataset.i;
    const img = cell.querySelector('img');
    const show = () => { render(); dlg.showModal(); window.__lenis?.stop(); };
    // 누른 썸네일이 그 자리에서 커지며 뷰어가 된다. 미지원 브라우저는 바로 열린다.
    if (document.startViewTransition && !reduced) {
      img.style.viewTransitionName = 'design-media';
      document.startViewTransition(() => {
        img.style.viewTransitionName = '';
        show();
        stage.querySelector('img').style.viewTransitionName = 'design-media';
      }).finished.finally(() => {
        const m = stage.querySelector('img');
        if (m) m.style.viewTransitionName = '';
      });
    } else show();
  };
  mason.addEventListener('click', (e) => {
    const cell = e.target.closest('.cell');
    if (cell) open(cell);
  });
  dlg.querySelector('.viewer-close').addEventListener('click', () => dlg.close());
  dlg.querySelector('.viewer-prev').addEventListener('click', () => go(-1));
  dlg.querySelector('.viewer-next').addEventListener('click', () => go(1));
  dlg.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
  });
  // 바깥 빈 곳을 누르면 닫는다.
  stage.addEventListener('click', (e) => { if (e.target === stage) dlg.close(); });
  dlg.addEventListener('close', () => {
    window.__lenis?.start();
    stage.querySelector('.viewer-media, .viewer-track')?.remove();
    lastCell?.focus();
  });
  // 한 장짜리는 좌우로 밀어 다음 작업으로. 여러 장짜리는 트랙이 직접 스크롤된다.
  let sx = null;
  stage.addEventListener('touchstart', (e) => { sx = track ? null : e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', (e) => {
    if (sx === null) return;
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    sx = null;
  });

  /* 상세 페이지 미니맵 ------------------------------------------------------- */
  function initMap() {
    const map = document.querySelector('.dd-map');
    if (!map || !('IntersectionObserver' in window)) return;
    // 목차는 섹션 몇 개씩을 한 단계로 묶는다. 어느 섹션이 보이든 그 단계가 켜진다.
    const links = [...map.querySelectorAll('a')];
    const byId = new Map(links.flatMap((a) => (a.dataset.secs || a.hash.slice(1)).split(' ').map((id) => [id, a])));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((a) => a.removeAttribute('aria-current'));
        byId.get(en.target.id)?.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    byId.forEach((_, id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    // Lenis가 돌고 있으면 앵커 이동도 Lenis로 보낸다.
    links.forEach((a) => a.addEventListener('click', (e) => {
      const target = document.getElementById(a.hash.slice(1));
      if (!target || !window.__lenis) return;
      e.preventDefault();
      window.__lenis.scrollTo(target, { offset: -(document.getElementById('siteHeader')?.offsetHeight || 0) - 16 });
    }));
  }
})();
