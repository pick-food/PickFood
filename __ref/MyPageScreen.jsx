// MyPageScreen â full account hub
window.MyPageScreen = ({ user, onProduct }) => {
  const d = window.PF_DATA;
  const [tab, setTab] = React.useState('orders');
  const cart     = PF_STORE.use(s => s.cart);
  const wishlist = PF_STORE.use(s => s.wishlist);

  const navItems = [
    { id: 'orders',   label: 'ì£¼ë¬¸ / ë°°ì¡', icon: 'Package', badge: d.orders.filter(o => ['shipping','preparing'].includes(o.status)).length },
    { id: 'cart',     label: 'ì¥ë°êµ¬ë',     icon: 'Cart', badge: cart.reduce((s,c)=>s+c.qty,0) },
    { id: 'wishlist', label: 'ì°í ìí',   icon: 'Bookmark', badge: wishlist.length },
    { id: 'coupon',   label: 'ì¿ í°',       icon: 'Tag', badge: d.coupons.length },
    { id: 'profile',  label: 'ìì  íë¡í', icon: 'Shield' },
    { id: 'address',  label: 'ë°°ì¡ì§',     icon: 'MapPin' },
    { id: 'account',  label: 'íì ì ë³´',  icon: 'User' },
    { id: 'notify',   label: 'ìë¦¼ ì¤ì ',  icon: 'Bell' }
  ];

  const recentOrder = d.orders.find(o => o.status === 'shipping') || d.orders[0];

  return (
    <div style={{ background: '#FFFFFF', minHeight: 'calc(100vh - 60px)', paddingBottom: 80 }} data-screen-label="06 ë§ì´íì´ì§">
      {/* Profile banner */}
      <div style={{ background: '#0F1E12', padding: '32px 40px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 999,
            background: 'linear-gradient(135deg, #A8E063, #2E8B57)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#0F1E12', fontSize: 22, fontWeight: 800
          }}>ë°</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>ë°í¬ì</h1>
              <span style={{ padding: '3px 8px', background: 'rgba(168,224,99,0.18)', color: '#A8E063', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>GOLD ë©¤ë²</span>
            </div>
            <div style={{ fontSize: 12, color: '#B8C5BA', marginTop: 4 }}>parkheun@example.com Â· ê°ì 2024.01.15 Â· ëì  ì£¼ë¬¸ {d.orders.length}ê±´</div>
          </div>
          <div style={{ display: 'flex', gap: 24, color: '#fff' }}>
            <Stat n={d.orders.filter(o => o.status === 'shipping').length} label="ë°°ì¡ì¤"/>
            <Stat n={cart.reduce((s,c)=>s+c.qty,0)} label="ì¥ë°êµ¬ë"/>
            <Stat n={wishlist.length} label="ì°"/>
            <Stat n="2,340" label="í¬ì¸í¸P" mono/>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 40px 0', display: 'grid', gridTemplateColumns: '220px 1fr', gap: 32, alignItems: 'flex-start' }}>
        {/* Side nav */}
        <aside style={{ background: '#fff', borderRadius: 12, padding: 12, border: '1px solid #E5E7E1', position: 'sticky', top: 80 }}>
          {navItems.map(it => {
            const Ico = Icon[it.icon];
            const on = tab === it.id;
            return (
              <button key={it.id} onClick={() => setTab(it.id)} style={{
                width: '100%', padding: '12px 14px', textAlign: 'left',
                background: on ? '#F0F6F1' : 'transparent',
                border: 'none', borderRadius: 8, cursor: 'pointer',
                fontFamily: 'inherit', fontSize: 13, fontWeight: on ? 700 : 500,
                color: on ? '#1F4D2C' : '#3A4A3F',
                display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2
              }}>
                {Ico && <Ico size={16} stroke={on ? '#1F4D2C' : '#6B7A6E'}/>}
                <span style={{ flex: 1 }}>{it.label}</span>
                {it.badge != null && it.badge > 0 && (
                  <span className="tabular" style={{ padding: '1px 7px', background: on ? '#1F4D2C' : '#E5E7E1', color: on ? '#A8E063' : '#3A4A3F', borderRadius: 999, fontSize: 11, fontWeight: 700 }}>{it.badge}</span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Main */}
        <main style={{ minWidth: 0 }}>
          {tab === 'orders'   && <OrdersTab orders={d.orders} products={d.products} recent={recentOrder}/>}
          {tab === 'cart'     && <CartTab onProduct={onProduct} user={user}/>}
          {tab === 'wishlist' && <WishlistTab products={d.products.filter(p => wishlist.includes(p.id))} onProduct={onProduct} user={user}/>}
          {tab === 'coupon'   && <CouponTab coupons={d.coupons}/>}
          {tab === 'profile'  && <ProfileTab/>}
          {tab === 'address'  && <AddressTab/>}
          {tab === 'account'  && <AccountTab/>}
          {tab === 'notify'   && <NotifyTab/>}
        </main>
      </div>
    </div>
  );
};

const Stat = ({ n, label, mono }) => (
  <div style={{ textAlign: 'center' }}>
    <div className={mono ? 'tabular' : ''} style={{ fontSize: 22, fontWeight: 800, color: '#A8E063', letterSpacing: '-0.02em', lineHeight: 1 }}>{n}</div>
    <div style={{ fontSize: 11, color: '#B8C5BA', marginTop: 4 }}>{label}</div>
  </div>
);

// =================== TABS ===================
const OrdersTab = ({ orders, products, recent }) => {
  const [filter, setFilter] = React.useState('all');
  const [modal, setModal] = React.useState(null); // { type, order }
  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);
  const statusLabel = { delivered: 'ë°°ì¡ ìë£', shipping: 'ë°°ì¡ ì¤', preparing: 'ìí ì¤ë¹', cancelled: 'ì£¼ë¬¸ ì·¨ì' };
  const statusTone = { delivered: '#1F6B45', shipping: '#1F4D2C', preparing: '#B97308', cancelled: '#9AA89D' };

  const openModal = (type, order) => setModal({ type, order });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <SectionHead title="ì£¼ë¬¸ / ë°°ì¡ ì¡°í"/>

      {/* Active shipment tracker */}
      {recent && recent.status === 'shipping' && (
        <div style={{ background: '#0F1E12', borderRadius: 14, padding: 24, color: '#fff', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: 999, background: 'rgba(168,224,99,0.1)' }}/>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, position: 'relative' }}>
            <span style={{ padding: '3px 8px', background: '#A8E063', color: '#0F1E12', borderRadius: 4, fontSize: 11, fontWeight: 800 }}>ë°°ì¡ ì¤</span>
            <span style={{ fontSize: 12, color: '#B8C5BA' }} className="tabular">{recent.id}</span>
          </div>
          <h3 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>ì¤ë ìë²½ 7ì ì´ì  ëì°© ìì </h3>
          <div style={{ fontSize: 13, color: '#B8C5BA', marginBottom: 20 }}>
            <Icon.MapPin size={12} stroke="#B8C5BA"/> {recent.addr}
          </div>

          {/* Progress bar */}
          <div style={{ position: 'relative', height: 6, background: 'rgba(255,255,255,0.12)', borderRadius: 999, marginBottom: 20 }}>
            <div style={{ position: 'absolute', inset: 0, width: '75%', background: 'linear-gradient(to right, #A8E063, #2E8B57)', borderRadius: 999 }}/>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, position: 'relative' }}>
            {recent.tracking.map((t, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: 999,
                    background: t.done ? (t.current ? '#A8E063' : '#fff') : 'transparent',
                    border: t.done ? 'none' : '1.5px solid rgba(255,255,255,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    {t.done && !t.current && <Icon.Check size={10} stroke="#0F1E12"/>}
                    {t.current && <span style={{ width: 6, height: 6, background: '#0F1E12', borderRadius: 999 }}/>}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: t.done ? '#fff' : 'rgba(255,255,255,0.4)' }}>{t.step}</span>
                </div>
                <div className="tabular" style={{ fontSize: 11, color: t.done ? '#B8C5BA' : 'rgba(255,255,255,0.3)', paddingLeft: 22 }}>{t.date}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid #E5E7E1' }}>
        {[
          { id: 'all', label: 'ì ì²´' },
          { id: 'preparing', label: 'ìí ì¤ë¹' },
          { id: 'shipping', label: 'ë°°ì¡ ì¤' },
          { id: 'delivered', label: 'ë°°ì¡ ìë£' },
          { id: 'cancelled', label: 'ì·¨ì / ë°í' }
        ].map(t => (
          <button key={t.id} onClick={() => setFilter(t.id)} style={{
            padding: '12px 16px', background: 'transparent', border: 'none', cursor: 'pointer',
            fontFamily: 'inherit', fontSize: 13, fontWeight: filter === t.id ? 700 : 500,
            color: filter === t.id ? '#0F1E12' : '#6B7A6E',
            borderBottom: '2px solid ' + (filter === t.id ? '#0F1E12' : 'transparent'),
            marginBottom: -1
          }}>{t.label} {filter === t.id && <span className="tabular" style={{ color: '#1F4D2C', marginLeft: 4 }}>{filtered.length}</span>}</button>
        ))}
      </div>

      {filtered.map(order => {
        const items = order.items.map(it => ({ ...products.find(p => p.id === it.p), qty: it.qty }));
        return (
          <div key={order.id} style={{ background: '#fff', border: '1px solid #E5E7E1', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F4F5F1', background: '#FAFAF7' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span className="tabular" style={{ fontSize: 13, fontWeight: 700, color: '#0F1E12' }}>{order.date}</span>
                <span style={{ width: 1, height: 10, background: '#E5E7E1' }}/>
                <span className="tabular" style={{ fontSize: 12, color: '#6B7A6E' }}>{order.id}</span>
                <span style={{ padding: '3px 8px', background: statusTone[order.status] + '18', color: statusTone[order.status], borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
                  {statusLabel[order.status]}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => openModal('detail', order)} style={smallBtn(false)}>ì£¼ë¬¸ ìì¸</button>
                {order.status === 'shipping' && <button onClick={() => openModal('track', order)} style={smallBtn(true)}>ë°°ì¡ ì¡°í</button>}
                {order.status === 'delivered' && <button onClick={() => openModal('review', order)} style={smallBtn(false)}>íê¸° ìì±</button>}
                {order.status === 'delivered' && <button onClick={() => {
                  order.items.forEach(it => PF_STORE.addToCart(it.p, it.qty, products.find(p => p.id === it.p)?.name || ''));
                }} style={smallBtn(false)}>ì¬ì£¼ë¬¸</button>}
              </div>
            </div>
            <div style={{ padding: '16px 20px' }}>
              {items.map(it => (
                <div key={it.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 0', borderBottom: items.length > 1 ? '1px solid #F4F5F1' : 'none' }}>
                  <img src={it.img} alt="" style={{ width: 56, height: 56, borderRadius: 8, objectFit: 'cover' }}/>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: '#6B7A6E' }}>{it.brand}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0F1E12' }}>{it.name}</div>
                    <div className="tabular" style={{ fontSize: 12, color: '#6B7A6E', marginTop: 2 }}>{it.price.toLocaleString()}ì Â· {it.qty}ê°</div>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #F4F5F1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: '#6B7A6E' }}>ì´ ê²°ì ê¸ì¡</span>
                <span className="tabular" style={{ fontSize: 18, fontWeight: 800, color: '#0F1E12' }}>{order.total.toLocaleString()}ì</span>
              </div>
            </div>
          </div>
        );
      })}

      {modal && <OrderModal modal={modal} products={products} onClose={() => setModal(null)}/>}
    </div>
  );
};

const OrderModal = ({ modal, products, onClose }) => {
  const { type, order } = modal;
  const items = order.items.map(it => ({ ...products.find(p => p.id === it.p), qty: it.qty }));
  const [rating, setRating] = React.useState(5);
  const [reviewText, setReviewText] = React.useState('');
  const [sub, setSub] = React.useState(null); // 'return' | 'exchange' | 'refund'
  const [reason, setReason] = React.useState('');
  const [memo, setMemo] = React.useState('');

  React.useEffect(() => {
    const esc = e => e.key === 'Escape' && (sub ? setSub(null) : onClose());
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [sub]);

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(15,30,18,0.5)', backdropFilter: 'blur(2px)',
      zIndex: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
    }}>
      <div onClick={e => e.stopPropagation()} className="pf-scale-in" style={{
        background: '#fff', borderRadius: 16, maxWidth: 560, width: '100%', maxHeight: '85vh',
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
        boxShadow: '0 24px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #F0F2EC', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0F1E12' }}>
              {type === 'detail' && 'ì£¼ë¬¸ ìì¸'}
              {type === 'track' && 'ë°°ì¡ ì¡°í'}
              {type === 'review' && 'íê¸° ìì±'}
            </h3>
            <div className="tabular" style={{ fontSize: 11, color: '#6B7A6E', marginTop: 2 }}>{order.id} Â· {order.date}</div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 6 }}>
            <Icon.Close size={18} stroke="#6B7A6E"/>
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          {type === 'detail' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Status banner */}
              <div style={{
                background: order.status === 'delivered' ? '#F0F6F1' : order.status === 'shipping' ? '#FFF8EC' : '#FAFAF7',
                border: '1px solid ' + (order.status === 'delivered' ? '#DCE9DF' : order.status === 'shipping' ? '#F3DDA8' : '#E5E7E1'),
                borderRadius: 10, padding: 14, display: 'flex', alignItems: 'center', gap: 12
              }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 999,
                  background: order.status === 'delivered' ? '#1F6B45' : order.status === 'shipping' ? '#E89B26' : '#6B7A6E',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {order.status === 'delivered' ? <Icon.Check size={16} stroke="#fff"/> :
                   order.status === 'shipping' ? <Icon.Truck size={16} stroke="#fff"/> :
                   <Icon.Package size={16} stroke="#fff"/>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#0F1E12' }}>
                    {order.status === 'delivered' ? 'ë°°ì¡ ìë£' : order.status === 'shipping' ? 'ë°°ì¡ ì¤' : order.status === 'preparing' ? 'ìí ì¤ë¹ ì¤' : 'ì£¼ë¬¸ ì·¨ì'}
                  </div>
                  <div style={{ fontSize: 11, color: '#6B7A6E', marginTop: 2 }}>
                    {order.status === 'delivered' ? '2026.05.12 06:48 ìë ¹ íì¸' :
                     order.status === 'shipping' ? 'ì¤ë 18ì ì´ì  ëì°© ìì ' :
                     order.status === 'preparing' ? 'ë´ì¼ ì¤ì  ì¶ê³  ìì ' : 'ì·¨ìë ì£¼ë¬¸ìëë¤'}
                  </div>
                </div>
              </div>

              <DetailRow k="ë°°ì¡ì§" v={order.addr}/>
              <DetailRow k="ìë ¹ì¸" v="ë°í¬ì Â· 010-1234-5678"/>
              <DetailRow k="ë°°ì¡ ë©ëª¨" v="ë¶ì¬ ì ë¬¸ ìì ëìì£¼ì¸ì"/>

              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#6B7A6E', marginBottom: 8 }}>ì£¼ë¬¸ ìí ({items.length}ê±´)</div>
                <div style={{ background: '#FAFAF7', borderRadius: 10, padding: 12 }}>
                  {items.map((it, i) => (
                    <div key={it.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < items.length - 1 ? '1px solid #F0F2EC' : 'none' }}>
                      <img src={it.img} alt="" style={{ width: 48, height: 48, borderRadius: 6, objectFit: 'cover' }}/>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#0F1E12' }}>{it.name}</div>
                        <div className="tabular" style={{ fontSize: 11, color: '#6B7A6E' }}>{it.price.toLocaleString()}ì Ã {it.qty}</div>
                      </div>
                      <div className="tabular" style={{ fontSize: 13, fontWeight: 700 }}>{(it.price * it.qty).toLocaleString()}ì</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment breakdown */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#6B7A6E', marginBottom: 8 }}>ê²°ì  ë´ì­</div>
                <div style={{ background: '#fff', border: '1px solid #E5E7E1', borderRadius: 10, padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <PriceRow k="ìíê¸ì¡" v={`${(order.total + 5000 - 3000).toLocaleString()}ì`}/>
                  <PriceRow k="ë°°ì¡ë¹" v="3,000ì"/>
                  <PriceRow k="íì ì¿ í°" v="-5,000ì" red/>
                  <PriceRow k="í¬ì¸í¸ ì¬ì©" v="-1,000P" red/>
                  <div style={{ borderTop: '1px solid #F0F2EC', paddingTop: 10, marginTop: 4 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 13, fontWeight: 800 }}>ì´ ê²°ì  ê¸ì¡</span>
                      <span className="tabular" style={{ fontSize: 18, fontWeight: 800, color: '#0F1E12' }}>{order.total.toLocaleString()}ì</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment method */}
              <DetailRow k="ê²°ì  ìë¨" v="ì ì©ì¹´ë (ì íì¹´ë ****-****-****-1234, ì¼ìë¶)"/>

              {/* Receipt actions */}
              <div style={{ background: '#FAFAF7', borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#3A4A3F', marginBottom: 10 }}>ììì¦</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <button style={smallBtn(false)} onClick={() => PF_STORE.pushToast({ kind: 'success', icon: 'check', message: 'ê±°ëëªì¸ìë¥¼ ë¤ì´ë¡ëíì´ì' })}>ê±°ëëªì¸ì ë³´ê¸°</button>
                  <button style={smallBtn(false)} onClick={() => PF_STORE.pushToast({ kind: 'success', icon: 'check', message: 'íê¸ììì¦ì ë°ê¸íì´ì', sub: 'êµ­ì¸ì²­ ííì¤ìì íì¸ ê°ë¥' })}>íê¸ììì¦ ë°ê¸</button>
                  <button style={smallBtn(false)} onClick={() => PF_STORE.pushToast({ kind: 'success', icon: 'check', message: 'ì¸ê¸ê³ì°ì ë°ê¸ ìì²­ë¨', sub: 'ë´ë¹ìê° íì¸ í ë°ì¡í©ëë¤' })}>ì¸ê¸ê³ì°ì ë°ê¸</button>
                </div>
              </div>

              {/* Return / Exchange â only delivered */}
              {order.status === 'delivered' && (
                <div style={{ background: '#fff', border: '1px solid #E5E7E1', borderRadius: 10, padding: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <Icon.RefreshCw size={16} stroke="#1F4D2C"/>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#0F1E12' }}>ë°íÂ·êµí</span>
                    <span className="tabular" style={{ fontSize: 11, color: '#6B7A6E', marginLeft: 'auto' }}>ìë ¹ì¼ë¡ë¶í° 7ì¼ ì´ë´</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#6B7A6E', lineHeight: 1.55, marginBottom: 10 }}>
                    ì ì ìíì ë¨ì ë³ì¬ ë°íì´ ì´ë µìµëë¤. ë¼ë²¨ ì ë³´ ëë½Â·ìí íì ì 100% íë¶ + ìë¡ê¸ ì§ê¸.
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => setSub('return')} style={smallBtn(false)}>ë°í ì ì²­</button>
                    <button onClick={() => setSub('exchange')} style={smallBtn(false)}>êµí ì ì²­</button>
                    <button onClick={() => setSub('refund')} style={smallBtn(false)}>íë¶ ë¬¸ì</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {type === 'track' && (
            <div>
              <div style={{ background: '#0F1E12', borderRadius: 12, padding: 18, color: '#fff', marginBottom: 18 }}>
                <div style={{ fontSize: 11, color: '#A8E063', fontWeight: 700, letterSpacing: '0.05em' }}>ë°°ì¡ ì¤</div>
                <div style={{ fontSize: 17, fontWeight: 800, marginTop: 4 }}>ì¤ë 18ì ì´ì  ëì°© ìì </div>
                <div style={{ fontSize: 12, color: '#B8C5BA', marginTop: 4 }}>ì´ì¡ì¥ 1234-5678-9012 Â· CJëííµì´</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {order.tracking.map((t, i) => (
                  <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '10px 0', position: 'relative' }}>
                    <div style={{ width: 22, display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                      <div style={{
                        width: 18, height: 18, borderRadius: 999,
                        background: t.done ? (t.current ? '#A8E063' : '#1F4D2C') : '#fff',
                        border: t.done ? 'none' : '1.5px solid #C9CFC4',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        {t.done && !t.current && <Icon.Check size={11} stroke="#fff"/>}
                        {t.current && <span style={{ width: 6, height: 6, background: '#0F1E12', borderRadius: 999 }}/>}
                      </div>
                      {i < order.tracking.length - 1 && <div style={{ flex: 1, width: 2, background: t.done ? '#1F4D2C' : '#E5E7E1', minHeight: 22 }}/>}
                    </div>
                    <div style={{ flex: 1, paddingBottom: 10 }}>
                      <div style={{ fontSize: 14, fontWeight: t.done ? 700 : 500, color: t.done ? '#0F1E12' : '#9AA89D' }}>{t.step}</div>
                      <div className="tabular" style={{ fontSize: 11, color: t.done ? '#6B7A6E' : '#C9CFC4', marginTop: 2 }}>{t.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {type === 'review' && (
            <div>
              {items.map(it => (
                <div key={it.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, background: '#FAFAF7', borderRadius: 10, marginBottom: 16 }}>
                  <img src={it.img} alt="" style={{ width: 56, height: 56, borderRadius: 8, objectFit: 'cover' }}/>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: '#6B7A6E' }}>{it.brand}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0F1E12' }}>{it.name}</div>
                  </div>
                </div>
              ))}
              <div style={{ fontSize: 13, fontWeight: 700, color: '#3A4A3F', marginBottom: 10 }}>ë§ì¡±ë</div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 18, padding: '14px 16px', background: '#FFF8EC', borderRadius: 10 }}>
                {[1,2,3,4,5].map(i => (
                  <button key={i} onClick={() => setRating(i)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4 }}>
                    <Icon.Star size={26} stroke={i <= rating ? '#E89B26' : '#DDE2DC'} filled/>
                  </button>
                ))}
                <span style={{ marginLeft: 'auto', alignSelf: 'center', fontSize: 13, fontWeight: 700, color: '#B97308' }}>{rating}ì </span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#3A4A3F', marginBottom: 8 }}>íê¸° ë´ì© <span style={{ color: '#9AA89D', fontWeight: 500, marginLeft: 4 }}>(ìì± ì 100P ì ë¦½)</span></div>
              <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="ì´ ìí, ìë ë¥´ê¸°/ì§ë³ íë¡íì ì´ë»ê² ë§ìëì? ë¤ë¥¸ íììê² ëìì´ ë  íê¸°ë¥¼ ë¨ê²¨ì£¼ì¸ì."
                style={{ width: '100%', minHeight: 110, padding: 12, border: '1px solid #E5E7E1', borderRadius: 8, fontFamily: 'inherit', fontSize: 13, resize: 'vertical', outline: 'none' }}/>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, fontSize: 11, color: '#6B7A6E' }}>
                <Icon.Paperclip size={12} stroke="#6B7A6E"/> ì¬ì§ ì²¨ë¶ (ì í, ìµë 4ì¥)
              </div>
            </div>
          )}
        </div>

        <div style={{ padding: '14px 24px', borderTop: '1px solid #F0F2EC', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          {sub ? (
            <>
              <button onClick={() => setSub(null)} style={smallBtn(false)}>ë«ê¸°</button>
              <button onClick={() => {
                const label = sub === 'return' ? 'ë°í' : sub === 'exchange' ? 'êµí' : 'íë¶';
                PF_STORE.pushToast({ kind: 'success', icon: 'check', message: `${label} ì ì²­ì´ ì ìëì´ì`, sub: 'ë´ë¹ìê° 1ììì¼ ë´ ì°ë½ëë¦½ëë¤' });
                PF_STORE.pushNotif({ kind: 'delivery', title: `${label} ì ì²­ ì ì`, desc: `${order.id} Â· ${label} ì²ë¦¬ ì§í ì¤` });
                onClose();
              }} style={{ ...smallBtn(true), padding: '8px 18px' }}>{sub === 'return' ? 'ë°í' : sub === 'exchange' ? 'êµí' : 'íë¶'} ì ì²­</button>
            </>
          ) : (
            <>
              <button onClick={onClose} style={smallBtn(false)}>ë«ê¸°</button>
              {type === 'review' && (
                <button onClick={() => { PF_STORE.pushToast({ kind: 'success', icon: 'check', message: 'íê¸°ë¥¼ ë±ë¡íì´ì', sub: '100P ì ë¦½ ìë£' }); onClose(); }} style={{ ...smallBtn(true), padding: '8px 18px' }}>ë±ë¡íê¸°</button>
              )}
              {type === 'track' && (
                <button onClick={onClose} style={{ ...smallBtn(true), padding: '8px 18px' }}>íë°°ì¬ íì´ì§ë¡ ì´ë</button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ k, v }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: 12, fontSize: 13 }}>
    <span style={{ color: '#6B7A6E', fontWeight: 600 }}>{k}</span>
    <span style={{ color: '#0F1E12' }}>{v}</span>
  </div>
);

const PriceRow = ({ k, v, red }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
    <span style={{ color: '#6B7A6E' }}>{k}</span>
    <span className="tabular" style={{ color: red ? '#D32F2F' : '#0F1E12', fontWeight: 700 }}>{v}</span>
  </div>
);

const ReturnForm = ({ sub, items, reason, setReason, memo, setMemo }) => {
  const reasons = {
    return: ['ë¨ì ë³ì¬ / ì¬ì´ì¦Â·ë§ ë¶ë§ (ìë³µ ë°°ì¡ë¹ ë³¸ì¸ ë¶ë´)', 'ìí íìÂ·íì', 'ì¤ë°°ì¡ / ëë½ ìí', 'ì íµê¸°í ìë°Â·ë§ë£', 'ìë ë¥´ê¸° ë¼ë²¨ ëë½'],
    exchange: ['íìë ìí ëì°©', 'ë¤ë¥¸ ìíì¼ë¡ ì¤ë°°ì¡ë¨', 'ëì¼ ìí ì¬ë°°ì¡', 'ê°ì ìí ë¤ë¥¸ ìµìì¼ë¡ êµí'],
    refund:  ['ê²°ì  ì·¨ì (ì ì²´ íë¶)', 'ë¶ë¶ íë¶ (ì¼ë¶ ìí)', 'ì¿ í°Â·í¬ì¸í¸ ë³µì', 'ê³ì¢ ìê¸ ë³ê²½']
  };
  const title = sub === 'return' ? 'ë°í' : sub === 'exchange' ? 'êµí' : 'íë¶';
  const isRefund = sub === 'refund';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{
        background: sub === 'return' ? '#FBF1F0' : sub === 'exchange' ? '#FFF8EC' : '#F0F6F1',
        border: '1px solid ' + (sub === 'return' ? '#F3C0BD' : sub === 'exchange' ? '#F3DDA8' : '#DCE9DF'),
        borderRadius: 10, padding: 14, display: 'flex', gap: 12
      }}>
        <Icon.Info size={18} stroke={sub === 'return' ? '#B71C1C' : sub === 'exchange' ? '#B97308' : '#1F6B45'}/>
        <div style={{ fontSize: 12, color: '#3A4A3F', lineHeight: 1.55 }}>
          {sub === 'return' && 'ì ì ìíì ë¨ì ë³ì¬ ë°íì´ ë¶ê°í©ëë¤. ë¼ë²¨ ëë½Â·íì ì 100% íë¶ + ìë¡ê¸ì´ ì§ê¸ë©ëë¤.'}
          {sub === 'exchange' && 'êµí ì¬ì ì ë°ë¼ ìë³µ ë°°ì¡ë¹ê° ë¶ë´ë©ëë¤. ëì¼ ìí ì¬ê³ ê° ìì ê²½ì° íë¶ë¡ ì íë  ì ìì´ì.'}
          {sub === 'refund' && 'íë¶ì ê²°ì  ìë¨ì ë°ë¼ 3~5ììì¼ ììë©ëë¤. ì¿ í°Â·í¬ì¸í¸ë ì¦ì ë³µìë©ëë¤.'}
        </div>
      </div>

      {/* Select items */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#3A4A3F', marginBottom: 8 }}>{title} ìí ì í</div>
        <div style={{ background: '#FAFAF7', borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map(it => (
            <label key={it.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ width: 16, height: 16 }}/>
              <img src={it.img} alt="" style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{it.name}</div>
                <div className="tabular" style={{ fontSize: 11, color: '#6B7A6E' }}>{it.price.toLocaleString()}ì Ã {it.qty}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Reason */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#3A4A3F', marginBottom: 8 }}>{title} ì¬ì </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {reasons[sub].map(r => (
            <label key={r} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
              border: '1px solid ' + (reason === r ? '#1F4D2C' : '#E5E7E1'),
              background: reason === r ? '#F0F6F1' : '#fff',
              borderRadius: 8, cursor: 'pointer'
            }}>
              <input type="radio" name="reason" checked={reason === r} onChange={() => setReason(r)}/>
              <span style={{ fontSize: 13, color: '#3A4A3F' }}>{r}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Memo */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#3A4A3F', marginBottom: 8 }}>ìì¸ ë´ì© <span style={{ color: '#9AA89D', fontWeight: 500 }}>(ì í, ë¹ ë¥¸ ì²ë¦¬ë¥¼ ìí´ ìì± ê¶ì¥)</span></div>
        <textarea value={memo} onChange={e => setMemo(e.target.value)} placeholder="ìí©ì ìì¸í ì ì´ì£¼ì¸ì. íì ì¬ì§ ì²¨ë¶ë ë¤ì ë¨ê³ìì ê°ë¥í©ëë¤."
          style={{ width: '100%', minHeight: 90, padding: 12, border: '1px solid #E5E7E1', borderRadius: 8, fontFamily: 'inherit', fontSize: 13, resize: 'vertical', outline: 'none' }}/>
      </div>

      {isRefund && (
        <div style={{ background: '#FAFAF7', borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#3A4A3F', marginBottom: 10 }}>íë¶ ë°ì ê³ì¢ ì ë³´ (ê³ì¢ì´ì²´ ê²°ì  ì)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <input placeholder="ìí ì í" style={{ padding: 10, border: '1px solid #E5E7E1', borderRadius: 6, fontFamily: 'inherit', fontSize: 12 }}/>
            <input placeholder="ìê¸ì£¼" style={{ padding: 10, border: '1px solid #E5E7E1', borderRadius: 6, fontFamily: 'inherit', fontSize: 12 }}/>
            <input placeholder="ê³ì¢ë²í¸" style={{ padding: 10, border: '1px solid #E5E7E1', borderRadius: 6, fontFamily: 'inherit', fontSize: 12, gridColumn: 'span 2' }}/>
          </div>
        </div>
      )}

      <div style={{ background: '#FAFAF7', borderRadius: 10, padding: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#3A4A3F', marginBottom: 6 }}>íì ì ë³´</div>
        <div style={{ fontSize: 11, color: '#6B7A6E', lineHeight: 1.55 }}>
          ìì¸ ê°ë¨êµ¬ íí¤ëë¡ 123, 1502í¸ (ì­ì¼ë)<br/>
          {sub === 'exchange' || sub === 'return' ? 'ë´ì¼ ì¤ì  íì ê¸°ì¬ ë°©ë¬¸ ìì  Â· ë³ê²½ ê°ë¥' : 'íë¶ ì§í ì ìë íìê° ììë©ëë¤'}
        </div>
      </div>
    </div>
  );
};

const WishlistTab = ({ products, onProduct, user }) => (
  <div>
    <SectionHead title="ì°í ìí" right={<span style={{ fontSize: 12, color: '#6B7A6E' }}>{products.length}ê°</span>}/>
    {products.length === 0 ? (
      <div style={{ background: '#fff', border: '1px solid #E5E7E1', borderRadius: 12, padding: 48, textAlign: 'center' }}>
        <Icon.Heart size={36} stroke="#C9CFC4"/>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#3A4A3F', marginTop: 12 }}>ì°í ìíì´ ìì´ì</div>
        <div style={{ fontSize: 12, color: '#6B7A6E', marginTop: 4 }}>ìì í ìíì ì°¾ì¼ë©´ â¥ ë²í¼ì¼ë¡ ì ì¥í´ ëì¸ì.</div>
      </div>
    ) : (
      <div className="pf-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
        {products.map(p => <ProductCard key={p.id} product={p} user={user} onClick={() => onProduct(p)}/>)}
      </div>
    )}
  </div>
);

const CartTab = ({ onProduct, user }) => {
  const d = window.PF_DATA;
  const cart = PF_STORE.use(s => s.cart);
  const items = cart.map(c => ({ ...d.products.find(p => p.id === c.id), qty: c.qty })).filter(x => x.id);
  const subtotal = items.reduce((sum, it) => sum + (it.price * it.qty), 0);
  const shippingFee = subtotal >= 40000 || subtotal === 0 ? 0 : 3000;
  const total = subtotal + shippingFee;

  const activeAllergenNames = (user?.activeAllergyGroups || []).flatMap(gid =>
    (d.allergyGroups.find(g => g.id === gid)?.allergens || []).map(aid => d.allergens.find(a => a.id === aid)?.name)
  ).filter(Boolean);

  return (
    <div>
      <SectionHead title="ì¥ë°êµ¬ë" right={<span style={{ fontSize: 12, color: '#6B7A6E' }}>{cart.reduce((s,c)=>s+c.qty,0)}ê°</span>}/>
      {items.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid #E5E7E1', borderRadius: 12, padding: 64, textAlign: 'center' }}>
          <Icon.Cart size={40} stroke="#C9CFC4"/>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#3A4A3F', marginTop: 12 }}>ì¥ë°êµ¬ëê° ë¹ì´ ìì´ì</div>
          <div style={{ fontSize: 12, color: '#6B7A6E', marginTop: 4 }}>ìí ìì¸ íì´ì§ìì 'ì¥ë°êµ¬ë'ë¥¼ ëë¬ ë´ì ë³´ì¸ì.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'flex-start' }}>
          <div style={{ background: '#fff', border: '1px solid #E5E7E1', borderRadius: 12, overflow: 'hidden' }} className="pf-stagger">
            {items.map(it => {
              const danger = it.allergens.some(a => activeAllergenNames.includes(a));
              return (
                <div key={it.id} style={{ padding: 18, borderBottom: '1px solid #F4F5F0', display: 'flex', gap: 16, alignItems: 'center' }}>
                  <img src={it.img} alt="" style={{ width: 72, height: 72, borderRadius: 8, objectFit: 'cover' }}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, color: '#6B7A6E', fontWeight: 600 }}>{it.brand}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0F1E12' }}>{it.name}</div>
                    {danger && (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 6, padding: '3px 8px', background: '#FDEAEA', color: '#B71C1C', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
                        <Icon.Alert size={11} stroke="#B71C1C"/> ìë ë¥´ê¸° ì£¼ì
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #C9CFC4', borderRadius: 8 }}>
                    <button onClick={() => PF_STORE.setCartQty(it.id, it.qty - 1)} className="pf-btn" style={{ width: 32, height: 32, border: 'none', background: 'transparent', cursor: 'pointer' }}><Icon.Minus size={13} stroke="#3A4A3F"/></button>
                    <span className="tabular" style={{ width: 28, textAlign: 'center', fontSize: 13, fontWeight: 700 }}>{it.qty}</span>
                    <button onClick={() => PF_STORE.setCartQty(it.id, it.qty + 1)} className="pf-btn" style={{ width: 32, height: 32, border: 'none', background: 'transparent', cursor: 'pointer' }}><Icon.Plus size={13} stroke="#3A4A3F"/></button>
                  </div>
                  <div className="tabular" style={{ fontSize: 16, fontWeight: 800, color: '#0F1E12', minWidth: 90, textAlign: 'right' }}>{(it.price * it.qty).toLocaleString()}ì</div>
                  <button onClick={() => PF_STORE.removeFromCart(it.id)} className="pf-btn" style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 6 }}>
                    <Icon.Trash size={16} stroke="#9AA89D"/>
                  </button>
                </div>
              );
            })}
          </div>

          <div style={{ background: '#fff', border: '1px solid #E5E7E1', borderRadius: 12, padding: 20, position: 'sticky', top: 90 }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0F1E12', marginBottom: 14 }}>ê²°ì  ìì½</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 14, borderBottom: '1px solid #F4F5F0' }}>
              <SummaryRow label={`ìí ${items.length}ê±´`} value={`${subtotal.toLocaleString()}ì`}/>
              <SummaryRow label="ë°°ì¡ë¹" value={shippingFee === 0 ? 'ë¬´ë£' : `${shippingFee.toLocaleString()}ì`} muted={shippingFee === 0}/>
              <SummaryRow label="ì¿ í° í ì¸" value="-0ì" muted/>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 14 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#0F1E12' }}>ì´ ê²°ì ê¸ì¡</span>
              <span className="tabular" style={{ fontSize: 22, fontWeight: 800, color: '#0F1E12' }}>{total.toLocaleString()}ì</span>
            </div>
            <button onClick={() => PF_STORE.pushToast({ kind: 'success', icon: 'check', message: 'ì£¼ë¬¸ì´ ì ìëì´ì', sub: 'ê²°ì  íì´ì§ë¡ ì´ëí©ëë¤ (ë°ëª¨)' })} className="pf-btn" style={{
              width: '100%', marginTop: 16, padding: '14px', background: '#0F1E12', color: '#fff', border: 'none',
              borderRadius: 8, fontFamily: 'inherit', fontSize: 14, fontWeight: 800, cursor: 'pointer'
            }}>ê²°ì íê¸°</button>
          </div>
        </div>
      )}
    </div>
  );
};
const SummaryRow = ({ label, value, muted }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
    <span style={{ color: '#6B7A6E' }}>{label}</span>
    <span className="tabular" style={{ color: muted ? '#1F6B45' : '#0F1E12', fontWeight: 700 }}>{value}</span>
  </div>
);

const CouponTab = ({ coupons }) => (
  <div>
    <SectionHead title="ë³´ì  ì¿ í°" right={<button style={smallBtn(false)}>ì¿ í° ì½ë ë±ë¡</button>}/>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {coupons.map(c => (
        <div key={c.id} style={{
          display: 'flex', background: '#fff', borderRadius: 12, overflow: 'hidden',
          border: '1px solid #E5E7E1', position: 'relative'
        }}>
          <div style={{ width: 140, padding: 18, background: 'linear-gradient(135deg, #1F4D2C, #2E8B57)', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <div className="tabular" style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em' }}>{c.discount}</div>
            <div style={{ fontSize: 11, color: '#A8E063', marginTop: 4 }}>í ì¸</div>
          </div>
          <div style={{ width: 1, background: 'repeating-linear-gradient(to bottom, #E5E7E1 0 4px, transparent 4px 8px)' }}/>
            <div style={{ flex: 1, padding: 18, display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0F1E12' }}>{c.label}</div>
              <div style={{ fontSize: 12, color: '#6B7A6E', marginTop: 4 }}>{c.cond}</div>
              <div className="tabular" style={{ fontSize: 11, color: '#B97308', marginTop: 6, fontWeight: 600 }}>~{c.expiry}ê¹ì§</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ProfileTab = () => {
  const d = window.PF_DATA;
  const [allergyGroups, setAllergyGroups] = React.useState([
    { id: 'me',  name: 'ë°í¬ì (ë³¸ì¸)', subtitle: '37ì¸ Â· ì¬ì±', allergens: ['ìì°','ê²'], active: true, severity: 'high' },
    { id: 'son', name: 'ê¹ì¸í (ìë¤)', subtitle: '6ì¸ Â· ë¨ì', allergens: ['ì°ì ','ê³ë','ëì½©'], active: false, severity: 'high' },
    { id: 'mom', name: 'ìë§', subtitle: '64ì¸ Â· ëê±°', allergens: ['ê³ ë±ì´','ê°ê°ë¥'], active: false, severity: 'mid' }
  ]);
  const [diseaseGroups, setDiseaseGroups] = React.useState([
    { id: 'me',  name: 'ë°í¬ì (ë³¸ì¸)', subtitle: 'ì§ë¨ 2022ë', diseases: ['ë¹ë¨'], stage: 'ì 2í Â· ê²½ì¦', active: true,  nutrients: { sugar: 25, sodium: 2000 } },
    { id: 'dad', name: 'ìë²ì§', subtitle: 'ì§ë¨ 2018ë', diseases: ['ê³ íì','ê³ ì§íì¦'], stage: 'ë³µí© ê´ë¦¬', active: false, nutrients: { sodium: 1500, fat: 50 } }
  ]);

  const toggleGroup = (kind, id) => {
    if (kind === 'allergy') setAllergyGroups(gs => gs.map(g => g.id === id ? { ...g, active: !g.active } : g));
    else setDiseaseGroups(gs => gs.map(g => g.id === id ? { ...g, active: !g.active } : g));
  };

  const activeAllergy = allergyGroups.filter(g => g.active);
  const activeDisease = diseaseGroups.filter(g => g.active);
  const totalAllergens = [...new Set(activeAllergy.flatMap(g => g.allergens))];
  const totalDiseases  = [...new Set(activeDisease.flatMap(g => g.diseases))];

  // Auto-scan stats â pretend computed
  const filteredOut = 23;
  const checkedThisMonth = 184;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <SectionHead title="ìì  íë¡í" desc="ìë ë¥´ê¸°Â·ì§ë³ ê·¸ë£¹ì ë§ë¤ë©´ ëª¨ë  ìí íì´ì§ìì ìëì¼ë¡ ìí ìì¬ë£ë¥¼ ê²ì¶í©ëë¤."/>

      {/* Hero status */}
      <div style={{ background: 'linear-gradient(135deg, #0F1E12 0%, #1F4D2C 100%)', borderRadius: 16, padding: 22, color: '#fff', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: 999, background: 'rgba(168,224,99,0.08)' }}/>
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', background: 'rgba(168,224,99,0.18)', color: '#A8E063', borderRadius: 999, fontSize: 10, fontWeight: 800, marginBottom: 10 }}>
            <Icon.Shield size={12} stroke="#A8E063"/> ìì  ë³´í¸ íì±
          </div>
          <div style={{ fontSize: 13, color: '#B8C5BA', marginBottom: 4 }}>ì ì© ì¤ì¸ ê·¸ë£¹</div>
          <div className="tabular" style={{ fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>{activeAllergy.length + activeDisease.length}<span style={{ fontSize: 14, fontWeight: 500, marginLeft: 4 }}>ê°</span></div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 10 }}>
            {totalAllergens.map(a => (
              <span key={a} style={{ padding: '3px 8px', background: 'rgba(255,107,107,0.18)', color: '#FFB4B4', borderRadius: 999, fontSize: 11, fontWeight: 700 }}>{a}</span>
            ))}
            {totalDiseases.map(d => (
              <span key={d} style={{ padding: '3px 8px', background: 'rgba(232,155,38,0.22)', color: '#FFD590', borderRadius: 999, fontSize: 11, fontWeight: 700 }}>{d}</span>
            ))}
          </div>
        </div>
        <div style={{ position: 'relative', borderLeft: '1px solid rgba(255,255,255,0.08)', paddingLeft: 20 }}>
          <div style={{ fontSize: 13, color: '#B8C5BA' }}>ì´ë² ë¬ ìë ì°¨ë¨</div>
          <div className="tabular" style={{ fontSize: 32, fontWeight: 800, color: '#A8E063', letterSpacing: '-0.02em', marginTop: 4 }}>{filteredOut}<span style={{ fontSize: 14, fontWeight: 500, color: '#fff', marginLeft: 4 }}>ê±´</span></div>
          <div style={{ fontSize: 11, color: '#B8C5BA', marginTop: 8, lineHeight: 1.5 }}>
            ì§ëë¬ë³´ë¤ 6ê±´ â<br/>ìë ë¥´ê¸° 19ê±´ Â· ìì 4ê±´
          </div>
        </div>
        <div style={{ position: 'relative', borderLeft: '1px solid rgba(255,255,255,0.08)', paddingLeft: 20 }}>
          <div style={{ fontSize: 13, color: '#B8C5BA' }}>ì´ë² ë¬ ê²ì¬ ìí</div>
          <div className="tabular" style={{ fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginTop: 4 }}>{checkedThisMonth}<span style={{ fontSize: 14, fontWeight: 500, color: '#fff', marginLeft: 4 }}>ê°</span></div>
          <div style={{ fontSize: 11, color: '#B8C5BA', marginTop: 8, lineHeight: 1.5 }}>
            ë¼ë²¨ ë¶ì ì íë 99.4%<br/>ìì½ì² 15ì¢ + ìì 8ì¢
          </div>
        </div>
      </div>

      {/* Allergy section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0F1E12' }}>ìë ë¥´ê¸° ê·¸ë£¹</h3>
          <Button variant="secondary" size="sm" icon={<Icon.Plus size={14} stroke="#1F4D2C"/>}>ê·¸ë£¹ ì¶ê°</Button>
        </div>
        <p style={{ fontSize: 12, color: '#6B7A6E', marginTop: 4, marginBottom: 14 }}>ê°ì¡± êµ¬ì±ìë³ë¡ ê·¸ë£¹ì ë§ë¤ê³  íìí  ëë§ ì ì©íì¸ì. í ê¸ë¡ ì¦ì ì¼ê³  ë ì ììµëë¤.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {allergyGroups.map(g => <AllergyGroupCard key={g.id} group={g} onToggle={() => toggleGroup('allergy', g.id)}/>)}
        </div>
      </div>

      {/* Disease section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0F1E12' }}>ì§ë³Â·ìì ê·¸ë£¹</h3>
          <Button variant="secondary" size="sm" icon={<Icon.Plus size={14} stroke="#1F4D2C"/>}>ê·¸ë£¹ ì¶ê°</Button>
        </div>
        <p style={{ fontSize: 12, color: '#6B7A6E', marginTop: 4, marginBottom: 14 }}>ë¹ë¨Â·ê³ íì ë± ìì ê¸°ì¤ì´ íìí ì§íì ë±ë¡íë©´ 1ì¼ ê¶ì¥ ì­ì·¨ë ê¸°ë°ì¼ë¡ ìë ì²´í¬í©ëë¤.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
          {diseaseGroups.map(g => <DiseaseGroupCard key={g.id} group={g} onToggle={() => toggleGroup('disease', g.id)}/>)}
        </div>
      </div>

      {/* Emergency contacts */}
      <div style={{ background: '#FBF1F0', border: '1px solid #F3C0BD', borderRadius: 12, padding: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
        <Icon.Alert size={22} stroke="#B71C1C"/>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#B71C1C' }}>ìê¸ ì ì°ë½ì²</div>
          <div style={{ fontSize: 12, color: '#7A1F1B', marginTop: 2 }}>ì¬í ìë ë¥´ê¸° ë°ì ì 119 Â· ë±ë¡ë ë³´í¸ì: ê¹ë¯¼ì 010-9876-5432</div>
        </div>
        <Button variant="secondary" size="sm">ë³´í¸ì ê´ë¦¬</Button>
      </div>

      {/* Privacy */}
      <div style={{ background: '#fff', border: '1px solid #E5E7E1', borderRadius: 12, padding: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
        <Icon.Lock size={22} stroke="#1F4D2C"/>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0F1E12' }}>ê±´ê° ì ë³´ ìí¸í ì ì¥</div>
          <div style={{ fontSize: 12, color: '#6B7A6E', marginTop: 2 }}>ìë ë¥´ê¸°Â·ì§ë³ ì ë³´ë KISA ì¸ì¦ AES-256 ìí¸íë¡ ì ì¥ëë©°, íìëë§ ì´ëí  ì ììµëë¤.</div>
        </div>
        <Button variant="secondary" size="sm">ìì¸ ë³´ê¸°</Button>
      </div>
    </div>
  );
};

const AllergyGroupCard = ({ group, onToggle }) => (
  <div style={{
    background: '#fff', border: '1.5px solid ' + (group.active ? '#1F4D2C' : '#E5E7E1'),
    borderRadius: 12, padding: 16, position: 'relative',
    boxShadow: group.active ? '0 4px 14px rgba(31,77,44,0.08)' : 'none'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
      <div style={{
        width: 36, height: 36, borderRadius: 999,
        background: group.active ? '#1F4D2C' : '#F4F5F1',
        color: group.active ? '#A8E063' : '#6B7A6E',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 800, fontSize: 13
      }}>{group.name[0]}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#0F1E12' }}>{group.name}</div>
        <div style={{ fontSize: 11, color: '#6B7A6E', marginTop: 1 }}>{group.subtitle}</div>
      </div>
      <Toggle on={group.active} onClick={onToggle}/>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
      <span style={{ fontSize: 10, color: '#6B7A6E', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>ì¬ê°ë</span>
      <span style={{ padding: '2px 7px', borderRadius: 4, fontSize: 10, fontWeight: 700,
        background: group.severity === 'high' ? '#FDEAEA' : '#FFF8EC',
        color: group.severity === 'high' ? '#B71C1C' : '#B97308'
      }}>{group.severity === 'high' ? 'ëì (ìëíë½ìì¤)' : 'ì¤ê°'}</span>
    </div>
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 12 }}>
      {group.allergens.map(x => (
        <div key={x} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px',
          background: group.active ? '#FEF2F2' : '#F4F5F1',
          border: '1px solid ' + (group.active ? '#F3D7D4' : '#E5E7E1'),
          borderRadius: 999 }}>
          <AllergenIcon name={x} size={13} danger={group.active}/>
          <span style={{ fontSize: 11, fontWeight: 700, color: group.active ? '#B71C1C' : '#3A4A3F' }}>{x}</span>
        </div>
      ))}
      <button style={{ padding: '4px 8px', background: '#fff', border: '1px dashed #C9CFC4', borderRadius: 999, fontFamily: 'inherit', fontSize: 11, fontWeight: 600, color: '#6B7A6E', cursor: 'pointer' }}>+ ì¶ê°</button>
    </div>
    <div style={{ display: 'flex', gap: 6, borderTop: '1px solid #F4F5F1', paddingTop: 10 }}>
      <button style={{ ...miniBtnStyle(false), flex: 1 }}>í¸ì§</button>
      <button style={{ ...miniBtnStyle(false), flex: 1 }}>ì´ë ¥ ë³´ê¸°</button>
    </div>
  </div>
);

const DiseaseGroupCard = ({ group, onToggle }) => (
  <div style={{
    background: '#fff', border: '1.5px solid ' + (group.active ? '#E89B26' : '#E5E7E1'),
    borderRadius: 12, padding: 18, position: 'relative',
    boxShadow: group.active ? '0 4px 14px rgba(232,155,38,0.1)' : 'none'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
      <div style={{
        width: 40, height: 40, borderRadius: 999,
        background: group.active ? '#FFF1D6' : '#F4F5F1',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <Icon.Heart2 size={20} color={group.active ? '#B97308' : '#9AA89D'}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: '#0F1E12' }}>{group.name}</div>
        <div style={{ fontSize: 11, color: '#6B7A6E', marginTop: 1 }}>{group.subtitle} Â· {group.stage}</div>
      </div>
      <Toggle on={group.active} onClick={onToggle}/>
    </div>
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 12 }}>
      {group.diseases.map(x => (
        <span key={x} style={{ padding: '4px 10px',
          background: group.active ? '#FFF8EC' : '#F4F5F1',
          border: '1px solid ' + (group.active ? '#F3DDA8' : '#E5E7E1'),
          borderRadius: 999, fontSize: 12, fontWeight: 700,
          color: group.active ? '#B97308' : '#3A4A3F'
        }}>{x}</span>
      ))}
    </div>
    <div style={{ background: '#FAFAF7', borderRadius: 8, padding: 10, marginBottom: 12 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: '#6B7A6E', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 6 }}>1ì¼ ê¶ì¥ íë</div>
      <div style={{ display: 'flex', gap: 14 }}>
        {Object.entries(group.nutrients).map(([k, v]) => (
          <div key={k}>
            <div style={{ fontSize: 10, color: '#9AA89D' }}>{k === 'sugar' ? 'ë¹ë¥' : k === 'sodium' ? 'ëí¸ë¥¨' : 'ì§ë°©'}</div>
            <div className="tabular" style={{ fontSize: 13, fontWeight: 800, color: '#0F1E12' }}>{v}{k === 'sodium' ? 'mg' : 'g'}</div>
          </div>
        ))}
      </div>
    </div>
    <div style={{ display: 'flex', gap: 6 }}>
      <button style={{ ...miniBtnStyle(false), flex: 1 }}>í¸ì§</button>
      <button style={{ ...miniBtnStyle(false), flex: 1 }}>ìë£ì§ ì ë³´</button>
    </div>
  </div>
);

const AddressTab = () => (
  <div>
    <SectionHead title="ë°°ì¡ì§ ê´ë¦¬" right={<Button variant="secondary" size="sm" icon={<Icon.Plus size={14} stroke="#1F4D2C"/>}>ë°°ì¡ì§ ì¶ê°</Button>}/>
    {[
      { label: 'ì§ (ê¸°ë³¸)', name: 'ë°í¬ì Â· 010-1234-5678', addr: 'ìì¸ ê°ë¨êµ¬ íí¤ëë¡ 123, 1502í¸ (ì­ì¼ë, ê°ë¨ë¹ë©)', def: true },
      { label: 'íì¬', name: 'ë°í¬ì Â· 010-1234-5678', addr: 'ìì¸ ë§í¬êµ¬ ìíë¡ 45, 5ì¸µ', def: false }
    ].map((a, i) => (
      <div key={i} style={{ background: '#fff', border: '1px solid ' + (a.def ? '#1F4D2C' : '#E5E7E1'), borderRadius: 12, padding: 20, marginBottom: 12, display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        <Icon.MapPin size={20} stroke={a.def ? '#1F4D2C' : '#6B7A6E'}/>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#0F1E12' }}>{a.label}</span>
            {a.def && <span style={{ padding: '2px 7px', background: '#1F4D2C', color: '#fff', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>ê¸°ë³¸ ë°°ì¡ì§</span>}
          </div>
          <div style={{ fontSize: 13, color: '#3A4A3F', marginTop: 6 }}>{a.name}</div>
          <div style={{ fontSize: 13, color: '#6B7A6E', marginTop: 2 }}>{a.addr}</div>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button style={smallBtn(false)}>í¸ì§</button>
          {!a.def && <button style={smallBtn(false)}>ì­ì </button>}
        </div>
      </div>
    ))}
  </div>
);

const AccountTab = () => (
  <div>
    <SectionHead title="íì ì ë³´"/>
    <div style={{ background: '#fff', border: '1px solid #E5E7E1', borderRadius: 12, padding: 24 }}>
      {[
        { k: 'ì´ë¦', v: 'ë°í¬ì' },
        { k: 'ì´ë©ì¼', v: 'parkheun@example.com', edit: true },
        { k: 'í´ëí°', v: '010-1234-5678', edit: true },
        { k: 'ìëìì¼', v: '1988.04.21' },
        { k: 'ì±ë³', v: 'ì¬ì±' },
        { k: 'ê°ìì¼', v: '2024.01.15' }
      ].map(r => (
        <div key={r.k} style={{ display: 'grid', gridTemplateColumns: '140px 1fr auto', alignItems: 'center', gap: 16, padding: '14px 0', borderTop: '1px solid #F4F5F1' }}>
          <span style={{ fontSize: 13, color: '#6B7A6E', fontWeight: 600 }}>{r.k}</span>
          <span style={{ fontSize: 14, color: '#0F1E12' }}>{r.v}</span>
          {r.edit && <button style={smallBtn(false)}>ë³ê²½</button>}
        </div>
      ))}
    </div>
    <div style={{ marginTop: 24, display: 'flex', gap: 8 }}>
      <button style={{ ...smallBtn(false), padding: '8px 14px' }}>ë¹ë°ë²í¸ ë³ê²½</button>
      <button style={{ ...smallBtn(false), padding: '8px 14px', color: '#D32F2F', borderColor: '#FCD7D7' }}>íì íí´</button>
    </div>
  </div>
);

const NotifyTab = () => {
  const [s, setS] = React.useState({ order: true, allergy: true, deal: false, news: false, expiry: true });
  return (
    <div>
      <SectionHead title="ìë¦¼ ì¤ì "/>
      <div style={{ background: '#fff', border: '1px solid #E5E7E1', borderRadius: 12, padding: 8 }}>
        {[
          { id: 'order', label: 'ì£¼ë¬¸Â·ë°°ì¡ ìë¦¼', desc: 'ì£¼ë¬¸ ì ì, ë°°ì¡ ì¶ë°/ëì°© ì ìë¦¼' },
          { id: 'allergy', label: 'ìë ë¥´ê¸° ê²½ê³ ', desc: 'êµ¬ë§¤ ì§ì  ìí ìì¬ë£ ê°ì§ ì í¸ì' },
          { id: 'deal', label: 'í¹ê°Â·ì¿ í°', desc: 'ê´ì¬ ì¹´íê³ ë¦¬ì ìê° í¹ê° ìë¦¼' },
          { id: 'expiry', label: 'ì¿ í° ë§ë£ ìë°', desc: 'ì¿ í° ë§ë£ 3ì¼ ì  ìë¦¼' },
          { id: 'news', label: 'ë´ì¤ë í°', desc: 'ì£¼ê° ìì ê°ì´ë ë´ì¤ë í°' }
        ].map(n => (
          <div key={n.id} style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 16, borderRadius: 8 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#0F1E12' }}>{n.label}</div>
              <div style={{ fontSize: 12, color: '#6B7A6E', marginTop: 2 }}>{n.desc}</div>
            </div>
            <Toggle on={s[n.id]} onClick={() => setS({ ...s, [n.id]: !s[n.id] })}/>
          </div>
        ))}
      </div>
    </div>
  );
};

const Toggle = ({ on, onClick }) => (
  <button onClick={onClick} style={{
    width: 40, height: 22, borderRadius: 999, border: 'none', cursor: 'pointer', position: 'relative',
    background: on ? '#1F4D2C' : '#C9CFC4', transition: 'background 150ms'
  }}>
    <span style={{ position: 'absolute', top: 2, left: on ? 20 : 2, width: 18, height: 18, background: '#fff', borderRadius: 999, transition: 'left 150ms', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }}/>
  </button>
);

const SectionHead = ({ title, desc, right }) => (
  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: desc ? 20 : 18, gap: 16 }}>
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0F1E12', letterSpacing: '-0.02em' }}>{title}</h2>
      {desc && <p style={{ fontSize: 13, color: '#6B7A6E', marginTop: 4, lineHeight: 1.55 }}>{desc}</p>}
    </div>
    {right}
  </div>
);

const smallBtn = (primary) => ({
  padding: '6px 12px', fontFamily: 'inherit', fontSize: 12, fontWeight: 600,
  border: '1px solid', borderColor: primary ? '#1F4D2C' : '#E5E7E1',
  background: primary ? '#1F4D2C' : '#fff', color: primary ? '#fff' : '#3A4A3F',
  borderRadius: 6, cursor: 'pointer'
});

const miniBtnStyle = (primary) => ({
  padding: '8px 10px', fontFamily: 'inherit', fontSize: 12, fontWeight: 600,
  border: '1px solid', borderColor: primary ? '#1F4D2C' : '#E5E7E1',
  background: primary ? '#1F4D2C' : '#fff', color: primary ? '#fff' : '#3A4A3F',
  borderRadius: 6, cursor: 'pointer'
});

