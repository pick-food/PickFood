// ============================================================
// pickfood â shared icon components (dual-tone)
// Lucide-style line + accent fill. Sized via `size` prop.
// ============================================================
const { useState, useEffect, useRef, useMemo, useCallback } = React;

window.Icon = {};

// Generic line icon helper
const I = ({ size = 20, stroke = 'currentColor', children, className = '', ...rest }) => (
  React.createElement('svg', {
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke, strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round',
    className, ...rest
  }, children)
);

Icon.Search = ({ size, stroke }) => <I size={size} stroke={stroke}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></I>;
Icon.Cart = ({ size, stroke }) => <I size={size} stroke={stroke}><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M3 4h2l2.7 12.4a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 8H6"/></I>;
Icon.User = ({ size, stroke }) => <I size={size} stroke={stroke}><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></I>;
Icon.Heart = ({ size = 20, stroke, filled }) => {
  const c = filled ? (stroke || '#D32F2F') : (stroke || 'currentColor');
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 21s-7-4.5-9-9C1.5 8 4 4 8 4c2 0 3 1 4 2 1-1 2-2 4-2 4 0 6.5 4 5 8-2 4.5-9 9-9 9Z"
        fill={filled ? c : 'none'} stroke={c} strokeWidth={filled ? 0 : 1.6}
        strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};
Icon.Filter = ({ size, stroke }) => <I size={size} stroke={stroke}><path d="M3 5h18M6 12h12M10 19h4"/></I>;
Icon.Close = ({ size, stroke }) => <I size={size} stroke={stroke}><path d="M6 6l12 12M18 6l-12 12"/></I>;
Icon.Check = ({ size, stroke }) => <I size={size} stroke={stroke}><path d="M20 6 9 17l-5-5"/></I>;
Icon.ChevronRight = ({ size, stroke }) => <I size={size} stroke={stroke}><path d="m9 6 6 6-6 6"/></I>;
Icon.ChevronDown = ({ size, stroke }) => <I size={size} stroke={stroke}><path d="m6 9 6 6 6-6"/></I>;
Icon.Plus = ({ size, stroke }) => <I size={size} stroke={stroke}><path d="M12 5v14M5 12h14"/></I>;
Icon.Minus = ({ size, stroke }) => <I size={size} stroke={stroke}><path d="M5 12h14"/></I>;
Icon.Trash = ({ size, stroke }) => <I size={size} stroke={stroke}><path d="M4 7h16M9 7V4h6v3M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13"/></I>;
Icon.Edit = ({ size, stroke }) => <I size={size} stroke={stroke}><path d="M14 4l6 6L8 22H2v-6L14 4Z"/></I>;
Icon.Alert = ({ size, stroke }) => <I size={size} stroke={stroke}><path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><path d="M12 9v4M12 17h.01"/></I>;
Icon.Info = ({ size, stroke }) => <I size={size} stroke={stroke}><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v5h1"/></I>;
Icon.Shield = ({ size, stroke }) => <I size={size} stroke={stroke}><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z"/><path d="m9 12 2 2 4-4"/></I>;
Icon.Chat = ({ size, stroke }) => <I size={size} stroke={stroke}><path d="M21 12a8 8 0 0 1-12.4 6.7L4 20l1.3-4.6A8 8 0 1 1 21 12Z"/></I>;
Icon.Send = ({ size, stroke }) => <I size={size} stroke={stroke}><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z"/></I>;
Icon.Home = ({ size, stroke }) => <I size={size} stroke={stroke}><path d="M3 11 12 3l9 8v10a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1V11Z"/></I>;
Icon.Settings = ({ size, stroke }) => <I size={size} stroke={stroke}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></I>;
Icon.ArrowLeft = ({ size, stroke }) => <I size={size} stroke={stroke}><path d="M19 12H5M12 5l-7 7 7 7"/></I>;
Icon.Star = ({ size, stroke, filled }) => <I size={size} stroke={stroke}><path d="m12 2 3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-7Z" fill={filled ? stroke : 'none'}/></I>;
Icon.Tag = ({ size, stroke }) => <I size={size} stroke={stroke}><path d="M20 13.5 13.5 20a2 2 0 0 1-2.8 0L3 12.3V4h8.3L20 12.7a2 2 0 0 1 0 .8Z"/><circle cx="8" cy="8" r="1.5"/></I>;
Icon.ChevronLeft = ({ size, stroke }) => <I size={size} stroke={stroke}><path d="m15 18-6-6 6-6"/></I>;
Icon.ThumbsUp = ({ size, stroke }) => <I size={size} stroke={stroke}><path d="M7 10v11h11l3-9-2-2h-7l1-5-3-2-3 7H7z"/></I>;
Icon.RefreshCw = ({ size, stroke }) => <I size={size} stroke={stroke}><path d="M21 12a9 9 0 0 1-15 6.7L3 16M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M3 21v-5h5"/></I>;
Icon.Package = ({ size, stroke }) => <I size={size} stroke={stroke}><path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/></I>;
Icon.MapPin = ({ size, stroke }) => <I size={size} stroke={stroke}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/></I>;
Icon.Bookmark = ({ size, stroke, filled }) => <I size={size} stroke={stroke}><path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16Z" fill={filled ? stroke : 'none'}/></I>;
Icon.User = ({ size, stroke }) => <I size={size} stroke={stroke}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></I>;
Icon.Settings = ({ size, stroke }) => <I size={size} stroke={stroke}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></I>;
Icon.Edit = ({ size, stroke }) => <I size={size} stroke={stroke}><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z"/></I>;
Icon.Trash = ({ size, stroke }) => <I size={size} stroke={stroke}><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></I>;
Icon.Bell = ({ size, stroke }) => <I size={size} stroke={stroke}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M13.7 21a2 2 0 0 1-3.4 0"/></I>;
Icon.Grid = ({ size, stroke }) => <I size={size} stroke={stroke}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></I>;
Icon.List = ({ size, stroke }) => <I size={size} stroke={stroke}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></I>;

