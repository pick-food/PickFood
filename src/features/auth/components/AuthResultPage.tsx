import type { FC, ReactNode } from "react";

interface ActionButton {
  label: string;
  variant: "filled" | "outline";
  onClick?: () => void;
}

interface AuthResultPageProps {
  iconColor?: string;
  iconType?: "check" | "x";
  title: string;
  description?: string;
  extra?: ReactNode;
  buttons: ActionButton[];
}

const AuthResultPage: FC<AuthResultPageProps> = ({
  iconColor = "#1F4D2C",
  iconType  = "check",
  title,
  description,
  extra,
  buttons,
}) => {
  const isError  = iconType === "x";
  const circBg   = isError ? "rgba(211,47,47,0.10)"  : "rgba(31,77,44,0.10)";
  const borderC  = isError ? "rgba(211,47,47,0.18)"  : "rgba(31,77,44,0.18)";
  const color    = isError ? "#D32F2F" : iconColor;

  return (
    <div style={{ background: '#FAFAF6', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>

        {/* Icon */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
          <div style={{
            width: 80, height: 80, borderRadius: 999,
            background: circBg, border: `2px solid ${borderC}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {isError ? (
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth="2.4" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
        </div>

        {/* Card */}
        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #E5E7E1', padding: '32px 28px', textAlign: 'center' }}>

          {/* Title */}
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0F1E12', letterSpacing: '-0.02em', lineHeight: 1.4, marginBottom: description || extra ? 14 : 28, whiteSpace: 'pre-line' }}>
            {title}
          </h1>

          {/* Description */}
          {description && (
            <p style={{ fontSize: 14, color: '#6B7A6E', lineHeight: 1.7, marginBottom: extra ? 20 : 28, whiteSpace: 'pre-line' }}>
              {description}
            </p>
          )}

          {/* Extra */}
          {extra && (
            <div style={{ marginBottom: 28 }}>{extra}</div>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 8 }}>
            {buttons.map((btn, i) =>
              btn.variant === "filled" ? (
                <button
                  key={i}
                  onClick={btn.onClick}
                  style={{
                    flex: 1, height: 50, borderRadius: 12, border: 'none', cursor: 'pointer',
                    fontFamily: 'inherit', fontSize: 15, fontWeight: 700, color: '#fff',
                    background: 'linear-gradient(135deg, #1F4D2C, #2A6339)',
                    boxShadow: '0 4px 14px rgba(31,77,44,0.22)', transition: 'opacity 160ms',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                  {btn.label}
                </button>
              ) : (
                <button
                  key={i}
                  onClick={btn.onClick}
                  style={{
                    flex: 1, height: 50, borderRadius: 12, cursor: 'pointer',
                    fontFamily: 'inherit', fontSize: 15, fontWeight: 700,
                    color: '#1F4D2C', background: '#fff',
                    border: '1.5px solid #1F4D2C', transition: 'background 160ms',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#F0F6F1')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
                >
                  {btn.label}
                </button>
              )
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AuthResultPage;
