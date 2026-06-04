// ChatCards â visual renderers for each card kind produced by ChatRenderer.build()
// Used by both the dedicated ChatbotScreen and the floating Chatbot widget.

window.PF_CHAT_CARDS = (() => {

  // shared sub-bits ----------------------------------------------------------
  const Pill = ({ children, color = '#1F4D2C', bg = '#EAF7D4' }) => (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: 11, fontWeight: 700, color, background: bg,
      padding: '3px 8px', borderRadius: 999
    }}>{children}</span>
  );

  const Stat = ({ label, value, unit, accent = '#1F4D2C' }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span style={{ fontSize: 10, color: '#6B7A6E', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</span>
      <span className="tabular" style={{ fontSize: 18, fontWeight: 800, color: accent }}>
        {value}<span style={{ fontSize: 11, fontWeight: 500, color: '#6B7A6E', marginLeft: 2 }}>{unit}</span>
      </span>
    </div>
  );

  // ---- formatMarkdown â light bold parser for **bold** ---------------------
  function formatMarkdown(text) {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p, i) => p.startsWith('**') && p.endsWith('**')
      ? <strong key={i} style={{ color: '#0F1E12' }}>{p.slice(2, -2)}</strong>
      : <React.Fragment key={i}>{p}</React.Fragment>);
  }

  // ========================================================================
  // Card renderers
  // ========================================================================

  const ProductPicksCard = ({ data, onProduct, compact }) => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: compact ? '1fr' : 'repeat(3, 1fr)',
      gap: compact ? 8 : 12, marginTop: 10
    }}>
      {data.items.map(p => (
        <button key={p.id} onClick={() => onProduct?.(p)} style={{
          background: '#fff', border: '1px solid #E5E7E1', borderRadius: 12,
          padding: 0, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
          overflow: 'hidden', display: 'flex', flexDirection: compact ? 'row' : 'column', gap: compact ? 10 : 0
        }}>
          <div style={{ width: compact ? 64 : '100%', height: compact ? 64 : 110, flexShrink: 0, background: '#F4F5F1', overflow: 'hidden' }}>
            <img src={p.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
          </div>
          <div style={{ padding: compact ? '8px 10px 8px 0' : 10, flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 10, color: '#6B7A6E', fontWeight: 600 }}>{p.brand}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#0F1E12', lineHeight: 1.3, marginTop: 2,
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.name}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
              <span className="tabular" style={{ fontSize: 13, fontWeight: 800, color: '#0F1E12' }}>{p.price.toLocaleString()}ì</span>
              <span style={{ fontSize: 10, color: '#1F6B45', fontWeight: 700 }}>Â· ë¨ë°±ì§ {p.nutrition.protein}g</span>
            </div>
            <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
              <Pill>ìì </Pill>
              {p.nutrition.sugar <= 5 && <Pill color="#B97308" bg="#FFF1D6">ì ë¹</Pill>}
            </div>
          </div>
        </button>
      ))}
    </div>
  );

  const AllergyBreakdownCard = ({ data }) => (
    <div style={{ background: '#fff', border: '1px solid #E5E7E1', borderRadius: 12, padding: 14, marginTop: 10 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, paddingBottom: 12, borderBottom: '1px solid #F0F2EC' }}>
        <Stat label="ê²ì¬ ìí"  value={data.stats.scanned} unit="ê°"/>
        <Stat label="ìì "        value={data.stats.safe}    unit="ê°" accent="#1F6B45"/>
        <Stat label="ì£¼ì"        value={data.stats.risky}   unit="ê°" accent="#D32F2F"/>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12 }}>
        <Row icon={<Icon.Alert size={14} stroke="#D32F2F"/>} bg="#FDEAEA"
          label="íí¼ ìë ë¥´ê¸°" value={data.unsafe.join(', ')} valueColor="#D32F2F"/>
        <Row icon={<Icon.Check size={14} stroke="#1F6B45"/>} bg="#EAF7D4"
          label="ìì  íì¸ë¨" value={data.safe.join(', ')} valueColor="#1F6B45"/>
      </div>
    </div>
  );

  const Row = ({ icon, bg, label, value, valueColor }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: bg, borderRadius: 8 }}>
      {icon}
      <span style={{ fontSize: 11, color: '#3A4A3F', fontWeight: 600 }}>{label}</span>
      <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 700, color: valueColor }}>{value}</span>
    </div>
  );

  const MealPlanCard = ({ data }) => (
    <div style={{ background: '#fff', border: '1px solid #E5E7E1', borderRadius: 12, padding: 0, marginTop: 10, overflow: 'hidden' }}>
      <div style={{ background: '#0F1E12', color: '#fff', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, fontWeight: 700 }}>ì£¼ê° ìë¨ (5ì¼)</span>
        <span style={{ fontSize: 11, color: '#A8E063', fontWeight: 600 }}>ë°í¬ìë ë§ì¶¤ Â· ë¹ë¨ ì¼ì´</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr 1fr 60px', fontSize: 11 }}>
        <div style={cellHead}>ìì¼</div>
        <div style={cellHead}>ìì¹¨</div>
        <div style={cellHead}>ì ì¬</div>
        <div style={cellHead}>ì ë</div>
        <div style={{...cellHead, textAlign: 'right' }}>kcal</div>
        {data.week.map(d => (
          <React.Fragment key={d.day}>
            <div style={{...cell, fontWeight: 700, color: '#0F1E12' }}>{d.day}<div style={{ fontSize: 9, color: '#9AA89D', fontWeight: 500 }}>{d.date}</div></div>
            <MealCell p={d.breakfast}/>
            <MealCell p={d.lunch}/>
            <MealCell p={d.dinner}/>
            <div style={{...cell, textAlign: 'right', fontWeight: 700 }} className="tabular">{d.kcal}</div>
          </React.Fragment>
        ))}
      </div>
      <div style={{ padding: 10, background: '#FAFAF7', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, color: '#6B7A6E' }}>5ì¼ Â· 15ë¼ Â· íê·  1,750kcal/ì¼</span>
        <button style={{
          background: '#1F4D2C', color: '#fff', border: 'none', borderRadius: 8,
          padding: '6px 12px', fontFamily: 'inherit', fontSize: 12, fontWeight: 700, cursor: 'pointer'
        }}>ì¥ë³´ê¸° ë¦¬ì¤í¸ â</button>
      </div>
    </div>
  );
  const cellHead = { padding: '8px 10px', background: '#F4F5F1', color: '#6B7A6E', fontWeight: 700, fontSize: 10, letterSpacing: '0.04em', textTransform: 'uppercase', borderBottom: '1px solid #E5E7E1' };
  const cell     = { padding: '8px 10px', borderBottom: '1px solid #F4F5F1', fontSize: 11, color: '#3A4A3F' };
  const MealCell = ({ p }) => (
    <div style={{...cell, display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ width: 24, height: 24, borderRadius: 4, overflow: 'hidden', background: '#F4F5F1', flexShrink: 0 }}>
        {p && <img src={p.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>}
      </div>
      <span style={{ fontSize: 11, color: '#0F1E12', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p?.name?.slice(0,12) || 'â'}</span>
    </div>
  );

  const CompareCard = ({ data, onProduct }) => {
    const { a, b } = data;
    const rows = [
      ['ê°ê²©', `${a.price.toLocaleString()}ì`, `${b.price.toLocaleString()}ì`, a.price < b.price ? 'a' : 'b'],
      ['ë¨ë°±ì§', `${a.nutrition.protein}g`, `${b.nutrition.protein}g`, a.nutrition.protein > b.nutrition.protein ? 'a' : 'b'],
      ['ë¹ë¥', `${a.nutrition.sugar}g`, `${b.nutrition.sugar}g`, a.nutrition.sugar < b.nutrition.sugar ? 'a' : 'b'],
      ['ëí¸ë¥¨', `${a.nutrition.sodium}mg`, `${b.nutrition.sodium}mg`, a.nutrition.sodium < b.nutrition.sodium ? 'a' : 'b'],
      ['ìë ë¥´ê¸°', a.allergens.join(',') || 'ìì', b.allergens.join(',') || 'ìì', null]
    ];
    return (
      <div style={{ background: '#fff', border: '1px solid #E5E7E1', borderRadius: 12, padding: 14, marginTop: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          {[a, b].map(p => (
            <button key={p.id} onClick={() => onProduct?.(p)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0, fontFamily: 'inherit' }}>
              <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: 8, overflow: 'hidden', background: '#F4F5F1' }}>
                <img src={p.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
              </div>
              <div style={{ fontSize: 10, color: '#6B7A6E', fontWeight: 600, marginTop: 6 }}>{p.brand}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#0F1E12', lineHeight: 1.3 }}>{p.name}</div>
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {rows.map(([label, va, vb, winner]) => (
            <div key={label} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', alignItems: 'center', padding: '6px 0', borderTop: '1px dashed #E5E7E1', fontSize: 12 }}>
              <span style={{ color: '#6B7A6E', fontWeight: 600 }}>{label}</span>
              <span style={{ fontWeight: winner === 'a' ? 800 : 500, color: winner === 'a' ? '#1F6B45' : '#3A4A3F' }} className="tabular">{va}{winner === 'a' && ' â'}</span>
              <span style={{ fontWeight: winner === 'b' ? 800 : 500, color: winner === 'b' ? '#1F6B45' : '#3A4A3F' }} className="tabular">{vb}{winner === 'b' && ' â'}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const SubstituteCard = ({ data }) => (
    <div style={{ background: '#fff', border: '1px solid #E5E7E1', borderRadius: 12, padding: 14, marginTop: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, background: '#FDEAEA', borderRadius: 8, marginBottom: 10 }}>
        <Icon.Alert size={16} stroke="#D32F2F"/>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#D32F2F' }}>íí¼ ì¬ë£: {data.from.allergy}</div>
          <div style={{ fontSize: 11, color: '#6B7A6E' }}>{data.from.name} Â· {data.from.kcal}kcal Â· ë¨ë°±ì§ {data.from.protein}g</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {data.options.map((o, i) => (
          <div key={i} style={{ padding: 10, border: '1px solid #E5E7E1', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 999, background: '#EAF7D4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon.Check size={16} stroke="#1F6B45"/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#0F1E12' }}>{o.name}</div>
              <div style={{ fontSize: 11, color: '#6B7A6E' }}>{o.kcal}kcal Â· ë¨ë°±ì§ {o.protein}g Â· {o.note}</div>
            </div>
            <Pill>ìì </Pill>
          </div>
        ))}
      </div>
    </div>
  );

  const NutrientTargetCard = ({ data }) => (
    <div style={{ background: '#fff', border: '1px solid #E5E7E1', borderRadius: 12, padding: 14, marginTop: 10, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
      {data.items.map(it => {
        const c = it.status === 'good' ? '#1F6B45' : it.status === 'low' ? '#D32F2F' : '#B97308';
        return (
          <div key={it.label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 10, color: '#6B7A6E', fontWeight: 600 }}>{it.label}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: c }}>{it.target}</span>
            <div style={{ height: 3, background: '#F0F2EC', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ width: '100%', height: '100%', background: c }}/>
            </div>
          </div>
        );
      })}
    </div>
  );

  const RecipeCard = ({ data }) => (
    <div style={{ background: '#fff', border: '1px solid #E5E7E1', borderRadius: 12, padding: 14, marginTop: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 12, borderBottom: '1px solid #F0F2EC' }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg,#F0F6F1,#EAF7D4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon.Star size={20} stroke="#1F4D2C" filled/>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#0F1E12' }}>{data.title}</div>
          <div style={{ fontSize: 11, color: '#6B7A6E' }}>{data.time} Â· {data.kcal}kcal Â· {data.servings}ì¸ë¶</div>
        </div>
        <Pill>ìì </Pill>
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7A6E', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 12, marginBottom: 6 }}>ì¬ë£</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {data.ingredients.map((ing, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, padding: '4px 0' }}>
            <Icon.Check size={12} stroke="#1F6B45"/>
            <span style={{ color: '#0F1E12', fontWeight: 600, flex: 1 }}>{ing.name}</span>
            <span style={{ color: '#6B7A6E' }}>{ing.amount}</span>
            {ing.pid && <a style={{ fontSize: 10, color: '#1F4D2C', fontWeight: 700, cursor: 'pointer' }}>ì¥ë°êµ¬ë +</a>}
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7A6E', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 12, marginBottom: 6 }}>ì¡°ë¦¬ ìì</div>
      <ol style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {data.steps.map((s, i) => <li key={i} style={{ fontSize: 12, color: '#3A4A3F', lineHeight: 1.55 }}>{s}</li>)}
      </ol>
      <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 11, color: '#6B7A6E' }}>í¬í¨ ìë ë¥´ê²:</span>
        {data.allergens.map(a => <Pill key={a} color="#B97308" bg="#FFF1D6">{a}</Pill>)}
      </div>
    </div>
  );

  const PhotoScanCard = ({ data }) => (
    <div style={{ background: '#fff', border: '1px solid #E5E7E1', borderRadius: 12, padding: 14, marginTop: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 10, borderBottom: '1px solid #F0F2EC' }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: '#0F1E12', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon.Camera size={16} stroke="#A8E063"/>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0F1E12' }}>{data.label}</div>
          <div style={{ fontSize: 11, color: '#6B7A6E' }}>ì¸ì ì ë¢°ë {Math.round(data.confidence * 100)}%</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
        {data.warnings.map((w, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, padding: 8, background: '#FDEAEA', borderRadius: 6, fontSize: 12, color: '#D32F2F', fontWeight: 600 }}>
            <Icon.Alert size={14} stroke="#D32F2F"/>{w.text}
          </div>
        ))}
        {data.ok.map((o, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, padding: 8, background: '#EAF7D4', borderRadius: 6, fontSize: 12, color: '#1F6B45', fontWeight: 600 }}>
            <Icon.Check size={14} stroke="#1F6B45"/>{o.text}
          </div>
        ))}
      </div>
    </div>
  );

  const NutritionSummaryCard = ({ data }) => (
    <div style={{ background: '#fff', border: '1px solid #E5E7E1', borderRadius: 12, padding: 14, marginTop: 10 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {data.metrics.map(m => {
          const pct = Math.min(100, (m.value / m.target) * 100);
          const c = m.good ? '#1F6B45' : '#D32F2F';
          return (
            <div key={m.label}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: '#6B7A6E', fontWeight: 600 }}>{m.label}</span>
                <span className="tabular" style={{ fontSize: 11, fontWeight: 700, color: '#0F1E12' }}>{m.value}<span style={{ color: '#9AA89D', fontWeight: 500 }}> / {m.target}{m.unit}</span></span>
              </div>
              <div style={{ height: 6, background: '#F0F2EC', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: pct + '%', height: '100%', background: c, transition: 'width 600ms' }}/>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ---- main dispatcher ----------------------------------------------------
  const CardSwitch = ({ kind, data, onProduct, compact }) => {
    switch (kind) {
      case 'product_picks':      return <ProductPicksCard data={data} onProduct={onProduct} compact={compact}/>;
      case 'allergy_breakdown':  return <AllergyBreakdownCard data={data}/>;
      case 'meal_plan':          return <MealPlanCard data={data}/>;
      case 'compare':            return <CompareCard data={data} onProduct={onProduct}/>;
      case 'substitute':         return <SubstituteCard data={data}/>;
      case 'nutrient_target':    return <NutrientTargetCard data={data}/>;
      case 'recipe':             return <RecipeCard data={data}/>;
      case 'photo_scan':         return <PhotoScanCard data={data}/>;
      case 'nutrition_summary':  return <NutritionSummaryCard data={data}/>;
      default: return null;
    }
  };

  return { CardSwitch, formatMarkdown, Pill };
})();

