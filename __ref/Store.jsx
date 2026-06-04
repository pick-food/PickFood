// PF_STORE â tiny global state for cart, wishlist, notifications, toasts.
// Subscribe with PF_STORE.use(selector) inside React components.

window.PF_STORE = (() => {
  const listeners = new Set();
  let state = {
    cart: [],          // [{ id, qty }]
    wishlist: [],      // [productId]
    notifs: [
      { id: 'n1', kind: 'allergy', title: 'ìë ë¥´ê¸° ê²½ê³ ', desc: 'ì¥ë°êµ¬ëì \'ìì° ì¼ì± ë³¶ìë°¥\'ì ë°í¬ìë ìë ë¥´ê¸° íë¡í(ìì°)ì í´ë¹í´ì.', time: 'ë°©ê¸ ì ', unread: true },
      { id: 'n2', kind: 'delivery', title: 'ì£¼ë¬¸ ì¶ë°', desc: 'ì£¼ë¬¸ë²í¸ #20250512-2841 ìíì´ ë¶ë¥ì¼í°ìì ì¶ë°íì´ì.', time: '12ë¶ ì ', unread: true },
      { id: 'n3', kind: 'deal', title: 'ê´ì¬ ì¹´íê³ ë¦¬ í¹ê°', desc: 'ì ë¹ ë² ì´ì»¤ë¦¬ ì¹´íê³ ë¦¬ ìµë 35% í ì¸ì´ ììëì´ì.', time: '1ìê° ì ', unread: true },
      { id: 'n4', kind: 'coupon', title: 'ì¿ í° ë§ë£ ìë°', desc: '5,000ì í ì¸ ì¿ í°ì´ 3ì¼ í ë§ë£ë©ëë¤.', time: 'ì´ì ', unread: false },
      { id: 'n5', kind: 'review', title: 'ë¦¬ë·° ìì± ë¶í', desc: 'êµ¬ë§¤íì  \'êµ­ë´ì° ì ê¸°ë ëë¶\' ì´ë ì¨ëì? 100P ì ë¦½ ê°ë¥.', time: '2ì¼ ì ', unread: false }
    ],
    toasts: []
  };

  const notify = () => listeners.forEach(fn => fn(state));
  const set = (patch) => { state = { ...state, ...patch }; notify(); };

  function pushToast(t) {
    const toast = { id: 't' + Date.now() + Math.random(), ...t };
    set({ toasts: [...state.toasts, toast] });
    setTimeout(() => removeToast(toast.id), t.duration || 3500);
  }
  function removeToast(id) { set({ toasts: state.toasts.filter(t => t.id !== id) }); }

  function pushNotif(n) {
    const notif = { id: 'n' + Date.now(), unread: true, time: 'ë°©ê¸ ì ', ...n };
    set({ notifs: [notif, ...state.notifs] });
  }

  // wishlist
  function toggleWishlist(productId, productName) {
    const has = state.wishlist.includes(productId);
    set({ wishlist: has ? state.wishlist.filter(x => x !== productId) : [...state.wishlist, productId] });
    pushToast({ kind: has ? 'info' : 'success', icon: 'heart', message: has ? 'ì° ëª©ë¡ìì ì ê±°íì´ì' : 'ì° ëª©ë¡ì ì¶ê°íì´ì', sub: productName });
  }

  // cart
  function addToCart(productId, qty, productName) {
    qty = qty || 1;
    const existing = state.cart.find(c => c.id === productId);
    let cart;
    if (existing) cart = state.cart.map(c => c.id === productId ? { ...c, qty: c.qty + qty } : c);
    else cart = [...state.cart, { id: productId, qty }];
    set({ cart });
    pushToast({ kind: 'cart', icon: 'cart', message: `ì¥ë°êµ¬ëì ${qty}ê° ë´ìì´ì`, sub: productName, action: 'ë³´ë¬ê°ê¸°' });
  }
  function setCartQty(productId, qty) {
    if (qty <= 0) return removeFromCart(productId);
    set({ cart: state.cart.map(c => c.id === productId ? { ...c, qty } : c) });
  }
  function removeFromCart(productId) {
    set({ cart: state.cart.filter(c => c.id !== productId) });
  }

  // notifs
  function markAllRead() { set({ notifs: state.notifs.map(n => ({ ...n, unread: false })) }); }
  function dismissNotif(id) { set({ notifs: state.notifs.filter(n => n.id !== id) }); }
  function markRead(id) { set({ notifs: state.notifs.map(n => n.id === id ? { ...n, unread: false } : n) }); }

  // React hook
  function use(selector) {
    const [, setTick] = React.useReducer(x => x + 1, 0);
    React.useEffect(() => {
      const fn = () => setTick();
      listeners.add(fn);
      return () => listeners.delete(fn);
    }, []);
    return selector ? selector(state) : state;
  }

  return {
    use, get: () => state, set, pushToast, removeToast, pushNotif,
    toggleWishlist, addToCart, setCartQty, removeFromCart,
    markAllRead, dismissNotif, markRead
  };
})();

// Animation styles + helpers â injected once.
if (!document.querySelector('#pf-anim-css')) {
  const s = document.createElement('style');
  s.id = 'pf-anim-css';
  s.textContent = `
    @keyframes pfFadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes pfFadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes pfScaleIn { from { opacity: 0; transform: scale(0.94); } to { opacity: 1; transform: scale(1); } }
    @keyframes pfSlideInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes pfSlideInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes pfPulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.06); } }
    @keyframes pfHeart { 0% { transform: scale(1); } 30% { transform: scale(1.4); } 60% { transform: scale(0.92); } 100% { transform: scale(1); } }
    @keyframes pfBlink { 0%,80%,100%{opacity:0.3} 40%{opacity:1} }
    @keyframes pfShake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-3px); } 75% { transform: translateX(3px); } }
    @keyframes pfShimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }

    .pf-fade-up   { animation: none; }
    .pf-fade-in   { animation: none; }
    .pf-scale-in  { animation: pfScaleIn 220ms cubic-bezier(0.2,0,0,1) both; }
    .pf-slide-right { animation: pfSlideInRight 280ms cubic-bezier(0.2,0,0,1) both; }
    .pf-slide-up  { animation: none; }
    .pf-press     { transition: transform 80ms ease-out; }
    .pf-press:active { transform: scale(0.96); }

    .pf-hover-lift { transition: transform 200ms cubic-bezier(0.2,0,0,1), box-shadow 200ms; }
    .pf-hover-lift:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(15,30,18,0.08); }

    .pf-img-zoom { overflow: hidden; }
    .pf-img-zoom img { transition: transform 500ms cubic-bezier(0.2,0,0,1); }
    .pf-img-zoom:hover img { transform: scale(1.06); }

    .pf-btn { transition: filter 140ms, transform 80ms; }
    .pf-btn:hover { filter: brightness(0.94); }
    .pf-btn:active { transform: translateY(1px) scale(0.98); }

    .pf-stagger > * { animation: none; }

    .pf-heart-burst { animation: pfHeart 380ms cubic-bezier(0.2,0,0,1); }
    .pf-shake { animation: pfShake 280ms; }

    .pf-bg-shimmer {
      background: linear-gradient(90deg, transparent, rgba(168,224,99,0.18), transparent);
      background-size: 200% 100%;
      animation: pfShimmer 1.6s linear infinite;
    }
  `;
  document.head.appendChild(s);
}

