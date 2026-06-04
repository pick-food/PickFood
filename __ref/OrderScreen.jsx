// OrderScreen â checkout flow
window.OrderScreen = ({ user, onComplete, onBack }) => {
  const d = window.PF_DATA;
  const cart = PF_STORE.use(s => s.cart);
  const items = cart.map(c => ({ ...d.products.find(p => p.id === c.id), qty: c.qty })).filter(x => x.id);
  const subtotal = items.reduce((sum, it) => sum + (it.price * it.qty), 0);
  const shippingFee = subtotal >= 40000 || subtotal === 0 ? 0 : 3000;

  const [addressIdx, setAddressIdx] = React.useState(0);
  const [delivery, setDelivery] = React.useState('standard');
  const [pay, setPay] = React.useState('card');
  const [coupon, setCoupon] = React.useState(null);
  const [usePoints, setUsePoints] = React.useState(0);
  const [agreed, setAgreed] = React.useState({ terms: false, privacy: false, age: false });
  const [memo, setMemo] = React.useState('');

  const addresses = [
    { id: 'a1', label: 'ì§ (ê¸°ë³¸)', name: 'ë°í¬ì', phone: '010-1234-5678', addr: 'ìì¸ ê°ë¨êµ¬ íí¤ëë¡ 123, 1502í¸ (ì­ì¼ë, ê°ë¨ë¹ë©)', def: true },
    { id: 'a2', label: 'íì¬', name: 'ë°í¬ì', phone: '010-1234-5678', addr: 'ìì¸ ë§í¬êµ¬ ìíë¡ 45, 5ì¸µ', def: false }
  ];
  const addr = addresses[addressIdx];

  const deliveryOptions = [
    { id: 'standard', label: 'ì¼ë° ë°°ì¡', desc: 'ì£¼ë¬¸ ë¤ì ììì¼ ëì°©', fee: shippingFee, extra: shippingFee === 0 ? 'ë¬´ë£' : `${shippingFee.toLocaleString()}ì` },
    { id: 'pickup',   label: 'í¸ìì  í½ì', desc: 'ê°ê¹ì´ CUÂ·GS25ìì ìë ¹', fee: 0, extra: 'ë¬´ë£' },
    { id: 'scheduled',label: 'ë ì§ ì§ì  ë°°ì¡', desc: 'ìíë ë ì§Â·ìê°ì ë°ê¸°', fee: shippingFee + 2000, extra: `+2,000ì` }
  ];
  const chosenDelivery = deliveryOptions.find(o => o.id === delivery);

  const coupons = [
    { id: 'c1', label: '5,000ì í ì¸ (íì ì ì©)', cond: '20,000ì ì´ì ê²°ì ', amount: 5000, valid: subtotal >= 20000 },
    { id: 'c2', label: 'ë¹ë¨ ì¼ì´ ë¼ì¸ 15%', cond: 'ë¹ë¨ ì¼ì´ ìí íì ', amount: Math.round(subtotal * 0.15), valid: true },
    { id: 'c3', label: '1,000ì (15,000ì+)', cond: '15,000ì ì´ì ê²°ì ', amount: 1000, valid: subtotal >= 15000 }
  ];
  const couponDiscount = coupon ? coupons.find(c => c.id === coupon).amount : 0;
  const pointsApplied = Math.min(usePoints, 2340);
  const total = subtotal + chosenDelivery.fee - couponDiscount - pointsApplied;
  const allChecked = agreed.terms && agreed.privacy && agreed.age;

  const activeAllergenNames = (user?.activeAllergyGroups || []).flatMap(gid =>
    (d.allergyGroups.find(g => g.id === gid)?.allergens || []).map(aid => d.allergens.find(a => a.id === aid)?.name)
  ).filter(Boolean);
  const dangerItems = items.filter(it => it.allergens.some(a => activeAllergenNames.includes(a)));

  return (
    <div style={{ background: '#FFFFFF', minHeight: 'calc(100vh - 60px)', paddingBottom: 80 }} data-screen-label="ì£¼ë¬¸/ê²°ì ">
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 40px' }}>
        <button onClick={onBack} className="pf-btn" style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', fontSize: 13, color: '#6B7A6E', marginBottom: 16 }}>
          <Icon.ArrowLeft size={14} stroke="#6B7A6E"/> ì¥ë°êµ¬ëë¡
        </button>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0F1E12', letterSpacing: '-0.02em' }}>ì£¼ë¬¸ / ê²°ì </h1>
        <div style={{ fontSize: 13, color: '#6B7A6E', marginTop: 4 }}>ìí {items.length}ê±´ Â· {items.reduce((s,c)=>s+c.qty,0)}ê°</div>

        {dangerItems.length > 0 && (
          <div  style={{
            marginTop: 18, background: '#FDEAEA', border: '1px solid #F3C0BD', borderRadius: 12,
            padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14
          }}>
            <div style={{ width: 38, height: 38, borderRadius: 999, background: '#D32F2F', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, animation: 'pfPulse 1.6s ease-in-out infinite' }}>
              <Icon.Alert size={20} stroke="#fff"/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#B71C1C', marginBottom: 2 }}>íìë ìë ë¥´ê¸° íë¡íì í´ë¹íë ìíì´ í¬í¨ëì´ ìì´ì</div>
              <div style={{ fontSize: 12, color: '#B71C1C', opacity: 0.85 }}>
                {dangerItems.map(it => it.name).slice(0, 2).join(', ')} ë± {dangerItems.length}ê° â ê²°ì  ì  ë¤ì í ë² íì¸í´ ì£¼ì¸ì.
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24, alignItems: 'flex-start', marginTop: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Address */}
            <Section title="ë°°ì¡ì§" right={<button className="pf-btn" style={linkBtn}>ë³ê²½</button>}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                {addresses.map((a, i) => (
                  <label key={a.id} style={{
                    flex: 1, padding: 14, borderRadius: 10, cursor: 'pointer',
                    border: '1.5px solid ' + (addressIdx === i ? '#0F1E12' : '#E5E7E1'),
                    background: addressIdx === i ? '#F0F6F1' : '#fff'
                  }}>
                    <input type="radio" checked={addressIdx === i} onChange={() => setAddressIdx(i)} style={{ display: 'none' }}/>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#0F1E12' }}>{a.label}</span>
                      {a.def && <span style={{ padding: '2px 6px', background: '#1F4D2C', color: '#fff', borderRadius: 3, fontSize: 10, fontWeight: 700 }}>ê¸°ë³¸</span>}
                    </div>
                    <div style={{ fontSize: 12, color: '#3A4A3F' }}>{a.name} Â· {a.phone}</div>
                    <div style={{ fontSize: 12, color: '#6B7A6E', marginTop: 2 }}>{a.addr}</div>
                  </label>
                ))}
              </div>
              <input value={memo} onChange={e => setMemo(e.target.value)} placeholder="ë°°ì¡ ë©ëª¨ (ì: ë¶ì¬ ì ë¬¸ ì)" style={{
                width: '100%', padding: '10px 12px', border: '1px solid #E5E7E1', borderRadius: 8,
                fontFamily: 'inherit', fontSize: 13, outline: 'none'
              }}/>
            </Section>

            {/* Items list */}
            <Section title={`ì£¼ë¬¸ ìí ${items.length}ê±´`}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {items.map((it, i) => {
                  const danger = it.allergens.some(a => activeAllergenNames.includes(a));
                  return (
                    <div key={it.id} style={{ padding: '12px 0', borderBottom: i < items.length - 1 ? '1px solid #F4F5F0' : 'none', display: 'flex', gap: 14, alignItems: 'center' }}>
                      <img src={it.img} alt="" style={{ width: 60, height: 60, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }}/>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 11, color: '#6B7A6E', fontWeight: 600 }}>{it.brand}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#0F1E12' }}>{it.name}</div>
                        <div className="tabular" style={{ fontSize: 12, color: '#6B7A6E', marginTop: 2 }}>{it.price.toLocaleString()}ì Ã {it.qty}</div>
                        {danger && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, marginTop: 4, padding: '2px 6px', background: '#FDEAEA', color: '#B71C1C', borderRadius: 3, fontSize: 10, fontWeight: 700 }}>
                            <Icon.Alert size={9} stroke="#B71C1C"/> ìë ë¥´ê¸° ì£¼ì
                          </span>
                        )}
                      </div>
                      <div className="tabular" style={{ fontSize: 14, fontWeight: 800, color: '#0F1E12' }}>{(it.price * it.qty).toLocaleString()}ì</div>
                    </div>
                  );
                })}
              </div>
            </Section>

            {/* Delivery */}
            <Section title="ë°°ì¡ ë°©ë²">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {deliveryOptions.map(o => (
                  <label key={o.id} style={{
                    padding: 14, border: '1.5px solid ' + (delivery === o.id ? '#0F1E12' : '#E5E7E1'),
                    background: delivery === o.id ? '#F0F6F1' : '#fff',
                    borderRadius: 10, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 12
                  }}>
                    <input type="radio" checked={delivery === o.id} onChange={() => setDelivery(o.id)}/>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#0F1E12' }}>{o.label}</div>
                      <div style={{ fontSize: 11, color: '#6B7A6E', marginTop: 2 }}>{o.desc}</div>
                    </div>
                    <span className="tabular" style={{ fontSize: 13, fontWeight: 700, color: o.fee === 0 ? '#1F6B45' : '#0F1E12' }}>{o.extra}</span>
                  </label>
                ))}
              </div>
            </Section>

            {/* Coupon + points */}
            <Section title="í ì¸ íí">
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#3A4A3F', marginBottom: 8 }}>ì¿ í°</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {coupons.map(c => (
                    <label key={c.id} style={{
                      padding: '10px 12px', border: '1px solid ' + (coupon === c.id ? '#1F4D2C' : '#E5E7E1'),
                      background: coupon === c.id ? '#F0F6F1' : '#fff', opacity: c.valid ? 1 : 0.5,
                      borderRadius: 8, cursor: c.valid ? 'pointer' : 'not-allowed',
                      display: 'flex', alignItems: 'center', gap: 8
                    }}>
                      <input type="radio" disabled={!c.valid} checked={coupon === c.id} onChange={() => setCoupon(c.id)}/>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#0F1E12' }}>{c.label}</div>
                        <div style={{ fontSize: 11, color: '#6B7A6E' }}>{c.cond}</div>
                      </div>
                      <span className="tabular" style={{ fontSize: 13, fontWeight: 800, color: '#D32F2F' }}>-{c.amount.toLocaleString()}ì</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#3A4A3F', marginBottom: 8 }}>í¬ì¸í¸ ì¬ì© (ë³´ì  2,340P)</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <input value={usePoints} onChange={e => setUsePoints(Math.min(2340, Math.max(0, Number(e.target.value)||0)))} placeholder="0" style={{
                    flex: 1, padding: '10px 12px', border: '1px solid #E5E7E1', borderRadius: 8,
                    fontFamily: 'inherit', fontSize: 13, textAlign: 'right'
                  }}/>
                  <button onClick={() => setUsePoints(2340)} className="pf-btn" style={{ padding: '0 14px', border: '1px solid #E5E7E1', background: '#fff', borderRadius: 8, fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>ì ì¡ ì¬ì©</button>
                </div>
              </div>
            </Section>

            {/* Payment */}
            <Section title="ê²°ì  ìë¨">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {[
                  { id: 'card', label: 'ì ì©Â·ì²´í¬ì¹´ë' },
                  { id: 'naver', label: 'NAVER Pay' },
                  { id: 'kakao', label: 'ì¹´ì¹´ì¤íì´' },
                  { id: 'bank', label: 'ê³ì¢ì´ì²´' }
                ].map(p => (
                  <button key={p.id} onClick={() => setPay(p.id)} className="pf-btn" style={{
                    padding: '14px 10px', border: '1.5px solid ' + (pay === p.id ? '#0F1E12' : '#E5E7E1'),
                    background: pay === p.id ? '#0F1E12' : '#fff',
                    color: pay === p.id ? '#A8E063' : '#3A4A3F',
                    borderRadius: 8, cursor: 'pointer',
                    fontFamily: 'inherit', fontSize: 13, fontWeight: 700
                  }}>{p.label}</button>
                ))}
              </div>
            </Section>

            {/* Agreement */}
            <Section title="ì½ê´ ëì">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Check checked={agreed.terms} onChange={v => setAgreed({...agreed, terms: v})} label="êµ¬ë§¤ì¡°ê±´ ë° ê²°ì  ì§íì ëìí©ëë¤ (íì)"/>
                <Check checked={agreed.privacy} onChange={v => setAgreed({...agreed, privacy: v})} label="ê°ì¸ì ë³´ ì 3ì ì ê³µì ëìí©ëë¤ (íì)"/>
                <Check checked={agreed.age} onChange={v => setAgreed({...agreed, age: v})} label="ë³¸ì¸ì ë§ 14ì¸ ì´ììëë¤ (íì)"/>
              </div>
            </Section>
          </div>

          {/* Right summary */}
          <div style={{ background: '#fff', border: '1px solid #E5E7E1', borderRadius: 12, padding: 22, position: 'sticky', top: 90 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F1E12', marginBottom: 16 }}>ê²°ì  ìì½</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 16, borderBottom: '1px solid #F4F5F0' }}>
              <RowK label={`ìí ${items.length}ê±´`} value={`${subtotal.toLocaleString()}ì`}/>
              <RowK label="ë°°ì¡ë¹" value={chosenDelivery.fee === 0 ? 'ë¬´ë£' : `${chosenDelivery.fee.toLocaleString()}ì`} muted={chosenDelivery.fee === 0}/>
              <RowK label="ì¿ í° í ì¸" value={couponDiscount > 0 ? `-${couponDiscount.toLocaleString()}ì` : '0ì'} muted={couponDiscount > 0} red={couponDiscount > 0}/>
              <RowK label="í¬ì¸í¸ ì¬ì©" value={pointsApplied > 0 ? `-${pointsApplied.toLocaleString()}P` : '0P'} muted={pointsApplied > 0} red={pointsApplied > 0}/>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 16, marginBottom: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#0F1E12' }}>ìµì¢ ê²°ì ê¸ì¡</span>
              <span className="tabular" style={{ fontSize: 26, fontWeight: 800, color: '#0F1E12', letterSpacing: '-0.02em' }}>{Math.max(0, total).toLocaleString()}ì</span>
            </div>
            <div style={{ fontSize: 11, color: '#6B7A6E' }}>êµ¬ë§¤ ì <strong className="tabular" style={{ color: '#1F4D2C' }}>{Math.floor(total/100).toLocaleString()}P</strong> ì ë¦½ ìì </div>

            <button disabled={!allChecked || items.length === 0} onClick={() => {
              PF_STORE.pushNotif({ kind: 'delivery', title: 'ì£¼ë¬¸ ì ì ìë£', desc: `${items.length}ê±´ì ìíì´ ì ì ì ìëì´ì.` });
              PF_STORE.pushToast({ kind: 'success', icon: 'check', message: 'ì£¼ë¬¸ì´ ì ìëì´ì', sub: `ì´ ${total.toLocaleString()}ì ê²°ì  ìë£ (ë°ëª¨)` });
              cart.forEach(c => PF_STORE.removeFromCart(c.id));
              onComplete();
            }} className="pf-btn" style={{
              width: '100%', marginTop: 16, padding: '16px', border: 'none',
              background: allChecked ? '#0F1E12' : '#DDE2DC',
              color: allChecked ? '#fff' : '#9AA89D',
              borderRadius: 8, fontFamily: 'inherit', fontSize: 15, fontWeight: 800,
              cursor: allChecked ? 'pointer' : 'not-allowed'
            }}>{Math.max(0, total).toLocaleString()}ì ê²°ì íê¸°</button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 12, padding: '8px 12px', background: '#F0F6F1', borderRadius: 6 }}>
              <Icon.Shield size={14} stroke="#1F4D2C"/>
              <span style={{ fontSize: 11, color: '#1F4D2C', fontWeight: 700 }}>pickfood ìì  ê²°ì  Â· SSL ìí¸í</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, right, children }) => (
  <div style={{ background: '#fff', border: '1px solid #E5E7E1', borderRadius: 12, padding: 22 }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
      <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0F1E12' }}>{title}</h3>
      {right}
    </div>
    {children}
  </div>
);
const linkBtn = { background: 'transparent', border: '1px solid #E5E7E1', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 600, color: '#3A4A3F' };
const Check = ({ checked, onChange, label }) => (
  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#3A4A3F' }}>
    <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} style={{ width: 16, height: 16 }}/>
    {label}
  </label>
);

