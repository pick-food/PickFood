// ProductCard â e-commerce style with real imagery & ratings
window.ProductCard = ({ product, onClick, user, compact }) => {
  const d = window.PF_DATA;
  const wishlist = PF_STORE.use(s => s.wishlist);
  const wished = wishlist.includes(product.id);
  const [burst, setBurst] = React.useState(false);

  const activeAllergens = (user?.activeAllergyGroups || []).flatMap(gid =>
    (d.allergyGroups.find(g => g.id === gid)?.allergens || []).map(aid => d.allergens.find(a => a.id === aid)?.name)
  ).filter(Boolean);
  const hits = product.allergens.filter(a => activeAllergens.includes(a));
  const isDanger = hits.length > 0;
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  const toggleWish = (e) => {
    e.stopPropagation();
    setBurst(true);
    setTimeout(() => setBurst(false), 400);
    PF_STORE.toggleWishlist(product.id, product.name);
  };

  return (
    <div onClick={onClick} className="pf-press pf-fade-up" style={{
      background: 'transparent', cursor: 'pointer', display: 'flex', flexDirection: 'column',
      transition: 'transform 200ms'
    }}>
      {/* Image */}
      <div className="pf-img-zoom" style={{ position: 'relative', aspectRatio: '1/1', overflow: 'hidden', borderRadius: 8, background: '#fff', border: '1px solid #ECEEE7' }}>
        <img className="pc-img" src={product.img} alt={product.name} style={{
          width: '100%', height: '100%', objectFit: 'cover', display: 'block'
        }}/>

        {/* Top-left badge */}
        {product.badge === 'recommended' && (
          <span style={{
            position: 'absolute', top: 8, left: 8, background: '#0F1E12', color: '#A8E063',
            padding: '4px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4
          }}><Icon.Shield size={11} stroke="#A8E063"/> ë§ì¶¤í½</span>
        )}
        {product.badge === 'deal' && (
          <span style={{
            position: 'absolute', top: 8, left: 8, background: '#1F4D2C', color: '#A8E063',
            padding: '4px 8px', borderRadius: 4, fontSize: 11, fontWeight: 800, letterSpacing: '0.02em'
          }}>í¹ê°</span>
        )}

        {/* Allergy warning overlay â subtle bottom strip, no red outline */}
        {isDanger && (
          <div style={{
            position: 'absolute', left: 8, right: 8, bottom: 8,
            background: 'rgba(211,47,47,0.96)', color: '#fff',
            padding: '6px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 6, backdropFilter: 'blur(6px)'
          }}>
            <Icon.Alert size={13} stroke="#fff"/>
            <span>{hits.join('Â·')} í¨ì </span>
          </div>
        )}

        {/* Wish button */}
        <button className={burst ? 'pf-heart-burst' : ''} style={{
          position: 'absolute', top: 8, right: 8,
          width: 32, height: 32, borderRadius: 999, border: 'none',
          background: wished ? '#D32F2F' : 'rgba(255,255,255,0.92)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)',
          transition: 'background 200ms'
        }} onClick={toggleWish}>
          <Icon.Heart size={15} stroke={wished ? '#fff' : '#3A4A3F'} filled={wished}/>
        </button>
      </div>

      {/* Info */}
      <div style={{ paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ fontSize: 11, color: '#6B7A6E', fontWeight: 600 }}>{product.brand}</div>
        <div style={{
          fontSize: 14, fontWeight: 500, color: '#0F1E12',
          lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden', minHeight: 39
        }}>{product.name}</div>

        {/* Price row */}
        <div style={{ marginTop: 4 }}>
          {discount > 0 && (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: 12, color: '#9AA89D', textDecoration: 'line-through' }} className="tabular">{product.originalPrice.toLocaleString()}</span>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            {discount > 0 && (
              <span style={{ fontSize: 17, fontWeight: 800, color: '#D32F2F' }} className="tabular">{discount}%</span>
            )}
            <span className="tabular" style={{ fontSize: 17, fontWeight: 800, color: '#0F1E12', letterSpacing: '-0.01em' }}>
              {product.price.toLocaleString()}<span style={{ fontSize: 13, fontWeight: 600, marginLeft: 1 }}>ì</span>
            </span>
          </div>
        </div>

        {/* Rating + reviews */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, fontSize: 12 }}>
          <Icon.Star size={12} stroke="#E89B26" filled/>
          <span className="tabular" style={{ fontWeight: 700, color: '#0F1E12' }}>{product.rating}</span>
          <span style={{ color: '#9AA89D' }}>Â· ë¦¬ë·° {product.reviews.toLocaleString()}</span>
        </div>

        {/* Delivery + safety tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 7px', background: '#F0F6F1', color: '#1F6B45', borderRadius: 4 }}>
            ë´ì¼ ëì°©
          </span>
          {!isDanger && user && (
            <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 7px', background: '#EAF7D4', color: '#1F4D2C', borderRadius: 4, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
              <Icon.Check size={10} stroke="#1F4D2C"/> ìì 
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// NutritionBlock â used on detail page
window.NutritionBlock = ({ nutrition }) => {
  const items = [
    { key: 'kcal', label: 'ì´ë', value: nutrition.kcal, unit: 'kcal', Icon: Icon.Kcal },
    { key: 'protein', label: 'ë¨ë°±ì§', value: nutrition.protein, unit: 'g', Icon: Icon.Protein },
    { key: 'carb', label: 'íìíë¬¼', value: nutrition.carb, unit: 'g', Icon: Icon.Carb },
    { key: 'fat', label: 'ì§ë°©', value: nutrition.fat, unit: 'g', Icon: Icon.Fat },
    { key: 'sodium', label: 'ëí¸ë¥¨', value: nutrition.sodium, unit: 'mg', Icon: Icon.Sodium },
    { key: 'sugar', label: 'ë¹ë¥', value: nutrition.sugar, unit: 'g', Icon: Icon.Sugar }
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10 }}>
      {items.map(it => (
        <div key={it.key} style={{ background: '#fff', border: '1px solid #E5E7E1', borderRadius: 12, padding: 14, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
          <it.Icon size={28}/>
          <div style={{ fontSize: 11, color: '#6B7A6E', fontWeight: 500 }}>{it.label}</div>
          <div className="tabular" style={{ fontSize: 18, fontWeight: 700, color: '#0F1E12' }}>{it.value}<span style={{ fontSize: 11, fontWeight: 500, color: '#6B7A6E', marginLeft: 2 }}>{it.unit}</span></div>
        </div>
      ))}
    </div>
  );
};

window.AllergenIcon = ({ name, size = 28, danger }) => {
  const map = {
    'ìì°': Icon.Shrimp, 'ê²': Icon.Crab, 'ëì½©': Icon.Peanut, 'ì°ì ': Icon.Milk,
    'ë¬ê±': Icon.Egg, 'ë°': Icon.Wheat, 'ëë': Icon.Soy, 'ê²¬ê³¼ë¥': Icon.Nut,
    'ìì ': Icon.Fish, 'ë°ëë': Icon.Banana
  };
  const Cmp = map[name] || Icon.Alert;
  const c = danger ? '#D32F2F' : '#3A4A3F';
  return <Cmp size={size} color={c}/>;
};

