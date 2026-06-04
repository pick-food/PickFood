// FilterSidebar â left column on home/search
window.FilterSidebar = ({ filters, onChange }) => {
  const d = window.PF_DATA;
  const [openSec, setOpenSec] = React.useState({ allergy: true, disease: true, nutrition: true, source: true });

  const toggleSection = (k) => setOpenSec({ ...openSec, [k]: !openSec[k] });
  const toggleAllergyGroup = (gid) => {
    const arr = filters.activeAllergyGroups || [];
    onChange({ activeAllergyGroups: arr.includes(gid) ? arr.filter(x => x !== gid) : [...arr, gid] });
  };
  const toggleDiseaseGroup = (gid) => {
    const arr = filters.activeDiseaseGroups || [];
    onChange({ activeDiseaseGroups: arr.includes(gid) ? arr.filter(x => x !== gid) : [...arr, gid] });
  };

  return (
    <aside style={{ width: 260, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>

      <Section title="ìë ë¥´ê¸° ê·¸ë£¹" open={openSec.allergy} onToggle={() => toggleSection('allergy')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {d.allergyGroups.map(g => {
            const on = (filters.activeAllergyGroups || []).includes(g.id);
            return (
              <label key={g.id} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
                borderRadius: 8, cursor: 'pointer',
                background: on ? '#FEF2F2' : 'transparent',
                border: '1px solid ' + (on ? '#FCD7D7' : 'transparent')
              }}>
                <div style={{
                  width: 18, height: 18, borderRadius: 4, flexShrink: 0,
                  border: '1.5px solid ' + (on ? '#D32F2F' : '#C9CFC4'),
                  background: on ? '#D32F2F' : '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {on && <Icon.Check size={12} stroke="#fff"/>}
                </div>
                <input type="checkbox" checked={on} onChange={() => toggleAllergyGroup(g.id)} style={{ display: 'none' }}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#0F1E12' }}>{g.name}</div>
                  <div style={{ fontSize: 11, color: on ? '#B71C1C' : '#6B7A6E' }}>
                    {g.allergens.map(a => d.allergens.find(x => x.id === a)?.name).join(' Â· ')}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </Section>

      <Section title="ì§ë³ ê·¸ë£¹" open={openSec.disease} onToggle={() => toggleSection('disease')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {d.diseaseGroups.map(g => {
            const on = (filters.activeDiseaseGroups || []).includes(g.id);
            return (
              <label key={g.id} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
                borderRadius: 8, cursor: 'pointer',
                background: on ? '#FFF8EC' : 'transparent',
                border: '1px solid ' + (on ? '#FBE9C7' : 'transparent')
              }}>
                <div style={{
                  width: 18, height: 18, borderRadius: 4, flexShrink: 0,
                  border: '1.5px solid ' + (on ? '#E89B26' : '#C9CFC4'),
                  background: on ? '#E89B26' : '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {on && <Icon.Check size={12} stroke="#fff"/>}
                </div>
                <input type="checkbox" checked={on} onChange={() => toggleDiseaseGroup(g.id)} style={{ display: 'none' }}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#0F1E12' }}>{g.name}</div>
                  <div style={{ fontSize: 11, color: on ? '#B97308' : '#6B7A6E' }}>
                    {g.diseases.map(did => d.diseases.find(x => x.id === did)?.name).join(' Â· ')}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </Section>

      <Section title="ìì ì ë³´ íí°" open={openSec.nutrition} onToggle={() => toggleSection('nutrition')}>
        <RangeFilter label="ë¨ë°±ì§" unit="g" min={0} max={80} value={filters.minProtein || 0} onChange={v => onChange({ minProtein: v })} side="min"/>
        <RangeFilter label="ë¹ë¥" unit="g" min={0} max={50} value={filters.maxSugar ?? 50} onChange={v => onChange({ maxSugar: v })} side="max"/>
        <RangeFilter label="ëí¸ë¥¨" unit="mg" min={0} max={2000} step={50} value={filters.maxSodium ?? 2000} onChange={v => onChange({ maxSodium: v })} side="max"/>
        <RangeFilter label="ì´ë" unit="kcal" min={0} max={800} step={10} value={filters.maxKcal ?? 800} onChange={v => onChange({ maxKcal: v })} side="max"/>
      </Section>

      <Section title="ìì°ì§ / ì¸ì¦" open={openSec.source} onToggle={() => toggleSection('source')}>
        <Checkbox label="êµ­ë´ì°" checked={filters.domestic} onChange={v => onChange({ domestic: v })}/>
        <Checkbox label="ì ê¸°ë ì¸ì¦" checked={filters.organic} onChange={v => onChange({ organic: v })}/>
        <Checkbox label="HACCP" checked={filters.haccp} onChange={v => onChange({ haccp: v })}/>
        <Checkbox label="ë¹ê±´ ì¸ì¦" checked={filters.vegan} onChange={v => onChange({ vegan: v })}/>
      </Section>

      <button style={{
        marginTop: 12, padding: '10px 14px', fontFamily: 'inherit',
        border: '1px solid #C9CFC4', background: '#fff', borderRadius: 8,
        fontSize: 13, fontWeight: 600, color: '#3A4A3F', cursor: 'pointer'
      }}>íí° ì´ê¸°í</button>
    </aside>
  );
};

const Section = ({ title, children, open, onToggle }) => (
  <div style={{ borderBottom: '1px solid #E5E7E1', paddingBottom: 16, marginBottom: 16 }}>
    <button onClick={onToggle} style={{
      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 0', background: 'transparent', border: 'none', cursor: 'pointer',
      fontFamily: 'inherit', fontSize: 14, fontWeight: 700, color: '#0F1E12'
    }}>
      <span>{title}</span>
      <span style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 200ms', display: 'flex' }}>
        <Icon.ChevronDown size={16} stroke="#6B7A6E"/>
      </span>
    </button>
    {open && <div style={{ marginTop: 4 }}>{children}</div>}
  </div>
);

const RangeFilter = ({ label, unit, min, max, step = 1, value, onChange, side }) => (
  <div style={{ padding: '8px 0' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
      <span style={{ fontSize: 12, color: '#3A4A3F', fontWeight: 500 }}>{label}</span>
      <span className="tabular" style={{ fontSize: 12, fontWeight: 700, color: '#1F4D2C' }}>
        {side === 'min' ? `${value}${unit} ì´ì` : `${value}${unit} ì´í`}
      </span>
    </div>
    <input type="range" min={min} max={max} step={step} value={value}
      onChange={e => onChange(Number(e.target.value))}
      style={{ width: '100%', accentColor: '#1F4D2C' }}/>
  </div>
);

const Checkbox = ({ label, checked, onChange }) => (
  <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', cursor: 'pointer', fontSize: 13, color: '#3A4A3F' }}>
    <div style={{
      width: 18, height: 18, borderRadius: 4, flexShrink: 0,
      border: '1.5px solid ' + (checked ? '#1F4D2C' : '#C9CFC4'),
      background: checked ? '#1F4D2C' : '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>{checked && <Icon.Check size={12} stroke="#fff"/>}</div>
    <input type="checkbox" checked={!!checked} onChange={e => onChange(e.target.checked)} style={{ display: 'none' }}/>
    <span>{label}</span>
  </label>
);

