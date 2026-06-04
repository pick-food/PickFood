import type { FC } from "react";
import { useLogin } from "../hooks/useLogin";

import naverLogo  from "@/assets/icons/naver.png";
import kakaoLogo  from "@/assets/icons/kakao.png";
import appleLogo  from "@/assets/icons/apple.png";
import googleLogo from "@/assets/icons/google.png";

interface LoginPageProps {
  onSuccess?:      () => void;
  onSignup?:       () => void;
  onFindId?:       () => void;
  onFindPassword?: () => void;
}

const Field: FC<{ label: string; hint?: string; children: React.ReactNode }> = ({ label, hint, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <label style={{ fontSize: 13, fontWeight: 700, color: '#0F1E12' }}>
      {label}
      {hint && <span style={{ fontSize: 11, fontWeight: 400, color: '#9AA89D', marginLeft: 6 }}>{hint}</span>}
    </label>
    {children}
  </div>
);

const inputStyle: React.CSSProperties = {
  width: '100%', height: 48, padding: '0 16px',
  border: '1.5px solid #E5E7E1', borderRadius: 10,
  fontFamily: 'inherit', fontSize: 14, background: '#fff', color: '#0F1E12',
  outline: 'none', transition: 'border-color 200ms',
};

const CheckIco = () => (
  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LoginPage: FC<LoginPageProps> = ({ onSuccess, onSignup, onFindId, onFindPassword }) => {
  const { id, setId, password, setPassword, autoLogin, setAutoLogin, handleLogin, error, loading } = useLogin(onSuccess);

  return (
    <div style={{ background: '#FAFAF6', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>

        {/* 헤더 */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #1F4D2C, #2A6339)', marginBottom: 16, boxShadow: '0 8px 24px rgba(31,77,44,0.25)' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L4 6v6c0 5.5 3.5 10.7 8 12 4.5-1.3 8-6.5 8-12V6L12 2z" stroke="#A8E063" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M9 12l2 2 4-4" stroke="#A8E063" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0F1E12', letterSpacing: '-0.02em' }}>pickfood에 오신 것을 환영해요</h1>
          <p style={{ fontSize: 14, color: '#6B7A6E', marginTop: 8, lineHeight: 1.5 }}>안심 식품 쇼핑을 시작하세요</p>
        </div>

        {/* 소셜 로그인 (상단) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
          <button style={{ width: '100%', height: 48, borderRadius: 12, border: 'none', background: '#03A94D', display: 'flex', alignItems: 'center', cursor: 'pointer', position: 'relative', fontFamily: 'inherit', transition: 'opacity 160ms' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')} onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
            <img src={naverLogo} alt="네이버" style={{ width: 20, height: 20, position: 'absolute', left: 18, filter: 'brightness(0) invert(1)' }} />
            <span style={{ width: '100%', textAlign: 'center', fontSize: 14, fontWeight: 700, color: '#fff' }}>네이버로 로그인</span>
          </button>
          <button style={{ width: '100%', height: 48, borderRadius: 12, border: 'none', background: '#FEE500', display: 'flex', alignItems: 'center', cursor: 'pointer', position: 'relative', fontFamily: 'inherit' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')} onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
            <img src={kakaoLogo} alt="카카오" style={{ width: 20, height: 20, position: 'absolute', left: 18 }} />
            <span style={{ width: '100%', textAlign: 'center', fontSize: 14, fontWeight: 700, color: '#0F1E12' }}>카카오로 로그인</span>
          </button>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button style={{ height: 48, borderRadius: 12, border: 'none', background: '#1A1A1A', display: 'flex', alignItems: 'center', cursor: 'pointer', position: 'relative', fontFamily: 'inherit' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')} onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
              <img src={appleLogo} alt="Apple" style={{ width: 18, height: 18, position: 'absolute', left: 16, filter: 'brightness(0) invert(1)' }} />
              <span style={{ width: '100%', textAlign: 'center', fontSize: 13, fontWeight: 700, color: '#fff' }}>Apple</span>
            </button>
            <button style={{ height: 48, borderRadius: 12, border: '1.5px solid #E5E7E1', background: '#fff', display: 'flex', alignItems: 'center', cursor: 'pointer', position: 'relative', fontFamily: 'inherit' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#FAFAF6')} onMouseLeave={e => (e.currentTarget.style.background = '#fff')}>
              <img src={googleLogo} alt="Google" style={{ width: 18, height: 18, position: 'absolute', left: 16 }} />
              <span style={{ width: '100%', textAlign: 'center', fontSize: 13, fontWeight: 700, color: '#3A4A3F' }}>Google</span>
            </button>
          </div>
        </div>

        {/* 구분선 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <div style={{ flex: 1, height: 1, background: '#E5E7E1' }} />
          <span style={{ fontSize: 12, color: '#9AA89D', fontWeight: 600 }}>또는 이메일로 로그인</span>
          <div style={{ flex: 1, height: 1, background: '#E5E7E1' }} />
        </div>

        {/* 이메일 로그인 폼 */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 28, border: '1px solid #E5E7E1', marginBottom: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Field label="아이디">
              <input
                type="text"
                autoComplete="off"
                value={id}
                onChange={e => setId(e.target.value)}
                placeholder="아이디를 입력해주세요"
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#1F4D2C')}
                onBlur={e => (e.target.style.borderColor = '#E5E7E1')}
              />
            </Field>
            <Field label="비밀번호">
              <input
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="비밀번호를 입력해주세요"
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#1F4D2C')}
                onBlur={e => (e.target.style.borderColor = '#E5E7E1')}
              />
            </Field>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
            <button type="button" onClick={() => setAutoLogin(!autoLogin)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
              <span style={{ width: 16, height: 16, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 200ms', background: autoLogin ? '#1F4D2C' : 'transparent', border: autoLogin ? 'none' : '1.5px solid #C9CFC4' }}>
                {autoLogin && <CheckIco />}
              </span>
              <span style={{ fontSize: 12, fontWeight: 500, color: '#6B7A6E' }}>자동 로그인</span>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button onClick={onFindId} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, color: '#6B7A6E' }}>아이디 찾기</button>
              <span style={{ width: 1, height: 10, background: '#E5E7E1' }} />
              <button onClick={onFindPassword} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, color: '#6B7A6E' }}>비밀번호 찾기</button>
            </div>
          </div>

          {error && <p style={{ fontSize: 12, color: '#D32F2F', textAlign: 'center', marginTop: 12 }}>{error}</p>}

          <button
            onClick={handleLogin}
            style={{ width: '100%', height: 50, marginTop: 20, borderRadius: 12, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 15, fontWeight: 800, color: '#fff', background: 'linear-gradient(135deg, #1F4D2C, #2A6339)', boxShadow: '0 4px 14px rgba(31,77,44,0.25)', transition: 'opacity 160ms' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.92')} onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </div>

        {/* 회원가입 링크 */}
        <div style={{ textAlign: 'center', fontSize: 13, color: '#6B7A6E' }}>
          아직 계정이 없으신가요?{' '}
          <button onClick={onSignup} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, color: '#1F4D2C', textDecoration: 'underline' }}>
            회원가입 → 알레르기 프로필 등록
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
