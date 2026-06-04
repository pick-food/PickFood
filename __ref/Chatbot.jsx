// Chatbot â premium floating widget with launcher anim, rich responses, outside-close
window.Chatbot = ({ user }) => {
  const [open, setOpen] = React.useState(false);
  const [view, setView] = React.useState('chat'); // 'chat' | 'history'
  const [input, setInput] = React.useState('');
  const [typing, setTyping] = React.useState(false);
  const [messages, setMessages] = React.useState([{ role: 'bot', t: 'greeting' }]);
  const panelRef = React.useRef(null);
  const endRef = React.useRef(null);
  const userName = (user && user.name) || 'ë°í¬ì';

  React.useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target) && !e.target.closest('[data-chatbot-fab]')) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  React.useEffect(() => {
    if (endRef.current) endRef.current.parentElement.scrollTop = endRef.current.parentElement.scrollHeight;
  }, [messages, typing]);

  const send = (txt) => {
    const t = (txt || input).trim();
    if (!t) return;
    setMessages(m => [...m, { role: 'user', text: t }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const intent = classify(t);
      const reply = buildReply(intent, t);
      setTyping(false);
      setMessages(m => [...m, { role: 'bot', t: intent, payload: reply }]);
    }, 650 + Math.random() * 400);
  };

  const suggestions = ['ìì° ìë ëìë½ ì¶ì²', 'ë¹ë¨ì ì¢ì ê°ì', 'ë¨ë°±ì§ 30g+ ìí', 'ì´ë² ì£¼ ê°ì¡± ìë¨', 'ìë¦¬ì ì¸ì¦ ìí'];

  return (
    <>
      {/* Launcher */}
      <button
        data-chatbot-fab
        onClick={() => setOpen(o => !o)}
        className="pf-btn"
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 70,
          width: 60, height: 60, borderRadius: 999, border: 'none', cursor: 'pointer',
          background: open ? '#0F1E12' : '#1F4D2C',
          boxShadow: '0 16px 40px rgba(15,30,18,0.28), 0 0 0 4px rgba(168,224,99,0.28)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 220ms cubic-bezier(0.2,0,0,1), background 200ms',
          transform: open ? 'scale(0.92) rotate(8deg)' : 'scale(1)'
        }}>
        {open ? <Icon.Close size={22} stroke="#A8E063"/> : <Icon.Chat size={26} stroke="#fff"/>}
        {!open && (
          <span style={{ position: 'absolute', top: 6, right: 6, width: 10, height: 10, background: '#A8E063', borderRadius: 999, border: '2px solid #1F4D2C', animation: 'pfPulse 1.6s infinite' }}/>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div ref={panelRef} className="pf-scale-in" style={{
          position: 'fixed', bottom: 96, right: 24, zIndex: 70,
          width: 400, height: 620, background: '#fff',
          borderRadius: 20, boxShadow: '0 24px 64px rgba(15,30,18,0.22)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          border: '1px solid #E5E7E1', transformOrigin: 'bottom right'
        }}>
          {/* Header */}
          <div style={{ padding: '14px 18px', background: 'linear-gradient(135deg, #0F1E12 0%, #1F4D2C 100%)', color: '#fff', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 999, background: 'rgba(168,224,99,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon.Sparkle size={20} stroke="#A8E063"/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 14, letterSpacing: '-0.01em' }}>pickfood ëì°ë¯¸</div>
              <div style={{ fontSize: 11, color: '#A8E063', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 6, height: 6, background: '#A8E063', borderRadius: 999, animation: 'pfPulse 1.4s infinite' }}/>
                {userName}ë íë¡í ì¸ì ì¤
              </div>
            </div>
            <button onClick={() => { setMessages([{ role: 'bot', t: 'greeting' }]); }} className="pf-btn" style={iconHeadBtn} title="ëí ì´ê¸°í">
              <Icon.RefreshCw size={16} stroke="#DCE9DF"/>
            </button>
            <button onClick={() => setOpen(false)} className="pf-btn" style={iconHeadBtn}>
              <Icon.Close size={18} stroke="#DCE9DF"/>
            </button>
          </div>

          {/* Profile chip */}
          <div style={{ padding: '10px 18px', background: '#FAFAF7', borderBottom: '1px solid #F0F2EC', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 10, color: '#6B7A6E', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>ì ì© íë¡í</span>
            <Pill bg="#FEF2F2" color="#B71C1C"><Icon.Alert size={9} stroke="#B71C1C"/> ìì°</Pill>
            <Pill bg="#FEF2F2" color="#B71C1C"><Icon.Alert size={9} stroke="#B71C1C"/> ê²</Pill>
            <Pill bg="#FFF8EC" color="#B97308">ë¹ë¨</Pill>
          </div>

          {/* Messages */}
          <div className="pf-stagger" style={{ flex: 1, padding: 16, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, background: '#FAFAF7' }}>
            {messages.map((m, i) => <MsgBubble key={i} m={m}/>)}
            {typing && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                <BotAv/>
                <div style={{ background: '#fff', border: '1px solid #E5E7E1', borderRadius: '14px 14px 14px 4px', padding: '12px 14px', display: 'flex', gap: 4 }}>
                  {[0,1,2].map(i => <span key={i} style={{ width: 6, height: 6, background: '#9AA89D', borderRadius: 999, animation: `pfBlink 1.4s ${i * 0.2}s infinite` }}/>)}
                </div>
              </div>
            )}
            <div ref={endRef}/>
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && !typing && (
            <div style={{ padding: '0 16px 8px' }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: '#6B7A6E', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>ì¶ì² ì§ë¬¸</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {suggestions.map(q => (
                  <button key={q} onClick={() => send(q)} className="pf-btn" style={{
                    padding: '6px 11px', fontFamily: 'inherit', fontSize: 12, fontWeight: 600,
                    border: '1px solid #DCE9DF', background: '#fff', color: '#1F4D2C',
                    borderRadius: 999, cursor: 'pointer'
                  }}>{q}</button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form onSubmit={e => { e.preventDefault(); send(); }} style={{
            padding: 12, borderTop: '1px solid #E5E7E1', background: '#fff',
            display: 'flex', gap: 8, alignItems: 'center'
          }}>
            <button type="button" className="pf-btn" style={iconBtnSquare} title="ì¬ì§ì¼ë¡ ë¬»ê¸°">
              <Icon.Paperclip size={16} stroke="#6B7A6E"/>
            </button>
            <input value={input} onChange={e => setInput(e.target.value)}
              placeholder={`${userName}ë, ë¬´ìì ëìëë¦´ê¹ì?`}
              style={{
                flex: 1, fontFamily: 'inherit', fontSize: 14,
                padding: '10px 14px', borderRadius: 999,
                border: '1px solid #E5E7E1', background: '#F4F5F1', outline: 'none'
              }}/>
            <button type="submit" className="pf-btn" style={{
              width: 38, height: 38, borderRadius: 999, border: 'none',
              background: input.trim() ? '#1F4D2C' : '#DDE2DC',
              color: '#fff', cursor: input.trim() ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Icon.ArrowUp size={16} stroke={input.trim() ? '#fff' : '#9AA89D'}/>
            </button>
          </form>
          <div style={{ fontSize: 10, color: '#9AA89D', textAlign: 'center', padding: '0 12px 10px' }}>
            ìë£ ì§ë¨ì ëì²´íì§ ììµëë¤. ìë ë¥´ê¸°Â·ì§íì ìë£ì§ê³¼ ìë´íì¸ì.
          </div>
        </div>
      )}
    </>
  );
};

const iconHeadBtn = { width: 32, height: 32, borderRadius: 999, background: 'rgba(255,255,255,0.06)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const iconBtnSquare = { width: 36, height: 36, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };

const BotAv = () => (
  <div style={{ width: 28, height: 28, borderRadius: 999, background: 'linear-gradient(135deg, #0F1E12, #1F4D2C)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
    <Icon.Sparkle size={14} stroke="#A8E063"/>
  </div>
);
const Pill = ({ children, color = '#1F4D2C', bg = '#EAF7D4' }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 11, fontWeight: 700, color, background: bg, padding: '3px 7px', borderRadius: 999 }}>{children}</span>
);

// --- intent classifier ---
function classify(t) {
  const x = t.toLowerCase();
  if (x.includes('ìì°') || x.includes('ìë ë¥´') || x.includes('ëì½©') || x.includes('ê°ê°')) return 'allergyScan';
  if (x.includes('ë¹ë¨') || x.includes('ì ë¹') || x.includes('íë¹') || x.includes('ë¹ë¥')) return 'diabetes';
  if (x.includes('ë¨ë°±') || x.includes('ì´ë') || x.includes('30g')) return 'protein';
  if (x.includes('ìë¨') || x.includes('ì£¼ê°') || x.includes('ê°ì¡±')) return 'mealPlan';
  if (x.includes('ìë¦¬ì') || x.includes('ê¸ë£¨í')) return 'glutenfree';
  if (x.includes('ë ìí¼') || x.includes('ìë¦¬')) return 'recipe';
  return 'general';
}

function buildReply(intent, text) {
  const d = window.PF_DATA;
  const safe = d.products.filter(p => !p.allergens.includes('ìì°') && !p.allergens.includes('ê²'));
  if (intent === 'allergyScan') {
    return {
      text: `ë°í¬ìë íë¡í(ìì°Â·ê²)ì ë¹¼ê³  ìì í ìí **${safe.length}ê°** ì¤ ì¸ê¸° ì¶ì²ì´ìì. ëª¨ë ìë ë¥´ê¸° ê²ì¦ ìë£.`,
      products: [d.products[0], d.products[4], d.products[2]],
      followUps: ['ê³ ë¨ë°± ìì£¼ë¡', 'ì ë¹ ìì£¼ë¡', 'ìì´ì©ì¼ë¡']
    };
  }
  if (intent === 'diabetes') {
    const items = safe.filter(p => p.nutrition.sugar <= 5).slice(0, 3);
    return {
      text: 'ë¹ë¨ ì¼ì´ ë¼ì¸ìì ë¹ë¥ 5g ì´í + ì GI ìì£¼ë¡ ê³¨ëì´ì.',
      products: items.length ? items : safe.slice(0, 3),
      stats: [{ k: 'íê·  ë¹ë¥', v: '2.1g' }, { k: 'íê·  ëí¸ë¥¨', v: '180mg' }, { k: 'íê·  GI', v: '52' }],
      followUps: ['ë¹ë¨ ìë¨ë', 'ì ë¹ ë¹µ ì¶ì²', 'ê°ì ìë ¤ì¤']
    };
  }
  if (intent === 'protein') {
    const items = [...safe].sort((a,b)=>b.nutrition.protein-a.nutrition.protein).slice(0, 3);
    return {
      text: 'ë¨ë°±ì§ í¨ëì´ ëì ìí TOP 3 ìëë¤.',
      products: items,
      followUps: ['ë¹ê±´ ë¨ë°±ì§ë§', 'í ë¼ 30g ìë¨', 'ì´ë í ìë¨']
    };
  }
  if (intent === 'mealPlan') {
    return {
      text: 'ì~ê¸ 5ì¼ì¹ ê°ì¡± ìë¨ì ìì  íí°ë¡ ì§ë´¤ì´ì. íë£¨ íê·  1,750kcal Â· ë¹ë¥ 22g.',
      plan: [
        { d: 'ì', b: 'ì ê¸°ë ëë¶ + í ë§í ', l: 'ë­ê°ì´ì´ ìë¬ë', dn: 'ì°ì´ ì¤íì´í¬' },
        { d: 'í', b: 'ìëª¬ëë¸ë¦¬ì¦ + ê²¬ê³¼', l: 'íë¯¸ ì¡ê³¡ë°¥', dn: 'ëë¶ ì¤í¬ë¨ë¸' },
        { d: 'ì', b: 'ê·¸ë¦­ìê±°í¸ + ê³¼ì¼', l: 'ë­ê°ì´ì´ ëìë½', dn: 'ì°ì´ êµ¬ì´' },
        { d: 'ëª©', b: 'ìê¸ì¹ í ì¤í¸', l: 'íë¯¸ë°¥ + ëë¶', dn: 'ê°ë¹í (ì ì¼)' },
        { d: 'ê¸', b: 'ë°ëë + ë¨ë°±ì§', l: 'ì°ì´ ìëìì¹', dn: 'ë­ ê°ì´ì´ ë³¶ì' }
      ],
      followUps: ['ì¥ë³´ê¸° ë¦¬ì¤í¸ ë§ë¤ì´ì¤', 'ì£¼ë§ë í¬í¨í´ì¤', 'ìì´ì© ìë¨']
    };
  }
  if (intent === 'glutenfree') {
    return {
      text: 'ìë¦¬ì ì¸ì¦ ê¸ë£¨ííë¦¬ ë¼ì¸ì ì¤ ë°í¬ìë íë¡íì ë§ë ìíì´ìì.',
      products: [d.products[0], d.products[3], d.products[11]],
      followUps: ['ë¹µÂ·ê³¼ìë§', 'ì£¼ì ì¹´íê³ ë¦¬', 'ê°ì ì¶ì²']
    };
  }
  if (intent === 'recipe') {
    return {
      text: 'ë°í¬ìë íë¡íì ìì í **5ë¶ ëë¶ ì¤í¬ë¨ë¸** ë ìí¼ìì. 1ì¸ë¶ ë¨ë°±ì§ 22g Â· ë¹ë¥ 3g.',
      recipe: {
        title: '5ë¶ ëë¶ ì¤í¬ë¨ë¸',
        time: '5ë¶', kcal: 220, servings: 1,
        ingredients: ['ì ê¸°ë ëë¶ Â½í©', 'ìê¸ì¹ í ì¤', 'ê³ë 1ì', 'ì¬ë¦¬ë¸ì  1í°ì ', 'ê°í©Â·íì¶'],
        steps: ['ëë¶ë¥¼ ì¼ê¹¨ ë¬¼ê¸° ì ê±°', 'ìê¸ì¹ 30ì´ ë³¶ê¸°', 'ëë¶+ê° ë£ê³  3ë¶ ë³¶ê¸°', 'ê³ë íì´ 1ë¶ ë§ë¬´ë¦¬']
      },
      followUps: ['ê³ë ë¹¼ê³  ë§ëë ë²', 'ë ë¹ì·í ë ìí¼', 'ìë¨ì ì¶ê°']
    };
  }
  return {
    text: 'ë§ìíì  ë´ì©ì ë°íì¼ë¡ ìì í ìíì ì¶ì²í´ ëë¦´ê²ì. ìë ë¥´ê¸°Â·ì§ë³Â·ìì ëª©í ì¤ ì´ë¤ ë¶ë¶ì´ ê°ì¥ ì¤ìíê°ì?',
    followUps: ['ìì° ìë ìí', 'ì ë¹ ìí', 'ê³ ë¨ë°± ìí', 'ìì´ ê°ì']
  };
}

// --- message bubble ---
const MsgBubble = ({ m }) => {
  if (m.role === 'user') {
    return (
      <div className="pf-slide-up" style={{ alignSelf: 'flex-end', background: '#0F1E12', color: '#fff', borderRadius: '14px 14px 4px 14px', padding: '10px 14px', maxWidth: '78%', fontSize: 13, lineHeight: 1.55 }}>
        {m.text}
      </div>
    );
  }
  if (m.t === 'greeting') {
    return (
      <div className="pf-slide-up" style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
        <BotAv/>
        <div style={{ maxWidth: '85%' }}>
          <div style={{ background: '#fff', border: '1px solid #E5E7E1', borderRadius: '14px 14px 14px 4px', padding: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0F1E12', marginBottom: 6 }}>ìëíì¸ì, ë°í¬ìë ð</div>
            <div style={{ fontSize: 12, color: '#3A4A3F', lineHeight: 1.55 }}>
              <strong>ìì°Â·ê² ìë ë¥´ê¸°</strong>ì <strong>ë¹ë¨</strong> íë¡íì ê¸°ìµíê³  ìì´ì. ë¬´ìì ê³¨ë¼ëë¦´ê¹ì?
            </div>
          </div>
        </div>
      </div>
    );
  }
  // bot reply
  const p = m.payload;
  return (
    <div className="pf-slide-up" style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
      <BotAv/>
      <div style={{ flex: 1, maxWidth: '85%', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ background: '#fff', border: '1px solid #E5E7E1', borderRadius: '14px 14px 14px 4px', padding: 14, fontSize: 13, lineHeight: 1.6, color: '#0F1E12' }}>
          {renderMd(p.text)}
        </div>

        {p.stats && (
          <div style={{ background: '#F0F6F1', borderRadius: 10, padding: 12, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {p.stats.map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: 9, fontWeight: 700, color: '#6B7A6E', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{s.k}</div>
                <div className="tabular" style={{ fontSize: 14, fontWeight: 800, color: '#1F4D2C', marginTop: 2 }}>{s.v}</div>
              </div>
            ))}
          </div>
        )}

        {p.products && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {p.products.map(prod => (
              <button key={prod.id} className="pf-btn pf-hover-lift" onClick={() => { PF_STORE.pushToast({ kind: 'info', icon: 'check', message: 'ìí íì´ì§ë¡ ì´ë', sub: prod.name }); }} style={{
                background: '#fff', border: '1px solid #E5E7E1', borderRadius: 10,
                padding: 10, display: 'flex', gap: 10, alignItems: 'center',
                fontFamily: 'inherit', textAlign: 'left', cursor: 'pointer'
              }}>
                <img src={prod.img} alt="" style={{ width: 48, height: 48, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10, color: '#6B7A6E' }}>{prod.brand}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#0F1E12', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{prod.name}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 2 }}>
                    <span className="tabular" style={{ fontSize: 12, fontWeight: 800, color: '#0F1E12' }}>{prod.price.toLocaleString()}ì</span>
                    <span style={{ fontSize: 10, color: '#1F6B45', fontWeight: 700 }}>Â· â {prod.rating}</span>
                  </div>
                </div>
                <Pill>ìì </Pill>
              </button>
            ))}
            <button onClick={() => PF_STORE.pushToast({ kind: 'cart', icon: 'cart', message: 'ëª¨ë ì¥ë°êµ¬ëì ë´ìì´ì', sub: `${p.products.length}ê° ìí`, action: 'ë³´ë¬ê°ê¸°' })} className="pf-btn" style={{ background: '#0F1E12', color: '#A8E063', border: 'none', borderRadius: 8, padding: '8px', fontFamily: 'inherit', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
              <Icon.Cart size={12} stroke="#A8E063"/> í ë²ì ì¥ë°êµ¬ëì ë´ê¸°
            </button>
          </div>
        )}

        {p.plan && (
          <div style={{ background: '#fff', border: '1px solid #E5E7E1', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ background: '#0F1E12', color: '#A8E063', padding: '8px 12px', fontSize: 11, fontWeight: 800, letterSpacing: '0.04em' }}>5ì¼ ìë¨í</div>
            <div>
              {p.plan.map((row, i) => (
                <div key={i} style={{ padding: '8px 12px', borderTop: i ? '1px solid #F4F5F0' : 'none', display: 'grid', gridTemplateColumns: '28px 1fr 1fr 1fr', gap: 6, fontSize: 11 }}>
                  <span style={{ fontWeight: 800, color: '#0F1E12' }}>{row.d}</span>
                  <span style={{ color: '#3A4A3F' }}>{row.b}</span>
                  <span style={{ color: '#3A4A3F' }}>{row.l}</span>
                  <span style={{ color: '#3A4A3F' }}>{row.dn}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {p.recipe && (
          <div style={{ background: '#fff', border: '1px solid #E5E7E1', borderRadius: 10, padding: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Icon.Star size={16} stroke="#1F4D2C" filled/>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#0F1E12' }}>{p.recipe.title}</span>
              <span style={{ fontSize: 10, color: '#6B7A6E' }}>Â· {p.recipe.time} Â· {p.recipe.kcal}kcal</span>
            </div>
            <div style={{ fontSize: 11, color: '#3A4A3F', marginBottom: 6, fontWeight: 700 }}>ì¬ë£</div>
            <div style={{ fontSize: 11, color: '#6B7A6E', lineHeight: 1.6 }}>{p.recipe.ingredients.join(' Â· ')}</div>
            <div style={{ fontSize: 11, color: '#3A4A3F', marginTop: 8, marginBottom: 4, fontWeight: 700 }}>ì¡°ë¦¬ë²</div>
            <ol style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: '#3A4A3F', lineHeight: 1.6 }}>
              {p.recipe.steps.map((s, i) => <li key={i}>{s}</li>)}
            </ol>
          </div>
        )}

        {p.followUps && (
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {p.followUps.map(q => (
              <button key={q} onClick={(e) => { e.stopPropagation(); /* trigger send via custom event */ const evt = new CustomEvent('pf-chat-send', { detail: q }); document.dispatchEvent(evt); }} className="pf-btn" style={{
                padding: '5px 10px', fontFamily: 'inherit', fontSize: 11, fontWeight: 600,
                border: '1px solid #DCE9DF', background: '#fff', color: '#1F4D2C',
                borderRadius: 999, cursor: 'pointer'
              }}>{q}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

function renderMd(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => p.startsWith('**') && p.endsWith('**')
    ? <strong key={i} style={{ color: '#0F1E12' }}>{p.slice(2, -2)}</strong>
    : <React.Fragment key={i}>{p}</React.Fragment>);
}

