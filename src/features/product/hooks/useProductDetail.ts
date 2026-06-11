import { useState } from "react";
import type { Product } from "../models/type";
import { addCartItems } from "../../cart/services/cartApi";
import { likeProduct, unlikeProduct } from "../../like/services/likeApi";
import { addLocalLike, removeLocalLike, isLocallyLiked } from "../../like/store/likeLocalStore";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isUUID = (id: string) => UUID_RE.test(id);

export function useProductDetail(product: Product, initialIsHearted = false) {
  const [quantity,  setQuantity]  = useState(1);
  const [isHearted, setIsHearted] = useState(() => isLocallyLiked(product.id) || initialIsHearted);
  const [isCarted,  setIsCarted]  = useState(false);
  const [activeTab, setActiveTab] = useState<"desc" | "detail" | "review" | "qna">("desc");

  const totalPrice = product.price * quantity;

  function increment() { setQuantity((q) => q + 1); }
  function decrement() { setQuantity((q) => Math.max(1, q - 1)); }

  async function toggleHeart() {
    const next = !isHearted;
    setIsHearted(next);
    if (next) {
      addLocalLike({
        product_id: product.id,
        title: product.name,
        thumbnail_file_id: '',
        is_available: true,
        liked_at: new Date().toISOString(),
      });
      if (isUUID(product.id)) likeProduct(product.id).catch(() => {});
    } else {
      removeLocalLike(product.id);
      if (isUUID(product.id)) unlikeProduct(product.id).catch(() => {});
    }
  }

  async function toggleCart() {
    const next = !isCarted;
    setIsCarted(next);
    if (!next || !isUUID(product.id)) return;
    try {
      await addCartItems([{ option_id: product.id, quantity }]);
    } catch {
      // 무시
    }
  }

  return {
    quantity, increment, decrement,
    isHearted, toggleHeart,
    isCarted,  toggleCart,
    activeTab, setActiveTab,
    totalPrice,
  };
}