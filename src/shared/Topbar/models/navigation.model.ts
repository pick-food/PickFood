export type NavTabId = 'all' | 'meat' | 'fruit' | 'vegetable' | 'dairy' | 'staple' | 'frozen' | 'snack' | 'baby' | 'health' | 'product' | 'recipe' | 'mypage';

export interface NavTab {
  id: NavTabId;
  label: string;
}

export const NAV_TABS: NavTab[] = [
  { id: 'all',       label: '전체' },
  { id: 'meat',      label: '정육·수산' },
  { id: 'fruit',     label: '과일' },
  { id: 'vegetable', label: '채소' },
  { id: 'dairy',     label: '유제품·음료' },
  { id: 'staple',    label: '주식·간편식' },
  { id: 'frozen',    label: '냉동·즉석' },
  { id: 'snack',     label: '간식·과자' },
  { id: 'baby',      label: '베이비푸드' },
  { id: 'health',    label: '건강기능식품' },
];