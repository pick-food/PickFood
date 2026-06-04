// SignupScreen â multi-step allergy/disease profile setup
window.SignupScreen = ({ onComplete }) => {
  const d = window.PF_DATA;
  const [step, setStep] = React.useState(1);
  const [formData, setFormData] = React.useState({
    email: '', password: '', name: '', allergyGroups: [{ id: 'me', name: 'ë³¸ì¸', allergens: [] }], diseaseGroups: [{ id: 'me', name: 'ë³¸ì¸', diseases: [] }]
  });
  const [activeGroupIdx, setActiveGroupIdx] = React.useState(0);
  const [activeDiseaseIdx, setActiveDiseaseIdx] = React.useState(0);

  const totalSteps = 4;

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* progress */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= step ? '#1F4D2C' : '#E5E7E1' }}/>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6B7A6E' }}>
          <span>STEP {step} / {totalSteps}</span>
          <span>{['', 'ê³ì  ì ë³´', 'ìë ë¥´ê¸° ê·¸ë£¹', 'ì§ë³ ê·¸ë£¹', 'íì¸'][step]}</span>
        </div>
      </div>

      {step === 1 && (
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0F1E12', letterSpacing: '-0.02em', marginBottom: 8 }}>pickfoodì ì¤ì  ê²ì íìí´ì</h1>
          <p style={{ fontSize: 15, color: '#3A4A3F', lineHeight: 1.55, marginBottom: 32 }}>
            ë¨¼ì  ê³ì ì ë§ë¤ì´ ì£¼ì¸ì. ë¤ì ë¨ê³ìì ìë ë¥´ê¸°Â·ì§ë³ ì ë³´ë¥¼ ë±ë¡íë©´<br/>
            ìì í ìíë§ ê³¨ë¼ ë³´ì¬ëë¦½ëë¤.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Field label="ì´ë©ì¼">
              <input type="email" placeholder="example@pickfood.com" value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })} style={inputStyle}/>
            </Field>
            <Field label="ë¹ë°ë²í¸" hint="8ì ì´ì, ìë¬¸Â·ì«ìÂ·í¹ìë¬¸ì í¬í¨">
              <input type="password" placeholder="â¢â¢â¢â¢â¢â¢â¢â¢" value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })} style={inputStyle}/>
            </Field>
            <Field label="ì´ë¦">
              <input type="text" placeholder="ì¤ëªì ìë ¥íì¸ì" value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })} style={inputStyle}/>
            </Field>
          </div>
          <div style={{ marginTop: 32, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="primary" size="lg" onClick={() => setStep(2)} icon={<Icon.ChevronRight size={18} stroke="#fff"/>}>ë¤ì â ìë ë¥´ê¸° ë±ë¡</Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0F1E12', letterSpacing: '-0.02em', marginBottom: 8 }}>ìë ë¥´ê¸° ê·¸ë£¹ì ë§ë¤ì´ì£¼ì¸ì</h1>
          <p style={{ fontSize: 15, color: '#3A4A3F', lineHeight: 1.55, marginBottom: 24 }}>
            ë³¸ì¸Â·ê°ì¡±ë³ë¡ ê·¸ë£¹ì ë§ë¤ì´ ìë ë¥´ê¸° ìì¬ë£ë¥¼ ë±ë¡íì¸ì.<br/>
            ì¬ë¬ ê·¸ë£¹ì ë§ë¤ë©´ íí°ì ë³µí©ì ì¼ë¡ ì ì©í  ì ìì´ì.
          </p>

          {/* Group tabs */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
            {formData.allergyGroups.map((g, i) => (
              <button key={g.id} onClick={() => setActiveGroupIdx(i)} style={{
                padding: '8px 14px', fontFamily: 'inherit', fontSize: 13, fontWeight: i === activeGroupIdx ? 700 : 500,
                border: '1px solid', borderColor: i === activeGroupIdx ? '#1F4D2C' : '#C9CFC4',
                background: i === activeGroupIdx ? '#1F4D2C' : '#fff',
                color: i === activeGroupIdx ? '#fff' : '#3A4A3F',
                borderRadius: 999, cursor: 'pointer'
              }}>{g.name}{g.allergens.length > 0 && ` (${g.allergens.length})`}</button>
            ))}
            <button onClick={() => {
              const newGroups = [...formData.allergyGroups, { id: 'g' + Date.now(), name: `ê·¸ë£¹ ${formData.allergyGroups.length + 1}`, allergens: [] }];
              setFormData({ ...formData, allergyGroups: newGroups });
              setActiveGroupIdx(newGroups.length - 1);
            }} style={{
              padding: '8px 14px', fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
              border: '1px dashed #C9CFC4', background: '#fff', color: '#1F4D2C',
              borderRadius: 999, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4
            }}><Icon.Plus size={14} stroke="#1F4D2C"/> ê·¸ë£¹ ì¶ê°</button>
          </div>

          {/* Active group editor */}
          <div style={{ background: '#FAFAF7', border: '1px solid #E5E7E1', borderRadius: 12, padding: 20 }}>
            <Field label="ê·¸ë£¹ ì´ë¦">
              <input type="text" value={formData.allergyGroups[activeGroupIdx].name}
                onChange={e => {
                  const g = [...formData.allergyGroups];
                  g[activeGroupIdx] = { ...g[activeGroupIdx], name: e.target.value };
                  setFormData({ ...formData, allergyGroups: g });
                }}
                placeholder="ì: ë°í¬ì, ê¹ì¸í, ìë§"
                style={inputStyle}/>
            </Field>

            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#3A4A3F', marginBottom: 10 }}>ìë ë¥´ê¸° ìì¬ë£ (ë³µì ì í)</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                {d.allergens.map(a => {
                  const selected = formData.allergyGroups[activeGroupIdx].allergens.includes(a.id);
                  return (
                    <button key={a.id} onClick={() => {
                      const g = [...formData.allergyGroups];
                      const arr = g[activeGroupIdx].allergens;
                      g[activeGroupIdx] = {
                        ...g[activeGroupIdx],
                        allergens: arr.includes(a.id) ? arr.filter(x => x !== a.id) : [...arr, a.id]
                      };
                      setFormData({ ...formData, allergyGroups: g });
                    }} style={{
                      padding: '12px 6px', fontFamily: 'inherit',
                      border: '1.5px solid', borderColor: selected ? '#D32F2F' : '#E5E7E1',
                      background: selected ? '#FEF2F2' : '#fff',
                      borderRadius: 10, cursor: 'pointer',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6
                    }}>
                      <AllergenIcon name={a.name} size={28} danger={selected}/>
                      <div style={{ fontSize: 12, fontWeight: selected ? 700 : 500, color: selected ? '#B71C1C' : '#3A4A3F' }}>{a.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="secondary" onClick={() => setStep(1)}>ì´ì </Button>
            <Button variant="primary" size="lg" onClick={() => setStep(3)} icon={<Icon.ChevronRight size={18} stroke="#fff"/>}>ë¤ì â ì§ë³ ë±ë¡</Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0F1E12', letterSpacing: '-0.02em', marginBottom: 8 }}>ê´ë¦¬ ì¤ì¸ ì§íì´ ìëì?</h1>
          <p style={{ fontSize: 15, color: '#3A4A3F', lineHeight: 1.55, marginBottom: 24 }}>
            ì§ë³ì´ ìë¤ë©´ ë±ë¡í´ ì£¼ì¸ì. ìì í ìì ì±ë¶ë§ ê³¨ë¼ ì¶ì²í´ ëë¦´ê²ì.<br/>
            ê·¸ë£¹ì ì¬ë¬ ê° ë§ë¤ì´ ê°ì¡±ë³ë¡ ê´ë¦¬í  ìë ìì´ì.
          </p>

          <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
            {formData.diseaseGroups.map((g, i) => (
              <button key={g.id} onClick={() => setActiveDiseaseIdx(i)} style={{
                padding: '8px 14px', fontFamily: 'inherit', fontSize: 13, fontWeight: i === activeDiseaseIdx ? 700 : 500,
                border: '1px solid', borderColor: i === activeDiseaseIdx ? '#1F4D2C' : '#C9CFC4',
                background: i === activeDiseaseIdx ? '#1F4D2C' : '#fff',
                color: i === activeDiseaseIdx ? '#fff' : '#3A4A3F',
                borderRadius: 999, cursor: 'pointer'
              }}>{g.name}{g.diseases.length > 0 && ` (${g.diseases.length})`}</button>
            ))}
            <button onClick={() => {
              const newGroups = [...formData.diseaseGroups, { id: 'd' + Date.now(), name: `ê·¸ë£¹ ${formData.diseaseGroups.length + 1}`, diseases: [] }];
              setFormData({ ...formData, diseaseGroups: newGroups });
              setActiveDiseaseIdx(newGroups.length - 1);
            }} style={{
              padding: '8px 14px', fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
              border: '1px dashed #C9CFC4', background: '#fff', color: '#1F4D2C',
              borderRadius: 999, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4
            }}><Icon.Plus size={14} stroke="#1F4D2C"/> ê·¸ë£¹ ì¶ê°</button>
          </div>

          <div style={{ background: '#FAFAF7', border: '1px solid #E5E7E1', borderRadius: 12, padding: 20 }}>
            <Field label="ê·¸ë£¹ ì´ë¦">
              <input type="text" value={formData.diseaseGroups[activeDiseaseIdx].name}
                onChange={e => {
                  const g = [...formData.diseaseGroups];
                  g[activeDiseaseIdx] = { ...g[activeDiseaseIdx], name: e.target.value };
                  setFormData({ ...formData, diseaseGroups: g });
                }}
                placeholder="ì: ë³¸ì¸, ìë²ì§"
                style={inputStyle}/>
            </Field>
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#3A4A3F', marginBottom: 10 }}>ê´ë¦¬ ì¤ì¸ ì§í (ë³µì ì í)</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                {d.diseases.map(dis => {
                  const selected = formData.diseaseGroups[activeDiseaseIdx].diseases.includes(dis.id);
                  return (
                    <button key={dis.id} onClick={() => {
                      const g = [...formData.diseaseGroups];
                      const arr = g[activeDiseaseIdx].diseases;
                      g[activeDiseaseIdx] = {
                        ...g[activeDiseaseIdx],
                        diseases: arr.includes(dis.id) ? arr.filter(x => x !== dis.id) : [...arr, dis.id]
                      };
                      setFormData({ ...formData, diseaseGroups: g });
                    }} style={{
                      padding: '14px 16px', fontFamily: 'inherit', textAlign: 'left',
                      border: '1.5px solid', borderColor: selected ? '#E89B26' : '#E5E7E1',
                      background: selected ? '#FFF8EC' : '#fff',
                      borderRadius: 10, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 12
                    }}>
                      <div style={{ width: 36, height: 36, borderRadius: 999, background: selected ? '#FBE9C7' : '#F4F5F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {dis.name === 'ë¹ë¨' && <Icon.Diabetes size={22}/>}
                        {dis.name.includes('ì§íì¦') && <Icon.Heart2 size={22}/>}
                        {dis.name === 'ê³ íì' && <Icon.Heart2 size={22}/>}
                        {dis.name === 'ì ì¥ì§í' && <Icon.Kidney size={22}/>}
                        {!['ë¹ë¨','ê³ ì§íì¦','ê³ íì','ì ì¥ì§í'].includes(dis.name) && <Icon.Info size={22} stroke="#3A4A3F"/>}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: selected ? '#B97308' : '#0F1E12' }}>{dis.name}</div>
                        <div style={{ fontSize: 11, color: '#6B7A6E', marginTop: 2 }}>{dis.avoid.join(' Â· ')} íí¼</div>
                      </div>
                      {selected && <Icon.Check size={18} stroke="#E89B26"/>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="secondary" onClick={() => setStep(2)}>ì´ì </Button>
            <Button variant="primary" size="lg" onClick={() => setStep(4)} icon={<Icon.ChevronRight size={18} stroke="#fff"/>}>ë¤ì â íì¸</Button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0F1E12', letterSpacing: '-0.02em', marginBottom: 8 }}>ì¤ë¹ ìë£</h1>
          <p style={{ fontSize: 15, color: '#3A4A3F', lineHeight: 1.55, marginBottom: 24 }}>
            {formData.name || 'íì'}ëì íë¡íì´ ë±ë¡ëìì´ì.<br/>
            ìë ì ë³´ë ë§ì´íì´ì§ìì ì¸ì ë  ìì í  ì ììµëë¤.
          </p>
          <div style={{ background: '#FAFAF7', border: '1px solid #E5E7E1', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#6B7A6E', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>ìë ë¥´ê¸° ê·¸ë£¹</div>
              {formData.allergyGroups.map(g => (
                <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0' }}>
                  <strong style={{ fontSize: 14, color: '#0F1E12', minWidth: 80 }}>{g.name}</strong>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {g.allergens.length === 0 && <span style={{ fontSize: 13, color: '#9AA89D' }}>ë±ë¡ë ìë ë¥´ê¸° ìì</span>}
                    {g.allergens.map(aid => {
                      const a = d.allergens.find(x => x.id === aid);
                      return <Badge key={aid} tone="danger" icon={<AllergenIcon name={a.name} size={12} danger/>}>{a.name}</Badge>;
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid #E5E7E1', paddingTop: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#6B7A6E', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>ì§ë³ ê·¸ë£¹</div>
              {formData.diseaseGroups.map(g => (
                <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0' }}>
                  <strong style={{ fontSize: 14, color: '#0F1E12', minWidth: 80 }}>{g.name}</strong>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {g.diseases.length === 0 && <span style={{ fontSize: 13, color: '#9AA89D' }}>ë±ë¡ë ì§ë³ ìì</span>}
                    {g.diseases.map(did => {
                      const dis = d.diseases.find(x => x.id === did);
                      return <Badge key={did} tone="warn">{dis.name}</Badge>;
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="secondary" onClick={() => setStep(3)}>ì´ì </Button>
            <Button variant="accent" size="lg" onClick={onComplete} icon={<Icon.Check size={18} stroke="#0F1E12"/>}>pickfood ììíê¸°</Button>
          </div>
        </div>
      )}
    </div>
  );
};

const Field = ({ label, hint, children }) => (
  <div>
    <div style={{ fontSize: 12, fontWeight: 600, color: '#3A4A3F', marginBottom: 6 }}>{label}</div>
    {children}
    {hint && <div style={{ fontSize: 12, color: '#6B7A6E', marginTop: 4 }}>{hint}</div>}
  </div>
);
const inputStyle = { fontFamily: 'inherit', fontSize: 15, padding: '12px 14px', borderRadius: 8, border: '1px solid #C9CFC4', background: '#fff', color: '#0F1E12', width: '100%', outline: 'none' };

