import { useState } from "react";
import type { Product } from "../models/type";

export function useProductDetail(product: Product) {
  const [quantity,  setQuantity]  = useState(1);
  const [isHearted, setIsHearted] = useState(false);
  const [isCarted,  setIsCarted]  = useState(false);
  const [activeTab, setActiveTab] = useState<"desc" | "detail" | "review" | "qna">("desc");

  const totalPrice = product.price * quantity;

  function increment() { setQuantity((q) => q + 1); }
  function decrement() { setQuantity((q) => Math.max(1, q - 1)); }

  function toggleHeart() { setIsHearted((prev) => !prev); }
  function toggleCart()  { setIsCarted((prev)  => !prev); }

  return {
    quantity, increment, decrement,
    isHearted, toggleHeart,
    isCarted,  toggleCart,
    activeTab, setActiveTab,
    totalPrice,
  };
}