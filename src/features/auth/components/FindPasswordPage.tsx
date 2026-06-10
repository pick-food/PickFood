import type { FC } from "react";
import { useFindPassword } from "../hooks/useFindPassword";
import AuthResultPage from "./AuthResultPage";

interface FindPasswordPageProps {
  onLogin?:  () => void;
  onSignup?: () => void;
}

const inputStyle: React.CSSProperties = {
  width: '100%', height: 48, padding: '0 16px',
  border: '1.5px solid #E5E7E1', borderRadius: 10,
  fontFamily: 'inherit', fontSize: 14, background: '#fff', color: '#0F1E12',
  outline: 'none', transition: 'border-color 200ms',
};

const LockIco = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <rect x="5" y="11" width="14" height="10" rx="2" stroke="#A8E063" strokeWidth="2"/>
    <path d="M8 11V7a4 4 0 018 0v4" stroke="#A8E063" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="16" r="1.5" fill="#A8E063"/>
  </svg>
);

const FindPasswordPage: FC<FindPasswordPageProps> = ({ onLogin, onSignup }) => {
  const { email, setEmail, emailValid, result, error, loading, handleSubmit } = useFindPassword();

  /* ── 계정 없음 ───────────────────────────────────────────── */
  if (result === "notFound") {
    return (
      <AuthResultPage
        iconType="x"
        title="일치하는 계정을 찾을 수 없습니다"
        description={"입력하신 이메일과 일치하는 계정이 없습니다.\n이메일을 다시 확인하거나 회원가입을 진행해주세요."}
        buttons={[
          { label: "다시 시도",    variant: "filled",  onClick: () => window.location.reload() },
          { label: "회원가입하기", variant: "outline", onClick: onSignup },
        ]}
      />
    );
  }

  /* ── 메일 발송 완료 ──────────────────────────────────────── */
  if (result === "found") {
    return (
      <AuthResultPage
        iconType="check"
        title="비밀번호 재설정 이메일이 발송되었습니다"
        extra={
          <div style={{
            background: '#F0F6F1', border: '1.5px solid #C9E4CF', borderRadius: 12,
            padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#1F4D2C" strokeWidth="1.8"/>
              <path d="M22 6l-10 7L2 6" stroke="#1F4D2C" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1F4D2C' }}>{email}</div>
              <div style={{ fontSize: 12, color: '#6B7A6E', marginTop: 2 }}>로 링크를 발송했습니다. 메일함을 확인해주세요.</div>
            </div>
          </div>
        }
        buttons={[
          { label: "로그인하기", variant: "filled", onClick: onLogin },
        ]}
      />
    );
  }

  /* ── 입력 폼 ─────────────────────────────────────────────── */
  return (
    <div style={{ background: '#FAFAF6', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>

        {/* 헤더 */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 56, height: 56, borderRadius: 16, marginBottom: 16,
            background: 'linear-gradient(135deg, #1F4D2C, #2A6339)',
            boxShadow: '0 8px 24px rgba(31,77,44,0.25)',
          }}>
            <LockIco />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0F1E12', letterSpacing: '-0.02em' }}>비밀번호 찾기</h1>
          <p style={{ fontSize: 14, color: '#6B7A6E', marginTop: 8, lineHeight: 1.5 }}>가입 시 등록한 이메일로 재설정 링크를 보내드립니다</p>
        </div>

        {/* 폼 카드 */}
        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #E5E7E1', padding: '28px', marginBottom: 20 }}>

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: '#0F1E12', display: 'block', marginBottom: 8 }}>이메일</label>
            <input
              type="email"
              autoComplete="off"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="가입 시 등록한 이메일을 입력해주세요"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = '#1F4D2C')}
              onBlur={e => (e.target.style.borderColor = '#E5E7E1')}
            />
          </div>

          {/* 안내 박스 */}
          <div style={{
            background: '#F0F6F1', borderRadius: 10, padding: '12px 14px', marginBottom: 20,
            display: 'flex', alignItems: 'flex-start', gap: 10,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
              <circle cx="12" cy="12" r="10" stroke="#1F4D2C" strokeWidth="1.8"/>
              <path d="M12 8v4M12 16h.01" stroke="#1F4D2C" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            <span style={{ fontSize: 12, color: '#1F4D2C', lineHeight: 1.6 }}>
              등록된 이메일 주소로 비밀번호 재설정 링크가 발송됩니다. 스팸 메일함도 확인해주세요.
            </span>
          </div>

          {/* 에러 */}
          {error && (
            <p style={{ fontSize: 12, color: '#D32F2F', marginBottom: 12, textAlign: 'center' }}>{error}</p>
          )}

          {/* 제출 버튼 */}
          <button
            onClick={handleSubmit}
            disabled={!emailValid || loading}
            style={{
              width: '100%', height: 50, borderRadius: 12, border: 'none',
              cursor: emailValid && !loading ? 'pointer' : 'not-allowed',
              fontFamily: 'inherit', fontSize: 15, fontWeight: 800,
              color: '#fff',
              background: emailValid && !loading
                ? 'linear-gradient(135deg, #1F4D2C, #2A6339)'
                : '#C9CFC4',
              boxShadow: emailValid && !loading ? '0 4px 14px rgba(31,77,44,0.25)' : 'none',
              transition: 'all 160ms',
            }}
            onMouseEnter={e => { if (emailValid && !loading) e.currentTarget.style.opacity = '0.9'; }}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            {loading ? '처리 중...' : '재설정 이메일 발송'}
          </button>
        </div>

        {/* 하단 링크 */}
        <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', gap: 16, fontSize: 13, color: '#6B7A6E' }}>
          <button
            onClick={onLogin}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, color: '#6B7A6E' }}
          >
            ← 로그인으로 돌아가기
          </button>
          <span style={{ color: '#E5E7E1' }}>|</span>
          <button
            onClick={onSignup}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, color: '#1F4D2C' }}
          >
            회원가입
          </button>
        </div>

      </div>
    </div>
  );
};

export default FindPasswordPage;
