// 식품 위생법상 표시 의무 알레르기 유발물질 — 로그인 전(회원가입 중)에도 선택 UI에 쓰는 고정 목록
export const ALLERGEN_EMOJI: Record<string, string> = {
  '난류':     '🥚', '계란': '🥚',
  '우유':     '🥛',
  '메밀':     '🌾',
  '땅콩':     '🥜',
  '대두':     '🫘',
  '밀':       '🌾',
  '고등어':   '🐟',
  '게':       '🦀',
  '새우':     '🦐',
  '돼지고기': '🐷',
  '복숭아':   '🍑',
  '토마토':   '🍅',
  '아황산류': '⚗️',
  '호두':     '🌰',
  '닭고기':   '🍗',
  '쇠고기':   '🥩',
  '오징어':   '🦑',
  '조개류':   '🦪',
  '잣':       '🌰',
  '참깨':     '🌿',
};

export interface LegalAllergen { name: string; emoji: string }

export const LEGAL_ALLERGENS: LegalAllergen[] = Object.entries(ALLERGEN_EMOJI)
  .filter(([name]) => name !== '계란') // 난류와 동의어라 목록에는 하나만 노출
  .map(([name, emoji]) => ({ name, emoji }));
