export type NavTabId = 'all' | 'product' | 'recipe' | 'mypage';

export interface NavTab {
  id: NavTabId;
  label: string;
}

export const NAV_TABS: NavTab[] = [
  { id: 'all',     label: '전체' },
  { id: 'product', label: '상품' },
  { id: 'recipe',  label: '레시피' },
  { id: 'mypage',  label: '마이페이지' },
];