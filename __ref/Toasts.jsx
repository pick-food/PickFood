// Toasts â animated stack of transient notifications in the bottom-right.
// Auto-renders from PF_STORE state.

window.Toasts = () => {
  const toasts = PF_STORE.use(s => s.toasts);

  return (
    <div style={{
      position: 'fixed', bottom: 96, right: 24, zIndex: 80,
      display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end', pointerEvents: 'none'
    }}>
      {toasts.map(t => <Toast key={t.id} t={t}/>)}
    </div>
  );
};

const Toast = ({ t }) => {
  const palette = {
    success: { bg: '#0F1E12', accent: '#A8E063', fg: '#fff' },
    cart:    { bg: '#0F1E12', accent: '#A8E063', fg: '#fff' },
    info:    { bg: '#fff',    accent: '#D32F2F', fg: '#0F1E12' },
    danger:  { bg: '#7A1F1B', accent: '#FCD7D7', fg: '#fff' }
  }[t.kind || 'info'];

  const IconCmp = {
    heart: Icon.Heart,
    cart:  Icon.Cart,
    check: Icon.Check,
    alert: Icon.Alert
  }[t.icon] || Icon.Info;

  return (
    <div className="pf-slide-right" style={{
      pointerEvents: 'auto',
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 16px 12px 12px',
      background: palette.bg, color: palette.fg,
      borderRadius: 12, minWidth: 280, maxWidth: 360,
      boxShadow: '0 12px 36px rgba(15,30,18,0.22)',
      border: t.kind === 'info' ? '1px solid #E5E7E1' : 'none'
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: 999, flexShrink: 0,
        background: t.kind === 'info' ? '#FEEEEE' : palette.accent + '28',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <IconCmp size={16} stroke={palette.accent} filled={t.icon === 'heart'}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3 }}>{t.message}</div>
        {t.sub && <div style={{ fontSize: 11, opacity: 0.72, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.sub}</div>}
      </div>
      {t.action && (
        <button onClick={t.onAction || (() => PF_STORE.removeToast(t.id))} style={{
          background: palette.accent + (t.kind === 'info' ? '20' : '28'),
          color: palette.accent, border: 'none', borderRadius: 8,
          padding: '6px 10px', fontFamily: 'inherit', fontSize: 11, fontWeight: 700, cursor: 'pointer', flexShrink: 0
        }}>{t.action}</button>
      )}
      <button onClick={() => PF_STORE.removeToast(t.id)} style={{
        background: 'transparent', border: 'none', cursor: 'pointer', padding: 4, flexShrink: 0,
        opacity: 0.6
      }}>
        <Icon.Close size={14} stroke={palette.fg}/>
      </button>
    </div>
  );
};

