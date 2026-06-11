import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../auth/store/useAuth';
import * as cartApi from '../services/cartApi';
import type { CartGroupUI, CartItemUI } from '../models/types';

export function useCart() {
  const { isLoggedIn } = useAuth();
  const [groups, setGroups]           = useState<CartGroupUI[]>([]);
  const [totalCount, setTotalCount]   = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading]     = useState(false);
  const [error, setError]             = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    if (!isLoggedIn) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await cartApi.getCart();
      setGroups(data.groups.map(g => ({
        ...g,
        items: g.items.map(item => ({ ...item, checked: true })),
      })));
      setTotalCount(data.total_count);
      setTotalAmount(data.total_amount);
    } catch {
      setError('장바구니를 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const allItems: CartItemUI[] = groups.flatMap(g => g.items);
  const allChecked  = allItems.length > 0 && allItems.every(i => i.checked);
  const checkedItems = allItems.filter(i => i.checked);

  function toggleAll() {
    setGroups(prev => prev.map(g => ({
      ...g,
      items: g.items.map(i => ({ ...i, checked: !allChecked })),
    })));
  }

  function toggleOne(itemId: string) {
    setGroups(prev => prev.map(g => ({
      ...g,
      items: g.items.map(i => i.id === itemId ? { ...i, checked: !i.checked } : i),
    })));
  }

  async function setQuantity(id: string, quantity: number) {
    if (quantity < 1) return;
    setGroups(prev => prev.map(g => ({
      ...g,
      items: g.items.map(i =>
        i.id === id ? { ...i, quantity, subtotal: i.option.price * quantity } : i
      ),
    })));
    try {
      await cartApi.updateCartItemQuantity(id, quantity);
    } catch {
      fetchCart();
    }
  }

  async function removeItems(ids: string[]) {
    setGroups(prev =>
      prev
        .map(g => ({ ...g, items: g.items.filter(i => !ids.includes(i.id)) }))
        .filter(g => g.items.length > 0)
    );
    setTotalCount(prev => prev - ids.length);
    try {
      await cartApi.deleteCartItems(ids);
    } catch {
      fetchCart();
    }
  }

  async function clearAll() {
    setGroups([]);
    setTotalCount(0);
    setTotalAmount(0);
    try {
      await cartApi.clearCart();
    } catch {
      fetchCart();
    }
  }

  async function addToCart(optionId: string, quantity: number) {
    await cartApi.addCartItems([{ option_id: optionId, quantity }]);
    await fetchCart();
  }

  return {
    groups,
    totalCount,
    totalAmount,
    isLoading,
    error,
    allChecked,
    checkedItems,
    toggleAll,
    toggleOne,
    setQuantity,
    removeOne:     (id: string) => removeItems([id]),
    clearChecked:  () => removeItems(checkedItems.map(i => i.id)),
    clearAll,
    addToCart,
    refresh: fetchCart,
  };
}
