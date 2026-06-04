// CartScreen â standalone cart page (was a tab in mypage)
window.CartScreen = ({ user, onProduct, onCheckout }) => {
  const d = window.PF_DATA;
  const cart = PF_STORE.use(s => s.cart);
  const items = cart.map(c => ({ ...d.products.find(p => p.id === c.id), qty: c.qty })).filter(x => x.id);
  const subtotal = items.reduce((sum, it) => sum + (it.price * it.qty), 0);
  const shippingFee = subtotal >= 40000 || subtotal === 0 ? 0 : 3000;
  const total = subtotal + shippingFee;

  const activeAllergenNames = (user?.activeAllergyGroups || []).flatMap(gid =>
    (d.allergyGroups.find(g => g.id === gid)?.allergens || []).map(aid => d.allergens.find(a => a.id === aid)?.name)
  ).filter(Boolean);
  const dangerCount = items.filter(it => it.allergens.some(a => activeAllergenNames.includes(a))).length;

  return (
    <div style={{ background: '#FFFFFF', minHeight: 'calc(100vh - 60px)', paddingBottom: 80 }} data-screen-label="ì¥ë°êµ¬ë">
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 40px 0' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0F1E12', letterSpacing: '-0.02em' }}>ì¥ë°êµ¬ë</h1>
        <div style={{ fontSize: 13, color: '#6B7A6E', marginTop: 4 }}>
          ì´ <strong className="tabular" style={{ color: '#0F1E12' }}>{cart.reduce((s,c)=>s+c.qty,0)}</strong>ê°
          {dangerCount > 0 && <span style={{ marginLeft: 8, color: '#B71C1C', fontWeight: 700 }}>Â· ì£¼ì ìí {dangerCount}ê°</span>}
        </div>

        {items.length === 0 ? (
          <div style={{ background: '#fff', border: '1px solid #E5E7E1', borderRadius: 12, padding: 80, textAlign: 'center', marginTop: 32 }}>
            <Icon.Cart size={48} stroke="#C9CFC4"/>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#3A4A3F', marginTop: 16 }}>ì¥ë°êµ¬ëê° ë¹ì´ ìì´ì</div>
            <div style={{ fontSize: 13, color: '#6B7A6E', marginTop: 6 }}>ìí ìì¸ íì´ì§ìì 'ì¥ë°êµ¬ë'ë¥¼ ëë¬ ë´ì ë³´ì¸ì.</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, alignItems: 'flex-start', marginTop: 24 }}>
            <div style={{ background: '#fff', border: '1px solid #E5E7E1', borderRadius: 12, overflow: 'hidden' }} className="pf-stagger">
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #F4F5F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: '#3A4A3F', cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked/> ì ì²´ì í ({items.length})
                </label>
                <button onClick={() => cart.forEach(c => PF_STORE.removeFromCart(c.id))} className="pf-btn" style={{
                  background: 'transparent', border: '1px solid #E5E7E1', color: '#6B7A6E',
                  borderRadius: 6, padding: '6px 12px', fontFamily: 'inherit', fontSize: 12, cursor: 'pointer'
                }}>ì í ë¹ì°ê¸°</button>
              </div>
              {items.map(it => {
                const danger = it.allergens.some(a => activeAllergenNames.includes(a));
                return (
                  <div key={it.id} style={{ padding: 18, borderBottom: '1px solid #F4F5F0', display: 'flex', gap: 16, alignItems: 'center' }}>
                    <input type="checkbox" defaultChecked style={{ width: 16, height: 16 }}/>
                    <img onClick={() => onProduct(it)} src={it.img} alt="" style={{ width: 80, height: 80, borderRadius: 8, objectFit: 'cover', cursor: 'pointer' }}/>
                    <div style={{ flex: 1, minWidth: 0, cursor: 'pointer' }} onClick={() => onProduct(it)}>
                      <div style={{ fontSize: 11, color: '#6B7A6E', fontWeight: 600 }}>{it.brand}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#0F1E12' }}>{it.name}</div>
                      <div className="tabular" style={{ fontSize: 12, color: '#6B7A6E', marginTop: 2 }}>{it.price.toLocaleString()}ì Â· 1ê°ë¹</div>
                      {danger && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 6, padding: '3px 8px', background: '#FDEAEA', color: '#B71C1C', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
                          <Icon.Alert size={11} stroke="#B71C1C"/> {user.name}ë ìë ë¥´ê¸° ì£¼ì
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #C9CFC4', borderRadius: 8 }}>
                      <button onClick={() => PF_STORE.setCartQty(it.id, it.qty - 1)} className="pf-btn" style={{ width: 34, height: 34, border: 'none', background: 'transparent', cursor: 'pointer' }}><Icon.Minus size={14} stroke="#3A4A3F"/></button>
                      <span className="tabular" style={{ width: 32, textAlign: 'center', fontSize: 14, fontWeight: 700 }}>{it.qty}</span>
                      <button onClick={() => PF_STORE.setCartQty(it.id, it.qty + 1)} className="pf-btn" style={{ width: 34, height: 34, border: 'none', background: 'transparent', cursor: 'pointer' }}><Icon.Plus size={14} stroke="#3A4A3F"/></button>
                    </div>
                    <div className="tabular" style={{ fontSize: 18, fontWeight: 800, color: '#0F1E12', minWidth: 110, textAlign: 'right' }}>{(it.price * it.qty).toLocaleString()}ì</div>
                    <button onClick={() => PF_STORE.removeFromCart(it.id)} className="pf-btn" style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 8 }}>
                      <Icon.Trash size={16} stroke="#9AA89D"/>
                    </button>
                  </div>
                );
              })}
            </div>

            <div style={{ background: '#fff', border: '1px solid #E5E7E1', borderRadius: 12, padding: 22, position: 'sticky', top: 90 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F1E12', marginBottom: 16 }}>ê²°ì  ìì½</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 16, borderBottom: '1px solid #F4F5F0' }}>
                <RowK label="ìíê¸ì¡" value={`${subtotal.toLocaleString()}ì`}/>
                <RowK label="ë°°ì¡ë¹" value={shippingFee === 0 ? 'ë¬´ë£' : `${shippingFee.toLocaleString()}ì`} muted={shippingFee === 0}/>
                <RowK label="ì¿ í°" value="0ì" muted/>
                <RowK label="í¬ì¸í¸" value="0P" muted/>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 16 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#0F1E12' }}>ì´ ê²°ì ê¸ì¡</span>
                <span className="tabular" style={{ fontSize: 26, fontWeight: 800, color: '#0F1E12', letterSpacing: '-0.02em' }}>{total.toLocaleString()}ì</span>
              </div>
              {shippingFee > 0 && (
                <div style={{ fontSize: 11, color: '#B97308', marginTop: 6, padding: 8, background: '#FFF8EC', borderRadius: 6 }}>
                  <Icon.Info size={12} stroke="#B97308"/> {(40000 - subtotal).toLocaleString()}ì ë ë´ì¼ë©´ ë¬´ë£ë°°ì¡
                </div>
              )}
              {dangerCount > 0 && (
                <div style={{ fontSize: 12, color: '#B71C1C', marginTop: 10, padding: 10, background: '#FDEAEA', borderRadius: 6, display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                  <Icon.Alert size={14} stroke="#B71C1C"/>
                  <span><strong>{dangerCount}ê°</strong> ìíì´ ìë ë¥´ê¸° íë¡íì í´ë¹í´ì. ê²°ì  ì  íì¸í´ ì£¼ì¸ì.</span>
                </div>
              )}
              <button onClick={onCheckout} className="pf-btn" style={{
                width: '100%', marginTop: 16, padding: '16px', background: '#0F1E12', color: '#fff', border: 'none',
                borderRadius: 8, fontFamily: 'inherit', fontSize: 15, fontWeight: 800, cursor: 'pointer'
              }}>{total.toLocaleString()}ì ì£¼ë¬¸íê¸°</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const RowK = ({ label, value, muted }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
    <span style={{ color: '#6B7A6E' }}>{label}</span>
    <span className="tabular" style={{ color: muted ? '#1F6B45' : '#0F1E12', fontWeight: 700 }}>{value}</span>
  </div>
);

// ====================== WISHLIST SCREEN ======================
window.WishlistScreen = ({ user, onProduct }) => {
  const d = window.PF_DATA;
  const wishlist = PF_STORE.use(s => s.wishlist);
  const products = d.products.filter(p => wishlist.includes(p.id));

  return (
    <div style={{ background: '#FFFFFF', minHeight: 'calc(100vh - 60px)', paddingBottom: 80 }} data-screen-label="ì°í ìí">
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 40px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0F1E12', letterSpacing: '-0.02em' }}>ì°í ìí</h1>
        <div style={{ fontSize: 13, color: '#6B7A6E', marginTop: 4, marginBottom: 24 }}>ì´ {products.length}ê°</div>

        {products.length === 0 ? (
          <div style={{ background: '#fff', border: '1px solid #E5E7E1', borderRadius: 12, padding: 80, textAlign: 'center' }}>
            <Icon.Heart size={48} stroke="#C9CFC4"/>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#3A4A3F', marginTop: 16 }}>ì°í ìíì´ ìì´ì</div>
            <div style={{ fontSize: 13, color: '#6B7A6E', marginTop: 6 }}>ìì í ìíì ì°¾ì¼ë©´ â¥ ë²í¼ì¼ë¡ ì ì¥í´ ëì¸ì.</div>
          </div>
        ) : (
          <div className="pf-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 18 }}>
            {products.map(p => <ProductCard key={p.id} product={p} user={user} onClick={() => onProduct(p)}/>)}
          </div>
        )}
      </div>
    </div>
  );
};

