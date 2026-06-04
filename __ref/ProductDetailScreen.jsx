// ProductDetailScreen â full e-commerce style (Kurly/Coupang hybrid)
window.ProductDetailScreen = ({ product, user, loggedIn, onBack, onProduct }) => {
  const d = window.PF_DATA;
  const [qty, setQty] = React.useState(1);
  const [tab, setTab] = React.useState('description');
  const [imgIdx, setImgIdx] = React.useState(0);
  const [reviewFilter, setReviewFilter] = React.useState('all');
  const [entryAlertOpen, setEntryAlertOpen] = React.useState(true);
  const wishlist = PF_STORE.use(s => s.wishlist);
  const wished = wishlist.includes(product.id);

  // Build a synthetic gallery from related product images
  const gallery = [product.img, ...d.products.filter(p => p.id !== product.id && p.cat === product.cat).slice(0, 3).map(p => p.img)];
  while (gallery.length < 4) gallery.push(product.img);

  const activeAllergenNames = loggedIn ? (user.activeAllergyGroups || []).flatMap(gid =>
    (d.allergyGroups.find(g => g.id === gid)?.allergens || []).map(aid => d.allergens.find(a => a.id === aid)?.name)
  ).filter(Boolean) : [];
  const activeDiseaseNames = loggedIn ? (user.activeDiseaseGroups || []).flatMap(gid =>
    (d.diseaseGroups.find(g => g.id === gid)?.diseases || []).map(did => d.diseases.find(x => x.id === did)?.name)
  ).filter(Boolean) : [];

  const allergyHits = product.allergens.filter(a => activeAllergenNames.includes(a));
  const isDanger = allergyHits.length > 0;
  const diseaseWarnings = [];
  if (activeDiseaseNames.includes('ë¹ë¨') && product.nutrition.sugar > 6) diseaseWarnings.push({ disease: 'ë¹ë¨', reason: `ë¹ë¥ ${product.nutrition.sugar}g (1ì¼ ê¶ì¥ 50g ê¸°ì¤ ${Math.round(product.nutrition.sugar/50*100)}%)` });
  if (activeDiseaseNames.includes('ê³ ì§íì¦') && product.nutrition.fat > 20) diseaseWarnings.push({ disease: 'ê³ ì§íì¦', reason: `ì§ë°© ${product.nutrition.fat}g Â· í¬íì§ë°© ë¤ë ê°ë¥ì±` });
  if (activeDiseaseNames.includes('ê³ íì') && product.nutrition.sodium > 500) diseaseWarnings.push({ disease: 'ê³ íì', reason: `ëí¸ë¥¨ ${product.nutrition.sodium}mg (1ì¼ ê¶ì¥ 2,000mg ê¸°ì¤ ${Math.round(product.nutrition.sodium/2000*100)}%)` });

  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  const finalPrice = product.price * qty;

  const related = d.products.filter(p => p.id !== product.id && p.cat === product.cat).slice(0, 5);
  const sameBrand = d.products.filter(p => p.brand === product.brand && p.id !== product.id).slice(0, 4);

  const riskCount = allergyHits.length + diseaseWarnings.length;
  const shouldShowEntryAlert = loggedIn && riskCount > 0 && entryAlertOpen;
  const [bellRinging, setBellRinging] = React.useState(false);

  React.useEffect(() => {
    setEntryAlertOpen(true);
    setTab('description');
    setImgIdx(0);
    if (riskCount > 0 && loggedIn) {
      setBellRinging(true);
      setTimeout(() => setBellRinging(false), 1800);
    }
  }, [product.id]);

  const handleAddToCart = () => {
    PF_STORE.addToCart(product.id, qty, product.name);
  };
  const handleWish = () => {
    PF_STORE.toggleWishlist(product.id, product.name);
  };

  return (
    <div style={{ background: '#fff', paddingBottom: 120 }} data-screen-label="04 ìí ìì¸">

      {shouldShowEntryAlert && <EntryAlert
        allergyHits={allergyHits}
        diseaseWarnings={diseaseWarnings}
        productName={product.name}
        user={user}
        onClose={() => setEntryAlertOpen(false)}
      />}

      {/* Breadcrumb */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '20px 40px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6B7A6E' }}>
          <button onClick={onBack} style={crumbBtn}>í</button>
          <Icon.ChevronRight size={11} stroke="#C9CFC4"/>
          <button style={crumbBtn}>{d.categories.find(c => c.id === product.cat)?.name}</button>
          <Icon.ChevronRight size={11} stroke="#C9CFC4"/>
          <span style={{ color: '#0F1E12' }}>{product.brand}</span>
        </div>
      </div>

      {/* Top section */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 40px 56px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '560px 1fr', gap: 56, alignItems: 'flex-start' }}>

          {/* Left: gallery */}
          <div style={{ position: 'sticky', top: 24 }}>
            <div style={{ borderRadius: 12, overflow: 'hidden', background: '#F4F5F1', aspectRatio: '1/1', position: 'relative' }}>
              <img src={gallery[imgIdx]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}/>
              <button onClick={() => setImgIdx((imgIdx - 1 + gallery.length) % gallery.length)} style={navBtn('left')}>
                <Icon.ChevronLeft size={20} stroke="#0F1E12"/>
              </button>
              <button onClick={() => setImgIdx((imgIdx + 1) % gallery.length)} style={navBtn('right')}>
                <Icon.ChevronRight size={20} stroke="#0F1E12"/>
              </button>
              <div className="tabular" style={{
                position: 'absolute', bottom: 14, right: 14, padding: '4px 10px',
                background: 'rgba(15,30,18,0.7)', color: '#fff', borderRadius: 999,
                fontSize: 11, fontWeight: 600, backdropFilter: 'blur(8px)'
              }}>{imgIdx + 1} / {gallery.length}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 10 }}>
              {gallery.map((g, i) => (
                <button key={i} onClick={() => setImgIdx(i)} style={{
                  border: 'none', padding: 0, cursor: 'pointer',
                  borderRadius: 8, overflow: 'hidden', position: 'relative',
                  aspectRatio: '1/1', background: '#F4F5F1',
                  outline: i === imgIdx ? '2px solid #0F1E12' : 'none',
                  outlineOffset: -2
                }}>
                  <img src={g} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                </button>
              ))}
            </div>

            {/* Trust badges */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 16 }}>
              <TrustBadge icon={<Icon.Shield size={18} stroke="#1F4D2C"/>} label="HACCP ì¸ì¦"/>
              <TrustBadge icon={<Icon.Check size={18} stroke="#1F4D2C"/>} label="ìì½ì² ê²ì¦"/>
              <TrustBadge icon={<Icon.Truck size={18} stroke="#1F4D2C"/>} label="ì½ëì²´ì¸"/>
            </div>
          </div>

          {/* Right: purchase column */}
          <div>
            {/* Brand line */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#1F4D2C' }}>{product.brand}</span>
              <span style={{ width: 1, height: 10, background: '#E5E7E1' }}/>
              <button style={{ fontSize: 12, color: '#6B7A6E', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>ë¸ëë ì ì²´ ë³´ê¸° â</button>
            </div>

            {/* Title */}
            <h1 style={{ fontSize: 26, fontWeight: 700, color: '#0F1E12', marginTop: 8, letterSpacing: '-0.02em', lineHeight: 1.35, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span>{product.name}</span>
              {bellRinging && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 30, height: 30, borderRadius: 999, background: '#D32F2F',
                  flexShrink: 0,
                  boxShadow: '0 0 0 6px rgba(211,47,47,0.16)',
                  animation: 'pfBellRing 0.9s ease-in-out 2'
                }}>
                  <Icon.Bell size={16} stroke="#fff"/>
                </span>
              )}
            </h1>
            <div style={{ fontSize: 14, color: '#6B7A6E', marginTop: 6 }}>{product.tags.join(' Â· ')}</div>

            {/* Rating row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                {[1,2,3,4,5].map(i => (
                  <Icon.Star key={i} size={15} stroke={i <= Math.round(product.rating) ? '#E89B26' : '#DDE2DC'} filled/>
                ))}
                <span className="tabular" style={{ fontSize: 13, fontWeight: 700, color: '#0F1E12', marginLeft: 4 }}>{product.rating}</span>
              </div>
              <button style={{ fontSize: 13, color: '#3A4A3F', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'underline', textUnderlineOffset: 3 }}>
                íê¸° {product.reviews.toLocaleString()}ê±´ ë³´ê¸°
              </button>
              <span style={{ width: 1, height: 12, background: '#E5E7E1' }}/>
              <button style={{ fontSize: 13, color: '#3A4A3F', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                ìí ë¬¸ì
              </button>
            </div>

            {/* Price */}
            <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid #E5E7E1' }}>
              {discount > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="tabular" style={{ fontSize: 13, color: '#9AA89D', textDecoration: 'line-through' }}>{product.originalPrice.toLocaleString()}ì</span>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
                {discount > 0 && <span className="tabular" style={{ fontSize: 30, fontWeight: 800, color: '#D32F2F', letterSpacing: '-0.02em' }}>{discount}%</span>}
                <span className="tabular" style={{ fontSize: 30, fontWeight: 800, color: '#0F1E12', letterSpacing: '-0.02em' }}>
                  {product.price.toLocaleString()}<span style={{ fontSize: 16, fontWeight: 600, marginLeft: 2 }}>ì</span>
                </span>
              </div>
            </div>

            {/* Spec lines */}
            <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid #F4F5F1', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <SpecLine label="ë°°ì¡" value={
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Icon.Truck size={14} stroke="#1F4D2C"/>
                  <strong style={{ color: '#1F4D2C' }}>ìì¬ ë°°ì¡</strong> Â· {product.delivery}
                </span>
              }/>
              <SpecLine label="í¬ì¥" value="ëì¥ Â· ì¢ì´ í¬ì¥ì¬"/>
              <SpecLine label="íë§¤ë¨ì" value="1í©"/>
              <SpecLine label="ìì°ì§" value="êµ­ë´ì° (ëë: ë¯¸êµ­)"/>
              <SpecLine label="ì íµê¸°í" value="ìë ¹ì¼ë¡ë¶í° 5ì¼ ì´ì"/>
            </div>

            {/* Coupon strip */}
            <div style={{ marginTop: 18, padding: '14px 18px', background: '#F0F6F1', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: '#1F4D2C', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon.Tag size={18} stroke="#A8E063"/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1F4D2C' }}>íì ì ì© ì¿ í° 1,000ì í ì¸</div>
                <div style={{ fontSize: 11, color: '#6B7A6E', marginTop: 2 }}>ë§ì´íì´ì§ìì ë°ê¸ í ê²°ì  ì ìë ì ì©</div>
              </div>
              <Button size="sm" variant="ghost">ì¿ í° ë°ê¸°</Button>
            </div>

            {/* Qty */}
            <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #E5E7E1' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#3A4A3F' }}>ìë</span>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #C9CFC4', borderRadius: 8 }}>
                  <button onClick={() => setQty(Math.max(1, qty - 1))} style={qtyBtn}><Icon.Minus size={14} stroke="#3A4A3F"/></button>
                  <span className="tabular" style={{ minWidth: 44, textAlign: 'center', fontWeight: 700, fontSize: 14 }}>{qty}</span>
                  <button onClick={() => setQty(qty + 1)} style={qtyBtn}><Icon.Plus size={14} stroke="#3A4A3F"/></button>
                </div>
              </div>

              <div style={{ marginTop: 18, padding: '16px 18px', background: '#F4F5F1', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#3A4A3F' }}>ì´ ìíê¸ì¡</span>
                <span className="tabular" style={{ fontSize: 26, fontWeight: 800, color: '#0F1E12', letterSpacing: '-0.02em' }}>
                  {finalPrice.toLocaleString()}<span style={{ fontSize: 14, fontWeight: 600, marginLeft: 2 }}>ì</span>
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              <button onClick={handleWish} className="pf-btn" style={iconActionBtn}>
                <Icon.Heart size={22} stroke={wished ? '#D32F2F' : '#3A4A3F'} filled={wished}/>
              </button>
              <Button variant="secondary" size="lg" style={{ flex: 1 }} onClick={handleAddToCart}>ì¥ë°êµ¬ë</Button>
              <Button variant={isDanger ? 'danger' : 'primary'} size="lg" style={{ flex: 1.3 }} onClick={handleAddToCart}>
                {isDanger ? 'êµ¬ë§¤íê¸°' : 'ë°ë¡ êµ¬ë§¤íê¸°'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ position: 'sticky', top: 0, background: '#fff', borderTop: '1px solid #E5E7E1', borderBottom: '1px solid #E5E7E1', zIndex: 10 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px', display: 'flex', gap: 0 }}>
          {[
            { id: 'description', label: 'ìí ì¤ëª' },
            { id: 'safety',      label: 'ìì Â·ìì', count: product.allergens.length },
            { id: 'reviews',     label: 'íê¸°', count: product.reviews },
            { id: 'inquiry',     label: 'ìí ë¬¸ì', count: 24 },
            { id: 'delivery',    label: 'ë°°ì¡ / ë°í' }
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '18px 22px', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              fontSize: 14, fontWeight: tab === t.id ? 700 : 500,
              color: tab === t.id ? '#0F1E12' : '#6B7A6E',
              borderBottom: '2px solid ' + (tab === t.id ? '#0F1E12' : 'transparent'),
              display: 'inline-flex', alignItems: 'center', gap: 6
            }}>
              {t.label}
              {t.count != null && <span className="tabular" style={{ fontSize: 12, color: tab === t.id ? '#1F4D2C' : '#9AA89D', fontWeight: 600 }}>{t.count > 999 ? `${(t.count/1000).toFixed(1)}k` : t.count}</span>}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 40px 0' }}>
        {tab === 'description' && <DescriptionTab product={product}/>}
        {tab === 'safety' && <SafetyTab product={product} activeAllergenNames={activeAllergenNames} loggedIn={loggedIn}/>}
        {tab === 'reviews' && <ReviewsTab product={product} filter={reviewFilter} setFilter={setReviewFilter}/>}
        {tab === 'inquiry' && <InquiryTab/>}
        {tab === 'delivery' && <DeliveryTab/>}
      </div>

      {/* Related */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 40px 0' }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0F1E12', letterSpacing: '-0.02em', marginBottom: 4 }}>ì´ ìíê³¼ í¨ê» ë³¸ ìí</h2>
        <p style={{ fontSize: 13, color: '#6B7A6E', marginBottom: 20 }}>ê°ì ì¹´íê³ ë¦¬ìì ì¸ê¸° ìë ìíì ëª¨ìì´ì.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 18 }}>
          {related.map(p => <ProductCard key={p.id} product={p} user={loggedIn ? user : null} onClick={() => onProduct(p)}/>)}
        </div>
      </div>

      {sameBrand.length > 0 && (
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '56px 40px 0' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0F1E12', letterSpacing: '-0.02em', marginBottom: 4 }}>{product.brand} ë¸ëëì ë¤ë¥¸ ìí</h2>
          <p style={{ fontSize: 13, color: '#6B7A6E', marginBottom: 20 }}>ê°ì ë¸ëë ë¤ë¥¸ ë¼ì¸ì.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 18 }}>
            {sameBrand.map(p => <ProductCard key={p.id} product={p} user={loggedIn ? user : null} onClick={() => onProduct(p)}/>)}
          </div>
        </div>
      )}

      {/* Sticky bottom buy bar */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff',
        borderTop: '1px solid #E5E7E1', padding: '14px 40px', zIndex: 50,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.04)'
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 20 }}>
          <img src={product.img} alt="" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#0F1E12', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 320 }}>{product.name}</div>
            <div className="tabular" style={{ fontSize: 13, fontWeight: 700, color: '#3A4A3F', marginTop: 2 }}>{product.price.toLocaleString()}ì Ã {qty}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 12, color: '#6B7A6E' }}>í©ê³</span>
            <span className="tabular" style={{ fontSize: 22, fontWeight: 800, color: '#0F1E12' }}>{finalPrice.toLocaleString()}ì</span>
          </div>
          <button onClick={handleWish} className="pf-btn" style={iconActionBtn}><Icon.Heart size={22} stroke={wished ? '#D32F2F' : '#3A4A3F'} filled={wished}/></button>
          <Button variant="secondary" size="lg" onClick={handleAddToCart}>ì¥ë°êµ¬ë</Button>
          <Button variant={isDanger ? 'danger' : 'primary'} size="lg" onClick={handleAddToCart}>{isDanger ? 'ì£¼ì í êµ¬ë§¤' : 'ë°ë¡ êµ¬ë§¤'}</Button>
        </div>
      </div>
    </div>
  );
};

