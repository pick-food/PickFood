// SearchScreen â full category page with granular filters
window.SearchScreen = ({ user, onProduct }) => {
  const d = window.PF_DATA;
  const [query, setQuery] = React.useState('');
  const [view, setView] = React.useState('grid');
  const [sort, setSort] = React.useState('relevance');
  const [activeCat, setActiveCat] = React.useState('protein');
  const [activeSub, setActiveSub] = React.useState('all');
  const [page, setPage] = React.useState(1);
  const [filters, setFilters] = React.useState({
    activeAllergyGroups: user.activeAllergyGroups || [],
    activeDiseaseGroups: user.activeDiseaseGroups || [],
    excludeAllergens: [],
    safeOnly: true,
    maxSugar: 50, maxSodium: 2000, maxKcal: 800, minProtein: 0, maxFat: 50,
    priceMin: 0, priceMax: 30000,
    brands: [], tags: [], origin: [],
    delivery: [], cert: [],
    inStock: true, onSale: false, newOnly: false
  });

  const activeAllergenNames = (filters.activeAllergyGroups || []).flatMap(gid =>
    (d.allergyGroups.find(g => g.id === gid)?.allergens || []).map(aid => d.allergens.find(a => a.id === aid)?.name)
  ).filter(Boolean);
  const allExcluded = [...new Set([...activeAllergenNames, ...filters.excludeAllergens])];

  let results = d.products.filter(p => {
    if (p.nutrition.protein < (filters.minProtein || 0)) return false;
    if (p.nutrition.sugar > filters.maxSugar) return false;
    if (p.nutrition.sodium > filters.maxSodium) return false;
    if (p.nutrition.kcal > filters.maxKcal) return false;
    if (p.nutrition.fat > filters.maxFat) return false;
    if (p.price < filters.priceMin || p.price > filters.priceMax) return false;
    if (filters.brands.length > 0 && !filters.brands.includes(p.brand)) return false;
    if (filters.tags.length > 0 && !filters.tags.some(t => p.tags.includes(t))) return false;
    if (filters.onSale && !p.originalPrice) return false;
    if (filters.safeOnly && p.allergens.some(a => allExcluded.includes(a))) return false;
    if (query && !p.name.includes(query) && !p.brand.includes(query) && !p.tags.some(t => t.includes(query))) return false;
    return true;
  });

  // sort
  if (sort === 'priceLow') results = [...results].sort((a, b) => a.price - b.price);
  if (sort === 'priceHigh') results = [...results].sort((a, b) => b.price - a.price);
  if (sort === 'popular') results = [...results].sort((a, b) => b.reviews - a.reviews);
  if (sort === 'rating') results = [...results].sort((a, b) => b.rating - a.rating);
  if (sort === 'protein') results = [...results].sort((a, b) => b.nutrition.protein - a.nutrition.protein);
  if (sort === 'new') results = [...results].reverse();

  const totalCount = d.products.length;
  const safeCount = d.products.filter(p => !p.allergens.some(a => activeAllergenNames.includes(a))).length;

  const subcats = {
    protein: ['ì ì²´', 'ìê³ ê¸°', 'ë¼ì§ê³ ê¸°', 'ë­/ì¤ë¦¬', 'ìì°', 'ê³ë', 'ëë¶/ì½©'],
    fruit:   ['ì ì²´', 'êµ­ì°', 'ìì', 'ì ì² ', 'ëë'],
    veg:     ['ì ì²´', 'ìì±ì', 'ë¿ë¦¬ì±ì', 'ë²ì¯', 'ìì±ì', 'ìë¬ë'],
    dairy:   ['ì ì²´', 'ì°ì ', 'ìê±°í¸', 'ì¹ì¦', 'ìë¬¼ì±', 'ëì '],
    staple:  ['ì ì²´', 'ì', 'ì¡ê³¡', 'ê°í¸ë°¥', 'ë©´ë¥'],
    ready:   ['ì ì²´', 'êµ­Â·í', 'ëìë½', 'ìì£¼', 'ëëë°¥'],
    snack:   ['ì ì²´', 'ì¿ í¤', 'ê²¬ê³¼ë¥', 'ë§ë­ì´', 'ìë£'],
    baby:    ['ì ì²´', 'ì´ì ì', 'ì ìê°ì', 'ë¶ì '],
    health:  ['ì ì²´', 'ë¹íë¯¼', 'íë¡ë°ì´ì¤í±ì¤', 'ë¨ë°±ì§ ë³´ì¶©', 'ì¤ë©ê°3']
  };
  const subs = subcats[activeCat] || ['ì ì²´'];

  return (
    <div style={{ background: '#FFFFFF', paddingBottom: 80, minHeight: '100vh' }} data-screen-label="03 ì¹´íê³ ë¦¬">

      {/* Category top rail */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E5E7E1' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px', display: 'flex', overflow: 'auto' }}>
          {d.categories.filter(c => c.id !== 'all').map(c => (
            <button key={c.id} onClick={() => { setActiveCat(c.id); setActiveSub('all'); setPage(1); }} style={{
              padding: '18px 22px', fontFamily: 'inherit', fontSize: 14, fontWeight: activeCat === c.id ? 700 : 500,
              color: activeCat === c.id ? '#1F4D2C' : '#3A4A3F',
              background: 'transparent', border: 'none', cursor: 'pointer',
              borderBottom: '2px solid ' + (activeCat === c.id ? '#1F4D2C' : 'transparent'),
              whiteSpace: 'nowrap'
            }}>{c.name}</button>
          ))}
        </div>
      </div>

      {/* Sub-category rail */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E5E7E1' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '12px 40px', display: 'flex', gap: 6, overflow: 'auto' }}>
          {subs.map((s, i) => (
            <button key={s} onClick={() => setActiveSub(i === 0 ? 'all' : s)} style={{
              padding: '7px 14px', borderRadius: 999, border: '1px solid ' + ((activeSub === s || (i === 0 && activeSub === 'all')) ? '#0F1E12' : '#E5E7E1'),
              background: (activeSub === s || (i === 0 && activeSub === 'all')) ? '#0F1E12' : '#fff',
              color: (activeSub === s || (i === 0 && activeSub === 'all')) ? '#fff' : '#3A4A3F',
              fontFamily: 'inherit', fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap'
            }}>{s}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 40px 0' }}>

        {/* Search bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: '#fff', border: '1.5px solid #C9CFC4', borderRadius: 14, marginBottom: 18 }}>
          <Icon.Search size={20} stroke="#3A4A3F"/>
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder={`${d.categories.find(c => c.id === activeCat)?.name} ììì ê²ì`}
            style={{ flex: 1, fontFamily: 'inherit', fontSize: 15, fontWeight: 500, border: 'none', outline: 'none', background: 'transparent', color: '#0F1E12' }}/>
          {query && <button onClick={() => setQuery('')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex' }}><Icon.X size={16} stroke="#9AA89D"/></button>}
        </div>

        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          {/* Sidebar filters */}
          <aside style={{ width: 260, flexShrink: 0, background: '#fff', border: '1px solid #E5E7E1', borderRadius: 12, padding: 20, position: 'sticky', top: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, paddingBottom: 12, borderBottom: '1px solid #F4F5F1' }}>
              <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0F1E12' }}>íí°</h3>
              <button onClick={() => setFilters({
                ...filters, excludeAllergens: [], maxSugar: 50, maxSodium: 2000, maxKcal: 800, minProtein: 0, maxFat: 50,
                priceMin: 0, priceMax: 30000, brands: [], tags: [], origin: [], delivery: [], cert: [], onSale: false, newOnly: false
              })}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 11, color: '#6B7A6E', textDecoration: 'underline' }}>ì ì²´ ì´ê¸°í</button>
            </div>

            {/* Safety toggle */}
            <div style={{ background: '#F0F6F1', padding: 12, borderRadius: 8, marginBottom: 14, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <Icon.Shield size={16} stroke="#1F4D2C"/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#1F4D2C' }}>ìì  ìíë§ ë³´ê¸°</div>
                <div style={{ fontSize: 10, color: '#3A4A3F', marginTop: 2 }}>ë°í¬ì íë¡í ê¸°ì¤ ìí ìì¬ë£ ì ì¸</div>
              </div>
              <Toggle on={filters.safeOnly} onClick={() => setFilters({ ...filters, safeOnly: !filters.safeOnly })}/>
            </div>

            <FilterSection title="ìë ë¥´ê¸° ê·¸ë£¹ ì ì¸">
              {d.allergyGroups.map(g => (
                <label key={g.id} style={checkRow}>
                  <input type="checkbox" checked={filters.activeAllergyGroups.includes(g.id)}
                    onChange={() => setFilters({
                      ...filters,
                      activeAllergyGroups: filters.activeAllergyGroups.includes(g.id)
                        ? filters.activeAllergyGroups.filter(x => x !== g.id) : [...filters.activeAllergyGroups, g.id]
                    })}/>
                  <span style={{ flex: 1, color: '#3A4A3F' }}>{g.name}</span>
                  <span style={{ fontSize: 10, color: '#9AA89D' }}>{g.allergens.length}ì¢</span>
                </label>
              ))}
            </FilterSection>

            <FilterSection title="ê°ë³ ìë ë¥´ê¸° ì ì¸">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {d.allergens.map(a => {
                  const on = filters.excludeAllergens.includes(a.name);
                  return (
                    <button key={a.id} onClick={() => setFilters({
                      ...filters,
                      excludeAllergens: on ? filters.excludeAllergens.filter(x => x !== a.name) : [...filters.excludeAllergens, a.name]
                    })}
                      style={{
                        padding: '4px 8px', border: '1px solid ' + (on ? '#D32F2F' : '#E5E7E1'),
                        background: on ? '#FEF2F2' : '#fff', color: on ? '#B71C1C' : '#3A4A3F',
                        borderRadius: 4, cursor: 'pointer', fontFamily: 'inherit',
                        fontSize: 11, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4
                      }}>
                      <AllergenIcon name={a.name} size={11} danger={on}/>{a.name}
                    </button>
                  );
                })}
              </div>
            </FilterSection>

            <FilterSection title="ì§ë³ ì¼ì´ ë¼ì¸">
              {d.diseases.slice(0, 5).map(dis => (
                <label key={dis.id} style={checkRow}>
                  <input type="checkbox"/>
                  <span style={{ flex: 1, color: '#3A4A3F' }}>{dis.name} ì í©</span>
                </label>
              ))}
            </FilterSection>

            <FilterSection title="ê°ê²©ë">
              <div style={{ display: 'flex', gap: 4, alignItems: 'center', fontSize: 11, marginBottom: 6 }}>
                <input type="number" value={filters.priceMin} onChange={e => setFilters({ ...filters, priceMin: Number(e.target.value) })} style={priceInput}/>
                <span style={{ color: '#9AA89D' }}>~</span>
                <input type="number" value={filters.priceMax} onChange={e => setFilters({ ...filters, priceMax: Number(e.target.value) })} style={priceInput}/>
              </div>
              <input type="range" min={0} max={30000} step={500} value={filters.priceMax} onChange={e => setFilters({ ...filters, priceMax: Number(e.target.value) })} style={{ width: '100%', accentColor: '#1F4D2C' }}/>
            </FilterSection>

            <FilterSection title="ìì ëª©í">
              <SliderControl label="ë¹ë¥ â¤" value={filters.maxSugar} max={50} unit="g" onChange={v => setFilters({ ...filters, maxSugar: v })}/>
              <SliderControl label="ëí¸ë¥¨ â¤" value={filters.maxSodium} max={2000} step={50} unit="mg" onChange={v => setFilters({ ...filters, maxSodium: v })}/>
              <SliderControl label="ë¨ë°±ì§ â¥" value={filters.minProtein} max={50} unit="g" onChange={v => setFilters({ ...filters, minProtein: v })}/>
              <SliderControl label="ì§ë°© â¤" value={filters.maxFat} max={50} unit="g" onChange={v => setFilters({ ...filters, maxFat: v })}/>
              <SliderControl label="ì¹¼ë¡ë¦¬ â¤" value={filters.maxKcal} max={1000} step={50} unit="kcal" onChange={v => setFilters({ ...filters, maxKcal: v })}/>
            </FilterSection>

            <FilterSection title="ë¸ëë">
              {d.brands.slice(0, 6).map(b => (
                <label key={b.id} style={checkRow}>
                  <input type="checkbox" checked={filters.brands.includes(b.name)}
                    onChange={() => setFilters({
                      ...filters,
                      brands: filters.brands.includes(b.name) ? filters.brands.filter(x => x !== b.name) : [...filters.brands, b.name]
                    })}/>
                  <span style={{ flex: 1, color: '#3A4A3F' }}>{b.name}</span>
                  <span style={{ fontSize: 10, color: '#9AA89D' }}>{d.products.filter(p => p.brand === b.name).length}</span>
                </label>
              ))}
            </FilterSection>

            <FilterSection title="íê·¸">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {['ì ê¸°ë','êµ­ë´ì°','HACCP','ëë¬¼ë³µì§','ì ë¹','ì ëí¸ë¥¨','ê³ ë¨ë°±','ì ì§ë°©','ë¹ê±´','ë½í íë¦¬','ê¸ë£¨ííë¦¬','ì¤ë©ê°3','ìì´ì¬ì '].map(t => {
                  const on = filters.tags.includes(t);
                  return (
                    <button key={t} onClick={() => setFilters({
                      ...filters,
                      tags: on ? filters.tags.filter(x => x !== t) : [...filters.tags, t]
                    })}
                      style={{
                        padding: '4px 9px', border: '1px solid ' + (on ? '#1F4D2C' : '#E5E7E1'),
                        background: on ? '#1F4D2C' : '#fff', color: on ? '#fff' : '#3A4A3F',
                        borderRadius: 999, cursor: 'pointer', fontFamily: 'inherit',
                        fontSize: 11, fontWeight: 600
                      }}>{t}</button>
                  );
                })}
              </div>
            </FilterSection>

            <FilterSection title="ìì°ì§">
              {['êµ­ë´ì°','ììì°','êµ­ë´ê°ê³µ','ì ë½','ë¶ë¯¸','ëë¨ì'].map(o => (
                <label key={o} style={checkRow}>
                  <input type="checkbox"/>
                  <span style={{ flex: 1, color: '#3A4A3F' }}>{o}</span>
                </label>
              ))}
            </FilterSection>

            <FilterSection title="ì¸ì¦">
              {['HACCP','ì ê¸°ë ì¸ì¦','ëë¬¼ë³µì§','GAP','ë¬´í­ìì ','ìì°ë¬¼ ì´ë ¥ì '].map(c => (
                <label key={c} style={checkRow}>
                  <input type="checkbox"/>
                  <span style={{ flex: 1, color: '#3A4A3F' }}>{c}</span>
                </label>
              ))}
            </FilterSection>

            <FilterSection title="ë°°ì¡">
              {[
                { id: 'fast', label: 'ë´ì¼ ëì°©' },
                { id: 'today', label: 'ë¹ì¼ë°°ì¡' },
                { id: 'free', label: 'ë¬´ë£ë°°ì¡' }
              ].map(x => (
                <label key={x.id} style={checkRow}>
                  <input type="checkbox"/>
                  <span style={{ flex: 1, color: '#3A4A3F' }}>{x.label}</span>
                </label>
              ))}
            </FilterSection>

            <FilterSection title="ê¸°í" last>
              <label style={checkRow}>
                <input type="checkbox" checked={filters.onSale} onChange={() => setFilters({ ...filters, onSale: !filters.onSale })}/>
                <span style={{ flex: 1, color: '#3A4A3F' }}>í ì¸ ìíë§</span>
              </label>
              <label style={checkRow}>
                <input type="checkbox" checked={filters.newOnly} onChange={() => setFilters({ ...filters, newOnly: !filters.newOnly })}/>
                <span style={{ flex: 1, color: '#3A4A3F' }}>ì ìíë§</span>
              </label>
              <label style={checkRow}>
                <input type="checkbox" checked={filters.inStock} onChange={() => setFilters({ ...filters, inStock: !filters.inStock })}/>
                <span style={{ flex: 1, color: '#3A4A3F' }}>íì  ì ì¸</span>
              </label>
            </FilterSection>
          </aside>

          {/* Main results */}
          <main style={{ flex: 1, minWidth: 0 }}>
            {/* Hero strip for current category */}
            <div style={{
              background: 'linear-gradient(135deg, #0F1E12, #1F4D2C)',
              color: '#fff', borderRadius: 12, padding: '20px 24px', marginBottom: 18,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#A8E063', letterSpacing: '0.1em', textTransform: 'uppercase' }}>CATEGORY Â· {d.categories.find(c => c.id === activeCat)?.name}</div>
                <h1 style={{ fontSize: 22, fontWeight: 800, marginTop: 6, letterSpacing: '-0.02em' }}>{d.categories.find(c => c.id === activeCat)?.name} {activeSub !== 'all' ? `Â· ${activeSub}` : ''}</h1>
                <div style={{ fontSize: 12, color: '#B8C5BA', marginTop: 4 }}>
                  ì ì²´ <strong className="tabular" style={{ color: '#fff' }}>{totalCount}</strong>ê° Â· ë°í¬ì íë¡í ìì  <strong className="tabular" style={{ color: '#A8E063' }}>{safeCount}</strong>ê°
                </div>
              </div>
              {filters.safeOnly && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'rgba(168,224,99,0.18)', borderRadius: 999 }}>
                  <Icon.Shield size={14} stroke="#A8E063"/>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#A8E063' }}>ìì  íí° ON</span>
                </div>
              )}
            </div>

            {/* Active filter chips */}
            {(allExcluded.length > 0 || filters.tags.length > 0 || filters.brands.length > 0 || filters.maxSugar < 50 || filters.maxSodium < 2000 || filters.minProtein > 0 || filters.onSale) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 16, padding: '12px 0' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#6B7A6E', letterSpacing: '0.05em' }}>ì ì© íí°</span>
                {allExcluded.map(a => (
                  <Chip key={a} tone="danger" onRemove={() => setFilters({ ...filters, excludeAllergens: filters.excludeAllergens.filter(x => x !== a), activeAllergyGroups: filters.activeAllergyGroups })}>
                    <AllergenIcon name={a} size={11} danger/> {a} ì ì¸
                  </Chip>
                ))}
                {filters.brands.map(b => <Chip key={b} onRemove={() => setFilters({ ...filters, brands: filters.brands.filter(x => x !== b) })}>{b}</Chip>)}
                {filters.tags.map(t => <Chip key={t} onRemove={() => setFilters({ ...filters, tags: filters.tags.filter(x => x !== t) })}>#{t}</Chip>)}
                {filters.maxSugar < 50 && <Chip onRemove={() => setFilters({ ...filters, maxSugar: 50 })}>ë¹ë¥ â¤ {filters.maxSugar}g</Chip>}
                {filters.maxSodium < 2000 && <Chip onRemove={() => setFilters({ ...filters, maxSodium: 2000 })}>ëí¸ë¥¨ â¤ {filters.maxSodium}mg</Chip>}
                {filters.minProtein > 0 && <Chip onRemove={() => setFilters({ ...filters, minProtein: 0 })}>ë¨ë°±ì§ â¥ {filters.minProtein}g</Chip>}
                {filters.onSale && <Chip onRemove={() => setFilters({ ...filters, onSale: false })}>í ì¸ ìíë§</Chip>}
              </div>
            )}

            {/* Sort + view bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, paddingBottom: 14, borderBottom: '1px solid #E5E7E1' }}>
              <div style={{ display: 'flex', gap: 4 }}>
                {[
                  { id: 'relevance', label: 'ê´ë ¨ëì' },
                  { id: 'popular', label: 'ì¸ê¸°ì' },
                  { id: 'new', label: 'ì ìíì' },
                  { id: 'priceLow', label: 'ë®ì ê°ê²©ì' },
                  { id: 'priceHigh', label: 'ëì ê°ê²©ì' },
                  { id: 'rating', label: 'íì ì' },
                  { id: 'protein', label: 'ë¨ë°±ì§ ëìì' }
                ].map(s => (
                  <button key={s.id} onClick={() => setSort(s.id)} style={{
                    padding: '6px 10px', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                    fontSize: 13, fontWeight: sort === s.id ? 700 : 500,
                    color: sort === s.id ? '#0F1E12' : '#6B7A6E',
                    display: 'flex', alignItems: 'center', gap: 4
                  }}>
                    {sort === s.id && <span style={{ width: 4, height: 4, background: '#1F4D2C', borderRadius: 999 }}/>}
                    {s.label}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="tabular" style={{ fontSize: 12, color: '#6B7A6E' }}>ì´ <strong style={{ color: '#0F1E12' }}>{results.length}</strong>ê°</span>
                <div style={{ display: 'flex', border: '1px solid #E5E7E1', borderRadius: 6, overflow: 'hidden' }}>
                  <button onClick={() => setView('grid')} style={viewBtn(view === 'grid')}><Icon.Grid size={14} stroke={view === 'grid' ? '#fff' : '#6B7A6E'}/></button>
                  <button onClick={() => setView('list')} style={viewBtn(view === 'list')}><Icon.List size={14} stroke={view === 'list' ? '#fff' : '#6B7A6E'}/></button>
                </div>
              </div>
            </div>

            {/* Results */}
            {results.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 20px', background: '#fff', borderRadius: 12 }}>
                <Icon.Search size={40} stroke="#C9CFC4"/>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#3A4A3F', marginTop: 16 }}>ì¡°ê±´ì ë§ë ìíì´ ììµëë¤</div>
                <div style={{ fontSize: 13, color: '#6B7A6E', marginTop: 6 }}>íí°ë¥¼ ì¡°ì í´ ë¤ì ìëí´ ë³´ì¸ì.</div>
              </div>
            ) : view === 'grid' ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
                {results.map(p => <ProductCard key={p.id} product={p} user={user} onClick={() => onProduct(p)}/>)}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {results.map(p => <ListRow key={p.id} product={p} user={user} onClick={() => onProduct(p)} excluded={allExcluded}/>)}
              </div>
            )}

            {/* Pagination */}
            {results.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 40 }}>
                <button style={pageBtn(false)}>â¹</button>
                {[1,2,3,4,5].map(n => <button key={n} onClick={() => setPage(n)} style={pageBtn(page === n)}>{n}</button>)}
                <button style={pageBtn(false)}>âº</button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

const ListRow = ({ product, user, onClick, excluded }) => {
  const isDanger = product.allergens.some(a => excluded.includes(a));
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  return (
    <div onClick={onClick} style={{ display: 'flex', gap: 18, padding: 14, background: '#fff', border: '1px solid ' + (isDanger ? '#FCD7D7' : '#E5E7E1'), borderRadius: 12, cursor: 'pointer' }}>
      <img src={product.img} alt="" style={{ width: 140, height: 140, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }}/>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 12, color: '#6B7A6E', fontWeight: 600 }}>{product.brand}</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#0F1E12', marginTop: 4 }}>{product.name}</div>
        <div style={{ display: 'flex', gap: 4, marginTop: 8, flexWrap: 'wrap' }}>
          {product.tags.map(t => (
            <span key={t} style={{ padding: '2px 7px', background: '#F4F5F1', color: '#3A4A3F', borderRadius: 4, fontSize: 10, fontWeight: 600 }}>{t}</span>
          ))}
        </div>
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#6B7A6E' }}>
            <Icon.Star size={12} stroke="#E89B26" filled/>
            <span className="tabular" style={{ fontWeight: 700, color: '#0F1E12' }}>{product.rating}</span>
            <span>({product.reviews})</span>
          </div>
          <span style={{ width: 1, height: 10, background: '#E5E7E1' }}/>
          <span style={{ fontSize: 12, color: '#1F4D2C', fontWeight: 600 }}><Icon.Truck size={12} stroke="#1F4D2C"/> {product.delivery}</span>
          {isDanger && <span style={{ marginLeft: 'auto', padding: '3px 8px', background: '#FEF2F2', color: '#B71C1C', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>ìë ë¥´ê¸° ì£¼ì</span>}
        </div>
      </div>
      <div style={{ width: 140, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end' }}>
        {discount > 0 && <span className="tabular" style={{ fontSize: 12, color: '#9AA89D', textDecoration: 'line-through' }}>{product.originalPrice.toLocaleString()}ì</span>}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          {discount > 0 && <span className="tabular" style={{ fontSize: 18, fontWeight: 800, color: '#D32F2F' }}>{discount}%</span>}
          <span className="tabular" style={{ fontSize: 20, fontWeight: 800, color: '#0F1E12' }}>{product.price.toLocaleString()}<span style={{ fontSize: 12, marginLeft: 2 }}>ì</span></span>
        </div>
        <Button variant="secondary" size="sm" style={{ marginTop: 10 }}>ì¥ë°êµ¬ë</Button>
      </div>
    </div>
  );
};

const Chip = ({ children, tone, onRemove }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 4,
    padding: '4px 8px 4px 10px',
    background: tone === 'danger' ? '#FBF1F0' : '#fff',
    border: '1px solid ' + (tone === 'danger' ? '#F3D7D4' : '#E5E7E1'),
    color: tone === 'danger' ? '#8E2A24' : '#3A4A3F',
    borderRadius: 999, fontSize: 12, fontWeight: 600
  }}>
    {children}
    <button onClick={onRemove} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', padding: 0, marginLeft: 2 }}>
      <Icon.X size={11} stroke={tone === 'danger' ? '#8E2A24' : '#9AA89D'}/>
    </button>
  </span>
);

const Toggle = ({ on, onClick }) => (
  <button onClick={onClick} style={{
    width: 32, height: 18, borderRadius: 999, border: 'none', cursor: 'pointer', position: 'relative', flexShrink: 0,
    background: on ? '#1F4D2C' : '#C9CFC4'
  }}>
    <span style={{ position: 'absolute', top: 2, left: on ? 16 : 2, width: 14, height: 14, background: '#fff', borderRadius: 999, transition: 'left 150ms' }}/>
  </button>
);

const FilterSection = ({ title, children, last }) => (
  <div style={{ paddingBottom: 14, marginBottom: 14, borderBottom: last ? 'none' : '1px solid #F4F5F1' }}>
    <div style={{ fontSize: 11, fontWeight: 800, color: '#3A4A3F', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 10 }}>{title}</div>
    {children}
  </div>
);

const SliderControl = ({ label, value, max, step = 1, unit, onChange }) => (
  <div style={{ marginBottom: 12 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
      <span style={{ fontSize: 11, color: '#3A4A3F' }}>{label}</span>
      <span className="tabular" style={{ fontSize: 11, fontWeight: 700, color: '#0F1E12' }}>{value}{unit}</span>
    </div>
    <input type="range" min={0} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))}
      style={{ width: '100%', accentColor: '#1F4D2C', height: 4 }}/>
  </div>
);

const checkRow = { display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', fontSize: 12, cursor: 'pointer' };
const priceInput = { flex: 1, padding: '5px 8px', border: '1px solid #E5E7E1', borderRadius: 4, fontFamily: 'inherit', fontSize: 11, textAlign: 'right', width: 80 };
const viewBtn = (on) => ({ width: 28, height: 28, border: 'none', cursor: 'pointer', background: on ? '#0F1E12' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' });
const pageBtn = (on) => ({
  width: 32, height: 32, border: '1px solid ' + (on ? '#0F1E12' : '#E5E7E1'),
  background: on ? '#0F1E12' : '#fff', color: on ? '#fff' : '#3A4A3F',
  cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, borderRadius: 6
});

