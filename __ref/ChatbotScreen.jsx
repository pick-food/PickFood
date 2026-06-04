// ChatbotScreen â full-page assistant (flex layout, no overflow scroll)
window.ChatbotScreen = ({ user, onProduct }) => {
  const d = window.PF_DATA;
  const [input, setInput] = React.useState('');
  const [typing, setTyping] = React.useState(false);
  const [convId, setConvId] = React.useState('c1');
  const [conversations, setConversations] = React.useState([
    { id: 'c1', title: 'ì¤ë ìë¡ì´ ëí', last: 'ìëíì¸ì...', when: 'ë°©ê¸', messages: [{ role: 'bot', t: 'greeting' }] },
    { id: 'c2', title: 'ì£¼ê° ìë¨ ì¶ì²', last: 'ì~ê¸ ìë¨íë¥¼ ì ë¦¬í´ ëë ¸ì´ì', when: 'ì´ì ', messages: [{ role: 'bot', t: 'greeting' }] },
    { id: 'c3', title: 'ì ë¹ ê°ì ë¹êµ', last: 'íë¼ë´ ì£¼ì¤ vs ê·¸ë¦­ìê±°í¸...', when: '3ì¼ ì ', messages: [{ role: 'bot', t: 'greeting' }] }
  ]);
  const conv = conversations.find(c => c.id === convId);
  const messages = conv.messages;
  const setMessages = (updater) => {
    setConversations(cs => cs.map(c => c.id === convId
      ? { ...c, messages: typeof updater === 'function' ? updater(c.messages) : updater }
      : c));
  };
  const endRef = React.useRef(null);

  React.useEffect(() => {
    if (endRef.current) endRef.current.parentElement.scrollTop = endRef.current.parentElement.scrollHeight;
  }, [messages, typing]);

  const send = (text) => {
    const t = (text || input).trim();
    if (!t) return;
    setMessages(m => [...m, { role: 'user', text: t }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const intent = classifyScreen(t);
      const reply = buildScreenReply(intent, t, d);
      setTyping(false);
      setMessages(m => [...m, { role: 'bot', t: intent, payload: reply }]);
    }, 700);
  };

  // Listen for in-bubble follow-up taps
  React.useEffect(() => {
    const handler = e => send(e.detail);
    document.addEventListener('pf-chat-screen-send', handler);
    return () => document.removeEventListener('pf-chat-screen-send', handler);
  }, [input, convId]);

  const suggestedQs = [
    'ìì° ìë ëìë½ ì¶ì²í´ì¤',
    'ë¹ë¨ì ì¢ì ê°ì ìë ¤ì¤',
    'ë¨ë°±ì§ 30g ì´ì ìí',
    'ì´ë² ì£¼ ê°ì¡± ìë¨ ì§ì¤',
    'ìë¦¬ì ì¸ì¦ ìí',
    '5ë¶ ìì ë§ëë ìë¦¬'
  ];

  const newConv = () => {
    const id = 'c' + Date.now();
    setConversations(cs => [{ id, title: 'ìë¡ì´ ëí', last: '', when: 'ë°©ê¸', messages: [{ role: 'bot', t: 'greeting' }] }, ...cs]);
    setConvId(id);
  };

  return (
    <div style={{
      height: 'calc(100vh - 134px)', // header utility (33) + main (74) + safety strip (27)
      display: 'flex', background: '#FFFFFF'
    }} data-screen-label="AI ìë´">

      {/* Sidebar â conversations */}
      <aside style={{ width: 280, borderRight: '1px solid #E5E7E1', background: '#fff', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '18px 18px 12px' }}>
          <button onClick={newConv} className="pf-btn" style={{
            width: '100%', padding: '11px 14px', background: '#0F1E12', color: '#fff',
            border: 'none', borderRadius: 10, fontFamily: 'inherit', fontSize: 13, fontWeight: 700,
            cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6
          }}>
            <Icon.Plus size={14} stroke="#A8E063"/> ì ëí
          </button>
        </div>
        <div style={{ padding: '0 8px 8px', overflowY: 'auto', flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#9AA89D', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '8px 10px' }}>ìµê·¼ ëí</div>
          {conversations.map(c => {
            const active = c.id === convId;
            return (
              <button key={c.id} onClick={() => setConvId(c.id)} className="pf-btn" style={{
                width: '100%', padding: '10px 12px', textAlign: 'left',
                background: active ? '#F0F6F1' : 'transparent', border: 'none', borderRadius: 8,
                cursor: 'pointer', fontFamily: 'inherit', marginBottom: 2,
                display: 'flex', flexDirection: 'column', gap: 2
              }}>
                <div style={{ fontSize: 13, fontWeight: active ? 700 : 600, color: active ? '#0F1E12' : '#3A4A3F', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11, color: '#9AA89D', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, marginRight: 6 }}>{c.last || 'ëí ìì'}</span>
                  <span style={{ fontSize: 10, color: '#9AA89D', flexShrink: 0 }}>{c.when}</span>
                </div>
              </button>
            );
          })}
        </div>
        <div style={{ padding: 14, borderTop: '1px solid #F0F2EC', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon.Shield size={16} stroke="#1F4D2C"/>
          <div style={{ fontSize: 11, color: '#3A4A3F', lineHeight: 1.4 }}>
            ëª¨ë  ëíë ë°í¬ìë íë¡í ê¸°ì¤ì¼ë¡ ìëµë©ëë¤.
          </div>
        </div>
      </aside>

      {/* Main column */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Top context bar */}
        <div style={{ padding: '14px 24px', background: '#fff', borderBottom: '1px solid #E5E7E1', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <div style={{ width: 38, height: 38, borderRadius: 999, background: 'linear-gradient(135deg, #0F1E12, #1F4D2C)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon.Sparkle size={18} stroke="#A8E063"/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#0F1E12' }}>pickfood ëì°ë¯¸</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#1F6B45' }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: '#2E8B57', animation: 'pfPulse 1.4s infinite' }}/>
              ì¨ë¼ì¸ Â· ë°í¬ìë íë¡í ì¸ì ì¤
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 10, color: '#6B7A6E', fontWeight: 700 }}>íë¡í</span>
            <ProfPill bg="#FEF2F2" color="#B71C1C">ìì° ìë ë¥´ê¸°</ProfPill>
            <ProfPill bg="#FEF2F2" color="#B71C1C">ê² ìë ë¥´ê¸°</ProfPill>
            <ProfPill bg="#FFF8EC" color="#B97308">ë¹ë¨</ProfPill>
          </div>
          <button className="pf-btn" style={{ background: '#fff', border: '1px solid #E5E7E1', borderRadius: 6, padding: '6px 12px', fontFamily: 'inherit', fontSize: 12, color: '#3A4A3F', cursor: 'pointer' }}>ëí ë´ë³´ë´ê¸°</button>
        </div>

        {/* Messages scroll area */}
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '24px 24px 16px' }}>
          <div className="pf-stagger" style={{ maxWidth: 820, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {messages.map((m, i) => <BubbleS key={i} msg={m} onProduct={onProduct}/>)}
            {typing && (
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                <BotAvS/>
                <div style={{ background: '#fff', border: '1px solid #E5E7E1', borderRadius: '14px 14px 14px 4px', padding: '12px 14px', display: 'flex', gap: 4 }}>
                  {[0,1,2].map(i => <span key={i} style={{ width: 6, height: 6, background: '#9AA89D', borderRadius: 999, animation: `pfBlink 1.4s ${i * 0.2}s infinite` }}/>)}
                </div>
              </div>
            )}
            <div ref={endRef}/>
          </div>
        </div>

        {/* Composer */}
        <div style={{ padding: '12px 24px 16px', borderTop: '1px solid #E5E7E1', background: '#fff', flexShrink: 0 }}>
          <div style={{ maxWidth: 820, margin: '0 auto' }}>
            {messages.length <= 1 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                {suggestedQs.map(q => (
                  <button key={q} onClick={() => send(q)} className="pf-btn" style={{
                    padding: '7px 12px', fontFamily: 'inherit', fontSize: 12, fontWeight: 600,
                    border: '1px solid #DCE9DF', background: '#fff', color: '#1F4D2C',
                    borderRadius: 999, cursor: 'pointer'
                  }}>{q}</button>
                ))}
              </div>
            )}
            <form onSubmit={e => { e.preventDefault(); send(); }} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: 8,
              background: '#fff', border: '2px solid #C9CFC4', borderRadius: 14
            }}>
              <button type="button" className="pf-btn" style={iconBtnS} title="ì¬ì§ ì²¨ë¶">
                <Icon.Paperclip size={18} stroke="#6B7A6E"/>
              </button>
              <input value={input} onChange={e => setInput(e.target.value)}
                placeholder="ë°í¬ìë, ë¬´ìì ëìëë¦´ê¹ì?"
                style={{ flex: 1, fontFamily: 'inherit', fontSize: 14, border: 'none', outline: 'none', padding: '8px 4px', background: 'transparent' }}/>
              <button type="submit" className="pf-btn" style={{
                ...iconBtnS,
                background: input.trim() ? '#0F1E12' : '#E5E7E1',
                width: 38, height: 38, borderRadius: 999
              }}>
                <Icon.ArrowUp size={16} stroke={input.trim() ? '#A8E063' : '#9AA89D'}/>
              </button>
            </form>
            <div style={{ fontSize: 10, color: '#9AA89D', textAlign: 'center', marginTop: 6 }}>
              ìë£ ì§ë¨ì ëì²´íì§ ììµëë¤. ìë ë¥´ê¸°Â·ì§íì ìë£ì§ê³¼ ìë´íì¸ì.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const iconBtnS = { width: 36, height: 36, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 999, flexShrink: 0 };
const ProfPill = ({ children, bg, color }) => (
  <span style={{ padding: '3px 8px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: bg, color }}>{children}</span>
);
const BotAvS = () => (
  <div style={{ width: 32, height: 32, borderRadius: 999, background: 'linear-gradient(135deg, #0F1E12, #1F4D2C)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
    <Icon.Sparkle size={16} stroke="#A8E063"/>
  </div>
);

function classifyScreen(t) {
  const x = t.toLowerCase();
  if (x.includes('ìì°') || x.includes('ìë ë¥´') || x.includes('ëì½©') || x.includes('ê°ê°')) return 'allergyScan';
  if (x.includes('ë¹ë¨') || x.includes('ì ë¹') || x.includes('ë¹ë¥')) return 'diabetes';
  if (x.includes('ë¨ë°±') || x.includes('30g') || x.includes('ì´ë')) return 'protein';
  if (x.includes('ìë¨') || x.includes('ì£¼ê°') || x.includes('ê°ì¡±')) return 'mealPlan';
  if (x.includes('ìë¦¬ì') || x.includes('ê¸ë£¨í')) return 'glutenfree';
  if (x.includes('ë ìí¼') || x.includes('5ë¶') || x.includes('ìë¦¬')) return 'recipe';
  return 'general';
}

function buildScreenReply(intent, text, d) {
  const safe = d.products.filter(p => !p.allergens.includes('ìì°') && !p.allergens.includes('ê²'));
  if (intent === 'allergyScan') return {
    text: `ë°í¬ìë íë¡í(ìì°Â·ê²)ì ë¹¼ê³  ìì í ìí **${safe.length}ê°** ì¤ ì¸ê¸° ì¶ì²ì ê³¨ë¼ë´¤ì´ì. ëª¨ë ìì½ì² ë¼ë²¨ ë¶ì ìë£.`,
    products: [safe[0], safe[2], safe[4]],
    stats: [{ k: 'ê²ì¬ ìí', v: d.products.length }, { k: 'ìì  ìí', v: safe.length }, { k: 'ì£¼ì ìí', v: d.products.length - safe.length }],
    followUps: ['ê³ ë¨ë°± ìì£¼ë¡', 'ê°ì ë¼ì¸ì', 'ìì´ì©ì¼ë¡']
  };
  if (intent === 'diabetes') return {
    text: 'ë¹ë¨ ê´ë¦¬ ë¼ì¸ì ì¤ ë¹ë¥ 5g ì´í + ì GI ìì£¼ë¡ ê³¨ëì´ì.',
    products: safe.filter(p => p.nutrition.sugar <= 5).slice(0, 3),
    targets: [
      { k: 'ë¹ë¥', v: 'â¤ 25g/ì¼', c: '#D32F2F' },
      { k: 'íìíë¬¼', v: '130â230g/ì¼', c: '#E89B26' },
      { k: 'ìì´ì¬ì ', v: 'â¥ 25g/ì¼', c: '#2E8B57' },
      { k: 'GI ì§ì', v: 'ì GI (â¤55)', c: '#2E8B57' }
    ],
    followUps: ['ë¹ë¨ ìë¨í', 'ì ë¹ ë¹µ ì¶ì²', 'í ë¼ ê°ì´ë']
  };
  if (intent === 'protein') return {
    text: 'ë¨ë°±ì§ í¨ëì´ ëì ìí TOP 3 ìëë¤. ì´ë í íë³µì©ì¼ë¡ í ë¼ 30g+ ê°ë¥.',
    products: [...safe].sort((a,b)=>b.nutrition.protein-a.nutrition.protein).slice(0, 3),
    followUps: ['ë¹ê±´ ë¨ë°±ì§ë§', '30g ìë¨ ì§ì¤', 'í ë¼ ê°ì´ë']
  };
  if (intent === 'mealPlan') return {
    text: 'ì~ê¸ 5ì¼ì¹ ê°ì¡± ìë¨ì ìì  íí°ë¡ ì§ë´¤ì´ì. íë£¨ íê·  1,750kcal Â· ë¹ë¥ 22g.',
    plan: [
      { d: 'ì', b: 'ì ê¸°ë ëë¶ + í ë§í ', l: 'ë­ê°ì´ì´ ìë¬ë', dn: 'ì°ì´ ì¤íì´í¬', kcal: 1620 },
      { d: 'í', b: 'ìëª¬ëë¸ë¦¬ì¦ + ê²¬ê³¼', l: 'íë¯¸ ì¡ê³¡ë°¥', dn: 'ëë¶ ì¤í¬ë¨ë¸', kcal: 1740 },
      { d: 'ì', b: 'ê·¸ë¦­ìê±°í¸ + ê³¼ì¼', l: 'ë­ê°ì´ì´ ëìë½', dn: 'ì°ì´ êµ¬ì´', kcal: 1820 },
      { d: 'ëª©', b: 'ìê¸ì¹ í ì¤í¸', l: 'íë¯¸ë°¥ + ëë¶', dn: 'ê°ë¹í (ì ì¼)', kcal: 1700 },
      { d: 'ê¸', b: 'ë°ëë + ë¨ë°±ì§', l: 'ì°ì´ ìëìì¹', dn: 'ë­ ê°ì´ì´ ë³¶ì', kcal: 1850 }
    ],
    followUps: ['ì¥ë³´ê¸° ë¦¬ì¤í¸', 'ì£¼ë§ í¬í¨ 7ì¼', 'ìì´ì© ìë¨']
  };
  if (intent === 'glutenfree') return {
    text: 'ìë¦¬ì ì¸ì¦ ê¸ë£¨ííë¦¬ ë¼ì¸ì ì¤ ë°í¬ìë íë¡íì ë§ë ìíì´ìì.',
    products: [safe[0], safe[3], safe[4]],
    followUps: ['ë¹µÂ·ê³¼ìë§', 'ì£¼ì ì¹´íê³ ë¦¬', 'ê°ì ì¶ì²']
  };
  if (intent === 'recipe') return {
    text: 'ë°í¬ìë íë¡íì ìì í **5ë¶ ëë¶ ì¤í¬ë¨ë¸** ë ìí¼ìì. 1ì¸ë¶ ë¨ë°±ì§ 22g Â· ë¹ë¥ 3g.',
    recipe: {
      title: '5ë¶ ëë¶ ì¤í¬ë¨ë¸', time: '5ë¶', kcal: 220, servings: 1,
      ingredients: ['ì ê¸°ë ëë¶ Â½í©', 'ìê¸ì¹ í ì¤', 'ê³ë 1ì', 'ì¬ë¦¬ë¸ì  1í°ì ', 'ê°í©Â·íì¶'],
      steps: ['ëë¶ë¥¼ ì¼ê¹¨ ë¬¼ê¸° ì ê±°', 'ìê¸ì¹ 30ì´ ë³¶ê¸°', 'ëë¶+ê° ë£ê³  3ë¶ ë³¶ê¸°', 'ê³ë íì´ 1ë¶ ë§ë¬´ë¦¬']
    },
    followUps: ['ê³ë ë¹¼ê³ ', 'ìë¨ì ì¶ê°', 'ë¹ì·í ë ìí¼ ë']
  };
  return {
    text: 'ë§ìíì  ë´ì©ì ë°íì¼ë¡ ì¶ì²í´ ëë¦´ê²ì. ìë ë¥´ê¸°Â·ì§ë³Â·ìì ëª©í ì¤ ì´ë¤ ë¶ë¶ì´ ê°ì¥ ì¤ìíê°ì?',
    followUps: ['ìì° ìë ìí', 'ì ë¹ ìí', 'ê³ ë¨ë°± ìí', 'ìì´ ê°ì']
  };
}

const BubbleS = ({ msg, onProduct }) => {
  if (msg.role === 'user') {
    return (
      <div className="pf-slide-up" style={{ alignSelf: 'flex-end', maxWidth: '70%' }}>
        <div style={{ background: '#0F1E12', color: '#fff', borderRadius: '16px 16px 4px 16px', padding: '12px 16px', fontSize: 14, lineHeight: 1.5 }}>
          {msg.text}
        </div>
      </div>
    );
  }
  if (msg.t === 'greeting') {
    return (
      <div className="pf-slide-up" style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <BotAvS/>
        <div style={{ maxWidth: '80%' }}>
          <div style={{ background: '#fff', border: '1px solid #E5E7E1', borderRadius: '16px 16px 16px 4px', padding: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0F1E12', marginBottom: 6 }}>ìëíì¸ì, ë°í¬ìë ð</div>
            <div style={{ fontSize: 13, color: '#3A4A3F', lineHeight: 1.6 }}>
              <strong>ìì°Â·ê² ìë ë¥´ê¸°</strong>ì <strong>ë¹ë¨</strong> íë¡íì ê¸°ìµíê³  ìì´ì.<br/>
              ìë ì¶ì² ì§ë¬¸ì ì ííê±°ë ìì ë¡­ê² ë¬¼ì´ë³´ì¸ì.
            </div>
          </div>
        </div>
      </div>
    );
  }
  const p = msg.payload;
  return (
    <div className="pf-slide-up" style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <BotAvS/>
      <div style={{ flex: 1, maxWidth: '80%', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ background: '#fff', border: '1px solid #E5E7E1', borderRadius: '16px 16px 16px 4px', padding: 16, fontSize: 14, lineHeight: 1.65 }}>
          {renderMdS(p.text)}
        </div>

        {p.stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {p.stats.map((s, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid #E5E7E1', borderRadius: 10, padding: 14, textAlign: 'center' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#6B7A6E', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{s.k}</div>
                <div className="tabular" style={{ fontSize: 22, fontWeight: 800, color: '#1F4D2C', marginTop: 4 }}>{s.v}</div>
              </div>
            ))}
          </div>
        )}

        {p.targets && (
          <div style={{ background: '#fff', border: '1px solid #E5E7E1', borderRadius: 10, padding: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {p.targets.map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 4, height: 24, background: t.c, borderRadius: 2 }}/>
                <div>
                  <div style={{ fontSize: 11, color: '#6B7A6E' }}>{t.k}</div>
                  <div className="tabular" style={{ fontSize: 13, fontWeight: 800, color: '#0F1E12' }}>{t.v}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {p.products && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {p.products.map(prod => (
              <button key={prod.id} onClick={() => onProduct(prod)} className="pf-btn pf-hover-lift" style={{
                background: '#fff', border: '1px solid #E5E7E1', borderRadius: 10, padding: 0,
                cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', overflow: 'hidden',
                display: 'flex', flexDirection: 'column'
              }}>
                <div style={{ width: '100%', height: 110, overflow: 'hidden' }}>
                  <img src={prod.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                </div>
                <div style={{ padding: 10 }}>
                  <div style={{ fontSize: 10, color: '#6B7A6E' }}>{prod.brand}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#0F1E12', lineHeight: 1.3, marginTop: 2,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 32 }}>{prod.name}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
                    <span className="tabular" style={{ fontSize: 13, fontWeight: 800, color: '#0F1E12' }}>{prod.price.toLocaleString()}ì</span>
                    <span style={{ fontSize: 10, color: '#1F6B45', fontWeight: 700 }}>Â· â {prod.rating}</span>
                  </div>
                  <span style={{ display: 'inline-block', marginTop: 6, padding: '2px 7px', background: '#EAF7D4', color: '#1F4D2C', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>ìì </span>
                </div>
              </button>
            ))}
          </div>
        )}

        {p.plan && (
          <div style={{ background: '#fff', border: '1px solid #E5E7E1', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ background: '#0F1E12', color: '#A8E063', padding: '10px 14px', fontSize: 12, fontWeight: 800, letterSpacing: '0.04em', display: 'flex', justifyContent: 'space-between' }}>
              <span>5ì¼ ìë¨í</span><span style={{ color: '#DCE9DF', fontWeight: 500 }}>ë°í¬ìë ë§ì¶¤ Â· ë¹ë¨ ì¼ì´</span>
            </div>
            <div style={{ padding: 0 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 1fr 1fr 60px', padding: '8px 14px', background: '#F4F5F1', fontSize: 10, fontWeight: 700, color: '#6B7A6E', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                <span>ìì¼</span><span>ìì¹¨</span><span>ì ì¬</span><span>ì ë</span><span style={{ textAlign: 'right' }}>kcal</span>
              </div>
              {p.plan.map((row, i) => (
                <div key={i} style={{ padding: '10px 14px', borderTop: '1px solid #F4F5F0', display: 'grid', gridTemplateColumns: '40px 1fr 1fr 1fr 60px', gap: 6, fontSize: 12 }}>
                  <span style={{ fontWeight: 800, color: '#0F1E12' }}>{row.d}</span>
                  <span style={{ color: '#3A4A3F' }}>{row.b}</span>
                  <span style={{ color: '#3A4A3F' }}>{row.l}</span>
                  <span style={{ color: '#3A4A3F' }}>{row.dn}</span>
                  <span className="tabular" style={{ textAlign: 'right', fontWeight: 700 }}>{row.kcal}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {p.recipe && (
          <div style={{ background: '#fff', border: '1px solid #E5E7E1', borderRadius: 10, padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid #F0F2EC' }}>
              <Icon.Star size={18} stroke="#1F4D2C" filled/>
              <span style={{ fontSize: 15, fontWeight: 800, color: '#0F1E12' }}>{p.recipe.title}</span>
              <span style={{ fontSize: 11, color: '#6B7A6E' }}>Â· {p.recipe.time} Â· {p.recipe.kcal}kcal Â· {p.recipe.servings}ì¸ë¶</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 20 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7A6E', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>ì¬ë£</div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {p.recipe.ingredients.map((it, i) => <li key={i} style={{ fontSize: 12, color: '#3A4A3F', display: 'flex', alignItems: 'center', gap: 6 }}><Icon.Check size={11} stroke="#1F6B45"/>{it}</li>)}
                </ul>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7A6E', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>ì¡°ë¦¬ ìì</div>
                <ol style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: '#3A4A3F', lineHeight: 1.7 }}>
                  {p.recipe.steps.map((s, i) => <li key={i}>{s}</li>)}
                </ol>
              </div>
            </div>
          </div>
        )}

        {p.followUps && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {p.followUps.map(q => (
              <button key={q} onClick={() => document.dispatchEvent(new CustomEvent('pf-chat-screen-send', { detail: q }))} className="pf-btn" style={{
                padding: '6px 12px', fontFamily: 'inherit', fontSize: 12, fontWeight: 600,
                border: '1px solid #DCE9DF', background: '#fff', color: '#1F4D2C',
                borderRadius: 999, cursor: 'pointer'
              }}>{q}</button>
            ))}
          </div>
        )}

        {p.products && (
          <button onClick={() => { p.products.forEach(prod => PF_STORE.addToCart(prod.id, 1, prod.name)); }} className="pf-btn" style={{
            alignSelf: 'flex-start', background: '#0F1E12', color: '#A8E063', border: 'none',
            borderRadius: 8, padding: '8px 14px', fontFamily: 'inherit', fontSize: 12, fontWeight: 700, cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 6
          }}>
            <Icon.Cart size={13} stroke="#A8E063"/> ëª¨ë ì¥ë°êµ¬ëì ë´ê¸°
          </button>
        )}
      </div>
    </div>
  );
};

function renderMdS(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => p.startsWith('**') && p.endsWith('**')
    ? <strong key={i} style={{ color: '#0F1E12' }}>{p.slice(2, -2)}</strong>
    : <React.Fragment key={i}>{p}</React.Fragment>);
}