// Dual-tone nutrition icons (custom)
Icon.Protein = ({ size = 22, color = '#1F4D2C', accent = '#A8E063' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="8" fill={accent} opacity=".55"/>
    <circle cx="12" cy="12" r="8" fill="none" stroke={color} strokeWidth="1.5"/>
    <path d="M9 12h6M12 9v6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
Icon.Carb = ({ size = 22, color = '#3A4A3F', accent = '#E89B26' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M5 14c0-4 3-9 8-9 4 0 6 3 6 6s-2 5-6 5-8 3-8 5" fill={accent} opacity=".4"/>
    <path d="M5 14c0-4 3-9 8-9 4 0 6 3 6 6s-2 5-6 5-8 3-8 5" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
Icon.Fat = ({ size = 22, color = '#3A4A3F', accent = '#FBE9C7' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M12 4c4 5 6 8 6 11a6 6 0 1 1-12 0c0-3 2-6 6-11Z" fill={accent}/>
    <path d="M12 4c4 5 6 8 6 11a6 6 0 1 1-12 0c0-3 2-6 6-11Z" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);
Icon.Sodium = ({ size = 22, color = '#3A4A3F' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <rect x="5" y="5" width="14" height="14" rx="2" fill="#2563EB" opacity=".22"/>
    <rect x="5" y="5" width="14" height="14" rx="2" fill="none" stroke={color} strokeWidth="1.5"/>
    <text x="12" y="16" textAnchor="middle" fontFamily="Pretendard Variable, sans-serif" fontSize="9" fontWeight="700" fill={color}>Na</text>
  </svg>
);
Icon.Sugar = ({ size = 22, color = '#3A4A3F' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M7 8h10l-1 11H8z" fill="#DDE2DC"/>
    <path d="M7 8h10l-1 11H8z" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M9 5h6v3H9z" fill="none" stroke={color} strokeWidth="1.5"/>
  </svg>
);
Icon.Kcal = ({ size = 22, color = '#3A4A3F', accent = '#E89B26' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M12 3c1 4 4 4 4 8a4 4 0 1 1-8 0c0-2 1-3 2-4 0-2 1-3 2-4Z" fill={accent} opacity=".5"/>
    <path d="M12 3c1 4 4 4 4 8a4 4 0 1 1-8 0c0-2 1-3 2-4 0-2 1-3 2-4Z" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);
Icon.Fiber = ({ size = 22, color = '#3A4A3F', accent = '#A8E063' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M4 20c2-10 6-14 16-16M5 20c8-2 12-6 14-14M6 20c5-1 9-5 10-10" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="18" cy="6" r="2" fill={accent}/>
  </svg>
);

// Allergen icons (custom)
Icon.Shrimp = ({ size = 22, color = '#D32F2F', accent = '#FCD7D7' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M5 14c0-4 4-7 8-7 4 0 6 2 6 4 0 3-3 4-3 6-3 2-7 1-9 0-2-1-2-3-2-3Z" fill={accent}/>
    <path d="M5 14c0-4 4-7 8-7 4 0 6 2 6 4 0 3-3 4-3 6-3 2-7 1-9 0-2-1-2-3-2-3Z" fill="none" stroke={color} strokeWidth="1.5"/>
    <circle cx="14" cy="10" r="1" fill={color}/>
    <path d="M3 11c1-1 2-1 3-1M3 14c1 0 2 0 3-1" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);
Icon.Peanut = ({ size = 22, color = '#D32F2F', accent = '#FCD7D7' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M11 4c2 0 3 2 3 3 2 0 3 2 3 4s-1 4-3 4c0 2-2 4-4 4s-3-2-3-4c-2 0-3-2-3-4s2-3 3-4c0-1 1-3 4-3Z" fill={accent}/>
    <path d="M11 4c2 0 3 2 3 3 2 0 3 2 3 4s-1 4-3 4c0 2-2 4-4 4s-3-2-3-4c-2 0-3-2-3-4s2-3 3-4c0-1 1-3 4-3Z" fill="none" stroke={color} strokeWidth="1.5"/>
  </svg>
);
Icon.Milk = ({ size = 22, color = '#3A4A3F', accent = '#DCE9DF' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M8 4h8v3l1 4v9H7v-9l1-4z" fill={accent}/>
    <path d="M8 4h8v3l1 4v9H7v-9l1-4z" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);
Icon.Egg = ({ size = 22, color = '#3A4A3F', accent = '#FFE5A8' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <ellipse cx="12" cy="14" rx="6" ry="8" fill={accent}/>
    <ellipse cx="12" cy="14" rx="6" ry="8" fill="none" stroke={color} strokeWidth="1.5"/>
  </svg>
);
Icon.Wheat = ({ size = 22, color = '#3A4A3F', accent = '#E89B26' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M12 22V8" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 10c-2-1-3-3-3-5 2 0 3 1 3 3M12 10c2-1 3-3 3-5-2 0-3 1-3 3" fill={accent} stroke={color} strokeWidth="1.2"/>
    <path d="M12 14c-2-1-3-3-3-5 2 0 3 1 3 3M12 14c2-1 3-3 3-5-2 0-3 1-3 3" fill={accent} stroke={color} strokeWidth="1.2"/>
    <path d="M12 18c-2-1-3-3-3-5 2 0 3 1 3 3M12 18c2-1 3-3 3-5-2 0-3 1-3 3" fill={accent} stroke={color} strokeWidth="1.2"/>
  </svg>
);
Icon.Crab = ({ size = 22, color = '#D32F2F', accent = '#FCD7D7' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <ellipse cx="12" cy="14" rx="7" ry="5" fill={accent}/>
    <ellipse cx="12" cy="14" rx="7" ry="5" fill="none" stroke={color} strokeWidth="1.5"/>
    <path d="M5 13c-2 0-3-2-3-3M19 13c2 0 3-2 3-3M8 18l-3 3M16 18l3 3" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="10" cy="13" r="0.8" fill={color}/>
    <circle cx="14" cy="13" r="0.8" fill={color}/>
  </svg>
);
Icon.Fish = ({ size = 22, color = '#3A4A3F', accent = '#A8C9E0' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M3 12c2-4 6-6 11-6 4 0 7 2 8 6-1 4-4 6-8 6-5 0-9-2-11-6Z" fill={accent}/>
    <path d="M3 12c2-4 6-6 11-6 4 0 7 2 8 6-1 4-4 6-8 6-5 0-9-2-11-6Z" fill="none" stroke={color} strokeWidth="1.5"/>
    <path d="M3 12 1 9v6l2-3Z" fill={accent} stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    <circle cx="17" cy="11" r="0.8" fill={color}/>
  </svg>
);
Icon.Soy = ({ size = 22, color = '#3A4A3F', accent = '#C6EE94' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M6 7c2-2 5-3 8-2 4 1 5 5 4 8-1 4-5 5-8 4-4-1-6-5-4-10Z" fill={accent}/>
    <path d="M6 7c2-2 5-3 8-2 4 1 5 5 4 8-1 4-5 5-8 4-4-1-6-5-4-10Z" fill="none" stroke={color} strokeWidth="1.5"/>
    <circle cx="10" cy="10" r="1" fill={color}/>
    <circle cx="14" cy="13" r="1" fill={color}/>
  </svg>
);
Icon.Nut = ({ size = 22, color = '#3A4A3F', accent = '#E89B26' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M8 4c3-1 6 0 8 3 2 4 1 9-3 12-4 2-9 0-10-5 0-3 2-9 5-10Z" fill={accent} opacity=".5"/>
    <path d="M8 4c3-1 6 0 8 3 2 4 1 9-3 12-4 2-9 0-10-5 0-3 2-9 5-10Z" fill="none" stroke={color} strokeWidth="1.5"/>
    <path d="M10 8c1 2 3 4 6 5" stroke={color} strokeWidth="1.2"/>
  </svg>
);
Icon.Banana = ({ size = 22, color = '#3A4A3F', accent = '#E8D265' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M5 4c1 8 5 14 14 14 1 0 2 0 1 1-2 3-9 4-13 1S2 11 3 6c0-2 2-3 2-2Z" fill={accent}/>
    <path d="M5 4c1 8 5 14 14 14 1 0 2 0 1 1-2 3-9 4-13 1S2 11 3 6c0-2 2-3 2-2Z" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);

// Disease icons
Icon.Diabetes = ({ size = 22, color = '#1F4D2C', accent = '#A8E063' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M8 5h8l-1 4 3 5c1 3-1 6-4 6h-4c-3 0-5-3-4-6l3-5-1-4Z" fill={accent} opacity=".5"/>
    <path d="M8 5h8l-1 4 3 5c1 3-1 6-4 6h-4c-3 0-5-3-4-6l3-5-1-4Z" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    <circle cx="12" cy="14" r="1.2" fill={color}/>
  </svg>
);
Icon.Heart2 = ({ size = 22, color = '#D32F2F', accent = '#FCD7D7' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M12 21s-7-4.5-9-9C1.5 8 4 4 8 4c2 0 3 1 4 2 1-1 2-2 4-2 4 0 6.5 4 5 8-2 4.5-9 9-9 9Z" fill={accent}/>
    <path d="M12 21s-7-4.5-9-9C1.5 8 4 4 8 4c2 0 3 1 4 2 1-1 2-2 4-2 4 0 6.5 4 5 8-2 4.5-9 9-9 9Z" fill="none" stroke={color} strokeWidth="1.5"/>
    <path d="M5 12h3l1-2 2 4 2-3 1 1h5" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
Icon.Kidney = ({ size = 22, color = '#3A4A3F', accent = '#A8C9E0' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M7 4c4-1 8 1 9 5s-1 9-5 11c-4 1-7-2-8-6s0-9 4-10Z" fill={accent} opacity=".7"/>
    <path d="M7 4c4-1 8 1 9 5s-1 9-5 11c-4 1-7-2-8-6s0-9 4-10Z" fill="none" stroke={color} strokeWidth="1.5"/>
  </svg>
);
Icon.Lung = ({ size = 22, color = '#3A4A3F', accent = '#FCD7D7' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M12 3v9M7 12c-3 0-4 3-4 5 0 3 2 4 4 4s3-2 3-4v-5c0-1-1 0-3 0ZM17 12c3 0 4 3 4 5 0 3-2 4-4 4s-3-2-3-4v-5c0-1 1 0 3 0Z" fill={accent} opacity=".6"/>
    <path d="M12 3v9M7 12c-3 0-4 3-4 5 0 3 2 4 4 4s3-2 3-4v-5c0-1-1 0-3 0ZM17 12c3 0 4 3 4 5 0 3-2 4-4 4s-3-2-3-4v-5c0-1 1 0 3 0Z" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);

window.Icon = Icon;

// Aliases / additions
Icon.Sparkle = (p) => <I {...p}><path d="M12 3v4M12 17v4M5 12H1M23 12h-4M6 6l2 2M16 16l2 2M6 18l2-2M16 8l2-2"/><path d="M12 8l1.5 2.5L16 12l-2.5 1.5L12 16l-1.5-2.5L8 12l2.5-1.5z"/></I>;
Icon.Truck = (p) => <I {...p}><path d="M1 3h15v13H1zM16 8h4l3 3v5h-7zM5.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM18.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/></I>;
Icon.Lock = (p) => <I {...p}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></I>;
Icon.Cart = (p) => <I {...p}><path d="M2 3h3l3 13h12l3-9H6"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/></I>;
Icon.User = (p) => <I {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></I>;
Icon.MapPin = (p) => <I {...p}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0Z"/><circle cx="12" cy="10" r="3"/></I>;
Icon.Bell = (p) => <I {...p}><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0"/></I>;
Icon.Paperclip = (p) => <I {...p}><path d="m21 11-8.5 8.5a5 5 0 1 1-7-7L14 4a3.5 3.5 0 0 1 5 5L10.5 17.5a2 2 0 0 1-3-3L15 7"/></I>;
Icon.ArrowUp = (p) => <I {...p}><path d="M12 19V5M5 12l7-7 7 7"/></I>;
Icon.Sliders = (p) => <I {...p}><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/></I>;
Icon.X = (p) => <I {...p}><path d="M18 6 6 18M6 6l12 12"/></I>;

