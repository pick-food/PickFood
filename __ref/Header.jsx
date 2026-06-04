// Header â full e-commerce style header with search, location, cart, live notifications
window.Header = ({ active, onNav, user, loggedIn, onLoginToggle }) => {
  const [q, setQ] = React.useState('');
  const [openMenu, setOpenMenu] = React.useState(null); // 'notif' | 'cart' | null

  const notifs   = PF_STORE.use(s => s.notifs);
  const cart     = PF_STORE.use(s => s.cart);
  const wishlist = PF_STORE.use(s => s.wishlist);

  const unread = notifs.filter(n => n.unread).length;
  const cartQty = cart.reduce((sum, c) => sum + c.qty, 0);

  const trendingKeywords = ['ì ë¹ ìí', 'ìë¦¬ì ì¸ì¦', 'ê¸ë£¨ííë¦¬', 'ìì° ìë ë³¶ìë°¥', 'ì ëí¸ë¥¨'];

  React.useEffect(() => {
    if (!openMenu) return;
    const close = (e) => {
      if (!e.target.closest('[data-popover-root]')) setOpenMenu(null);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [openMenu]);

  const utilLinks = [
    { id: 'help', label: 'ê³ ê°ì¼í°' },
    { id: 'biz', label: 'ìì ë¬¸ì', href: '../../partners/index.html' },
    { id: 'app', label: 'ì± ë¤ì´ë¡ë' }
  ];

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 60, background: '#fff' }}>
      {/* Top utility strip */}
      <div style={{ borderBottom: '1px solid #F0F2EC', background: '#FAFAF6' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '6px 40px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 14, fontSize: 12, color: '#6B7A6E' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Icon.MapPin size={12} stroke="#1F4D2C"/>
            <strong style={{ color: '#0F1E12' }}>ìì¸ ê°ë¨êµ¬ ì­ì¼ë</strong>
          </span>
          <span style={{ width: 1, height: 10, background: '#E5E7E1' }}/>
          {utilLinks.map((l, i) => (
            <React.Fragment key={l.id}>
              {i > 0 && <span style={{ width: 1, height: 10, background: '#E5E7E1' }}/>}
              <a href={l.href} style={{ cursor: 'pointer' }}>{l.label}</a>
            </React.Fragment>
          ))}
          <span style={{ width: 1, height: 10, background: '#E5E7E1' }}/>
          {loggedIn ? (
            <a onClick={onLoginToggle} style={{ cursor: 'pointer', color: '#1F4D2C', fontWeight: 600 }}>ë¡ê·¸ìì</a>
          ) : (
            <a onClick={onLoginToggle} style={{ cursor: 'pointer', color: '#1F4D2C', fontWeight: 600 }}>ë¡ê·¸ì¸ (ë°ëª¨)</a>
          )}
        </div>
      </div>

      {/* Main header */}
      <div style={{ borderBottom: '1px solid #E5E7E1' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '16px 40px', display: 'flex', alignItems: 'center', gap: 28 }}>
          <a onClick={() => onNav('home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="../../assets/logo.svg" alt="pickfood" style={{ height: 40, width: 'auto' }}/>
          </a>

          <nav style={{ display: 'flex', gap: 2, fontSize: 15 }}>
            {[
              { id: 'home', label: 'í' },
              { id: 'search', label: 'ì¹´íê³ ë¦¬' },
              { id: 'detail', label: 'íë ì´ì' },
              { id: 'chatbot', label: 'AI ìë´' }
            ].map(item => (
              <button key={item.id} onClick={() => onNav(item.id)} className="pf-btn" style={{
                fontFamily: 'inherit', fontSize: 15, fontWeight: active === item.id ? 800 : 600,
                color: active === item.id ? '#0F1E12' : '#3A4A3F',
                background: 'transparent', border: 'none', cursor: 'pointer',
                padding: '8px 12px', borderRadius: 8, position: 'relative'
              }}>
                {item.label}
                {item.id === 'chatbot' && (
                  <span style={{ position: 'absolute', top: 2, right: -2, background: '#A8E063', color: '#0F1E12', fontSize: 9, fontWeight: 800, padding: '1px 4px', borderRadius: 3 }}>NEW</span>
                )}
              </button>
            ))}
          </nav>

          <div style={{ flex: 1, position: 'relative', maxWidth: 560 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 14px', borderRadius: 999,
              border: '2px solid #0F1E12', background: '#fff'
            }}>
              <Icon.Search size={18} stroke="#0F1E12"/>
              <input value={q} onChange={e => setQ(e.target.value)}
                placeholder="ìì° ìë ë³¶ìë°¥, ì ë¹ ë¹µ, ê¸ë£¨ííë¦¬â¦"
                style={{ flex: 1, border: 'none', outline: 'none', fontFamily: 'inherit', fontSize: 14, background: 'transparent' }}/>
              <button className="pf-btn" style={{
                background: '#0F1E12', color: '#A8E063', border: 'none', borderRadius: 999,
                padding: '5px 12px', fontFamily: 'inherit', fontSize: 12, fontWeight: 700, cursor: 'pointer'
              }}>ê²ì</button>
            </div>
            {q.length === 0 && (
              <div style={{ display: 'flex', gap: 6, marginTop: 8, paddingLeft: 4, alignItems: 'center', fontSize: 11 }}>
                <span style={{ color: '#9AA89D', fontWeight: 600 }}>ì¸ê¸° ê²ì</span>
                {trendingKeywords.map((k, i) => (
                  <a key={k} onClick={() => onNav('search')} style={{
                    cursor: 'pointer', color: '#3A4A3F', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 3
                  }}>
                    <span style={{ color: i < 3 ? '#D32F2F' : '#9AA89D', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{i + 1}</span>
                    {k}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div data-popover-root style={{ position: 'relative' }}>
              <IconAction icon={<Icon.Bell size={20} stroke="#3A4A3F"/>} label="ìë¦¼" badge={unread || null} onClick={() => setOpenMenu(o => o === 'notif' ? null : 'notif')} active={openMenu === 'notif'}/>
              {openMenu === 'notif' && <NotifPanel notifs={notifs} onClose={() => setOpenMenu(null)}/>}
            </div>
            <IconAction icon={<Icon.Heart size={20} stroke="#3A4A3F"/>} label="ì°" badge={wishlist.length || null} onClick={() => onNav('wishlist')}/>
            <div data-popover-root style={{ position: 'relative' }}>
              <IconAction icon={<Icon.Cart size={20} stroke="#3A4A3F"/>} label="ì¥ë°êµ¬ë" badge={cartQty || null} onClick={() => onNav('cart')} active={false}/>
            </div>
            <button onClick={() => onNav('mypage')} className="pf-btn" style={{
              display: 'flex', alignItems: 'center', gap: 8, background: 'transparent', border: 'none',
              cursor: 'pointer', padding: '6px 8px 6px 10px', borderRadius: 999, marginLeft: 4
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: 999,
                background: loggedIn ? 'linear-gradient(135deg, #1F4D2C, #2E8B57)' : '#E5E7E1',
                color: loggedIn ? '#A8E063' : '#9AA89D',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12
              }}>{loggedIn ? (user?.name?.[0] || 'ë°') : <Icon.User size={16} stroke="#9AA89D"/>}</div>
            </button>
          </div>
        </div>
      </div>

      {loggedIn && (
        <div style={{ background: '#0F1E12', color: '#fff' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '8px 40px', display: 'flex', alignItems: 'center', gap: 12, fontSize: 12 }}>
            <Icon.Shield size={14} stroke="#A8E063"/>
            <span style={{ color: '#A8E063', fontWeight: 700 }}>ìì  íí° ON</span>
            <span style={{ color: '#5A6F60' }}>Â·</span>
            <span style={{ color: '#DCE9DF' }}>ë°í¬ìë / ìì°Â·ê² / ë¹ë¨ ì¼ì´ ì ì© ì¤</span>
            <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 4, color: '#A8E063', cursor: 'pointer', fontWeight: 600 }}>
              íí° ê´ë¦¬ <Icon.ChevronRight size={12} stroke="#A8E063"/>
            </span>
          </div>
        </div>
      )}
    </header>
  );
};

const IconAction = ({ icon, label, badge, onClick, active }) => (
  <button onClick={onClick} className="pf-btn" style={{
    position: 'relative',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0,
    background: active ? '#F0F2EC' : 'transparent', border: 'none', cursor: 'pointer',
    padding: '6px 10px', borderRadius: 8, minWidth: 52,
    transition: 'background 160ms'
  }}>
    {icon}
    <span style={{ fontSize: 10, color: '#6B7A6E', fontWeight: 600, marginTop: 2 }}>{label}</span>
    {badge && (
      <span className="pf-scale-in" style={{
        position: 'absolute', top: 2, right: 4,
        background: '#D32F2F', color: '#fff', borderRadius: 999,
        fontSize: 10, fontWeight: 800, padding: '1px 5px', minWidth: 16, textAlign: 'center', lineHeight: 1.3
      }}>{badge}</span>
    )}
  </button>
);

// ----- Notification Panel -----
const NOTIF_META = {
  allergy:  { icon: <Icon.Alert size={16} stroke="#D32F2F"/>,  bg: '#FDEAEA', cat: 'ìì  ìë¦¼' },
  delivery: { icon: <Icon.Cart size={16} stroke="#1F4D2C"/>,   bg: '#EAF7D4', cat: 'êµ¬ë§¤' },
  deal:     { icon: <Icon.Shield size={16} stroke="#B97308"/>, bg: '#FFF1D6', cat: 'íí' },
  coupon:   { icon: <Icon.Star size={16} stroke="#B97308" filled/>, bg: '#FFF1D6', cat: 'íí' },
  review:   { icon: <Icon.Chat size={16} stroke="#3A4A3F"/>,   bg: '#F0F2EC', cat: 'êµ¬ë§¤' }
};
const TABS = [
  { id: 'all',     label: 'ì ì²´',     match: () => true },
  { id: 'purchase',label: 'êµ¬ë§¤',     match: n => ['delivery','review'].includes(n.kind) },
  { id: 'safety',  label: 'ìì  ìë¦¼', match: n => n.kind === 'allergy' },
  { id: 'reward',  label: 'íí',     match: n => ['deal','coupon'].includes(n.kind) }
];

const NotifPanel = ({ notifs, onClose }) => {
  const [tab, setTab] = React.useState('all');
  const filtered = notifs.filter(TABS.find(t => t.id === tab).match);

  return (
    <div className="pf-scale-in" style={{
      position: 'absolute', top: 'calc(100% + 8px)', right: 0,
      width: 400, maxHeight: 560, background: '#fff', borderRadius: 14,
      border: '1px solid #E5E7E1', boxShadow: '0 16px 48px rgba(15,30,18,0.16)',
      overflow: 'hidden', display: 'flex', flexDirection: 'column', zIndex: 70,
      transformOrigin: 'top right'
    }}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid #F0F2EC', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#0F1E12' }}>ìë¦¼</div>
          <div style={{ fontSize: 11, color: '#6B7A6E', marginTop: 2 }}>ë°í¬ìë íë¡í ê¸°ì¤ ìì  ìë¦¼ ì°ì  íì</div>
        </div>
        <button onClick={PF_STORE.markAllRead} className="pf-btn" style={{ background: '#F0F2EC', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 11, color: '#1F4D2C', fontWeight: 700, padding: '6px 10px', borderRadius: 6 }}>
          ëª¨ë ì½ì
        </button>
      </div>

      <div style={{ display: 'flex', gap: 4, padding: '8px 12px', borderBottom: '1px solid #F0F2EC', fontSize: 12 }}>
        {TABS.map(t => {
          const count = notifs.filter(t.match).filter(n => n.unread).length;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} className="pf-btn" style={{
              padding: '5px 12px', borderRadius: 999, border: 'none', cursor: 'pointer',
              background: tab === t.id ? '#0F1E12' : 'transparent',
              color: tab === t.id ? '#fff' : '#6B7A6E',
              fontWeight: 700, fontFamily: 'inherit', fontSize: 12,
              display: 'inline-flex', alignItems: 'center', gap: 4
            }}>
              {t.label}
              {count > 0 && <span className="tabular" style={{ background: tab === t.id ? '#A8E063' : '#D32F2F', color: tab === t.id ? '#0F1E12' : '#fff', borderRadius: 999, padding: '0 5px', fontSize: 10 }}>{count}</span>}
            </button>
          );
        })}
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }} className="pf-stagger">
        {filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#9AA89D', fontSize: 13 }}>
            ìë¡ì´ ìë¦¼ì´ ììµëë¤.
          </div>
        ) : filtered.map(n => {
          const meta = NOTIF_META[n.kind] || NOTIF_META.review;
          return (
            <div key={n.id} onClick={() => PF_STORE.markRead(n.id)} style={{
              padding: '14px 18px', borderBottom: '1px solid #F4F5F0',
              display: 'flex', gap: 12,
              background: n.unread ? '#FAFAF7' : '#fff',
              cursor: 'pointer', position: 'relative',
              transition: 'background 160ms'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#F0F2EC'}
            onMouseLeave={e => e.currentTarget.style.background = n.unread ? '#FAFAF7' : '#fff'}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {meta.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#6B7A6E', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{meta.cat}</span>
                  {n.unread && <span style={{ width: 5, height: 5, borderRadius: 999, background: '#D32F2F' }}/>}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0F1E12', lineHeight: 1.3 }}>{n.title}</div>
                <div style={{ fontSize: 12, color: '#3A4A3F', lineHeight: 1.5, marginTop: 4 }}>{n.desc}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
                  <span className="tabular" style={{ fontSize: 11, color: '#9AA89D' }}>{n.time}</span>
                  {n.action && <a className="pf-btn" style={{ fontSize: 11, color: '#1F4D2C', fontWeight: 700, cursor: 'pointer' }}>{n.action} â</a>}
                </div>
              </div>
              <button onClick={e => { e.stopPropagation(); PF_STORE.dismissNotif(n.id); }} className="pf-btn" style={{
                background: 'transparent', border: 'none', cursor: 'pointer', padding: 4, alignSelf: 'flex-start', flexShrink: 0,
                opacity: 0.5
              }}>
                <Icon.Close size={14} stroke="#9AA89D"/>
              </button>
            </div>
          );
        })}
      </div>

      <div style={{ padding: '10px 14px', borderTop: '1px solid #F0F2EC', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, color: '#9AA89D' }}>30ì¼ ì´ë´ ìë¦¼</span>
        <a style={{ fontSize: 12, color: '#1F4D2C', fontWeight: 700, cursor: 'pointer' }}>ìë¦¼ ì¤ì  â</a>
      </div>
    </div>
  );
};

// ----- Cart Mini Preview -----
const CartPreview = ({ onClose, onNav }) => {
  const cart = PF_STORE.use(s => s.cart);
  const products = window.PF_DATA.products;
  const items = cart.map(c => ({ ...products.find(p => p.id === c.id), qty: c.qty })).filter(x => x.id);
  const subtotal = items.reduce((sum, it) => sum + (it.price * it.qty), 0);

  return (
    <div className="pf-scale-in" style={{
      position: 'absolute', top: 'calc(100% + 8px)', right: 0,
      width: 380, maxHeight: 540, background: '#fff', borderRadius: 14,
      border: '1px solid #E5E7E1', boxShadow: '0 16px 48px rgba(15,30,18,0.16)',
      overflow: 'hidden', display: 'flex', flexDirection: 'column', zIndex: 70,
      transformOrigin: 'top right'
    }}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid #F0F2EC', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: '#0F1E12' }}>ì¥ë°êµ¬ë <span className="tabular" style={{ color: '#1F4D2C' }}>{cart.reduce((s,c)=>s+c.qty,0)}</span></div>
        <button onClick={onClose} className="pf-btn" style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4 }}>
          <Icon.Close size={14} stroke="#9AA89D"/>
        </button>
      </div>
      {items.length === 0 ? (
        <div style={{ padding: '48px 20px', textAlign: 'center' }}>
          <Icon.Cart size={36} stroke="#C9CFC4"/>
          <div style={{ fontSize: 13, color: '#6B7A6E', marginTop: 10 }}>ì¥ë°êµ¬ëê° ë¹ì´ ìì´ì</div>
          <div style={{ fontSize: 11, color: '#9AA89D', marginTop: 4 }}>ìì í ìíì ê³¨ë¼ ë´ì ë³´ì¸ì</div>
        </div>
      ) : (
        <>
          <div style={{ flex: 1, overflowY: 'auto' }} className="pf-stagger">
            {items.map(it => (
              <div key={it.id} style={{ padding: '12px 16px', borderBottom: '1px solid #F4F5F0', display: 'flex', gap: 10, alignItems: 'center' }}>
                <img src={it.img} alt="" style={{ width: 48, height: 48, borderRadius: 6, objectFit: 'cover' }}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10, color: '#6B7A6E' }}>{it.brand}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#0F1E12', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.name}</div>
                  <div className="tabular" style={{ fontSize: 12, fontWeight: 700, color: '#0F1E12', marginTop: 2 }}>{(it.price * it.qty).toLocaleString()}ì</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E5E7E1', borderRadius: 6 }}>
                  <button onClick={() => PF_STORE.setCartQty(it.id, it.qty - 1)} className="pf-btn" style={qtyMiniBtn}><Icon.Minus size={11} stroke="#3A4A3F"/></button>
                  <span className="tabular" style={{ width: 22, textAlign: 'center', fontSize: 12, fontWeight: 700 }}>{it.qty}</span>
                  <button onClick={() => PF_STORE.setCartQty(it.id, it.qty + 1)} className="pf-btn" style={qtyMiniBtn}><Icon.Plus size={11} stroke="#3A4A3F"/></button>
                </div>
                <button onClick={() => PF_STORE.removeFromCart(it.id)} className="pf-btn" style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4 }}>
                  <Icon.Trash size={14} stroke="#9AA89D"/>
                </button>
              </div>
            ))}
          </div>
          <div style={{ padding: 14, borderTop: '1px solid #F0F2EC', background: '#FAFAF7' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 12, color: '#6B7A6E' }}>ì´ í©ê³</span>
              <span className="tabular" style={{ fontSize: 18, fontWeight: 800, color: '#0F1E12' }}>{subtotal.toLocaleString()}ì</span>
            </div>
            <button onClick={() => { onClose(); onNav('mypage'); }} className="pf-btn" style={{
              width: '100%', padding: '10px', background: '#0F1E12', color: '#fff', border: 'none',
              borderRadius: 8, fontFamily: 'inherit', fontSize: 13, fontWeight: 700, cursor: 'pointer'
            }}>ì¥ë°êµ¬ë ë³´ë¬ê°ê¸°</button>
          </div>
        </>
      )}
    </div>
  );
};
const qtyMiniBtn = { width: 24, height: 24, background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };

