import type { FC } from "react";
import { useState } from "react";
import { useSignup } from "../hooks/useSignup";
import TermsModel from "./TermsModel";
import { useAllergens } from "../../allergen/hooks/useAllergens";
import { createAllergenGroup } from "../../allergen/services/allergenApi";

const DISEASES = [
  { id: 'diabetes',       name: '당뇨',       emoji: '💉', desc: '당류·고GI 식품 회피' },
  { id: 'hyper_lip',      name: '고지혈증',   emoji: '🫀', desc: '포화지방·콜레스테롤 회피' },
  { id: 'hyper_tension',  name: '고혈압',     emoji: '🩺', desc: '나트륨 과다 식품 회피' },
  { id: 'kidney',         name: '신장질환',   emoji: '🫘', desc: '칼륨·인 과다 식품 회피' },
  { id: 'thyroid',        name: '갑상선질환', emoji: '🦋', desc: '요오드·글루텐 회피' },
  { id: 'gout',           name: '통풍',       emoji: '🦵', desc: '퓨린 과다 식품 회피' },
  { id: 'fatty_liver',    name: '지방간',     emoji: '🍺', desc: '포화지방·알코올 회피' },
  { id: 'cardiovascular', name: '심혈관질환', emoji: '❤️',  desc: '포화지방·염분 회피' },
];

// ── Types ────────────────────────────────────────────────────────────────────

interface AllergyGroup { id: string; name: string; allergens: string[] }
interface DiseaseGroup { id: string; name: string; diseases: string[] }

// ── Shared styles ────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  fontFamily: 'inherit', fontSize: 14, padding: '11px 14px',
  borderRadius: 8, border: '1px solid #C9CFC4',
  background: '#fff', color: '#0F1E12', width: '100%', outline: 'none',
  boxSizing: 'border-box',
};

