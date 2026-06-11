import type { FC } from "react";

interface LoginRequiredProps {
  onLogin: () => void;
}

const LockIco = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="11" width="18" height="11" rx="2" stroke="#A8E063" strokeWidth="1.6"/>
    <path d="M7 11V7a5 5 0 0110 0v4" stroke="#A8E063" strokeWidth="1.6" strokeLinecap="round"/>
    <circle cx="12" cy="16" r="1.5" fill="#A8E063"/>
  </svg>
);

const LoginRequired: FC<LoginRequiredProps> = ({ onLogin }) => (
  <div style={{
    flex: 1, display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    minHeight: 480, gap: 16, padding: '60px 24px',
  }}>
    <div style={{
      width: 96, height: 96, borderRadius: 999,
      background: '#0F1E12', display: 'flex', alignItems: 'center', justifyContent: 'center',
      marginBottom: 8,
    }}>
      <LockIco />
    </div>
    <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0F1E12', margin: 0 }}>
      로그인 후 이용해주세요
    </h2>
    <p style={{ fontSize: 14, color: '#6B7A6E', textAlign: 'center', lineHeight: 1.7, margin: 0 }}>
      해당 서비스는 로그인이 필요합니다.<br />
      로그인하고 맞춤 식품 쇼핑을 시작하세요.
    </p>
    <button
      onClick={onLogin}
      style={{
        marginTop: 8,
        padding: '14px 48px',
        background: '#1F4D2C',
        color: '#fff',
        border: 'none',
        borderRadius: 10,
        fontSize: 16,
        fontWeight: 700,
        cursor: 'pointer',
        letterSpacing: '-0.01em',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = '#0F1E12')}
      onMouseLeave={e => (e.currentTarget.style.background = '#1F4D2C')}
    >
      로그인하기
    </button>
  </div>
);

export default LoginRequired;
