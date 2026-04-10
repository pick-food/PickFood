export type FilterId =
  | 'gluten'
  | 'fructose'
  | 'lactose'
  | 'peanut'
  | 'egg'
  | 'soy'
  | 'crustacean'
  | 'msg'
  | 'high-sodium'
  | 'high-sugar'
  | 'diabetes';

export interface FilterItem {
  id: FilterId;
  label: string;
}

export const FILTER_ITEMS: FilterItem[] = [
  { id: 'gluten',      label: '글루텐' },
  { id: 'fructose',    label: '기타과당' },
  { id: 'lactose',     label: '유당' },
  { id: 'peanut',      label: '땅콩' },
  { id: 'egg',         label: '달걀' },
  { id: 'soy',         label: '대두' },
  { id: 'crustacean',  label: '갑각류' },
  { id: 'msg',         label: 'MSG' },
  { id: 'high-sodium', label: '고나트륨' },
  { id: 'high-sugar',  label: '고당류' },
  { id: 'diabetes',    label: '당뇨주의' },
];