const Field: FC<{ label: string; hint?: string; children: React.ReactNode }> = ({ label, hint, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <label style={{ fontSize: 12, fontWeight: 600, color: '#3A4A3F' }}>
      {label}
      {hint && <span style={{ fontSize: 11, fontWeight: 400, color: '#9AA89D', marginLeft: 6 }}>{hint}</span>}
    </label>
    {children}
  </div>
);

const PrevBtn: FC<{ onClick: () => void }> = ({ onClick }) => (
  <button onClick={onClick} style={{ padding: '12px 20px', background: '#fff', color: '#3A4A3F', border: '1px solid #C9CFC4', borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
    이전
  </button>
);

const NextBtn: FC<{ onClick: () => void; label: string; disabled?: boolean }> = ({ onClick, label, disabled }) => (
  <button onClick={onClick} disabled={disabled} style={{ padding: '12px 28px', background: disabled ? '#C9CFC4' : 'linear-gradient(135deg, #1F4D2C, #2A6339)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: disabled ? 'default' : 'pointer', fontFamily: 'inherit', opacity: disabled ? 0.7 : 1 }}>
    {label}
  </button>
);

// ── SignupPage ────────────────────────────────────────────────────────────────

interface SignupPageProps {
  onBack?: () => void;
  onComplete?: () => void;
}

const STEP_LABELS = ['계정 정보', '알레르기 그룹', '질병 그룹', '확인'];

const SignupPage: FC<SignupPageProps> = ({ onBack: _onBack, onComplete }) => {
  const [step, setStep] = useState(1);
  const [allergyGroups, setAllergyGroups] = useState<AllergyGroup[]>([{ id: 'me', name: '본인', allergens: [] }]);
  const [activeAllergyIdx, setActiveAllergyIdx] = useState(0);
  const [diseaseGroups, setDiseaseGroups] = useState<DiseaseGroup[]>([{ id: 'me', name: '본인', diseases: [] }]);
  const [activeDiseaseIdx, setActiveDiseaseIdx] = useState(0);
  const [showTerms, setShowTerms] = useState(false);

  // GET /allergens — 알레르기 유발물질 목록 로드
  const { allergens: apiAllergens, loading: allergensLoading } = useAllergens();

  // useSignup에 onComplete 래퍼 전달:
  // 회원가입 성공 → POST /allergen-groups 저장 → 부모 onComplete 호출
  // useSignup이 내부에서 onCompleteRef.current를 사용하므로 매 렌더마다 최신 allergyGroups 반영
  const {
    name, setName,
    nickname, setNickname,
    email, setEmail,
    emailCode, setEmailCode,
    password, setPassword,
    confirmPw, setConfirmPw,
    phone, setPhone,
    phoneVerifyCode,
    termsAgreed, setTermsAgreed,
    showPassword, setShowPassword,
    nicknameStatus, checkNickname,
    emailStatus, sendEmailCode, verifyEmailCode,
    phoneStatus, sendPhoneCode, verifyPhoneCode,
    passwordValid, passwordMatch, passwordMismatch,
    loading, error,
    handleSubmit,
  } = useSignup(async () => {
    // POST /allergen-groups: 알레르기가 하나라도 있는 그룹만 저장 (실패해도 블로킹하지 않음)
    const groupsWithAllergens = allergyGroups.filter(g => g.allergens.length > 0);
    await Promise.allSettled(
      groupsWithAllergens.map(g =>
        createAllergenGroup({ name: g.name, allergen_ids: g.allergens })
      )
    );
    onComplete?.();
  });

  // ── Helpers ───────────────────────────────────────────────────────────────

  function focusGreen(e: React.FocusEvent<HTMLInputElement>) { e.target.style.borderColor = '#1F4D2C'; }
  function blurGray(e: React.FocusEvent<HTMLInputElement>)   { e.target.style.borderColor = '#C9CFC4'; }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={{ background: '#FAFAF6', minHeight: '100vh', padding: '40px 24px 80px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>

        {/* Progress */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= step ? '#1F4D2C' : '#E5E7E1', transition: 'background 300ms' }} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6B7A6E' }}>
            <span>STEP {step} / 4</span>
            <span>{STEP_LABELS[step - 1]}</span>
          </div>
        </div>

        {/* ── Step 1: Account Info ─────────────────────────────────────────── */}
        {step === 1 && (
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: '#0F1E12', letterSpacing: '-0.02em', marginBottom: 8 }}>
              pickfood에 오신 것을 환영해요
            </h1>
            <p style={{ fontSize: 14, color: '#3A4A3F', lineHeight: 1.6, marginBottom: 32 }}>
              먼저 계정을 만들어 주세요. 다음 단계에서 알레르기·질병 정보를 등록하면<br />
              안전한 식품만 골라 보여드립니다.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* 이름 */}
              <Field label="이름">
                <input type="text" autoComplete="off" value={name} onChange={e => setName(e.target.value)}
                  placeholder="실명을 입력해주세요" style={inputStyle} onFocus={focusGreen} onBlur={blurGray} />
              </Field>

              {/* 닉네임 */}
              <Field label="닉네임(2~30글자)">
                <div style={{ display: 'flex', gap: 8 }}>
                  <input type="text" autoComplete="off" value={nickname} onChange={e => setNickname(e.target.value)}
                    placeholder="영문자로 시작, 영문·숫자만 사용 가능" style={{ ...inputStyle, flex: 1 }} onFocus={focusGreen} onBlur={blurGray} />
                  <button type="button" onClick={checkNickname} style={{
                    padding: '0 16px', height: 44, border: '1px solid', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 700, flexShrink: 0, whiteSpace: 'nowrap',
                    borderColor: nicknameStatus === 'available' ? '#1F4D2C' : '#C9CFC4',
                    background: nicknameStatus === 'available' ? '#1F4D2C' : '#fff',
                    color: nicknameStatus === 'available' ? '#fff' : '#3A4A3F',
                  }}>
                    {nicknameStatus === 'available' ? '검사 완료' : '중복 검사'}
                  </button>
                </div>
                {nicknameStatus === 'available' && <p style={{ fontSize: 11, color: '#27AE60', marginTop: 2 }}>사용 가능한 닉네임입니다.</p>}
                {nicknameStatus === 'duplicate' && <p style={{ fontSize: 11, color: '#D32F2F', marginTop: 2 }}>중복된 닉네임입니다.</p>}
              </Field>

              {/* 이메일 */}
              <Field label="이메일">
                <div style={{ display: 'flex', gap: 8 }}>
                  <input type="email" autoComplete="off" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="example@pickfood.com" style={{ ...inputStyle, flex: 1 }} onFocus={focusGreen} onBlur={blurGray} />
                  <button type="button" onClick={sendEmailCode} disabled={emailStatus === 'verified'} style={{
                    padding: '0 16px', height: 44, border: '1px solid', borderRadius: 8, cursor: (emailStatus === 'sent' || emailStatus === 'verified') ? 'default' : 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 700, flexShrink: 0, whiteSpace: 'nowrap',
                    borderColor: (emailStatus === 'sent' || emailStatus === 'verified') ? '#1F4D2C' : '#C9CFC4',
                    background: (emailStatus === 'sent' || emailStatus === 'verified') ? '#1F4D2C' : '#fff',
                    color: (emailStatus === 'sent' || emailStatus === 'verified') ? '#fff' : '#3A4A3F',
                  }}>
                    {emailStatus === 'verified' ? '인증 완료' : emailStatus === 'sent' ? '전송 완료' : '인증번호 전송'}
                  </button>
                </div>
                {(emailStatus === 'sent' || emailStatus === 'verified') && (
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <input type="text" autoComplete="off" value={emailCode} onChange={e => setEmailCode(e.target.value)}
                      placeholder="인증번호를 입력해주세요" style={{ ...inputStyle, flex: 1 }} onFocus={focusGreen} onBlur={blurGray} />
                    <button type="button" onClick={verifyEmailCode} disabled={emailStatus === 'verified'} style={{
                      padding: '0 16px', height: 44, border: '1px solid', borderRadius: 8, cursor: emailStatus === 'verified' ? 'default' : 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 700, flexShrink: 0,
                      background: emailStatus === 'verified' ? '#1F4D2C' : '#fff',
                      color: emailStatus === 'verified' ? '#fff' : '#3A4A3F',
                      borderColor: emailStatus === 'verified' ? '#1F4D2C' : '#C9CFC4',
                    }}>
                      {emailStatus === 'verified' ? '인증 완료' : '인증하기'}
                    </button>
                  </div>
                )}
              </Field>

              {/* 휴대폰 */}
              <Field label="휴대폰 번호">
                <div style={{ display: 'flex', gap: 8 }}>
                  <input type="tel" autoComplete="off" value={phone} onChange={e => setPhone(e.target.value)}
                    placeholder="01012345678 (- 없이 입력)" style={{ ...inputStyle, flex: 1 }} onFocus={focusGreen} onBlur={blurGray} />
                  <button type="button" onClick={sendPhoneCode} disabled={phoneStatus === 'verified'} style={{
                    padding: '0 16px', height: 44, border: '1px solid', borderRadius: 8, cursor: phoneStatus === 'verified' ? 'default' : 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 700, flexShrink: 0, whiteSpace: 'nowrap',
                    borderColor: (phoneStatus === 'sent' || phoneStatus === 'verified') ? '#1F4D2C' : '#C9CFC4',
                    background: (phoneStatus === 'sent' || phoneStatus === 'verified') ? '#1F4D2C' : '#fff',
                    color: (phoneStatus === 'sent' || phoneStatus === 'verified') ? '#fff' : '#3A4A3F',
                  }}>
                    {phoneStatus === 'verified' ? '인증 완료' : phoneStatus === 'sent' ? '재전송' : '인증번호 전송'}
                  </button>
                </div>
                {(phoneStatus === 'sent' || phoneStatus === 'verified') && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ background: '#F0F7F2', border: '1px solid #C9E4CF', borderRadius: 8, padding: '12px 14px', marginBottom: 8 }}>
                      <div style={{ fontSize: 12, color: '#1F4D2C', fontWeight: 600, marginBottom: 6 }}>아래 번호로 문자를 보내주세요 (5분 내)</div>
                      <div style={{ fontSize: 13, color: '#0F1E12' }}>수신번호: <strong>1666-3538</strong></div>
                      <div style={{ fontSize: 13, color: '#0F1E12', marginTop: 4 }}>메시지: <strong>PF-{phoneVerifyCode}</strong></div>
                    </div>
                    <button type="button" onClick={verifyPhoneCode} disabled={phoneStatus === 'verified'} style={{
                      width: '100%', padding: '11px 0', border: '1px solid', borderRadius: 8, cursor: phoneStatus === 'verified' ? 'default' : 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 700,
                      background: phoneStatus === 'verified' ? '#1F4D2C' : '#fff',
                      color: phoneStatus === 'verified' ? '#fff' : '#3A4A3F',
                      borderColor: phoneStatus === 'verified' ? '#1F4D2C' : '#C9CFC4',
                    }}>
                      {phoneStatus === 'verified' ? '인증 완료' : '문자 전송 후 인증 확인'}
                    </button>
                  </div>
                )}
              </Field>

              {/* 비밀번호 */}
              <Field label="비밀번호" hint="8자 이상, 영문·숫자·특수문자 포함">
                <div style={{ position: 'relative' }}>
                  <input type={showPassword ? 'text' : 'password'} autoComplete="new-password"
                    value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••" style={{ ...inputStyle, paddingRight: 44 }}
                    onFocus={focusGreen} onBlur={blurGray} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                    position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#9AA89D', padding: 0,
                  }}>
                    {showPassword
                      ? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><path d="M14.12 14.12a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    }
                  </button>
                </div>
                {password && !passwordValid && (
                  <p style={{ fontSize: 11, color: '#D32F2F', marginTop: 2 }}>특수문자, 영대소문자를 포함해주세요.</p>
                )}
              </Field>

              {/* 비밀번호 확인 */}
              <Field label="비밀번호 확인">
                <input type="password" autoComplete="new-password"
                  value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
                  placeholder="비밀번호를 다시 입력해주세요" style={inputStyle}
                  onFocus={focusGreen} onBlur={blurGray} />
                {passwordMismatch && <p style={{ fontSize: 11, color: '#D32F2F', marginTop: 2 }}>비밀번호가 일치하지 않습니다.</p>}
                {passwordMatch && <p style={{ fontSize: 11, color: '#27AE60', marginTop: 2 }}>비밀번호가 일치합니다.</p>}
              </Field>
            </div>

            {/* 약관 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 20 }}>
              <button type="button" onClick={() => setTermsAgreed(!termsAgreed)} style={{
                width: 16, height: 16, borderRadius: 4, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: termsAgreed ? 'none' : '1.5px solid #C9CFC4', background: termsAgreed ? '#1F4D2C' : 'transparent', cursor: 'pointer',
              }}>
                {termsAgreed && <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </button>
              <span style={{ fontSize: 12, color: '#6B7A6E' }}>
                <button type="button" onClick={() => setShowTerms(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, color: '#1F4D2C', fontWeight: 700, textDecoration: 'underline', padding: 0 }}>약관</button>에 동의합니다.
              </span>
            </div>

            {showTerms && (
              <TermsModel onClose={() => setShowTerms(false)} onAgree={() => { setTermsAgreed(true); setShowTerms(false); }} />
            )}
            {error && <p style={{ fontSize: 12, color: '#D32F2F', textAlign: 'center', marginTop: 12 }}>{error}</p>}

            <div style={{ marginTop: 32, display: 'flex', justifyContent: 'flex-end' }}>
              <NextBtn
                onClick={() => setStep(2)}
                label="다음으로"
                disabled={
                  !name ||
                  !nickname || nicknameStatus !== 'available' ||
                  emailStatus !== 'verified' ||
                  phoneStatus !== 'verified' ||
                  !password || !passwordValid ||
                  !passwordMatch ||
                  !termsAgreed
                }
              />
            </div>
          </div>
        )}

        {/* ── Step 2: Allergy Groups ───────────────────────────────────────── */}
        {step === 2 && (
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: '#0F1E12', letterSpacing: '-0.02em', marginBottom: 8 }}>알레르기 그룹을 만들어주세요</h1>
            <p style={{ fontSize: 14, color: '#3A4A3F', lineHeight: 1.6, marginBottom: 24 }}>
              본인·가족별로 그룹을 만들어 알레르기 식재료를 등록하세요.<br />
              여러 그룹을 만들면 필터에 복합적으로 적용할 수 있어요.
            </p>

            {/* Group tabs */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
              {allergyGroups.map((g, i) => (
                <button key={g.id} onClick={() => setActiveAllergyIdx(i)} style={{
                  padding: '8px 14px', fontFamily: 'inherit', fontSize: 13,
                  fontWeight: i === activeAllergyIdx ? 700 : 500,
                  border: '1px solid', borderColor: i === activeAllergyIdx ? '#1F4D2C' : '#C9CFC4',
                  background: i === activeAllergyIdx ? '#1F4D2C' : '#fff',
                  color: i === activeAllergyIdx ? '#fff' : '#3A4A3F',
                  borderRadius: 999, cursor: 'pointer',
                }}>
                  {g.name}{g.allergens.length > 0 && ` (${g.allergens.length})`}
                </button>
              ))}
              <button onClick={() => {
                const next: AllergyGroup[] = [...allergyGroups, { id: 'g' + Date.now(), name: `그룹 ${allergyGroups.length + 1}`, allergens: [] }];
                setAllergyGroups(next);
                setActiveAllergyIdx(next.length - 1);
              }} style={{
                padding: '8px 14px', fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
                border: '1px dashed #C9CFC4', background: '#fff', color: '#1F4D2C',
                borderRadius: 999, cursor: 'pointer',
              }}>
                + 그룹 추가
              </button>
            </div>

            {/* Active group editor */}
            <div style={{ background: '#FAFAF7', border: '1px solid #E5E7E1', borderRadius: 12, padding: 20 }}>
              <Field label="그룹 이름">
                <input type="text" value={allergyGroups[activeAllergyIdx].name}
                  onChange={e => {
                    const g = [...allergyGroups];
                    g[activeAllergyIdx] = { ...g[activeAllergyIdx], name: e.target.value };
                    setAllergyGroups(g);
                  }}
                  placeholder="예: 아빠, 아이, 엄마"
                  style={inputStyle} onFocus={focusGreen} onBlur={blurGray} />
              </Field>
              <div style={{ marginTop: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#3A4A3F', marginBottom: 10 }}>알레르기 식재료 (복수 선택)</div>
                {allergensLoading ? (
                  <div style={{ fontSize: 13, color: '#9AA89D', textAlign: 'center', padding: 16 }}>불러오는 중…</div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                    {apiAllergens.map(a => {
                      const sel = allergyGroups[activeAllergyIdx].allergens.includes(a.id);
                      return (
                        <button key={a.id} onClick={() => {
                          const g = [...allergyGroups];
                          const arr = g[activeAllergyIdx].allergens;
                          g[activeAllergyIdx] = { ...g[activeAllergyIdx], allergens: sel ? arr.filter(x => x !== a.id) : [...arr, a.id] };
                          setAllergyGroups(g);
                        }} style={{
                          padding: '10px 4px', fontFamily: 'inherit',
                          border: '1.5px solid', borderColor: sel ? '#D32F2F' : '#E5E7E1',
                          background: sel ? '#FEF2F2' : '#fff',
                          borderRadius: 10, cursor: 'pointer',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                        }}>
                          <span style={{ fontSize: 20 }}>{a.emoji}</span>
                          <div style={{ fontSize: 11, fontWeight: sel ? 700 : 500, color: sel ? '#B71C1C' : '#3A4A3F', textAlign: 'center' }}>{a.name}</div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
              <PrevBtn onClick={() => setStep(1)} />
              <NextBtn onClick={() => setStep(3)} label="다음 → 질병 등록" />
            </div>
          </div>
        )}

        {/* ── Step 3: Disease Groups ───────────────────────────────────────── */}
        {step === 3 && (
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: '#0F1E12', letterSpacing: '-0.02em', marginBottom: 8 }}>관리 중인 질환이 있나요?</h1>
            <p style={{ fontSize: 14, color: '#3A4A3F', lineHeight: 1.6, marginBottom: 24 }}>
              질환이 있다면 등록해 주세요. 안전한 영양 성분만 골라 추천해 드릴게요.<br />
              그룹을 여러 개 만들어 가족별로 관리할 수도 있어요.
            </p>

            {/* Group tabs */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
              {diseaseGroups.map((g, i) => (
                <button key={g.id} onClick={() => setActiveDiseaseIdx(i)} style={{
                  padding: '8px 14px', fontFamily: 'inherit', fontSize: 13,
                  fontWeight: i === activeDiseaseIdx ? 700 : 500,
                  border: '1px solid', borderColor: i === activeDiseaseIdx ? '#1F4D2C' : '#C9CFC4',
                  background: i === activeDiseaseIdx ? '#1F4D2C' : '#fff',
                  color: i === activeDiseaseIdx ? '#fff' : '#3A4A3F',
                  borderRadius: 999, cursor: 'pointer',
                }}>
                  {g.name}{g.diseases.length > 0 && ` (${g.diseases.length})`}
                </button>
              ))}
              <button onClick={() => {
                const next: DiseaseGroup[] = [...diseaseGroups, { id: 'd' + Date.now(), name: `그룹 ${diseaseGroups.length + 1}`, diseases: [] }];
                setDiseaseGroups(next);
                setActiveDiseaseIdx(next.length - 1);
              }} style={{
                padding: '8px 14px', fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
                border: '1px dashed #C9CFC4', background: '#fff', color: '#1F4D2C',
                borderRadius: 999, cursor: 'pointer',
              }}>
                + 그룹 추가
              </button>
            </div>

            {/* Active disease group editor */}
            <div style={{ background: '#FAFAF7', border: '1px solid #E5E7E1', borderRadius: 12, padding: 20 }}>
              <Field label="그룹 이름">
                <input type="text" value={diseaseGroups[activeDiseaseIdx].name}
                  onChange={e => {
                    const g = [...diseaseGroups];
                    g[activeDiseaseIdx] = { ...g[activeDiseaseIdx], name: e.target.value };
                    setDiseaseGroups(g);
                  }}
                  placeholder="예: 본인, 아버지"
                  style={inputStyle} onFocus={focusGreen} onBlur={blurGray} />
              </Field>
              <div style={{ marginTop: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#3A4A3F', marginBottom: 10 }}>관리 중인 질환 (복수 선택)</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                  {DISEASES.map(dis => {
                    const sel = diseaseGroups[activeDiseaseIdx].diseases.includes(dis.id);
                    return (
                      <button key={dis.id} onClick={() => {
                        const g = [...diseaseGroups];
                        const arr = g[activeDiseaseIdx].diseases;
                        g[activeDiseaseIdx] = { ...g[activeDiseaseIdx], diseases: sel ? arr.filter(x => x !== dis.id) : [...arr, dis.id] };
                        setDiseaseGroups(g);
                      }} style={{
                        padding: '14px 16px', fontFamily: 'inherit', textAlign: 'left',
                        border: '1.5px solid', borderColor: sel ? '#E89B26' : '#E5E7E1',
                        background: sel ? '#FFF8EC' : '#fff',
                        borderRadius: 10, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 12,
                      }}>
                        <div style={{ width: 36, height: 36, borderRadius: 999, background: sel ? '#FBE9C7' : '#F4F5F1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                          {dis.emoji}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: sel ? '#B97308' : '#0F1E12' }}>{dis.name}</div>
                          <div style={{ fontSize: 11, color: '#6B7A6E', marginTop: 2 }}>{dis.desc}</div>
                        </div>
                        {sel && (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M20 6L9 17l-5-5" stroke="#E89B26" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
              <PrevBtn onClick={() => setStep(2)} />
              <NextBtn onClick={() => setStep(4)} label="다음 → 확인" />
            </div>
          </div>
        )}

        {/* ── Step 4: Confirmation ─────────────────────────────────────────── */}
        {step === 4 && (
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: '#0F1E12', letterSpacing: '-0.02em', marginBottom: 8 }}>준비 완료!</h1>
            <p style={{ fontSize: 14, color: '#3A4A3F', lineHeight: 1.6, marginBottom: 24 }}>
              {name || '회원'}님의 프로필이 등록되었어요.<br />
              아래 정보는 마이페이지에서 언제든 수정할 수 있습니다.
            </p>

            <div style={{ background: '#FAFAF7', border: '1px solid #E5E7E1', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Account */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7A6E', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>계정 정보</div>
                <div style={{ fontSize: 14, color: '#0F1E12' }}>
                  <span style={{ fontWeight: 700 }}>{name}</span>
                  {email && <span style={{ color: '#6B7A6E', marginLeft: 8 }}>{email}</span>}
                </div>
              </div>

              {/* Allergy summary */}
              <div style={{ borderTop: '1px solid #E5E7E1', paddingTop: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7A6E', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>알레르기 그룹</div>
                {allergyGroups.map(g => (
                  <div key={g.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '5px 0' }}>
                    <strong style={{ fontSize: 13, color: '#0F1E12', minWidth: 60, paddingTop: 2 }}>{g.name}</strong>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {g.allergens.length === 0
                        ? <span style={{ fontSize: 12, color: '#9AA89D' }}>등록된 알레르기 없음</span>
                        : g.allergens.map(aid => {
                            const a = apiAllergens.find(x => x.id === aid);
                            if (!a) return null;
                            return (
                              <span key={aid} style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', background: '#FEF2F2', color: '#B71C1C', borderRadius: 999 }}>
                                {a.emoji} {a.name}
                              </span>
                            );
                          })
                      }
                    </div>
                  </div>
                ))}
              </div>

              {/* Disease summary */}
              <div style={{ borderTop: '1px solid #E5E7E1', paddingTop: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7A6E', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>질병 그룹</div>
                {diseaseGroups.map(g => (
                  <div key={g.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '5px 0' }}>
                    <strong style={{ fontSize: 13, color: '#0F1E12', minWidth: 60, paddingTop: 2 }}>{g.name}</strong>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {g.diseases.length === 0
                        ? <span style={{ fontSize: 12, color: '#9AA89D' }}>등록된 질환 없음</span>
                        : g.diseases.map(did => {
                            const dis = DISEASES.find(x => x.id === did)!;
                            return (
                              <span key={did} style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', background: '#FFF8EC', color: '#B97308', borderRadius: 999 }}>
                                {dis.emoji} {dis.name}
                              </span>
                            );
                          })
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {error && <p style={{ fontSize: 12, color: '#D32F2F', textAlign: 'center', marginTop: 12 }}>{error}</p>}

            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
              <PrevBtn onClick={() => setStep(3)} />
              <button onClick={handleSubmit} disabled={loading} style={{
                padding: '12px 28px', background: 'linear-gradient(135deg, #E89B26, #D4830C)', color: '#0F1E12',
                border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700,
                cursor: loading ? 'default' : 'pointer', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', gap: 6, opacity: loading ? 0.7 : 1,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17l-5-5" stroke="#0F1E12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {loading ? '처리 중...' : 'pickfood 시작하기'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default SignupPage;
