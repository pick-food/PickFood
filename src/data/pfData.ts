const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=720&q=80&auto=format&fit=crop`;

export interface PFProduct {
  id: string;
  cat: string;
  subcat: string;
  origin: string;
  name: string;
  brand: string;
  price: number;
  originalPrice: number | null;
  img: string;
  tags: string[];
  allergens: string[];
  nutrition: { protein: number; carb: number; fat: number; sodium: number; sugar: number; kcal: number };
  rating: number;
  reviews: number;
  badge: string | null;
  riskDiseases: string[];
  delivery: string;
}

export interface PFCookingTip {
  storage: string;
  shelfLife: string;
  how: string;
  tips: string[];
  methods: string[];
}

export interface PFCategory { id: string; name: string; icon: string }
export interface PFAllergen  { id: string; name: string }
export interface PFDisease   { id: string; name: string; avoid: string[] }
export interface PFAllergenGroup { id: string; name: string; allergens: string[] }
export interface PFDiseaseGroup  { id: string; name: string; diseases: string[] }
export interface PFBrand { id: string; name: string; tag: string; img: string; accent: string }
export interface PFTrackingStep  { step: string; date: string; done: boolean; current?: boolean }
export type PFOrderStatus = 'delivered' | 'shipping' | 'preparing' | 'cancelled';
export interface PFOrder {
  id: string; date: string; status: PFOrderStatus;
  items: { p: string; qty: number }[];
  total: number; addr: string;
  tracking: PFTrackingStep[];
}
export interface PFCurrentUser {
  name: string; email: string; joinDate: string; grade: string; points: number;
  activeAllergyGroups: string[]; activeDiseaseGroups: string[];
}

// ── Products ────────────────────────────────────────────────────────────────

export const PF_PRODUCTS: PFProduct[] = [
  { id: 'p1',  cat: 'protein', subcat: '두부/콩',  origin: '국내산',  name: '국내산 유기농 두부 300g (2입)',         brand: '풀무원',      price: 3200,  originalPrice: 3900,  img: img('1546069901-ba9599a7e63c'), tags: ['고단백','저당','국내산','유기농'],     allergens: ['대두'],              nutrition: { protein: 11, carb: 3,  fat: 5,  sodium: 12,   sugar: 1,  kcal: 130 }, rating: 4.8, reviews: 1247, badge: 'recommended', riskDiseases: [],             delivery: '내일 도착' },
  { id: 'p2',  cat: 'ready',   subcat: '덮밥류',   origin: '국내가공', name: '오뚜기 새우 야채 볶음밥 350g',          brand: '오뚜기',      price: 4900,  originalPrice: null,  img: img('1603133872878-684f208fb84b'), tags: ['갑각류 함유'],               allergens: ['새우','밀'],          nutrition: { protein: 12, carb: 65, fat: 14, sodium: 980,  sugar: 4,  kcal: 460 }, rating: 4.5, reviews: 832,  badge: 'danger',      riskDiseases: ['고혈압'],       delivery: '내일 도착' },
  { id: 'p3',  cat: 'staple',  subcat: '잡곡',     origin: '국내산',  name: '풀무원 현미잡곡밥 210g x 6입',          brand: '풀무원',      price: 9800,  originalPrice: 12600, img: img('1536304993881-ff6e9eefa2a6'), tags: ['저당','식이섬유','국내산'],            allergens: [],                    nutrition: { protein: 5,  carb: 42, fat: 2,  sodium: 320,  sugar: 1,  kcal: 220 }, rating: 4.7, reviews: 2104, badge: 'deal',         riskDiseases: [],             delivery: '내일 도착' },
  { id: 'p4',  cat: 'dairy',   subcat: '요거트',   origin: '국내가공', name: '매일유업 그릭요거트 플레인 450g',        brand: '매일유업',    price: 5200,  originalPrice: null,  img: img('1488477181946-6428a0291777'), tags: ['고단백','프로바이오틱스'],              allergens: ['우유'],              nutrition: { protein: 24, carb: 12, fat: 6,  sodium: 110,  sugar: 8,  kcal: 200 }, rating: 4.6, reviews: 3489, badge: null,           riskDiseases: [],             delivery: '내일 도착' },
  { id: 'p5',  cat: 'protein', subcat: '닭/오리',  origin: '국내산',  name: '국내산 무항생제 닭가슴살 1kg',           brand: 'pickfood',    price: 12900, originalPrice: 15900, img: img('1604503468506-a8da13d82791'), tags: ['고단백','저지방','HACCP','무항생제','국내산'], allergens: [],               nutrition: { protein: 78, carb: 0,  fat: 12, sodium: 320,  sugar: 0,  kcal: 420 }, rating: 4.9, reviews: 5821, badge: 'recommended', riskDiseases: [],             delivery: '내일 도착' },
  { id: 'p6',  cat: 'ready',   subcat: '냉동식품', origin: '국내가공', name: 'CJ 게맛살 200g x 3입',                  brand: 'CJ',          price: 5900,  originalPrice: null,  img: img('1607301406259-dfb186e15de8'), tags: ['해산물','갑각류'],               allergens: ['새우','게','밀'],    nutrition: { protein: 10, carb: 8,  fat: 1,  sodium: 720,  sugar: 2,  kcal: 90  }, rating: 4.3, reviews: 412,  badge: 'danger',      riskDiseases: [],             delivery: '내일 도착' },
  { id: 'p7',  cat: 'dairy',   subcat: '식물성',   origin: '국내가공', name: '매일 무가당 아몬드브리즈 950ml',         brand: '매일',        price: 3490,  originalPrice: 3900,  img: img('1550583724-b2692b85b150'),    tags: ['저당','비건','락토프리'],               allergens: ['견과류'],            nutrition: { protein: 3,  carb: 1,  fat: 3,  sodium: 80,   sugar: 0,  kcal: 60  }, rating: 4.7, reviews: 1893, badge: null,           riskDiseases: [],             delivery: '내일 도착' },
  { id: 'p8',  cat: 'protein', subcat: '돼지고기', origin: '국내산',  name: '제주 흑돼지 오겹살 500g (구이용)',       brand: '제주랜드',    price: 16900, originalPrice: 19900, img: img('1607623814075-e51df1bdc82f'), tags: ['고단백','국내산'],                     allergens: [],                    nutrition: { protein: 42, carb: 0,  fat: 38, sodium: 180,  sugar: 0,  kcal: 560 }, rating: 4.6, reviews: 728,  badge: null,           riskDiseases: ['고지혈증'],     delivery: '내일 도착' },
  { id: 'p9',  cat: 'protein', subcat: '수산',     origin: '유럽',    name: '노르웨이산 생연어 스테이크 250g',        brand: '오아시스',    price: 9900,  originalPrice: 11900, img: img('1519708227418-c8fd9a32b7a2'), tags: ['오메가3','고단백','저당'],              allergens: ['생선'],              nutrition: { protein: 38, carb: 0,  fat: 16, sodium: 140,  sugar: 0,  kcal: 320 }, rating: 4.8, reviews: 1056, badge: 'recommended', riskDiseases: [],             delivery: '내일 도착' },
  { id: 'p10', cat: 'snack',   subcat: '견과류',   origin: '수입산',  name: 'Whole Earth 무가당 땅콩버터 340g',      brand: 'Whole Earth', price: 7900,  originalPrice: null,  img: img('1589927986089-35812388d1f4'), tags: ['고단백','무설탕'],                     allergens: ['땅콩'],              nutrition: { protein: 28, carb: 18, fat: 50, sodium: 12,   sugar: 4,  kcal: 588 }, rating: 4.7, reviews: 619,  badge: 'danger',      riskDiseases: [],             delivery: '내일 도착' },
  { id: 'p11', cat: 'fruit',   subcat: '수입',     origin: '동남아',  name: '필리핀산 신선 바나나 1.2kg',             brand: '돌',          price: 4500,  originalPrice: null,  img: img('1571771894821-ce9b6c11b08e'), tags: ['칼륨','신선'],                          allergens: ['바나나'],            nutrition: { protein: 1,  carb: 23, fat: 0,  sodium: 1,    sugar: 12, kcal: 89  }, rating: 4.4, reviews: 2287, badge: null,           riskDiseases: ['당뇨'],         delivery: '내일 도착' },
  { id: 'p12', cat: 'fruit',   subcat: '국산',     origin: '국내산',  name: '대저 짭짤이 토마토 1kg',                 brand: '국내산',      price: 5900,  originalPrice: 7200,  img: img('1518977822534-7049a61ee0c2'), tags: ['비타민C','국내산'],                    allergens: [],                    nutrition: { protein: 1,  carb: 4,  fat: 0,  sodium: 5,    sugar: 3,  kcal: 22  }, rating: 4.5, reviews: 891,  badge: 'recommended', riskDiseases: [],             delivery: '내일 도착' },
  { id: 'p13', cat: 'protein', subcat: '계란',     origin: '국내산',  name: '하림 자연실록 동물복지 계란 30구',       brand: '하림',        price: 8900,  originalPrice: 10900, img: img('1582722872445-44dc5f7e3c8f'), tags: ['동물복지','HACCP','국내산'],            allergens: ['달걀'],              nutrition: { protein: 7,  carb: 1,  fat: 5,  sodium: 70,   sugar: 0,  kcal: 78  }, rating: 4.8, reviews: 3421, badge: 'deal',         riskDiseases: [],             delivery: '내일 도착' },
  { id: 'p14', cat: 'veg',     subcat: '잎채소',   origin: '국내산',  name: '친환경 유기농 시금치 200g',              brand: '풀무원',      price: 2900,  originalPrice: null,  img: img('1576045057995-568f588f82fb'), tags: ['유기농','국내산'],                     allergens: [],                    nutrition: { protein: 3,  carb: 4,  fat: 0,  sodium: 79,   sugar: 0,  kcal: 23  }, rating: 4.6, reviews: 542,  badge: null,           riskDiseases: [],             delivery: '내일 도착' },
  { id: 'p15', cat: 'snack',   subcat: '음료',     origin: '국내산',  name: '제주 한라봉 농축 주스 1L',               brand: '제주마음',    price: 6900,  originalPrice: 8900,  img: img('1600271886742-f049cd451bba'), tags: ['비타민C','국내산'],                    allergens: [],                    nutrition: { protein: 1,  carb: 24, fat: 0,  sodium: 5,    sugar: 22, kcal: 110 }, rating: 4.7, reviews: 783,  badge: 'deal',         riskDiseases: ['당뇨'],         delivery: '내일 도착' },
  { id: 'p16', cat: 'ready',   subcat: '국·탕',   origin: '국내산',  name: '비비고 갈비탕 500g (1인분)',             brand: '비비고',      price: 5900,  originalPrice: 6900,  img: img('1569058242253-92a9c755a0ec'), tags: ['국내산'],                              allergens: ['쇠고기','밀'],       nutrition: { protein: 22, carb: 14, fat: 18, sodium: 1640, sugar: 2,  kcal: 280 }, rating: 4.5, reviews: 1932, badge: null,           riskDiseases: ['고혈압'],       delivery: '내일 도착' },
];

// ── Categories ──────────────────────────────────────────────────────────────

export const PF_CATEGORIES: PFCategory[] = [
  { id: 'all',     name: '전체',        icon: 'grid'    },
  { id: 'protein', name: '정육·수산',   icon: 'protein' },
  { id: 'fruit',   name: '과일',        icon: 'fruit'   },
  { id: 'veg',     name: '채소',        icon: 'veg'     },
  { id: 'dairy',   name: '유제품·음료', icon: 'dairy'   },
  { id: 'staple',  name: '주식·간편식', icon: 'rice'    },
  { id: 'ready',   name: '냉동·즉석',   icon: 'snow'    },
  { id: 'snack',   name: '간식·과자',   icon: 'snack'   },
  { id: 'baby',    name: '베이비푸드',  icon: 'baby'    },
  { id: 'health',  name: '건강기능식품',icon: 'health'  },
];

// ── Allergens & Diseases ─────────────────────────────────────────────────────

export const PF_ALLERGENS: PFAllergen[] = [
  { id: 'shrimp',   name: '새우'   }, { id: 'crab',    name: '게'     }, { id: 'peanut',   name: '땅콩'  },
  { id: 'milk',     name: '우유'   }, { id: 'egg',     name: '달걀'   }, { id: 'wheat',    name: '밀'    },
  { id: 'soy',      name: '대두'   }, { id: 'nut',     name: '견과류' }, { id: 'fish',     name: '생선'  },
  { id: 'banana',   name: '바나나' }, { id: 'pork',    name: '돼지고기'},{ id: 'beef',     name: '쇠고기'},
  { id: 'mackerel', name: '고등어' }, { id: 'tomato',  name: '토마토' }, { id: 'shellfish',name: '조개류'},
];

export const PF_DISEASES: PFDisease[] = [
  { id: 'diabetes',       name: '당뇨',         avoid: ['고당류','고탄수화물']     },
  { id: 'hyperlipidemia', name: '고지혈증',     avoid: ['포화지방','트랜스지방']   },
  { id: 'hypertension',   name: '고혈압',       avoid: ['고나트륨']               },
  { id: 'kidney',         name: '신장질환',     avoid: ['고나트륨','고칼륨','고인'] },
  { id: 'gout',           name: '통풍',         avoid: ['고퓨린']                 },
  { id: 'gerd',           name: '역류성 식도염', avoid: ['카페인','매운맛']        },
  { id: 'celiac',         name: '셀리악병',     avoid: ['글루텐']                 },
  { id: 'lactose',        name: '유당불내증',   avoid: ['유당']                   },
];

// ── User Profile Groups ──────────────────────────────────────────────────────

export const PF_ALLERGY_GROUPS: PFAllergenGroup[] = [
  { id: 'g1', name: '박희은',    allergens: ['shrimp', 'crab']  },
  { id: 'g2', name: '김세현',    allergens: ['peanut', 'banana'] },
  { id: 'g3', name: '엄마',      allergens: ['milk', 'egg']      },
];

export const PF_DISEASE_GROUPS: PFDiseaseGroup[] = [
  { id: 'd1', name: '본인',   diseases: ['diabetes']                   },
  { id: 'd2', name: '아버지', diseases: ['hyperlipidemia','hypertension'] },
];

export const PF_WISHLIST = ['p1', 'p5', 'p9', 'p13'];

// ── Current Demo User ────────────────────────────────────────────────────────

export const PF_CURRENT_USER: PFCurrentUser = {
  name: '박희은',
  email: 'parkheun@example.com',
  joinDate: '2024.01.15',
  grade: 'GOLD',
  points: 2340,
  activeAllergyGroups: ['g1'],
  activeDiseaseGroups: ['d1'],
};

// ── Orders ───────────────────────────────────────────────────────────────────

export const PF_ORDERS: PFOrder[] = [
  {
    id: 'PF20260512-3421', date: '2026.05.12', status: 'delivered',
    items: [{ p: 'p1', qty: 2 }, { p: 'p7', qty: 1 }],
    total: 9890, addr: '서울 강남구 테헤란로 123',
    tracking: [
      { step: '주문 접수', date: '2026.05.11 23:45', done: true  },
      { step: '상품 준비', date: '2026.05.12 02:30', done: true  },
      { step: '배송 출발', date: '2026.05.12 04:12', done: true  },
      { step: '배송 완료', date: '2026.05.12 06:48', done: true  },
    ],
  },
  {
    id: 'PF20260510-9981', date: '2026.05.10', status: 'shipping',
    items: [{ p: 'p5', qty: 1 }, { p: 'p9', qty: 1 }, { p: 'p13', qty: 1 }],
    total: 31700, addr: '서울 강남구 테헤란로 123',
    tracking: [
      { step: '주문 접수', date: '2026.05.10 22:15', done: true,  },
      { step: '상품 준비', date: '2026.05.11 01:00', done: true,  },
      { step: '배송 출발', date: '오늘 출발 예정',   done: true,  current: true },
      { step: '배송 완료', date: '오늘 18시 이전 도착', done: false },
    ],
  },
  {
    id: 'PF20260508-2210', date: '2026.05.08', status: 'preparing',
    items: [{ p: 'p3', qty: 1 }, { p: 'p12', qty: 2 }],
    total: 21600, addr: '서울 강남구 테헤란로 123',
    tracking: [
      { step: '주문 접수', date: '2026.05.13 21:30',     done: true  },
      { step: '상품 준비', date: '내일 오전 진행 예정',  done: false, current: true },
      { step: '배송 출발', date: '대기',                 done: false },
      { step: '배송 완료', date: '대기',                 done: false },
    ],
  },
  {
    id: 'PF20260420-7710', date: '2026.04.20', status: 'delivered',
    items: [{ p: 'p4', qty: 1 }, { p: 'p10', qty: 1 }],
    total: 13100, addr: '서울 강남구 테헤란로 123',
    tracking: [],
  },
  {
    id: 'PF20260402-1109', date: '2026.04.02', status: 'cancelled',
    items: [{ p: 'p8', qty: 1 }],
    total: 16900, addr: '서울 강남구 테헤란로 123',
    tracking: [],
  },
];

// ── Cooking Tips ─────────────────────────────────────────────────────────────

export const PF_COOKING_TIPS: Record<string, PFCookingTip> = {
  p1:  { storage: '냉장 보관 (0~5°C)', shelfLife: '개봉 후 3일 이내', how: '끓는 물에 살짝 데치거나 그대로 조리해요. 두부찌개·된장찌개·두부조림 등 다양하게 활용 가능해요.', tips: ['개봉 후 남은 두부는 물에 담가 냉장 보관', '부드러운 두부는 찌개용, 단단한 두부는 구이·조림용'], methods: ['국·탕', '볶음', '조림'] },
  p2:  { storage: '냉동 보관 (–18°C 이하)', shelfLife: '제조일로부터 12개월', how: '봉지째 전자레인지 3분, 또는 끓는 물에 3~4분 가열해요. 팬에 볶아도 맛있어요.', tips: ['해동 후 재냉동 금지', '가열 후 잘 섞어 고르게 데워지도록'], methods: ['볶음'] },
  p3:  { storage: '서늘하고 건조한 곳 또는 냉장 보관', shelfLife: '6개월 (개봉 후 냉장 1개월)', how: '물 190ml 넣고 전자레인지 2분 가열해요. 끓는 물에 3분 넣어두어도 돼요.', tips: ['개봉 후 밀봉 냉장 보관 권장', '찬밥은 국·볶음밥에 활용'], methods: ['국·탕'] },
  p4:  { storage: '냉장 보관 (0~5°C)', shelfLife: '개봉 전 30일, 개봉 후 2~3일', how: '그대로 먹거나 과일·그래놀라·꿀을 올려 먹어요. 스무디 베이스로도 활용해요.', tips: ['숟가락으로 떠먹는 진한 그릭요거트 스타일', '과일과 섞으면 영양 균형 UP'], methods: ['샐러드·날것'] },
  p5:  { storage: '냉장 2일, 냉동 3개월', shelfLife: '포장재 날짜 확인', how: '냉동 상태면 냉장에서 하루 해동 후 조리해요. 80°C 이상 완전히 익혀서 드세요.', tips: ['소금·후추로 밑간 후 30분 재워두면 더 맛있어요', '에어프라이어 180°C 15분도 추천'], methods: ['구이', '찜', '볶음'] },
  p6:  { storage: '냉동 보관 (–18°C 이하)', shelfLife: '제조일로부터 9개월', how: '냉장 해동 후 샐러드·라면·국물 요리에 넣어요. 전자레인지 1분도 가능해요.', tips: ['해동 후 당일 섭취 권장', '떡볶이·어묵탕·비빔밥에 활용'], methods: ['국·탕', '샐러드·날것'] },
  p7:  { storage: '개봉 전 상온, 개봉 후 냉장 (0~5°C)', shelfLife: '개봉 전 6개월, 개봉 후 3일', how: '차갑게 마시거나 커피·시리얼·스무디에 활용해요.', tips: ['흔들어서 마시기', '가열해도 사용 가능 (라떼 등)'], methods: ['샐러드·날것'] },
  p8:  { storage: '냉장 2일, 냉동 3개월', shelfLife: '포장재 날짜 확인', how: '냉동이면 냉장에서 하루 해동 후 불판에 구워요. 참기름·소금으로 밑간해요.', tips: ['불판 예열 후 강불 → 중불로 구워야 육즙이 살아요', '앞뒤 2~3분씩'], methods: ['구이', '볶음'] },
  p9:  { storage: '냉장 1~2일, 냉동 1개월', shelfLife: '포장재 날짜 확인', how: '냉동이면 냉장 4~6시간 해동 후 구이 또는 찜으로 드세요.', tips: ['레몬즙 뿌리면 비린내 제거', '70°C 이상 완전 가열 권장'], methods: ['구이', '찜', '오븐·베이킹'] },
  p10: { storage: '개봉 전 서늘한 상온, 개봉 후 냉장', shelfLife: '개봉 전 12개월, 개봉 후 3개월', how: '빵·과일·채소 등과 함께 발라 먹어요. 스무디나 드레싱에도 활용 가능해요.', tips: ['분리되면 잘 저어 사용', '냉장 시 굳을 수 있으니 실온에 잠깐 두세요'], methods: ['샐러드·날것'] },
  p11: { storage: '상온 (15~25°C), 노란 바나나는 냉장 가능', shelfLife: '구매 후 4~5일 (상온)', how: '껍질 벗겨 그대로 먹거나 스무디·바나나우유에 활용해요.', tips: ['검은 반점이 생기면 단맛이 더 강해져요', '냉동하면 스무디·아이스크림 재료로 활용'], methods: ['샐러드·날것'] },
  p12: { storage: '꼭지 위로 세워서 서늘한 상온 또는 냉장 보관', shelfLife: '구매 후 5~7일', how: '흐르는 물에 30초 세척 후 생으로 드세요. 샐러드·카프레제에 활용해요.', tips: ['토마토는 냉장보다 상온이 더 맛있어요', '올리브오일+소금+바질로 간단 샐러드'], methods: ['샐러드·날것'] },
  p13: { storage: '냉장 보관 (0~5°C) 뾰족한 쪽이 아래로', shelfLife: '구매 후 14일 이내', how: '끓는 물에 넣어 12분 완숙, 8분 반숙, 5분 반반숙으로 삶아요.', tips: ['실온에 30분 꺼내두면 균일하게 삶아져요', '삶은 후 찬물에 담그면 껍질이 잘 벗겨짐'], methods: ['전·부침', '볶음', '찜'] },
  p14: { storage: '세척 후 물기 제거, 냉장 보관 (0~5°C)', shelfLife: '구매 후 3~4일', how: '끓는 물에 30초~1분 데쳐 무치거나, 팬에 마늘·참기름으로 볶아 드세요.', tips: ['데친 후 찬물에 헹궈야 선명한 초록색 유지', '시금치는 오래 볶으면 질겨지니 짧게'], methods: ['볶음', '국·탕', '찜'] },
  p15: { storage: '개봉 후 냉장 보관 (0~5°C)', shelfLife: '개봉 전 12개월, 개봉 후 7일', how: '그대로 마시거나 물 또는 탄산수 1:3으로 희석해 마셔요.', tips: ['얼음 넣어 시원하게', '탄산수와 섞으면 상큼한 에이드'], methods: ['샐러드·날것'] },
  p16: { storage: '냉동 또는 냉장 보관', shelfLife: '냉동 6개월, 냉장 3일', how: '봉지째 끓는 물에 5분, 또는 전자레인지 2분 30초 가열해요. 봉지 뜯고 냄비에 데워도 돼요.', tips: ['개봉 후 당일 섭취 권장', '나트륨 높으니 물을 충분히 마시세요'], methods: ['국·탕'] },
};

// ── Helpers ──────────────────────────────────────────────────────────────────

export function getPFActiveAllergenNames(): string[] {
  const activeGroupIds = PF_CURRENT_USER.activeAllergyGroups;
  const activeGroups   = PF_ALLERGY_GROUPS.filter(g => activeGroupIds.includes(g.id));
  const allergenIds    = [...new Set(activeGroups.flatMap(g => g.allergens))];
  return allergenIds.map(id => PF_ALLERGENS.find(a => a.id === id)?.name ?? '').filter(Boolean);
}

export function getPFActiveDiseaseNames(): string[] {
  const activeGroupIds = PF_CURRENT_USER.activeDiseaseGroups;
  const activeGroups   = PF_DISEASE_GROUPS.filter(g => activeGroupIds.includes(g.id));
  const diseaseIds     = [...new Set(activeGroups.flatMap(g => g.diseases))];
  return diseaseIds.map(id => PF_DISEASES.find(d => d.id === id)?.name ?? '').filter(Boolean);
}

export function getPFProductById(id: string): PFProduct | undefined {
  return PF_PRODUCTS.find(p => p.id === id);
}