// =================== TABS ===================
const DescriptionTab = ({ product }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 56 }}>
    {/* Editorial hero */}
    <div style={{ background: '#F4F5F1', borderRadius: 16, overflow: 'hidden', position: 'relative', aspectRatio: '16/7' }}>
      <img src={product.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(15,30,18,0.7), transparent 50%)' }}/>
      <div style={{ position: 'absolute', top: '50%', left: 48, transform: 'translateY(-50%)', color: '#fff', maxWidth: 480 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#A8E063', textTransform: 'uppercase', marginBottom: 12 }}>pickfood editor's note</div>
        <h2 style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.25 }}>ë§¤ì¼ ìíì ì¬ë¼ë<br/>ë¶ë´ ìì´ ìì¬íê².</h2>
        <p style={{ fontSize: 15, marginTop: 14, lineHeight: 1.7, opacity: 0.85 }}>
          {product.brand}ì´ 30ëê° ììì¨ ë¸íì°ë¡ ë§ë  ì ì í ìí. ìë ë¥´ê¸°Â·ì§ë³ ì ë³´ê° ë¼ë²¨ í ì¤ì ë¨¸ë¬´ë¥´ì§ ìëë¡ pickfoodê° ë¤ì í ë² ê²ì¦íìµëë¤.
        </p>
      </div>
    </div>

    {/* Feature grid */}
    <div>
      <SectionTitle kicker="ì í í¹ì§" title="ì´ ìíì ê³ ë¥¸ ì´ì "/>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {product.tags.map((tag, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #E5E7E1', borderRadius: 12, padding: 24 }}>
            <div className="tabular" style={{ fontSize: 11, fontWeight: 700, color: '#9AA89D', letterSpacing: '0.1em' }}>0{i + 1}</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#0F1E12', marginTop: 8, letterSpacing: '-0.01em' }}>{tag}</div>
            <p style={{ fontSize: 13, color: '#6B7A6E', marginTop: 8, lineHeight: 1.6 }}>
              {tagDescriptions[tag] || `${tag} ê¸°ì¤ì ì¶©ì¡±íë ìíìëë¤. ìì¸í ë¶ìì ìì Â·ìì í­ìì íì¸íì¤ ì ììµëë¤.`}
            </p>
          </div>
        ))}
      </div>
    </div>

    {/* Story strip */}
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'center' }}>
      <div>
        <SectionTitle kicker="ìì¬ë£ ì´ì¼ê¸°" title="ì´ëì ì´ë»ê² ë§ë¤ì´ì¡ë"/>
        <p style={{ fontSize: 15, color: '#3A4A3F', lineHeight: 1.8 }}>
          {product.brand}ì ìíì¬ ëì¥ìì ì§ì  ì¬ë°°Â·ê°ê³µëë ìì¬ë£ë¥¼ ì¬ì©íìµëë¤. ê°ê³µ ë¨ê³ë§ë¤ HACCP ê²ì¬ë¥¼ íµí´ ììì ê´ë¦¬íê³ , pickfoodë ë§¤ì£¼ 1í ë¬´ìì íë³¸ ê²ì¬ë¥¼ íµí´ ë¼ë²¨ ì íëë¥¼ ì ê²í©ëë¤.
        </p>
        <div style={{ display: 'flex', gap: 24, marginTop: 24 }}>
          <KeyValue k="ìì°ì§" v="êµ­ë´ì°"/>
          <KeyValue k="ê°ê³µ ìì¤" v="ê²½ê¸° ìì±"/>
          <KeyValue k="ì¸ì¦" v="HACCP Â· ì ê¸°ë"/>
        </div>
      </div>
      <div style={{ aspectRatio: '4/3', borderRadius: 12, overflow: 'hidden', background: '#F4F5F1' }}>
        <img src={product.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
      </div>
    </div>

    {/* Cooking suggestions */}
    <div>
      <SectionTitle kicker="íì© ì ì" title="ì´ë ê² ëìë©´ ì¢ìì"/>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[
          { title: 'ë¨ëì¼ë¡', desc: 'ë°ì°ê±°ë ê·¸ëë¡ ë¨¹ì´ë ë§ìê² ì¦ê¸¸ ì ììµëë¤.', tag: '5ë¶' },
          { title: 'ìì¬ ëì©', desc: 'íë£¨ íë¼ ë¨ë°±ì§ ë³´ì¶©ì¼ë¡ íì©íê¸° ì¢ìµëë¤.', tag: '10ë¶' },
          { title: 'ìë¦¬ ìì©', desc: 'ìë¬ëÂ·ëìë½ ë± ë¤ìí ë©ë´ì íì© ê°ë¥í©ëë¤.', tag: '15ë¶' }
        ].map((s, i) => (
          <div key={i} style={{ background: '#F4F5F1', borderRadius: 12, padding: 20 }}>
            <div className="tabular" style={{ display: 'inline-block', padding: '3px 8px', background: '#0F1E12', color: '#A8E063', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>{s.tag}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#0F1E12', marginTop: 12 }}>{s.title}</div>
            <p style={{ fontSize: 13, color: '#6B7A6E', marginTop: 6, lineHeight: 1.6 }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const SafetyTab = ({ product, activeAllergenNames, loggedIn }) => {
  const d = window.PF_DATA;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      <div>
        <SectionTitle kicker="ìì ì ë³´" title="100gë¹ ìì ì±ë¶" right={<span style={{ fontSize: 12, color: '#9AA89D' }}>ì¶ì²: ì ì¡°ì¬ ë¼ë²¨</span>}/>
        <NutritionBlock nutrition={product.nutrition}/>
        {/* Daily intake bar visualization */}
        <div style={{ background: '#fff', border: '1px solid #E5E7E1', borderRadius: 12, padding: 24, marginTop: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0F1E12', marginBottom: 14 }}>1ì¼ ê¶ì¥ ì­ì·¨ë ëë¹ (ì±ì¸ ê¸°ì¤)</div>
          {[
            { label: 'ëí¸ë¥¨', value: product.nutrition.sodium, max: 2000, color: '#E89B26', unit: 'mg' },
            { label: 'ë¹ë¥',   value: product.nutrition.sugar,   max: 50,   color: '#D32F2F', unit: 'g' },
            { label: 'í¬íì§ë°©', value: product.nutrition.fat * 0.4, max: 15, color: '#B97308', unit: 'g' },
            { label: 'ë¨ë°±ì§', value: product.nutrition.protein, max: 55,   color: '#1F6B45', unit: 'g' }
          ].map(b => {
            const pct = Math.min(100, (b.value / b.max) * 100);
            return (
              <div key={b.label} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 90px', alignItems: 'center', gap: 16, padding: '8px 0' }}>
                <span style={{ fontSize: 12, color: '#3A4A3F', fontWeight: 600 }}>{b.label}</span>
                <div style={{ position: 'relative', height: 8, background: '#F4F5F1', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', inset: 0, width: `${pct}%`, background: b.color, borderRadius: 999 }}/>
                </div>
                <span className="tabular" style={{ fontSize: 12, color: '#3A4A3F', textAlign: 'right', fontWeight: 600 }}>
                  {Math.round(b.value)}{b.unit} <span style={{ color: '#9AA89D' }}>Â· {Math.round(pct)}%</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <SectionTitle kicker="ìë ë¥´ê¸° ê²ì¦" title="ìì¬ë£ Â· ìë ë¥´ê¸° ì ë³´" right={<span style={{ fontSize: 12, color: '#9AA89D' }}>ìì½ì² íì ëì 15ì¢</span>}/>
        <div style={{ background: '#fff', border: '1px solid #E5E7E1', borderRadius: 12, padding: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#3A4A3F', marginBottom: 12 }}>ì´ ìíì´ í¬í¨íë ìì¬ë£</div>
          {product.allergens.length === 0 ? (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#ECF7F0', borderRadius: 8 }}>
              <Icon.Check size={18} stroke="#2E8B57"/>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1F6B45' }}>ì£¼ì ìë ë¥´ê¸° ìì¬ë£ ìì</span>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {product.allergens.map(a => {
                const isUserHit = activeAllergenNames.includes(a);
                return (
                  <div key={a} style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                    padding: '14px 18px', minWidth: 88,
                    background: isUserHit ? '#FEF2F2' : '#F4F5F1',
                    border: '1.5px solid ' + (isUserHit ? '#FCD7D7' : 'transparent'),
                    borderRadius: 10
                  }}>
                    <AllergenIcon name={a} size={32} danger={isUserHit}/>
                    <div style={{ fontSize: 12, fontWeight: 700, color: isUserHit ? '#B71C1C' : '#3A4A3F' }}>{a}</div>
                    {isUserHit && <div style={{ fontSize: 10, fontWeight: 600, color: '#B71C1C', marginTop: -4 }}>ë³¸ì¸ ìë ë¥´ê¸°</div>}
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ marginTop: 28, paddingTop: 22, borderTop: '1px solid #F4F5F1' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#6B7A6E', marginBottom: 14 }}>ì ì²´ 15ì¢ íì ëì â íì = í¬í¨ ì ë¨</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 10 }}>
              {d.allergens.map(a => {
                const has = product.allergens.includes(a.name);
                const isUserHit = has && activeAllergenNames.includes(a.name);
                return (
                  <div key={a.id} style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                    opacity: has ? 1 : 0.28, padding: '10px 4px',
                    background: isUserHit ? '#FEF2F2' : 'transparent',
                    borderRadius: 8
                  }}>
                    <AllergenIcon name={a.name} size={24} danger={isUserHit}/>
                    <div style={{ fontSize: 11, fontWeight: 600, color: isUserHit ? '#B71C1C' : '#3A4A3F', textAlign: 'center' }}>{a.name}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div>
        <SectionTitle kicker="ì§í ìíë" title="ë§ì±ì§í ìì ì í©ì±"/>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {[
            { name: 'ë¹ë¨',     ok: product.nutrition.sugar < 6,    note: `ë¹ë¥ ${product.nutrition.sugar}g` },
            { name: 'ê³ íì',   ok: product.nutrition.sodium < 500, note: `ëí¸ë¥¨ ${product.nutrition.sodium}mg` },
            { name: 'ê³ ì§íì¦', ok: product.nutrition.fat < 20,     note: `ì§ë°© ${product.nutrition.fat}g` },
            { name: 'ì ì¥ì§í', ok: product.nutrition.sodium < 300, note: `ëí¸ë¥¨ ${product.nutrition.sodium}mg` }
          ].map(r => (
            <div key={r.name} style={{
              background: r.ok ? '#F0F6F1' : '#FFF8EC',
              border: '1px solid ' + (r.ok ? '#DCE9DF' : '#FBE9C7'),
              borderRadius: 10, padding: 14,
              display: 'flex', alignItems: 'center', gap: 12
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 999, background: r.ok ? '#1F6B45' : '#E89B26', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {r.ok ? <Icon.Check size={18} stroke="#fff"/> : <Icon.Alert size={18} stroke="#fff"/>}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: r.ok ? '#1F6B45' : '#B97308' }}>{r.name}</div>
                <div style={{ fontSize: 11, color: r.ok ? '#1F6B45' : '#B97308', opacity: 0.8 }}>{r.ok ? 'ì í©' : 'ì£¼ì'} Â· {r.note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ReviewsTab = ({ product, filter, setFilter }) => {
  const reviews = [
    { id: 1, user: 'ê¹**', score: 5, date: '2026.05.08', verified: true, profile: 'ë³¸ì¸ â ìì°/ê² ìë ë¥´ê¸°', body: 'ê²½ê³ ê° ë¯¸ë¦¬ ë ì ìíí ìíì ì¬ê¸° ì ì íì¸í  ì ììì´ì. ì¼ë° ì¼íëª°ììë ë¼ë²¨ì ì¼ì¼ì´ ë´ì¼ íëë° ì ë§ í¸í©ëë¤.', helpful: 42, photos: [product.img] },
    { id: 2, user: 'ë°**', score: 5, date: '2026.05.05', verified: true, profile: 'ìë²ì§ â ë¹ë¨', body: 'ë¹ë¨ ì¼ì´ íí°ë¡ ê±°ë¥¸ ìíì¸ë° ì¤ì ë¡ ìí íë¹ì´ ìì ì ìëë¤. ìì ì ë³´ê° ìì¸í ëìì ìì¬íê³  êµ¬ë§¤ ì¤.', helpful: 28, photos: [] },
    { id: 3, user: 'ì´**', score: 4, date: '2026.05.03', verified: true, profile: 'ë³¸ì¸ â ì°ì  ìë ë¥´ê¸°', body: 'ë§ë ì¢ê³  ìì  ê²ì¦ë ë§ìì ë¤ì´ì. ë¤ë§ í¬ì¥ì´ ì¡°ê¸ë§ ë ììì¼ë©´ ì¢ê² ì´ì.', helpful: 14, photos: [] },
    { id: 4, user: 'ì **', score: 5, date: '2026.05.01', verified: true, profile: 'ìë§ â ê³ íì', body: 'ì ëí¸ë¥¨ì´ë¼ ë¶ëª¨ëê» ìì¬íê³  ë³´ë´ëë¦´ ì ììµëë¤. ìë íí° ì ë§ ì ì©í´ì.', helpful: 11, photos: [product.img, product.img] }
  ];
  const dist = [{ s: 5, p: 78 }, { s: 4, p: 16 }, { s: 3, p: 4 }, { s: 2, p: 1 }, { s: 1, p: 1 }];

  return (
    <div>
      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 32, marginBottom: 32, padding: '28px 32px', background: '#F4F5F1', borderRadius: 14 }}>
        <div style={{ textAlign: 'center', paddingTop: 6 }}>
          <div className="tabular" style={{ fontSize: 56, fontWeight: 800, color: '#0F1E12', letterSpacing: '-0.04em', lineHeight: 1 }}>{product.rating}</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, marginTop: 8 }}>
            {[1,2,3,4,5].map(i => <Icon.Star key={i} size={16} stroke={i <= Math.round(product.rating) ? '#E89B26' : '#DDE2DC'} filled/>)}
          </div>
          <div style={{ fontSize: 12, color: '#6B7A6E', marginTop: 8 }}>ì ì²´ {product.reviews.toLocaleString()}ê±´ì íê¸°</div>
        </div>
        <div>
          {dist.map(r => (
            <div key={r.s} style={{ display: 'grid', gridTemplateColumns: '32px 1fr 50px', alignItems: 'center', gap: 12, padding: '4px 0' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#3A4A3F' }}>{r.s}ì </span>
              <div style={{ height: 6, background: '#fff', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${r.p}%`, background: '#E89B26', borderRadius: 999 }}/>
              </div>
              <span className="tabular" style={{ fontSize: 12, color: '#6B7A6E', textAlign: 'right' }}>{r.p}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { id: 'all', label: 'ì ì²´' },
          { id: 'photo', label: 'ì¬ì§ íê¸°' },
          { id: 'same', label: 'ê°ì ìë ë¥´ê¸° ê·¸ë£¹' },
          { id: 'same2', label: 'ê°ì ì§ë³ ê·¸ë£¹' },
          { id: 'best', label: 'ëìì' }
        ].map(c => (
          <button key={c.id} onClick={() => setFilter(c.id)} style={{
            padding: '7px 14px', borderRadius: 999, border: '1px solid ' + (filter === c.id ? '#0F1E12' : '#E5E7E1'),
            background: filter === c.id ? '#0F1E12' : '#fff', color: filter === c.id ? '#fff' : '#3A4A3F',
            fontFamily: 'inherit', fontSize: 12, fontWeight: 600, cursor: 'pointer'
          }}>{c.label}</button>
        ))}
      </div>

      {/* Reviews */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {reviews.map(r => (
          <div key={r.id} style={{ padding: '24px 0', borderTop: '1px solid #E5E7E1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {[1,2,3,4,5].map(i => <Icon.Star key={i} size={13} stroke={i <= r.score ? '#E89B26' : '#DDE2DC'} filled/>)}
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#0F1E12' }}>{r.user}</span>
              {r.verified && <span style={{ fontSize: 10, padding: '2px 6px', background: '#F0F6F1', color: '#1F6B45', borderRadius: 4, fontWeight: 700 }}>â êµ¬ë§¤íì¸</span>}
              <span style={{ fontSize: 11, padding: '2px 7px', background: '#fff', color: '#3A4A3F', border: '1px solid #E5E7E1', borderRadius: 4 }}>{r.profile}</span>
              <span className="tabular" style={{ fontSize: 12, color: '#9AA89D', marginLeft: 'auto' }}>{r.date}</span>
            </div>
            <p style={{ fontSize: 14, color: '#3A4A3F', lineHeight: 1.7, marginBottom: r.photos.length > 0 ? 12 : 8 }}>{r.body}</p>
            {r.photos.length > 0 && (
              <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                {r.photos.map((p, i) => (
                  <img key={i} src={p} alt="" style={{ width: 84, height: 84, objectFit: 'cover', borderRadius: 6 }}/>
                ))}
              </div>
            )}
            <button style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', background: '#fff', border: '1px solid #E5E7E1',
              borderRadius: 999, cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, color: '#3A4A3F'
            }}>
              <Icon.ThumbsUp size={12} stroke="#3A4A3F"/> ëìì´ ëì´ì <span className="tabular">{r.helpful}</span>
            </button>
          </div>
        ))}
      </div>

      <button style={{ width: '100%', padding: '14px', marginTop: 24, background: '#fff', border: '1px solid #E5E7E1', borderRadius: 8, fontFamily: 'inherit', fontSize: 14, fontWeight: 600, color: '#3A4A3F', cursor: 'pointer' }}>
        íê¸° ë ë³´ê¸° ({product.reviews.toLocaleString() - 4}ê±´)
      </button>
    </div>
  );
};

const InquiryTab = () => {
  const qa = [
    { q: 'ì´ ìí ì°ì  ìë ë¥´ê¸° ìì´ë ë¨¹ì ì ìëì?', a: 'ìì Â·ìì í­ìì ë³¸ ìíì ì°ì  ìì¬ë£ë¥¼ í¬í¨íì§ ììµëë¤. ë¨, ê°ì ì ì¡° ë¼ì¸ìì ì°ì  í¨ì  ì íì´ ìì°ë  ì ìì´ êµì°¨ì¤ì¼ ê°ë¥ì±ì íì¸ í ì­ì·¨ ë¶íëë¦½ëë¤.', status: 'answered', date: '2026.05.06' },
    { q: 'ëë ë³´ê´ ê°ë¥íê°ì?', a: 'ëë ë³´ê´ ì íë¯¸ê° ë³ì§ë  ì ìì´ ëì¥ ë³´ê´ì ê¶ì¥ëë¦½ëë¤.', status: 'answered', date: '2026.05.04' },
    { q: 'ëª ì¸ë¶ì¸ê°ì?', a: null, status: 'pending', date: '2026.05.10' }
  ];
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <div>
          <SectionTitle kicker="ìí ë¬¸ì" title="ê¶ê¸í ì ì ë¬¼ì´ë³´ì¸ì" right={null}/>
        </div>
        <Button variant="primary" size="md">ë¬¸ì ìì±íê¸°</Button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {qa.map((item, i) => (
          <div key={i} style={{ padding: '20px 0', borderTop: '1px solid #E5E7E1' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <span style={{ padding: '3px 8px', borderRadius: 4, background: item.status === 'answered' ? '#1F4D2C' : '#E89B26', color: '#fff', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                {item.status === 'answered' ? 'ëµë³ìë£' : 'ëµë³ëê¸°'}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0F1E12' }}>Q. {item.q}</div>
                <div className="tabular" style={{ fontSize: 11, color: '#9AA89D', marginTop: 4 }}>{item.date}</div>
                {item.a && (
                  <div style={{ marginTop: 14, padding: 16, background: '#F4F5F1', borderRadius: 8 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#1F4D2C', marginBottom: 6 }}>A. pickfood ëµë³</div>
                    <p style={{ fontSize: 13, color: '#3A4A3F', lineHeight: 1.7 }}>{item.a}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DeliveryTab = () => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
    <div style={{ background: '#fff', border: '1px solid #E5E7E1', borderRadius: 12, padding: 28 }}>
      <div style={{ width: 44, height: 44, borderRadius: 10, background: '#F0F6F1', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
        <Icon.Truck size={22} stroke="#1F4D2C"/>
      </div>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0F1E12' }}>ë°°ì¡ ìë´</h3>
      <ul style={{ marginTop: 14, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <DeliveryItem k="ì£¼ë¬¸ ë§ê°" v="ì¤í 3ì (ì~ê¸)"/>
        <DeliveryItem k="ë°°ì¡ ëì°©" v="ì£¼ë¬¸ ë¤ì ììì¼ ëì°©"/>
        <DeliveryItem k="ë°°ì¡ ì§ì­" v="ìì¸ Â· ê²½ê¸° Â· ì¸ì² (ì¼ë¶ ì§ì­ ì ì¸)"/>
        <DeliveryItem k="ë°°ì¡ë¹" v="40,000ì ì´ì ë¬´ë£, ë¯¸ë§ ì 3,000ì"/>
        <DeliveryItem k="í¬ì¥ì¬" v="100% ì¬íì© ì¢ì´ ë°ì¤"/>
      </ul>
    </div>
    <div style={{ background: '#fff', border: '1px solid #E5E7E1', borderRadius: 12, padding: 28 }}>
      <div style={{ width: 44, height: 44, borderRadius: 10, background: '#FFF8EC', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
        <Icon.RefreshCw size={22} stroke="#B97308"/>
      </div>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0F1E12' }}>êµí Â· ë°í ìë´</h3>
      <ul style={{ marginTop: 14, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <DeliveryItem k="ì ì²­ ê¸°í" v="ìë ¹ì¼ë¡ë¶í° 7ì¼ ì´ë´"/>
        <DeliveryItem k="ì ì ìí" v="ì ì ìí í¹ì±ì ë¨ì ë³ì¬ì ìí ë°í ë¶ê°"/>
        <DeliveryItem k="ìë ë¥´ê¸° ëë½" v="ë¼ë²¨ ì ë³´ ëë½ ì 100% íë¶ + ìë¡ê¸"/>
        <DeliveryItem k="ë¬¸ì" v="ê³ ê°ì¼í° 1670-1234 (ì¤ì  9ì~ì¤í 6ì)"/>
      </ul>
    </div>
  </div>
);

// =================== helpers ===================
const SpecLine = ({ label, value }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18, fontSize: 13 }}>
    <span style={{ width: 64, color: '#9AA89D', fontWeight: 500, flexShrink: 0 }}>{label}</span>
    <span style={{ color: '#3A4A3F', flex: 1, lineHeight: 1.55 }}>{value}</span>
  </div>
);

const TrustBadge = ({ icon, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: '#F4F5F1', borderRadius: 8 }}>
    {icon}
    <span style={{ fontSize: 12, fontWeight: 600, color: '#3A4A3F' }}>{label}</span>
  </div>
);

const SectionTitle = ({ kicker, title, right }) => (
  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 18, gap: 16 }}>
    <div>
      {kicker && <div style={{ fontSize: 11, fontWeight: 800, color: '#1F4D2C', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>{kicker}</div>}
      <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0F1E12', letterSpacing: '-0.02em' }}>{title}</h2>
    </div>
    {right}
  </div>
);

const KeyValue = ({ k, v }) => (
  <div>
    <div style={{ fontSize: 11, fontWeight: 600, color: '#9AA89D', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{k}</div>
    <div style={{ fontSize: 15, fontWeight: 700, color: '#0F1E12', marginTop: 4 }}>{v}</div>
  </div>
);

const DeliveryItem = ({ k, v }) => (
  <li style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 14, fontSize: 13 }}>
    <span style={{ color: '#6B7A6E', fontWeight: 600 }}>{k}</span>
    <span style={{ color: '#3A4A3F', lineHeight: 1.55 }}>{v}</span>
  </li>
);

const tagDescriptions = {
  'ê³ ë¨ë°±':       'ë¨ë°±ì§ í¨ëì´ 100gë¹ 12g ì´ìì¸ ìíì¼ë¡, ê·¼ì¡ ì ì§ì ìì¬ ëì©ì ì í©í©ëë¤.',
  'ì ë¹':         'ë¹ë¥ í¨ëì´ 100gë¹ 5g ì´íì¸ ìí. ë¹ë¨Â·ë¤ì´ì´í¸ ì¼ì´ ë¼ì¸ììëë¤.',
  'êµ­ë´ì°':       'êµ­ë´ìì ìì°Â·ê°ê³µë ìì¬ë£ë¥¼ ì¬ì©í©ëë¤. ìì°ì§ íê¸°ë¥¼ ë¼ë²¨ìì íì¸í  ì ììµëë¤.',
  'ì ê¸°ë':       'ì ê¸° ëë²ì¼ë¡ ì¬ë°°ë ìì¬ë£ìëë¤. ëì½Â·ííë¹ë£ ì¬ì©ì ê¸í©ëë¤.',
  'ì ì§ë°©':       'ì§ë°© í¨ëì´ 100gë¹ 3g ì´íì¸ ìí. ê³ ì§íì¦ ì¼ì´ ë¼ì¸ììëë¤.',
  'ë¹ê±´':         'ëë¬¼ì± ìì¬ë£ë¥¼ í¬í¨íì§ ììµëë¤.',
  'ë½í íë¦¬':     'ì ë¹ì´ ì ê±°ëì´ ì ë¹ë¶ë´ì¦ì´ ìì´ë ë¶ë´ ìì´ ëì¤ ì ììµëë¤.',
  'ëë¬¼ë³µì§':     'ëë¬¼ë³µì§ ì¸ì¦ ëê°ìì ìì°ë ìì¬ë£ë¥¼ ì¬ì©íìµëë¤.',
  'ìì´ì¬ì ':     'ìì´ì¬ì  í¨ëì´ íë¶íì¬ ìíÂ·ì¥ ê±´ê°ì ëìì ì¤ëë¤.',
  'HACCP':       'HACCP ìíìì ê´ë¦¬ì¸ì¦ ìì¤ìì ìì°ëììµëë¤.',
  'ì¤ë©ê°3':      'ì¤ë©ê°3 ì§ë°©ì°ì´ íë¶íê² í¨ì ëì´ ìì´ íê´ ê±´ê°ì ëìì ì¤ëë¤.'
};

const crumbBtn = { background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, color: '#6B7A6E' };
const qtyBtn = { width: 36, height: 36, background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const iconActionBtn = { width: 52, height: 52, background: '#fff', border: '1px solid #C9CFC4', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 };
const navBtn = (side) => ({
  position: 'absolute', top: '50%', transform: 'translateY(-50%)',
  [side]: 12, width: 36, height: 36, borderRadius: 999,
  background: 'rgba(255,255,255,0.92)', border: 'none',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', backdropFilter: 'blur(8px)',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
});

// ----- EntryAlert: a slide-down banner shown when user enters a risky product page -----
const EntryAlert = ({ allergyHits, diseaseWarnings, productName, user, onClose }) => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    // Auto-collapse after 12s (still keep persistent badge in safety panel)
    const t = setTimeout(onClose, 12000);
    return () => clearTimeout(t);
  }, [onClose]);

  const isAllergy = allergyHits.length > 0;
  const accent = isAllergy ? '#D32F2F' : '#B97308';
  const bg = isAllergy ? '#FDEAEA' : '#FFF1D6';
  const borderClr = isAllergy ? '#F3C0BD' : '#F3DDA8';

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 45,
      background: bg, borderBottom: '1px solid ' + borderClr
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '14px 40px',
        display: 'flex', alignItems: 'flex-start', gap: 16
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 999, background: accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          animation: 'pfPulse 1.6s ease-in-out infinite'
        }}>
          <Icon.Alert size={18} stroke="#fff"/>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: accent, letterSpacing: '-0.005em' }}>
              {isAllergy ? 'â  ì£¼ì â íìë ìë ë¥´ê¸° ìì¬ë£ê° í¬í¨ë ìíìëë¤' : 'â  ì£¼ì â íìë ì§ë³ íë¡íì ê¶ì¥íì§ ìë ìì ì±ë¶ìëë¤'}
            </span>
            <span style={{ fontSize: 11, padding: '2px 7px', background: '#fff', color: accent, borderRadius: 999, fontWeight: 700 }}>
              {user.name}ë íë¡í ê¸°ì¤
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
            {allergyHits.map(a => (
              <span key={a} style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '4px 9px', background: '#fff', color: '#B71C1C',
                borderRadius: 999, fontSize: 12, fontWeight: 700
              }}>
                <AllergenIcon name={a} size={13} danger/> {a} í¨ì 
              </span>
            ))}
            {diseaseWarnings.map((w, i) => (
              <span key={i} style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '4px 9px', background: '#fff', color: '#B97308',
                borderRadius: 999, fontSize: 12, fontWeight: 700
              }}>
                <Icon.Info size={12} stroke="#B97308"/> {w.disease} Â· {w.reason}
              </span>
            ))}
          </div>
          <div style={{ fontSize: 12, color: '#3A4A3F', lineHeight: 1.55 }}>
            êµ¬ë§¤ ì  ìì ì ë³´Â·ìì¬ë£ë¥¼ ë¤ì íì¸í´ ì£¼ì¸ì. ìì Â·ìì í­ìì ìì¸í ë¶ìì ë³´ì¤ ì ìì´ì.
          </div>
        </div>
        <button onClick={onClose} className="pf-btn" style={{
          background: '#fff', color: '#3A4A3F', border: '1px solid ' + borderClr,
          padding: '8px 12px', borderRadius: 8, cursor: 'pointer',
          fontFamily: 'inherit', fontSize: 12, fontWeight: 700, flexShrink: 0,
          display: 'inline-flex', alignItems: 'center', gap: 4
        }}>
          <Icon.Close size={12} stroke="#3A4A3F"/> ë«ê¸°
        </button>
      </div>
    </div>
  );
};

