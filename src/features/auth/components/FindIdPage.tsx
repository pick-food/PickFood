import type { FC } from "react";
import { useFindId } from "../hooks/useFindId";
import AuthResultPage from "./AuthResultPage";

interface FindIdPageProps {
  onLogin?:        () => void;
  onSignup?:       () => void;
  onFindPassword?: () => void;
}

const inputStyle: React.CSSProperties = {
  flex: 1, minWidth: 0, height: 48, padding: '0 16px',
  border: '1.5px solid #E5E7E1', borderRadius: 10,
  fontFamily: 'inherit', fontSize: 14, background: '#fff', color: '#0F1E12',
  outline: 'none', transition: 'border-color 200ms',
};

/* ── HeaderIcon ──────────────────────────────────────────── */
const PersonSearchIco = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <circle cx="10" cy="8" r="4" stroke="#A8E063" strokeWidth="2"/>
    <path d="M2 20c0-4 3.58-6 8-6" stroke="#A8E063" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="18" cy="18" r="3" stroke="#A8E063" strokeWidth="2"/>
    <path d="M20.5 20.5L23 23" stroke="#A8E063" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const FindIdPage: FC<FindIdPageProps> = ({ onLogin, onSignup, onFindPassword }) => {
  const {
    name, setName,
    phone, handlePhoneChange, phoneValid,
    phoneCode, setPhoneCode,
    phoneStatus, sendPhoneCode, verifyPhoneCode,
    result, foundId,
    timeLeft, formatTime,
    handleSubmit, error, loading,
  } = useFindId();

  /* ── 아이디 없음 ─────────────────────────────────────────── */
  if (result === "notFound") {
    return (
      <AuthResultPage
        iconType="x"
        title="일치하는 계정을 찾을 수 없습니다"
        description={"입력하신 정보와 일치하는 계정이 없습니다.\n입력하신 정보를 다시 확인하거나 회원가입을 진행해주세요."}
        buttons={[
          { label: "다시 시도",   variant: "filled",  onClick: () => window.location.reload() },
          { label: "회원가입하기", variant: "outline", onClick: onSignup },
        ]}
      />
    );
  }

  /* ── 아이디 찾기 성공 ─────────────────────────────────────── */
  if (result === "found") {
    return (
      <AuthResultPage
        iconType="check"
        title={`${name}님의 아이디를\n찾았습니다`}
        extra={
          <div>
            {/* 아이디 표시 박스 */}
            <div style={{
              background: '#F0F6F1', border: '1.5px solid #C9E4CF', borderRadius: 12,
              padding: '16px 20px', marginBottom: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: 12, color: '#6B7A6E' }}>아이디</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#0F1E12', letterSpacing: '0.02em' }}>{foundId}</span>
            </div>
            {/* 타이머 */}
            <div style={{
              background: '#FAFAF6', borderRadius: 8, padding: '10px 14px',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#9AA89D" strokeWidth="2"/>
                <path d="M12 6v6l4 2" stroke="#9AA89D" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span style={{ fontSize: 12, color: '#9AA89D', flex: 1 }}>보안을 위해 {formatTime(timeLeft)} 후 재인증이 필요합니다</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#1F4D2C', fontVariantNumeric: 'tabular-nums' }}>{formatTime(timeLeft)}</span>
            </div>
          </div>
        }
        buttons={[
          { label: "로그인하기",    variant: "filled",  onClick: onLogin },
          { label: "비밀번호 찾기", variant: "outline", onClick: onFindPassword },
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
            <PersonSearchIco />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0F1E12', letterSpacing: '-0.02em' }}>아이디 찾기</h1>
          <p style={{ fontSize: 14, color: '#6B7A6E', marginTop: 8, lineHeight: 1.5 }}>가입 시 등록한 이름과 휴대폰 번호로 찾을 수 있습니다</p>
        </div>

        {/* 폼 카드 */}
        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #E5E7E1', padding: '28px', marginBottom: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* 이름 */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#0F1E12', display: 'block', marginBottom: 8 }}>이름</label>
              <input
                type="text"
                autoComplete="off"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="이름을 입력해주세요"
                style={{ ...inputStyle, width: '100%' }}
                onFocus={e => (e.target.style.borderColor = '#1F4D2C')}
                onBlur={e => (e.target.style.borderColor = '#E5E7E1')}
              />
            </div>

            {/* 휴대폰 번호 */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#0F1E12', display: 'block', marginBottom: 8 }}>휴대폰 번호</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="tel"
                  autoComplete="off"
                  value={phone}
                  onChange={e => handlePhoneChange(e.target.value)}
                  placeholder="010-0000-0000"
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#1F4D2C')}
                  onBlur={e => (e.target.style.borderColor = '#E5E7E1')}
                />
                <button
                  onClick={sendPhoneCode}
                  disabled={!phoneValid || loading}
                  style={{
                    height: 48, padding: '0 16px', borderRadius: 10, flexShrink: 0,
                    border: `1.5px solid ${phoneValid ? '#1F4D2C' : '#E5E7E1'}`,
                    background: phoneValid ? '#F0F6F1' : '#fff',
                    color: phoneValid ? '#1F4D2C' : '#9AA89D',
                    fontFamily: 'inherit', fontSize: 13, fontWeight: 700,
                    cursor: phoneValid ? 'pointer' : 'not-allowed', transition: 'all 160ms',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {phoneStatus === 'sent' ? '재전송' : '인증번호 전송'}
                </button>
              </div>
            </div>

            {/* 인증번호 입력 */}
            {(phoneStatus === "sent" || phoneStatus === "verified") && (
              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: '#0F1E12', display: 'block', marginBottom: 8 }}>인증번호</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    autoComplete="off"
                    value={phoneCode}
                    onChange={e => setPhoneCode(e.target.value)}
                    placeholder="인증번호 6자리를 입력하세요"
                    maxLength={6}
                    style={{ ...inputStyle, letterSpacing: '0.2em', fontWeight: 700 }}
                    onFocus={e => (e.target.style.borderColor = '#1F4D2C')}
                    onBlur={e => (e.target.style.borderColor = '#E5E7E1')}
                  />
                  {phoneStatus === "verified" ? (
                    <div style={{
                      height: 48, padding: '0 16px', borderRadius: 10, flexShrink: 0,
                      background: '#1F4D2C', color: '#A8E063',
                      fontFamily: 'inherit', fontSize: 13, fontWeight: 700,
                      display: 'flex', alignItems: 'center', whiteSpace: 'nowrap',
                    }}>
                      ✓ 인증 완료
                    </div>
                  ) : (
                    <button
                      onClick={verifyPhoneCode}
                      disabled={!phoneCode || loading}
                      style={{
                        height: 48, padding: '0 16px', borderRadius: 10, flexShrink: 0,
                        background: '#1F4D2C', color: '#fff', border: 'none',
                        fontFamily: 'inherit', fontSize: 13, fontWeight: 700,
                        cursor: phoneCode ? 'pointer' : 'not-allowed', transition: 'opacity 160ms',
                        whiteSpace: 'nowrap',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
                      onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                    >
                      확인
                    </button>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* 에러 */}
          {error && (
            <p style={{ fontSize: 12, color: '#D32F2F', marginTop: 12, textAlign: 'center' }}>{error}</p>
          )}

          {/* 제출 버튼 */}
          <button
            onClick={handleSubmit}
            style={{
              width: '100%', height: 50, marginTop: 24, borderRadius: 12, border: 'none',
              cursor: 'pointer', fontFamily: 'inherit', fontSize: 15, fontWeight: 800,
              color: '#fff', background: 'linear-gradient(135deg, #1F4D2C, #2A6339)',
              boxShadow: '0 4px 14px rgba(31,77,44,0.25)', transition: 'opacity 160ms',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            아이디 찾기
          </button>
        </div>

        {/* 하단 링크 */}
        <div style={{ textAlign: 'center', fontSize: 13, color: '#6B7A6E' }}>
          <button
            onClick={onLogin}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, color: '#6B7A6E' }}
          >
            ← 로그인으로 돌아가기
          </button>
        </div>

      </div>
    </div>
  );
};

export default FindIdPage;
