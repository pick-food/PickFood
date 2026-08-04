import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../auth/store/useAuth';
import { getMyLikes, likeProduct, unlikeProduct, type LikeItem } from '../services/likeApi';
import {
  getLocalLikes, addLocalLike, removeLocalLike, mergeAPILikes,
  isLocallyLiked, CHANGE_EVENT,
} from '../store/likeLocalStore';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isUUID = (id: string) => UUID_RE.test(id);

export function useLike() {
  const { isLoggedIn } = useAuth();
  const [items, setItems] = useState<LikeItem[]>(getLocalLikes);
  const [isLoading, setIsLoading] = useState(false);

  // 로컬 스토어 변경 이벤트 구독
  useEffect(() => {
    function onChanged() { setItems(getLocalLikes()); }
    window.addEventListener(CHANGE_EVENT, onChanged);
    return () => window.removeEventListener(CHANGE_EVENT, onChanged);
  }, []);

  // API에서 찜 목록 fetch 후 로컬과 병합
  const fetchFromAPI = useCallback(async () => {
    if (!isLoggedIn) return;
    setIsLoading(true);
    try {
      const data = await getMyLikes();
      mergeAPILikes(data.items);   // 이벤트 발생 → setItems 자동 반영
    } catch {
      // 무시
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => { fetchFromAPI(); }, [fetchFromAPI]);

  function isLiked(productId: string) {
    return isLoggedIn && isLocallyLiked(productId);
  }

  async function toggleLike(productId: string, info?: { title: string }) {
    if (isLiked(productId)) {
      removeLocalLike(productId);
      if (isUUID(productId)) {
        try { await unlikeProduct(productId); } catch { /* 무시 */ }
      }
    } else {
      addLocalLike({
        product_id: productId,
        title: info?.title ?? productId,
        thumbnail_file_id: '',
        is_available: true,
        liked_at: new Date().toISOString(),
      });
      if (isUUID(productId)) {
        try { await likeProduct(productId); } catch { /* 무시 */ }
      }
    }
  }

  return { items, isLoading, isLiked, toggleLike, refresh: fetchFromAPI };
}
