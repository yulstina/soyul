/* Case study pages — opening scrub, ratio-adaptive gallery, lightbox.
   style.css/site.js still own the header, smooth scroll and reveal. */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Smooth scroll. site.js is deliberately not loaded here — it is built
     around the home page's hero spacer, which these pages do not have — so the
     detail pages start their own Lenis with the same feel. */
  if (window.Lenis && !reduced) {
    const lenis = new Lenis({ lerp: 0.09 });
    // topbtn.js가 스크롤을 넘겨받을 수 있도록 노출한다.
    window.__lenis = lenis;
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
  // The header is fixed and always present here, so pages need its height.
  const header = document.getElementById('siteHeader');
  const syncHeaderHeight = () => document.documentElement.style
    .setProperty('--header-height', `${header ? header.offsetHeight : 0}px`);
  syncHeaderHeight();
  addEventListener('resize', syncHeaderHeight, { passive: true });

  // Full bleed is done in CSS alone (see .video-full). It was measured here at
  // first, but a width held in a variable is a width that can go stale, and
  // the whole layout then depends on a listener having fired.

  /* Ratio-adaptive gallery ------------------------------------------------
     Each project supplies a different kind of artwork — wide brand shots,
     tall kiosk screens, page-length site captures — so the layout is decided
     from the image itself rather than hardcoded per page. A project with one
     image then looks as deliberate as one with twenty. */
  const classify = (img) => {
    const r = img.naturalWidth / img.naturalHeight;
    if (!r || !isFinite(r)) return 'square';
    if (r < 0.42) return 'long';   // a whole page captured top to bottom
    if (r < 0.85) return 'tall';   // kiosk / phone screens
    if (r > 1.45) return 'wide';   // brand shots, banners, hero art
    return 'square';
  };

  const shots = [...document.querySelectorAll('.shot')];
  shots.forEach((shot) => {
    const img = shot.querySelector('img');
    if (!img) return;
    // A shot that names an empty state is one whose file may not exist yet. It
    // labels itself rather than showing a broken image; a 404 usually lands
    // before this runs, so the failure is checked as well as listened for.
    if (shot.dataset.empty) {
      const markEmpty = () => shot.classList.add('is-empty');
      if (img.complete && !img.naturalWidth) markEmpty();
      else img.addEventListener('error', markEmpty, { once: true });
    }
    // An explicit data-ratio in the markup always wins — some images need to
    // be featured for editorial reasons, not geometric ones.
    if (shot.dataset.ratio) return;
    const apply = () => { shot.dataset.ratio = classify(img); };
    if (img.complete && img.naturalWidth) apply();
    else img.addEventListener('load', apply, { once: true });
  });

  /* Opening ---------------------------------------------------------------
     Scroll-driven, matching the home hero. The cover recedes, the title block
     rises toward the header, and the rule draws out from the left. */
  const open = document.querySelector('.case-open');
  const coverImg = document.querySelector('.case-cover img, .case-cover video');
  const openInner = document.querySelector('.case-open-inner');
  const rule = document.querySelector('.case-rule');

  if (open && !reduced) {
    const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
    const smooth = (t) => t * t * (3 - 2 * t);
    let ticking = false;

    const update = () => {
      ticking = false;
      const h = open.offsetHeight || 1;
      const p = clamp01(scrollY / h);
      const e = smooth(p);
      // The cover pushes back into the void rather than merely scrolling off,
      // and drifts down a few percent as it goes so it reads as lagging behind
      // the page — the same depth hint the WORK chapters use on the home page.
      // The drift stays inside the headroom the scale creates (4% of 7%), so
      // the top edge of the photograph is never exposed.
      if (coverImg) {
        coverImg.style.transform =
          `translateY(${(e * 4).toFixed(2)}%) scale(${(1 + e * 0.14).toFixed(4)})`;
        coverImg.style.filter =
          `brightness(${(0.92 - e * 0.5).toFixed(3)}) saturate(${(1 - e * 0.42).toFixed(3)})`;
      }
      // The title climbs toward the header, the way SOYUL docks on the home page.
      openInner.style.transform = `translateY(${(-e * 90).toFixed(2)}px)`;
      openInner.style.opacity = String(Math.max(0, 1 - e * 1.25));
      // The rule draws early, so it is finished before the block leaves.
      if (rule) rule.style.transform = `scaleX(${smooth(clamp01(p / 0.45)).toFixed(4)})`;
    };

    addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });
    addEventListener('resize', update, { passive: true });
    update();
  } else if (rule) {
    rule.style.transform = 'scaleX(1)';
  }

  // A cover that is a recording plays itself, so someone who has asked for less
  // motion gets the poster frame instead of a loop they cannot stop.
  if (reduced && coverImg && coverImg.tagName === 'VIDEO') {
    coverImg.autoplay = false;
    coverImg.pause();
  }

  /* Video --------------------------------------------------------------------
     On a mouse, the recording runs while the pointer is over it and stops when
     the pointer leaves — the visitor decides when it moves. A touch screen has
     no pointer to hover with, so there it plays while on screen instead, and
     the corner button is the way to stop it. Muted and inline either way, which
     is what browsers require before they will start a video at all. */
  const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;

  document.querySelectorAll('video[data-inview]').forEach((video) => {
    const frame = video.parentElement;
    const toggle = frame.querySelector('.video-toggle');

    // A slot whose file has not been exported yet keeps its place in the layout
    // and labels itself, instead of showing a broken video frame. A missing
    // file 404s immediately — often before this line runs — so the error is
    // checked as well as listened for.
    const card = video.closest('.clip');
    const slot = card || (frame.classList.contains('video-main') ? frame : null);
    if (slot) {
      slot.dataset.empty = card ? 'CLIP' : 'VIDEO';
      const markEmpty = () => slot.classList.add('is-empty');
      if (video.error) markEmpty();
      else video.addEventListener('error', markEmpty);
    }

    /* The frame reserves its height from a ratio guessed in CSS. Once the file
       reports its real shape, that guess is replaced, so the videos can be
       re-exported at any ratio without anyone editing the stylesheet.
       A card in the grid does NOT take its own ratio: exports of the same set
       differ by a pixel or two, and per-card ratios turn that into a visibly
       ragged row. The first clip to report sets the shape for all of them, and
       object-fit trims the fraction of a percent that costs. */
    const applyRatio = () => {
      if (!video.videoWidth || !video.videoHeight) return;
      const ratio = video.videoWidth / video.videoHeight;
      if (!card) { frame.style.aspectRatio = `${video.videoWidth} / ${video.videoHeight}`; return; }
      const grid = card.parentElement;
      if (!grid.style.getPropertyValue('--clip-ar')) {
        grid.style.setProperty('--clip-ar', String(ratio.toFixed(4)));
      }
    };
    // Metadata for a cached file can land before this line runs, and then the
    // event never comes.
    if (video.readyState >= 1) applyRatio();
    else video.addEventListener('loadedmetadata', applyRatio);

    // Set by the button: once someone stops the loop, nothing may start it
    // again behind their back.
    let stopped = false;
    const play = () => { if (!stopped) video.play().catch(() => {}); };

    /* Three ways a recording can behave, one per kind of thing being shown.
       A short clip of an interaction reads best when the visitor starts it, so
       hovering plays it. A kiosk demo is a screen that is meant to be running,
       so it runs on its own and hovering STOPS it — that is the only way to
       hold a frame long enough to read it. `data-hover="pause"` asks for the
       second. A touch screen has no pointer for either, so both fall back to
       playing while on screen. */
    const mode = video.dataset.hover === 'pause' ? 'pause'
               : video.dataset.hover === 'none' ? 'in-view'
               : canHover ? 'hover-play' : 'in-view';
    let inView = false;
    const watchViewport = () => new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        inView = e.isIntersecting;
        if (inView) play(); else video.pause();
      });
    }, { threshold: 0.2 }).observe(video);

    if (reduced) {
      // Motion the visitor did not ask for is the thing they turned off.
      stopped = true;
      video.controls = true;
      if (toggle) toggle.hidden = true;
    } else if (mode === 'hover-play') {
      frame.addEventListener('mouseenter', play);
      frame.addEventListener('mouseleave', () => video.pause());
      // Hovering is the control here, so the button would only be a second one.
      if (toggle) toggle.hidden = true;
    } else {
      watchViewport();
      if (mode === 'pause' && canHover) {
        frame.addEventListener('mouseenter', () => video.pause());
        // Leaving must not start a video that has since scrolled away.
        frame.addEventListener('mouseleave', () => { if (inView) play(); });
      }
    }

    if (!toggle) return;
    toggle.addEventListener('click', () => {
      stopped = !stopped;
      if (stopped) video.pause(); else video.play().catch(() => {});
      toggle.textContent = stopped ? 'PLAY' : 'PAUSE';
      toggle.setAttribute('aria-pressed', String(stopped));
    });
  });

  /* Lightbox --------------------------------------------------------------
     The UI detail is the evidence, and it only reads at full size. Built once
     and reused, so opening an image costs no layout work. */
  const box = document.createElement('div');
  box.className = 'lightbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', '이미지 확대 보기');
  box.innerHTML =
    '<button class="lightbox-close" type="button">CLOSE ✕</button><img alt="" />';
  document.body.appendChild(box);
  const boxImg = box.querySelector('img');
  const closeBtn = box.querySelector('.lightbox-close');
  let lastFocus = null;

  const openBox = (img, long) => {
    lastFocus = document.activeElement;
    boxImg.src = img.currentSrc || img.src;
    boxImg.alt = img.alt || '';
    box.classList.toggle('is-long', long);
    box.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  };
  const closeBox = () => {
    box.classList.remove('is-open');
    document.body.style.overflow = '';
    // Release the decoded image so a long capture is not held in memory.
    boxImg.removeAttribute('src');
    if (lastFocus) lastFocus.focus();
  };

  // A page capture is shown cropped to its top, so the lightbox is the only
  // way to read the rest of it — it opens scrollable at full length.
  const isPage = (shot) =>
    shot.dataset.ratio === 'long' || shot.dataset.ratio === 'long-narrow';

  shots.forEach((shot) => {
    const img = shot.querySelector('img');
    if (!img) return;
    shot.addEventListener('click', () => openBox(img, isPage(shot)));
    // Every shot needs a keyboard route to the same thing the mouse gets.
    shot.tabIndex = 0;
    shot.setAttribute('role', 'button');
    shot.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      openBox(img, isPage(shot));
    });
  });

  closeBtn.addEventListener('click', closeBox);
  box.addEventListener('click', (e) => { if (e.target === box) closeBox(); });
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && box.classList.contains('is-open')) closeBox();
  });
})();
