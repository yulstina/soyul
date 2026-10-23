/* DESIGN 데이터. 새 작업은 이미지를 assets/design/에 넣고 여기 한 줄을 더하면
   목록·필터 개수·뷰어에 함께 반영된다.
   - thumb : 목록 썸네일(640px 안팎), w/h는 그 썸네일 크기
   - slides: 뷰어에서 보는 원본. 두 장 이상이면 뷰어 안에서 넘긴다
   - wide  : 매스너리에서 두 칸을 쓰는 가로형 배너 */
window.DESIGN_TOOLS = [
  { step: '기획', tools: [['Claude', 'assets/icons/claude-color.svg']] },
  { step: '이미지 생성', tools: [['GPT', 'assets/icons/openai.svg', 'mask']] },
  { step: '이미지 편집·제작', tools: [['Figma', 'assets/icons/figma-color.svg']] },
  { step: '영상', tools: [['Flow', 'assets/icons/flow.webp'], ['Higgsfield', 'assets/icons/higgsfield.webp'], ['CapCut', 'CC', 'text']] },
];

window.DESIGN_ITEMS = (() => {
  const C = 'assets/design/content/';
  const set = (names) => names.map((n) => `${C}${n}.webp`);
  const range = (prefix, n) => Array.from({ length: n }, (_, i) => `${prefix}-${String(i + 1).padStart(2, '0')}`);
  return [
    // 상세페이지 — 각자 새 페이지로 열린다
    { id: 'lunea', type: 'detail', brand: 'LUNÉA LAB', title: 'LUNÉA LAB', kicker: 'COSMETIC · 2026',
      desc: '라일락빛 세럼 상세페이지. 8개 섹션에 모델 영상과 수분 그래프 애니메이션을 넣었습니다.',
      href: 'design-lunea.html', thumb: 'assets/design/lunea/strip.webp', w: 480, h: 4086 },
    { id: 'babambi', type: 'detail', brand: 'BABAMBI', title: 'BABAMBI', kicker: 'PET FOOD · 2026',
      desc: '반려견 동결건조 간식 상세페이지. 원물 비교, 6가지 옵션, 급여량과 FAQ까지 담았습니다.',
      href: 'design-babambi.html', thumb: 'assets/design/babambi/strip.webp', w: 480, h: 4524 },
    { id: 'modak', type: 'detail', brand: 'MODAK EMBER', title: 'MODAK EMBER', kicker: 'CAMPING · 2026',
      desc: '잔불처럼 켜지는 캠핑 랜턴 상세페이지. 불이 켜지는 장면과 색온도 전환을 영상으로 넣었습니다.',
      href: 'design-modak.html', thumb: 'assets/design/modak/strip.webp', w: 480, h: 3403 },

    // 콘텐츠 — 뷰어로 본다. 순서는 브랜드가 섞이도록 배치
    { id: 'modak-card', type: 'card', brand: 'MODAK EMBER', title: '생활용품 카드뉴스', fmt: 'CARD NEWS 4:5',
      size: '1080 × 1350 · 8장', thumb: `${C}modak-card-01@640.webp`, w: 640, h: 800, slides: set(range('modak-card', 8)) },
    { id: 'lunea-banner-pc', type: 'banner', brand: 'LUNÉA LAB', title: '화장품 PC 메인 배너', fmt: 'WEB BANNER',
      size: '1920 × 600', thumb: `${C}lunea-banner-pc@640.webp`, w: 960, h: 300, wide: true, slides: set(['lunea-banner-pc']) },
    { id: 'babambi-story', type: 'sns', brand: 'BABAMBI', title: '반려동물 인스타 스토리', fmt: 'STORY 9:16',
      size: '1080 × 1920 · 2장', thumb: `${C}babambi-story-1@640.webp`, w: 640, h: 1096, slides: set(['babambi-story-1', 'babambi-story-2']) },
    { id: 'modak-feed', type: 'sns', brand: 'MODAK EMBER', title: '생활용품 인스타 피드', fmt: 'FEED 4:5',
      size: '1080 × 1350 × 9', thumb: `${C}modak-feed@640.webp`, w: 800, h: 1000, slides: set(['modak-feed']) },
    { id: 'lunea-card', type: 'card', brand: 'LUNÉA LAB', title: '화장품 카드뉴스', fmt: 'CARD NEWS 4:5',
      size: '1080 × 1350 · 6장', thumb: `${C}lunea-card-01@640.webp`, w: 640, h: 800, slides: set(range('lunea-card', 6)) },
    { id: 'modak-banner', type: 'banner', brand: 'MODAK EMBER', title: '생활용품 프로모션 배너 3종', fmt: 'BANNER SET',
      size: '1920×600 · 1080×1080 · 750×1000', thumb: `${C}modak-banner-wide@640.webp`, w: 960, h: 300, wide: true,
      slides: set(['modak-banner-wide', 'modak-banner-square', 'modak-banner-mobile']) },
    { id: 'babambi-kv', type: 'banner', brand: 'BABAMBI', title: '반려동물 키비주얼', fmt: 'KEY VISUAL',
      size: '1672 × 941', thumb: `${C}babambi-kv@640.webp`, w: 960, h: 540, wide: true, slides: set(['babambi-kv']) },
    { id: 'lunea-feed', type: 'sns', brand: 'LUNÉA LAB', title: '화장품 인스타 피드', fmt: 'FEED 4:5',
      size: '1080 × 1350 × 9', thumb: `${C}lunea-feed@640.webp`, w: 800, h: 1000, slides: set(['lunea-feed']) },
    { id: 'babambi-ad', type: 'banner', brand: 'BABAMBI', title: '반려동물 광고 배너', fmt: 'AD 1:1',
      size: '1254 × 1254', thumb: `${C}babambi-ad@640.webp`, w: 640, h: 640, slides: set(['babambi-ad']) },
    { id: 'lunea-banner-event', type: 'banner', brand: 'LUNÉA LAB', title: '화장품 기획전 배너', fmt: 'WEB BANNER',
      size: '1200 × 600', thumb: `${C}lunea-banner-event@640.webp`, w: 960, h: 480, wide: true, slides: set(['lunea-banner-event']) },
    { id: 'lunea-banner-mo', type: 'banner', brand: 'LUNÉA LAB', title: '화장품 모바일 배너 2종', fmt: 'MOBILE BANNER',
      size: '750 × 900 · 2장', thumb: `${C}lunea-banner-mo-1@640.webp`, w: 640, h: 768, slides: set(['lunea-banner-mo-1', 'lunea-banner-mo-2']) },
    { id: 'babambi-feed', type: 'sns', brand: 'BABAMBI', title: '반려동물 인스타 피드', fmt: 'FEED',
      size: '프로필 + 9컷', thumb: `${C}babambi-feed@640.webp`, w: 800, h: 772, slides: set(['babambi-feed']) },
    { id: 'lunea-banner-yearend', type: 'banner', brand: 'LUNÉA LAB', title: '화장품 연말 프로모션 배너', fmt: 'WEB BANNER',
      size: '1200 × 600', thumb: `${C}lunea-banner-yearend@640.webp`, w: 960, h: 480, wide: true, slides: set(['lunea-banner-yearend']) },
  ];
})();
