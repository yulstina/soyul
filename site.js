/* SOYUL PORTFOLIO — page behaviour outside the hero.
   Four small jobs: smooth scroll, the header drop, the chapter coordinate
   read-out, and one shared reveal primitive. Nothing here owns layout. */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.getElementById('siteHeader');
  // The spacer's measured height is the single source of truth for where the
  // hero ends — hero.js sizes it from --hero-span, so reading it here keeps the
  // two files in step without either of them knowing the token.
  const spacer = document.getElementById('heroSpacer');

  /* Smooth scroll ---------------------------------------------------------
     Lenis gives the page its weight. The hero's scroll handler reads
     window.scrollY, which Lenis keeps in sync, so the two do not fight. */
  if (window.Lenis && !reduced) {
    const lenis = new Lenis({ lerp: 0.09 });
    // topbtn.js가 스크롤을 넘겨받을 수 있도록 노출한다.
    window.__lenis = lenis;
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);

    // Anchors have to go through Lenis or the native jump fights the loop.
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -header.offsetHeight });
      });
    });
  }

  /* Header ----------------------------------------------------------------
     It drops in only once the work sheet has fully covered the hero — the
     "딸깍" beat at the end of the black-hole exit. */
  function syncHeader() {
    // The nav has to be settled before the hero's SOYUL docks into it, so this
    // fires early in the docking phase. That phase starts where the WORK sheet
    // begins covering the fixed hero — one viewport before the spacer ends.
    const uncovered = Math.max(1, spacer.offsetHeight - innerHeight);
    const covered = scrollY >= uncovered + innerHeight * 0.2;
    header.classList.toggle('is-visible', covered);
    document.documentElement.style.setProperty(
      '--header-height', `${header.offsetHeight}px`
    );
  }

  /* Chapter coordinates ---------------------------------------------------
     Built from the DOM so adding or reordering a chapter in index.html needs
     no change here. */
  const chapters = [...document.querySelectorAll('[data-chapter]')];
  const nav = document.getElementById('chapterIndex');

  const links = chapters.map((ch, i) => {
    const a = document.createElement('a');
    a.href = `#${ch.id}`;
    a.textContent = String(i + 1).padStart(2, '0');
    a.setAttribute('aria-label', ch.dataset.chapter);
    nav.appendChild(a);
    return a;
  });

  function syncChapters() {
    // The rail reads out chapter positions, so it belongs to the chapters —
    // not to WORK as a whole. Keying it to the section would light it up over
    // the intro copy, which it then sits on top of.
    const first = chapters[0].getBoundingClientRect();
    const last = chapters[chapters.length - 1].getBoundingClientRect();
    nav.classList.toggle('is-active',
      first.top < innerHeight * 0.5 && last.bottom > innerHeight * 0.5);

    // Current = the chapter whose box straddles the middle of the screen.
    const mid = innerHeight / 2;
    let current = -1;
    chapters.forEach((ch, i) => {
      const b = ch.getBoundingClientRect();
      if (b.top <= mid && b.bottom >= mid) current = i;
    });
    links.forEach((a, i) => a.classList.toggle('is-current', i === current));
  }

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      syncHeader();
      syncChapters();
    });
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll, { passive: true });

  /* Closing field --------------------------------------------------------
     The void comes back for the last screen so the page ends where it began.
     Deliberately not the hero's animated field: this one is drawn once and
     never again — no rAF, no scroll work. A second live particle loop would
     cost real frames for a screen nobody interacts with. */
  const field = document.getElementById('contactField');
  if (field) {
    const ctx = field.getContext('2d', { alpha: true });
    const draw = () => {
      const rect = field.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      field.width = Math.round(rect.width * dpr);
      field.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, rect.width, rect.height);
      // Sparser than the hero's field — this is an echo, not a repeat. Much
      // below this it stops reading as a field at all and just looks like dust.
      const count = Math.round((rect.width * rect.height) / 3400);
      for (let i = 0; i < count; i++) {
        const x = Math.random() * rect.width;
        const y = Math.random() * rect.height;
        ctx.beginPath();
        ctx.arc(x, y, Math.random() * 1.1 + 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(250,250,248,${(Math.random() * 0.26 + 0.07).toFixed(3)})`;
        ctx.fill();
      }
    };
    draw();
    let redraw;
    addEventListener('resize', () => {
      clearTimeout(redraw);
      redraw = setTimeout(draw, 180);
    }, { passive: true });
  }

  /* Reveal is not here on purpose ----------------------------------------
     [data-reveal] runs on a native CSS scroll timeline (see style.css). No
     observer, no class toggling, nothing on the main thread. Browsers without
     scroll-timeline support get the static finished state, which is the right
     fallback rather than a degraded one. */

  syncHeader();
  syncChapters();
})();
