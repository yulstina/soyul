/* DESIGN 데이터. 새 작업은 이미지를 assets/design/에 넣고 여기 한 줄을 더하면
   목록·필터 개수·뷰어에 함께 반영된다.
   - thumb : 목록 썸네일(640px 안팎), w/h는 그 썸네일 크기
   - slides: 뷰어에서 보는 원본. 두 장 이상이면 뷰어 안에서 넘긴다
   - wide  : 매스너리에서 두 칸을 쓰는 가로형 배너 */
window.DESIGN_TOOLS = [
  { step: '기획', tools: [['Claude', 'assets/icons/claude-color.svg']] },
  { step: '이미지 생성', tools: [['GPT', 'assets/icons/openai.svg', 'mask']] },
  { step: '이미지 편집·제작', tools: [['Figma', 'assets/icons/figma-color.svg'], ['Photoshop', 'assets/icons/photoshop.svg', 'mask'], ['Illustrator', 'assets/icons/illustrator.svg', 'mask']] },
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

    { id: 'cirrus', type: 'detail', brand: 'CIRRUS NIMBUS', title: 'CIRRUS NIMBUS', kicker: 'HOME APPLIANCE · 2026',
      desc: '날개 없는 링에 바람과 빛을 담은 서큘레이터 팬램프 상세페이지. 23개 섹션에 시연 영상 4컷을 넣었습니다.',
      href: 'design-cirrus.html', thumb: 'assets/design/cirrus/strip.webp', w: 480, h: 4400 },

    // 콘텐츠 — 뷰어로 본다. 순서는 브랜드가 섞이도록 배치
    { id: 'modak-card', type: 'card', brand: 'MODAK EMBER', title: '생활용품 카드뉴스', fmt: 'CARD NEWS 4:5',
      size: '1080 × 1350 · 8장', thumb: `${C}modak-card-01@640.webp`, w: 640, h: 800, slides: set(range('modak-card', 8)) },
    { id: 'lunea-banner-pc', type: 'banner', brand: 'LUNÉA LAB', title: '화장품 PC 메인 배너', fmt: 'WEB BANNER',
      size: '1920 × 600', thumb: `${C}lunea-banner-pc@640.webp`, w: 960, h: 300, wide: true, slides: set(['lunea-banner-pc']) },
    { id: 'babambi-story', type: 'sns', brand: 'BABAMBI', title: '반려동물 인스타 스토리', fmt: 'STORY 9:16',
      size: '1080 × 1920 · 2장', thumb: `${C}babambi-story-1@640.webp`, w: 640, h: 1096, slides: set(['babambi-story-1', 'babambi-story-2']) },
    { id: 'cirrus-card', type: 'card', brand: 'CIRRUS NIMBUS', title: '가전 카드뉴스', fmt: 'CARD NEWS 4:5',
      size: '1080 × 1350 · 8장', thumb: `${C}cirrus-card-01@640.webp`, w: 640, h: 800, slides: set(range('cirrus-card', 8)) },
    { id: 'modak-feed', type: 'sns', brand: 'MODAK EMBER', title: '생활용품 인스타 피드', fmt: 'FEED 4:5',
      size: '1080 × 1350 × 9', thumb: `${C}modak-feed@640.webp`, w: 800, h: 1000, slides: set(['modak-feed']) },
    { id: 'gyeol-card', type: 'card', brand: 'GYEOL', title: '바디워시 카드뉴스', fmt: 'CARD NEWS 4:5',
      size: '1080 × 1350 · 5장', thumb: `${C}gyeol-card-01@640.webp`, w: 640, h: 800, slides: set(range('gyeol-card', 5)) },
    { id: 'lunea-card', type: 'card', brand: 'LUNÉA LAB', title: '화장품 카드뉴스', fmt: 'CARD NEWS 4:5',
      size: '1080 × 1350 · 6장', thumb: `${C}lunea-card-01@640.webp`, w: 640, h: 800, slides: set(range('lunea-card', 6)) },
    { id: 'modak-banner', type: 'banner', brand: 'MODAK EMBER', title: '생활용품 프로모션 배너 3종', fmt: 'BANNER SET',
      size: '1920×600 · 1080×1080 · 750×1000', thumb: `${C}modak-banner-wide@640.webp`, w: 960, h: 300, wide: true,
      slides: set(['modak-banner-wide', 'modak-banner-square', 'modak-banner-mobile']) },
    { id: 'gyeol-banner', type: 'banner', brand: 'GYEOL', title: '바디워시 프로모션 배너 3종', fmt: 'BANNER SET',
      size: '1920×720 · 750×1000 · 1200×160', thumb: `${C}gyeol-banner-wide@640.webp`, w: 960, h: 360, wide: true,
      slides: set(['gyeol-banner-wide', 'gyeol-banner-mobile', 'gyeol-banner-strip']) },
    { id: 'babambi-kv', type: 'banner', brand: 'BABAMBI', title: '반려동물 키비주얼', fmt: 'KEY VISUAL',
      size: '1672 × 941', thumb: `${C}babambi-kv@640.webp`, w: 960, h: 540, wide: true, slides: set(['babambi-kv']) },
    { id: 'cirrus-banner', type: 'banner', brand: 'CIRRUS NIMBUS', title: '가전 프로모션 배너 3종', fmt: 'BANNER SET',
      size: '1920×600 · 1920×140 · 1080×1080', thumb: `${C}cirrus-banner-wide@640.webp`, w: 960, h: 300, wide: true,
      slides: set(['cirrus-banner-wide', 'cirrus-banner-strip', 'cirrus-banner-square']) },
    { id: 'lunea-feed', type: 'sns', brand: 'LUNÉA LAB', title: '화장품 인스타 피드', fmt: 'FEED 4:5',
      size: '1080 × 1350 × 9', thumb: `${C}lunea-feed@640.webp`, w: 800, h: 1000, slides: set(['lunea-feed']) },
    { id: 'gyeol-story', type: 'sns', brand: 'GYEOL', title: '바디워시 인스타 스토리', fmt: 'STORY 9:16',
      size: '1080 × 1920', thumb: `${C}gyeol-story@640.webp`, w: 640, h: 1138, slides: set(['gyeol-story']) },
    { id: 'babambi-ad', type: 'banner', brand: 'BABAMBI', title: '반려동물 광고 배너', fmt: 'AD 1:1',
      size: '1254 × 1254', thumb: `${C}babambi-ad@640.webp`, w: 640, h: 640, slides: set(['babambi-ad']) },
    { id: 'cirrus-feed', type: 'sns', brand: 'CIRRUS NIMBUS', title: '가전 인스타 피드', fmt: 'FEED 1:1',
      size: '1080 × 1080 × 9', thumb: `${C}cirrus-feed@640.webp`, w: 800, h: 800, slides: set(['cirrus-feed']) },
    { id: 'lunea-banner-event', type: 'banner', brand: 'LUNÉA LAB', title: '화장품 기획전 배너', fmt: 'WEB BANNER',
      size: '1200 × 600', thumb: `${C}lunea-banner-event@640.webp`, w: 960, h: 480, wide: true, slides: set(['lunea-banner-event']) },
    { id: 'lunea-banner-mo', type: 'banner', brand: 'LUNÉA LAB', title: '화장품 모바일 배너 2종', fmt: 'MOBILE BANNER',
      size: '750 × 900 · 2장', thumb: `${C}lunea-banner-mo-1@640.webp`, w: 640, h: 768, slides: set(['lunea-banner-mo-1', 'lunea-banner-mo-2']) },
    { id: 'gyeol-feed', type: 'sns', brand: 'GYEOL', title: '바디워시 인스타 피드', fmt: 'FEED 4:5',
      size: '1080 × 1350 × 9', thumb: `${C}gyeol-feed@640.webp`, w: 800, h: 995, slides: set(['gyeol-feed']) },
    { id: 'babambi-feed', type: 'sns', brand: 'BABAMBI', title: '반려동물 인스타 피드', fmt: 'FEED',
      size: '프로필 + 9컷', thumb: `${C}babambi-feed@640.webp`, w: 800, h: 772, slides: set(['babambi-feed']) },
    { id: 'lunea-banner-yearend', type: 'banner', brand: 'LUNÉA LAB', title: '화장품 연말 프로모션 배너', fmt: 'WEB BANNER',
      size: '1200 × 600', thumb: `${C}lunea-banner-yearend@640.webp`, w: 960, h: 480, wide: true, slides: set(['lunea-banner-yearend']) },
  ];
})();