// Footer
window.Footer = () => (
  <footer style={{ background: '#0F1E12', color: '#fff', marginTop: 80 }}>
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 40px 32px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr 1fr', gap: 40, marginBottom: 40 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.04em', marginBottom: 14, color: '#A8E063' }}>pickfood</div>
          <p style={{ fontSize: 12, lineHeight: 1.7, color: '#A0B0A6' }}>
            ìë ë¥´ê¸°Â·ì§ë³ì´ ìë ê°ì¡±ì ìí<br/>
            ë§ì¶¤ ìí íë ì´ì íë«í¼.<br/>
            ë§¤ì¼ ìì í ìíì ë°°ë¬í©ëë¤.
          </p>
          <div style={{ display: 'flex', gap: 6, marginTop: 18 }}>
            {['HACCP','KFDA','ISO 22000','KISA'].map(c => (
              <span key={c} style={{ padding: '4px 8px', border: '1px solid #2A3A2F', borderRadius: 4, fontSize: 10, fontWeight: 700, color: '#A0B0A6' }}>{c}</span>
            ))}
          </div>
        </div>
        <FooterColumn title="ê³ ê°ì§ì" items={['ê³µì§ì¬í­','ìì£¼ ë¬»ë ì§ë¬¸','1:1 ë¬¸ì','ë°íÂ·êµí']}/>
        <FooterColumn title="íì¬ì ë³´" items={['íì¬ ìê°','ì±ì© ìë´','ë³´ëìë£','íí¸ëì­']}/>
        <FooterColumn title="ìì ê¸°ì¤" items={['ìë ë¥´ê¸° ê²ì¦ ì ì°¨','ìì ìë¬¸ ììí','HACCP ì¸ì¦','ìì¬ë£ ì¶ì ']}/>
        <FooterColumn title="ìì Â·ì í´" items={['ë¸ëë ìì ','PB íì','ê´ê³  ì í´','API ì í´']}/>
      </div>
      <div style={{ borderTop: '1px solid #2A3A2F', paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ fontSize: 11, color: '#6B8070', lineHeight: 1.8 }}>
          (ì£¼)í½í¸ë  Â·  ëí ì´ëí  Â·  ì¬ììë±ë¡ë²í¸ 123-45-67890  Â·  íµì íë§¤ìì ê³  2026-ìì¸ê°ë¨-01234<br/>
          ìì¸í¹ë³ì ê°ë¨êµ¬ íí¤ëë¡ 123, í½í¸ëë¹ë© 8ì¸µ  Â·  ê³ ê°ì¼í° 1588-0000 (íì¼ 09:00â18:00)<br/>
          Â© 2026 pickfood Inc. All rights reserved.
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <SocialDot label="IG"/>
          <SocialDot label="YT"/>
          <SocialDot label="BL"/>
          <SocialDot label="KK"/>
        </div>
      </div>
    </div>
  </footer>
);

const FooterColumn = ({ title, items }) => (
  <div>
    <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 14, color: '#fff' }}>{title}</div>
    <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, listStyle: 'none', padding: 0, margin: 0 }}>
      {items.map(it => <li key={it} style={{ fontSize: 12, color: '#A0B0A6', cursor: 'pointer' }}>{it}</li>)}
    </ul>
  </div>
);
const SocialDot = ({ label }) => (
  <div style={{ width: 30, height: 30, borderRadius: 999, background: '#1A2A1F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#A0B0A6', cursor: 'pointer' }}>{label}</div>
);

