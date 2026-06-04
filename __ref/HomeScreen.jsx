// HomeScreen â full e-commerce home (Kurly/Oasis hybrid)
window.HomeScreen = ({ user, loggedIn, onProduct, onSignup, onSearch }) => {
  const d = window.PF_DATA;
  const [heroIdx, setHeroIdx] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [activeCat, setActiveCat] = React.useState('all');
  const [countdown, setCountdown] = React.useState({ h: 2, m: 34, s: 12 });

  // Bright editorial hero slides â split layout (text panel + product image)
  const HERO = [
    {
      id: 'h1',
      tag: 'CURATED',
      kicker: 'ìë ë¥´ê¸° ìì  ë¼ì¸ì',
      title: 'ìì° ìì´ë\
ë¤ì±ë¡ì´ í ë¼',
      desc: 'ê°ê°ë¥ ìë ë¥´ê¸° íì 1ë§ ëªì´ ì§ì  ê³ ë¥¸ ìì  ìí 320ì ',
      cta: 'ìì  ë¼ì¸ì ë³´ê¸°',
      img: 'https://images.unsplash.com/photo-1543353071-873f17a7a088?w=1200&q=85&auto=format&fit=crop',
      bg: '#F0F6F1', accent: '#1F4D2C', textColor: '#0F1E12', meta: '5/12 ~ 5/18'
    },
    {
      id: 'h2',
      tag: 'ì£¼ê° í ì¸',
      kicker: 'ë¹ë¨ ì¼ì´ ë¼ì¸ì',
      title: 'ì ë¹Â·ì GI ìí\
ìµë 35% í ì¸',
      desc: 'ìë£ì§ ìë¬¸ ìì ê¸°ì¤ ì ì© Â· 28ì¢ íì  í¹ê°',
      cta: 'í¹ê° ë³´ë¬ê°ê¸°',
      img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&q=85&auto=format&fit=crop',
      bg: '#FFF8EC', accent: '#B97308', textColor: '#0F1E12', meta: '~ 6/12'
    },
    {
      id: 'h3',
      tag: 'NEW',
      kicker: 'ìë¦¬ì ì¸ì¦ ë¼ì¸',
      title: 'êµ­ë´ ì ì¼\
ê¸ë£¨ííë¦¬ 28ì¢',
      desc: 'ìë£ì§ ìë¬¸ ìë£ Â· ì²« ìì  ê¸°ë ë¬´ë£ ë°°ì¡',
      cta: 'ëë¬ë³´ê¸°',
      img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=85&auto=format&fit=crop',
      bg: '#FAFAE5', accent: '#1F4D2C', textColor: '#0F1E12', meta: 'ì ê·'
    },
    {
      id: 'h4',
      tag: 'PB',
      kicker: 'pickfood ìê·¸ëì²',
      title: 'ë¬´í­ìì  ë­ê°ì´ì´\
22% ì²« ì¶ì',
      desc: 'ì ì§ë°©Â·ê³ ë¨ë°± PB ë¼ì¸ Â· ë¨ 7ì¼',
      cta: 'ì ìí ë³´ë¬ê°ê¸°',
      img: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=1200&q=85&auto=format&fit=crop',
      bg: '#FFEFE5', accent: '#D55A2C', textColor: '#0F1E12', meta: '~ 5/19'
    }
  ];

  // Auto rotate hero
  React.useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setHeroIdx(i => (i + 1) % HERO.length), 5500);
    return () => clearInterval(t);
  }, [paused]);

  // Countdown ticker
  React.useEffect(() => {
    const t = setInterval(() => setCountdown(c => {
      let s = c.s - 1, m = c.m, h = c.h;
      if (s < 0) { s = 59; m--; }
      if (m < 0) { m = 59; h--; }
      if (h < 0) { h = 23; }
      return { h, m, s };
    }), 1000);
    return () => clearInterval(t);
  }, []);

  // Personalization
  const activeAllergens = loggedIn ? (user.activeAllergyGroups || []).flatMap(gid =>
    (d.allergyGroups.find(g => g.id === gid)?.allergens || []).map(aid => d.allergens.find(a => a.id === aid)?.name)
  ).filter(Boolean) : [];
  const safe = d.products.filter(p => !p.allergens.some(a => activeAllergens.includes(a)));
  const danger = d.products.filter(p => p.allergens.some(a => activeAllergens.includes(a)));

  const dealProducts = d.products.filter(p => p.badge === 'deal' || (p.originalPrice && p.price / p.originalPrice < 0.85));
  const recommended = (loggedIn ? safe : d.products).filter(p => p.badge === 'recommended');
  const best = [...d.products].sort((a, b) => b.reviews - a.reviews).slice(0, 8);
  const newArrivals = d.products.slice(8, 14);

  const filteredByCat = activeCat === 'all' ? d.products : d.products.filter(p => p.cat === activeCat);
  const slide = HERO[heroIdx];

  return (
    <div style={{ background: '#FFFFFF', paddingBottom: 80 }}>

      {/* Category bar */}
      <CategoryBar cats={d.categories} active={activeCat} onChange={setActiveCat}/>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 40px 0' }}>

        {/* Hero carousel + side promos */}
        <section style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16, marginBottom: 36 }}>
          {/* Main rotating â bright split layout */}
          <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            style={{
              position: 'relative', borderRadius: 16, overflow: 'hidden', aspectRatio: '16/7',
              background: slide.bg, transition: 'background 600ms ease',
              border: '1px solid rgba(15,30,18,0.05)'
            }}>
            <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1fr 1.05fr' }}>
              {/* Left text panel */}
              <div key={slide.id + '-txt'} className="pf-fade-in" style={{
                padding: '52px 0 52px 56px',
                display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14,
                color: slide.textColor, position: 'relative', zIndex: 1
              }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '5px 12px', background: '#fff', color: slide.accent, borderRadius: 999,
                  fontSize: 11, fontWeight: 800, alignSelf: 'flex-start', letterSpacing: '0.06em',
                  border: '1px solid rgba(15,30,18,0.06)', boxShadow: '0 1px 2px rgba(15,30,18,0.04)'
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: 999, background: slide.accent }}/>
                  {slide.tag}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: slide.accent, letterSpacing: '-0.005em' }}>{slide.kicker}</div>
                <h1 style={{
                  fontSize: 46, fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.03em',
                  whiteSpace: 'pre-line', marginTop: -2
                }}>{slide.title}</h1>
                <p style={{ fontSize: 14, color: 'rgba(15,30,18,0.65)', lineHeight: 1.55, maxWidth: 360 }}>{slide.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 8 }}>
                  <button style={{
                    background: '#0F1E12', color: '#fff', border: 'none', borderRadius: 8,
                    padding: '12px 22px', fontFamily: 'inherit', fontSize: 14, fontWeight: 700,
                    cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6
                  }}>{slide.cta} <Icon.ChevronRight size={14} stroke="#fff"/></button>
                  <span className="tabular" style={{ fontSize: 11, color: 'rgba(15,30,18,0.5)', fontWeight: 600 }}>{slide.meta}</span>
                </div>
              </div>
              {/* Right image panel */}
              <div style={{ position: 'relative', overflow: 'hidden' }}>
                {HERO.map((h, i) => (
                  <img key={h.id} src={h.img} alt="" style={{
                    position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
                    opacity: i === heroIdx ? 1 : 0,
                    transform: i === heroIdx ? 'scale(1)' : 'scale(1.04)',
                    transition: 'opacity 600ms ease, transform 700ms ease',
                    clipPath: 'polygon(8% 0, 100% 0, 100% 100%, 0 100%)'
                  }}/>
                ))}
              </div>
            </div>

            {/* Arrows */}
            <button onClick={() => setHeroIdx((heroIdx - 1 + HERO.length) % HERO.length)} style={{
              position: 'absolute', left: 14, bottom: 14,
              width: 36, height: 36, borderRadius: 999, border: '1px solid rgba(15,30,18,0.08)',
              background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2
            }}><Icon.ChevronLeft size={16} stroke="#0F1E12"/></button>
            <button onClick={() => setHeroIdx((heroIdx + 1) % HERO.length)} style={{
              position: 'absolute', left: 56, bottom: 14,
              width: 36, height: 36, borderRadius: 999, border: '1px solid rgba(15,30,18,0.08)',
              background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2
            }}><Icon.ChevronRight size={16} stroke="#0F1E12"/></button>

            {/* Counter pill */}
            <div className="tabular" style={{
              position: 'absolute', bottom: 18, right: 18, padding: '6px 12px',
              background: 'rgba(15,30,18,0.08)', backdropFilter: 'blur(6px)',
              borderRadius: 999, fontSize: 11, fontWeight: 700, color: '#0F1E12', zIndex: 2,
              display: 'flex', alignItems: 'center', gap: 8
            }}>
              <span style={{ color: '#0F1E12' }}>{String(heroIdx + 1).padStart(2,'0')}</span>
              <span style={{ width: 30, height: 2, background: 'rgba(15,30,18,0.15)', borderRadius: 1, position: 'relative', overflow: 'hidden' }}>
                <span key={heroIdx + (paused ? '-p' : '')} style={{
                  position: 'absolute', inset: 0, background: slide.accent,
                  width: paused ? '40%' : '100%',
                  animation: paused ? 'none' : 'pfBarFill 5.5s linear forwards'
                }}/>
              </span>
              <span style={{ color: 'rgba(15,30,18,0.5)' }}>{String(HERO.length).padStart(2,'0')}</span>
            </div>
          </div>

          {/* Side promos */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SidePromo
              bg="#FFF8EC" accent="#B97308"
              kicker={`ìê° í¹ê° Â· ${String(countdown.h).padStart(2,'0')}:${String(countdown.m).padStart(2,'0')}:${String(countdown.s).padStart(2,'0')}`}
              title="íë¯¸ì¡ê³¡ë°¥ 22% í ì¸"
              desc="ì ë¹Â·ê³ ì¬ì  ë² ì¤í¸ìë¬ Â· ë¨ 24ìê°"
              img={d.products[2].img}
              cta="í¹ê° ë³´ê¸°"
            />
            <SidePromo
              bg="#F0F6F1" accent="#1F4D2C"
              kicker={loggedIn ? 'ë§ì¶¤ ì¶ì²' : 'ì ê· íì íí'}
              title={loggedIn ? `ì¤ë ìì  ìí ${safe.length}ê°` : 'ì²« ì£¼ë¬¸ 5,000ì'}
              desc={loggedIn ? 'ë°í¬ìë íë¡í ê¸°ì¤ ìì  ê²ì¦ ìë£' : 'ìë ë¥´ê¸°Â·ì§ë³ íë¡í ë±ë¡ ì ìë ì ì©'}
              img={d.products[4].img}
              cta={loggedIn ? 'ë§ì¶¤ ë³´ê¸°' : 'íìê°ì'}
            />
          </div>
        </section>

        {/* Personalized safety banner (logged in only) */}
        {loggedIn && (
          <section style={{
            background: '#fff', border: '1px solid #E5E7E1', borderRadius: 12,
            padding: '18px 22px', marginBottom: 32,
            display: 'flex', alignItems: 'center', gap: 20
          }}>
            <div style={{ width: 44, height: 44, borderRadius: 999, background: '#0F1E12', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon.Shield size={22} stroke="#A8E063"/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0F1E12' }}>ë°í¬ìë ìì  íí° ì ì© ì¤</div>
              <div style={{ fontSize: 12, color: '#6B7A6E', marginTop: 2 }}>
                ìì°Â·ê² ìë ë¥´ê¸° / ë¹ë¨ ì¼ì´ Â· ì ì²´ {d.products.length}ê° ì¤ <strong style={{ color: '#1F6B45' }}>{safe.length}ê° ìì </strong>, <strong style={{ color: '#B71C1C' }}>{danger.length}ê° ì£¼ì</strong>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <FilterTag><Icon.Shrimp size={13}/> ìì° ì ì¸</FilterTag>
              <FilterTag><Icon.Crab size={13}/> ê² ì ì¸</FilterTag>
              <FilterTag><Icon.Diabetes size={13}/> ë¹ë¨ ì¼ì´</FilterTag>
            </div>
            <button style={{ padding: '8px 14px', border: '1px solid #E5E7E1', borderRadius: 8, background: '#fff', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, color: '#3A4A3F', cursor: 'pointer' }}>íí° ê´ë¦¬</button>
          </section>
        )}

        {/* Guest education (when logged out) */}
        {!loggedIn && (
          <section style={{ marginBottom: 36 }}>
            <SectionHeader kicker="ìì½ì² íì ëì" title="ìì£¼ ëì¹ë ìë ë¥´ê¸° ìì¬ë£ 15ì¢" desc="ê°ê³µìí ë¼ë²¨ìì ìì£¼ ëë½ëë ìì¬ë£ìëë¤. íë¡íì ë±ë¡íë©´ ìëì¼ë¡ ê±¸ë¬ì§ëë¤."/>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 10 }}>
              {d.allergens.slice(0, 8).map(a => (
                <div key={a.id} style={{
                  background: '#fff', border: '1px solid #E5E7E1', borderRadius: 10, padding: 14,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8
                }}>
                  <AllergenIcon name={a.name} size={32}/>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>{a.name}</div>
                  <div style={{ fontSize: 10, color: '#9AA89D', fontFamily: 'var(--font-mono)' }} className="tabular">{d.products.filter(p => p.allergens.includes(a.name)).length}ê° ìí</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Time Deal section */}
        <section style={{ marginBottom: 44 }}>
          <SectionHeader
            kicker={<span style={{ color: '#1F4D2C' }}>â± TIME DEAL</span>}
            title="ëì¹ë©´ íííë ìê° í¹ê°"
            desc={`${String(countdown.h).padStart(2,'0')}:${String(countdown.m).padStart(2,'0')}:${String(countdown.s).padStart(2,'0')} í ì¢ë£`}
            right={<Button variant="ghost" size="sm" icon={<Icon.ChevronRight size={14} stroke="#1F4D2C"/>}>ì ì²´ë³´ê¸°</Button>}
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
            {dealProducts.slice(0, 5).map(p => <ProductCard key={p.id} product={p} user={loggedIn ? user : null} onClick={() => onProduct(p)}/>)}
          </div>
        </section>

        {/* Personalized picks OR recommended */}
        <section style={{ marginBottom: 44 }}>
          <SectionHeader
            kicker={loggedIn ? 'ë°í¬ìë PICK' : 'í¸ì§ì¥ ì¶ì²'}
            title={loggedIn ? 'íìëê» ìì í ë§ì¶¤ ìí' : 'ì´ë² ì£¼ ìëí°ê° ê³ ë¥¸ ìí'}
            desc={loggedIn ? 'ìë ë¥´ê¸°Â·ì§ë³ì ëª¨ë íµê³¼í ìíë§ ëª¨ììµëë¤' : 'ììê³¼ ìì  ê¸°ì¤ì¼ë¡ ê²ì¦ë ìíìëë¤'}
            right={<Button variant="ghost" size="sm" icon={<Icon.ChevronRight size={14} stroke="#1F4D2C"/>}>ì ì²´ë³´ê¸°</Button>}
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
            {recommended.slice(0, 5).map(p => <ProductCard key={p.id} product={p} user={loggedIn ? user : null} onClick={() => onProduct(p)}/>)}
          </div>
        </section>

        {/* Brand showcase */}
        <section style={{ marginBottom: 44 }}>
          <SectionHeader kicker="ìì  ë¸ëë" title="ì ë¢°í  ì ìë ìí ë¸ëë" desc="ìì ì±Â·ì¸ì¦Â·ìì°ì§ë¥¼ ëª¨ë ê²ì¦í íí¸ë ë¸ëëìëë¤."/>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
            {d.brands.map(b => (
              <div key={b.id} style={{
                background: '#fff', borderRadius: 12, overflow: 'hidden',
                border: '1px solid #E5E7E1', cursor: 'pointer'
              }}>
                <div style={{ aspectRatio: '4/3', position: 'relative', overflow: 'hidden' }}>
                  <img src={b.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.85)' }}/>
                  <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, transparent 40%, ${b.accent}E6)` }}/>
                  <div style={{ position: 'absolute', bottom: 10, left: 12, color: '#fff' }}>
                    <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: '-0.01em' }}>{b.name}</div>
                    <div style={{ fontSize: 10, opacity: 0.85, marginTop: 1 }}>{b.tag}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Best sellers â horizontal scroll */}
        <section style={{ marginBottom: 44 }}>
          <SectionHeader
            kicker="BEST"
            title="ì´ë² ì£¼ ë² ì¤í¸ ìë¬"
            desc="ê°ì¥ ë§ì´ ì£¼ë¬¸ë ìí TOP 8"
            right={<Button variant="ghost" size="sm" icon={<Icon.ChevronRight size={14} stroke="#1F4D2C"/>}>ì ì²´ë³´ê¸°</Button>}
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 12 }}>
            {best.map((p, i) => (
              <div key={p.id} style={{ position: 'relative', cursor: 'pointer' }} onClick={() => onProduct(p)}>
                <div style={{ position: 'relative', aspectRatio: '1/1', borderRadius: 8, overflow: 'hidden', background: '#F4F5F1' }}>
                  <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                  <div className="tabular" style={{
                    position: 'absolute', top: 6, left: 6, width: 24, height: 24,
                    background: i < 3 ? '#0F1E12' : '#fff',
                    color: i < 3 ? '#A8E063' : '#0F1E12',
                    fontSize: 12, fontWeight: 800, borderRadius: 4,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>{i + 1}</div>
                </div>
                <div style={{ fontSize: 11, color: '#6B7A6E', marginTop: 8, fontWeight: 600 }}>{p.brand}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#0F1E12', lineHeight: 1.3, marginTop: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.name}</div>
                <div className="tabular" style={{ fontSize: 13, fontWeight: 800, color: '#0F1E12', marginTop: 4 }}>{p.price.toLocaleString()}ì</div>
              </div>
            ))}
          </div>
        </section>

        {/* New arrivals */}
        <section style={{ marginBottom: 44 }}>
          <SectionHeader
            kicker="NEW"
            title="ìë¡ ë¤ì´ì¨ ì ìí"
            desc="ê²ì¦ì ê° ë§ì¹ê³  ìì í ìíì ê°ì¥ ë¨¼ì  ë§ëë³´ì¸ì"
            right={<Button variant="ghost" size="sm" icon={<Icon.ChevronRight size={14} stroke="#1F4D2C"/>}>ì ì²´ë³´ê¸°</Button>}
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
            {newArrivals.map(p => <ProductCard key={p.id} product={p} user={loggedIn ? user : null} onClick={() => onProduct(p)}/>)}
          </div>
        </section>

        {/* Category browse */}
        <section style={{ marginBottom: 32 }}>
          <SectionHeader kicker="ì¹´íê³ ë¦¬" title="ìíë ì¹´íê³ ë¦¬ìì ê³¨ë¼ë³´ê¸°" desc="ìì  íí°ë ëª¨ë  ì¹´íê³ ë¦¬ì ì ì©ë©ëë¤"/>
          <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
            {d.categories.map(c => (
              <button key={c.id} onClick={() => setActiveCat(c.id)} style={{
                padding: '8px 14px', borderRadius: 999,
                border: '1px solid ' + (activeCat === c.id ? '#1F4D2C' : '#E5E7E1'),
                background: activeCat === c.id ? '#1F4D2C' : '#fff',
                color: activeCat === c.id ? '#fff' : '#3A4A3F',
                fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer'
              }}>{c.name}</button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
            {filteredByCat.slice(0, 10).map(p => <ProductCard key={p.id} product={p} user={loggedIn ? user : null} onClick={() => onProduct(p)}/>)}
          </div>
        </section>

        {/* Trust strip */}
        <section style={{
          background: '#fff', borderRadius: 12, padding: '28px 32px', marginTop: 32,
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24,
          border: '1px solid #E5E7E1'
        }}>
          <TrustItem icon={<Icon.Shield size={26} stroke="#1F4D2C"/>} title="ìì½ì² íì ëì ìë ê²ì¦" desc="15ì¢ ìë ë¥´ê¸° ìì¬ë£ë¥¼ ë¼ë²¨ìì ìë ì¶ì¶"/>
          <TrustItem icon={<Icon.Check size={26} stroke="#1F4D2C"/>} title="ìë£ ìë¬¸ ìì ê¸°ì¤" desc="9ê° ë§ì±ì§í ìì ê°ì´ëë¥¼ ìë£ì§ê³¼ í¨ê» ìì±"/>
          <TrustItem icon={<Icon.Truck size={26} stroke="#1F4D2C"/>} title="ìì¬ ë°°ì¡" desc="ì½ëì²´ì¸ì¼ë¡ ì ì ë ì ì§ Â· ìì í í¬ì¥ì¬ ì¬ì©"/>
          <TrustItem icon={<Icon.Lock size={26} stroke="#1F4D2C"/>} title="ê°ì¸ ê±´ê°ì ë³´ ìí¸í" desc="ìë ë¥´ê¸°Â·ì§ë³ ë°ì´í°ë KISA ì¸ì¦ ìí¸í ì ì¥"/>
        </section>

      </div>
    </div>
  );
};

// ============== sub-components ==============
const CategoryBar = ({ cats, active, onChange }) => (
  <div style={{ background: '#fff', borderBottom: '1px solid #E5E7E1' }}>
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px', display: 'flex', gap: 4 }}>
      {cats.map(c => (
        <button key={c.id} onClick={() => onChange(c.id)} style={{
          padding: '16px 18px', fontFamily: 'inherit', fontSize: 14, fontWeight: active === c.id ? 700 : 500,
          color: active === c.id ? '#1F4D2C' : '#3A4A3F',
          background: 'transparent', border: 'none', cursor: 'pointer',
          borderBottom: '2px solid ' + (active === c.id ? '#1F4D2C' : 'transparent'),
          whiteSpace: 'nowrap'
        }}>{c.name}</button>
      ))}
    </div>
  </div>
);

const SidePromo = ({ bg, accent, kicker, title, desc, img, cta, dark }) => (
  <div className="pf-hover-lift" style={{
    background: bg, borderRadius: 14, padding: 16, display: 'flex', gap: 14,
    alignItems: 'center', flex: 1, cursor: 'pointer', overflow: 'hidden', position: 'relative',
    border: dark ? 'none' : '1px solid rgba(15,30,18,0.05)', minHeight: 0
  }}>
    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 5, alignSelf: 'flex-start',
        padding: '3px 8px',
        background: dark ? 'rgba(0,0,0,0.35)' : '#fff',
        color: accent,
        borderRadius: 999, fontSize: 10, fontWeight: 800, letterSpacing: '0.04em',
        border: dark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(15,30,18,0.06)',
        marginBottom: 2
      }}>
        <span style={{ width: 4, height: 4, borderRadius: 999, background: accent }}/>
        {kicker}
      </div>
      <div style={{ fontSize: 17, fontWeight: 800, color: dark ? '#fff' : '#0F1E12', letterSpacing: '-0.02em', lineHeight: 1.2 }}>{title}</div>
      <div style={{ fontSize: 11.5, color: dark ? 'rgba(255,255,255,0.7)' : '#6B7A6E', lineHeight: 1.45 }}>{desc}</div>
      {cta && (
        <div style={{ marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 11, fontWeight: 700, color: accent }}>
          {cta} <Icon.ChevronRight size={11} stroke={accent}/>
        </div>
      )}
    </div>
    <div style={{ width: 92, height: 92, borderRadius: 12, overflow: 'hidden', flexShrink: 0, position: 'relative', boxShadow: '0 4px 12px rgba(15,30,18,0.06)' }}>
      <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
    </div>
  </div>
);

const FilterTag = ({ children }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 4,
    padding: '4px 10px', background: '#F0F6F1', color: '#1F4D2C',
    borderRadius: 999, fontSize: 12, fontWeight: 600
  }}>{children}</span>
);

const TrustItem = ({ icon, title, desc }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <div style={{ width: 44, height: 44, borderRadius: 10, background: '#F0F6F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
    <div style={{ fontSize: 13, fontWeight: 700, color: '#0F1E12' }}>{title}</div>
    <div style={{ fontSize: 12, color: '#6B7A6E', lineHeight: 1.5 }}>{desc}</div>
  </div>
);

const SectionHeader = ({ kicker, title, desc, right }) => (
  <div style={{ marginBottom: 18, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
    <div>
      {kicker && <div style={{ fontSize: 11, fontWeight: 800, color: '#6B7A6E', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>{kicker}</div>}
      <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0F1E12', letterSpacing: '-0.02em' }}>{title}</h2>
      {desc && <p style={{ fontSize: 13, color: '#6B7A6E', marginTop: 4, lineHeight: 1.5 }}>{desc}</p>}
    </div>
    {right}
  </div>
);

