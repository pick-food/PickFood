// Shared primitive components â Button, Badge, Chip, Card
const { useState: _useS, useEffect: _useE } = React;

window.Button = ({ variant = 'primary', size = 'md', icon, children, onClick, disabled, style, ...rest }) => {
  const base = {
    fontFamily: 'inherit', fontWeight: 600, border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
    borderRadius: '8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    transition: 'all 150ms cubic-bezier(0.2,0,0,1)', whiteSpace: 'nowrap'
  };
  const sizes = {
    sm: { padding: '8px 12px', fontSize: 13 },
    md: { padding: '12px 20px', fontSize: 15 },
    lg: { padding: '16px 28px', fontSize: 16 }
  };
  const variants = {
    primary: { background: '#1F4D2C', color: '#fff' },
    accent:  { background: '#A8E063', color: '#0F1E12' },
    secondary: { background: '#fff', color: '#1F4D2C', border: '1px solid #C9CFC4' },
    ghost: { background: 'transparent', color: '#1F4D2C' },
    danger: { background: '#D32F2F', color: '#fff' },
    dark: { background: '#0F1E12', color: '#fff' }
  };
  if (disabled) {
    variants.primary = { background: '#DDE2DC', color: '#9AA89D' };
    variants.accent  = { background: '#DDE2DC', color: '#9AA89D' };
  }
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}
      onMouseEnter={e => !disabled && (e.currentTarget.style.filter = 'brightness(0.95)')}
      onMouseLeave={e => !disabled && (e.currentTarget.style.filter = 'brightness(1)')}
      {...rest}>
      {icon}{children}
    </button>
  );
};

window.Badge = ({ tone = 'neutral', children, icon }) => {
  const tones = {
    safe:    { background: '#CFE8DA', color: '#1F6B45' },
    danger:  { background: '#FCD7D7', color: '#B71C1C' },
    brand:   { background: '#DCE9DF', color: '#1F4D2C' },
    warn:    { background: '#FBE9C7', color: '#B97308' },
    neutral: { background: '#F4F5F1', color: '#3A4A3F', border: '1px solid #E5E7E1' },
    lime:    { background: '#EAF7D4', color: '#1F4D2C' },
    solid:   { background: '#1F4D2C', color: '#fff' },
    accent:  { background: '#A8E063', color: '#0F1E12' }
  };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 9px', borderRadius: 999, fontSize: 12, fontWeight: 600, ...tones[tone] }}>
      {icon}{children}
    </span>
  );
};

window.Chip = ({ active, tone = 'default', onClick, children }) => {
  const styles = {
    default: active
      ? { background: '#1F4D2C', borderColor: '#1F4D2C', color: '#fff' }
      : { background: '#fff', borderColor: '#C9CFC4', color: '#3A4A3F' },
    danger: active
      ? { background: '#D32F2F', borderColor: '#D32F2F', color: '#fff' }
      : { background: '#FEF2F2', borderColor: '#FCD7D7', color: '#B71C1C' }
  };
  return (
    <button onClick={onClick} style={{
      fontFamily: 'inherit', fontWeight: active ? 600 : 500, fontSize: 13,
      padding: '7px 13px', borderRadius: 999, border: '1px solid',
      cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
      transition: 'all 150ms', ...styles[tone]
    }}>
      {children}
      {active && <Icon.Close size={12}/>}
    </button>
  );
};

window.Card = ({ children, style, onClick, hover }) => (
  <div onClick={onClick} style={{
    background: '#fff', border: '1px solid #E5E7E1', borderRadius: 12,
    boxShadow: '0 1px 2px rgba(15,30,18,0.04)', transition: 'all 200ms cubic-bezier(0.2,0,0,1)',
    cursor: onClick ? 'pointer' : 'default', ...style
  }}
  onMouseEnter={e => hover && (e.currentTarget.style.boxShadow = '0 2px 8px rgba(15,30,18,0.08)', e.currentTarget.style.transform = 'translateY(-2px)')}
  onMouseLeave={e => hover && (e.currentTarget.style.boxShadow = '0 1px 2px rgba(15,30,18,0.04)', e.currentTarget.style.transform = 'translateY(0)')}
  >{children}</div>
);

// Product image placeholder â solid color blocks by category
window.ProductImage = ({ kind, size = '100%', radius = 0 }) => {
  const map = {
    tofu: { bg: 'linear-gradient(135deg,#F5F5E8,#E5E7E1)', shape: <rect x="20" y="30" width="60" height="40" rx="4" fill="#F5F0D8"/> },
    rice: { bg: 'linear-gradient(135deg,#FFF8F0,#FBE9C7)', shape: <ellipse cx="50" cy="55" rx="32" ry="22" fill="#E8D9B8"/> },
    rice2:{ bg: 'linear-gradient(135deg,#FFF8F0,#E89B26)', shape: <ellipse cx="50" cy="55" rx="32" ry="22" fill="#C9A66B"/> },
    yogurt:{ bg: 'linear-gradient(135deg,#F0F6F1,#DCE9DF)', shape: <rect x="28" y="20" width="44" height="60" rx="6" fill="#fff"/> },
    chicken:{ bg: 'linear-gradient(135deg,#FFF1E5,#FCD7D7)', shape: <ellipse cx="50" cy="55" rx="32" ry="22" fill="#F5C99B"/> },
    crab:  { bg: 'linear-gradient(135deg,#FEF2F2,#FCD7D7)', shape: <ellipse cx="50" cy="55" rx="32" ry="18" fill="#E89B9B"/> },
    milk:  { bg: 'linear-gradient(135deg,#F0F6F1,#fff)', shape: <rect x="32" y="20" width="36" height="60" rx="4" fill="#fff" stroke="#DDE2DC"/> },
    pork:  { bg: 'linear-gradient(135deg,#FFF1E5,#F5C99B)', shape: <rect x="20" y="35" width="60" height="30" rx="6" fill="#E89B9B"/> },
    salmon:{ bg: 'linear-gradient(135deg,#FFEFEA,#F5C99B)', shape: <path d="M20 50 Q50 30 80 50 Q50 70 20 50Z" fill="#F08060"/> },
    peanut:{ bg: 'linear-gradient(135deg,#FFF8EC,#E89B26)', shape: <ellipse cx="50" cy="55" rx="28" ry="22" fill="#C9A66B"/> },
    banana:{ bg: 'linear-gradient(135deg,#FFFCE5,#FBE9C7)', shape: <path d="M22 30 Q30 60 70 70 Q60 50 30 25" fill="#E8D265"/> },
    tomato:{ bg: 'linear-gradient(135deg,#FEF2F2,#FCD7D7)', shape: <><circle cx="50" cy="55" r="22" fill="#D34A4A"/><path d="M44 33 L50 38 L56 33" stroke="#3D7A4D" strokeWidth="2.5" fill="none"/></> }
  };
  const item = map[kind] || map.tofu;
  return (
    <div style={{ width: size, aspectRatio: '1/1', background: item.bg, borderRadius: radius, position: 'relative', overflow: 'hidden' }}>
      <svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        {item.shape}
      </svg>
    </div>
  );
};

