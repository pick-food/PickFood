import type { LikeItem } from '../services/likeApi';

const STORAGE_KEY = 'pf_local_likes';
const CHANGE_EVENT = 'pickfood:likes-changed';

function read(): LikeItem[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'); }
  catch { return []; }
}

function write(items: LikeItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function getLocalLikes(): LikeItem[] {
  return read();
}

export function isLocallyLiked(productId: string): boolean {
  return read().some(i => i.product_id === productId);
}

export function addLocalLike(item: LikeItem) {
  if (!isLocallyLiked(item.product_id)) write([...read(), item]);
}

export function removeLocalLike(productId: string) {
  write(read().filter(i => i.product_id !== productId));
}

export function mergeAPILikes(apiItems: LikeItem[]) {
  const local = read();
  const merged = [...apiItems];
  local.forEach(l => {
    if (!merged.some(m => m.product_id === l.product_id)) merged.push(l);
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export { CHANGE_EVENT };
