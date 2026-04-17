import type { FC } from "react";
import { useState } from "react";
import { useSignup } from "../hooks/useSignup";
import checkIcon from "@/assets/icons/check.png";
import TermsModel from "./TermsModel";

// ── 공통 서브 컴포넌트 ─────────────────────────────────────────────────────────

const FieldLabel: FC<{ label: string }> = ({ label }) => (
  <p className="text-[12px] font-medium text-gray-900 mb-[6px]">
    {label}
    <span className="text-[#FF0000] ml-[2px]">*</span>
  </p>
);

const OutlineBtn: FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-[72px] h-[38px] border border-primary rounded-xs text-[11px] font-medium text-primary hover:bg-primary-light transition-colors flex-shrink-0"
  >
    {label}
  </button>
);

const FilledBtn: FC<{ label: string }> = ({ label }) => (
  <div className="w-[72px] h-[38px] bg-primary rounded-xs text-[11px] font-medium text-white flex items-center justify-center flex-shrink-0">
    {label}
  </div>
);

const EyeToggle: FC<{ show: boolean; onToggle: () => void }> = ({ show, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className="absolute right-[12px] top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
    aria-label={show ? "비밀번호 숨기기" : "비밀번호 보기"}
  >
    {show ? (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ) : (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
        <path d="M14.12 14.12a3 3 0 11-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    )}
  </button>
);

const Checkbox: FC<{ checked: boolean; onToggle: () => void }> = ({ checked, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className={[
      "w-[13px] h-[13px] rounded-[2px] flex-shrink-0 flex items-center justify-center transition-colors",
      checked ? "bg-primary" : "border border-gray-300 bg-white",
    ].join(" ")}
    aria-checked={checked}
  >
    {checked && <img src={checkIcon} alt="" className="w-full h-full object-contain" />}
  </button>
);

// 입력 시에만 등장 — 조건부 렌더링
const ValidationMsg: FC<{ msg: string; type: "success" | "error" }> = ({ msg, type }) => (
  <p className={[
    "text-[11px] font-medium leading-[140%] mt-[4px]",
    type === "success" ? "text-[#00C900]" : "text-[#FF0000]",
  ].join(" ")}>
    {msg}
  </p>
);

// ── SignupPage ─────────────────────────────────────────────────────────────────
interface SignupPageProps {
  onBack?:     () => void;
  onComplete?: () => void;
}

const SignupPage: FC<SignupPageProps> = ({ onBack: _onBack, onComplete }) => {
  const [showTerms, setShowTerms] = useState(false);
  const {
    name, setName,
    nickname, setNickname,
    email, setEmail,
    emailCode, setEmailCode,
    password, setPassword,
    confirmPw, setConfirmPw,
    phone, setPhone,
    phoneCode, setPhoneCode,
    termsAgreed, setTermsAgreed,
    showPassword, setShowPassword,
    showConfirmPw, setShowConfirmPw,
    nicknameStatus, checkNickname,
    emailStatus, sendEmailCode, verifyEmailCode,
    phoneStatus, sendPhoneCode, verifyPhoneCode,
    passwordValid, passwordMatch, passwordMismatch,
    handleSubmit,
  } = useSignup();

  const inputBase =
    "flex-1 min-w-0 h-[38px] px-[14px] border border-gray-100 rounded-xs text-[12px] font-medium placeholder:text-gray-300 focus:outline-none focus:border-primary";

  // 모든 필드 사이 간격: mb-[10px]
  const fieldGap = "mb-[10px]";

  return (
    <div className="flex-1 bg-white flex items-center justify-center py-10">
      <div className="w-[360px] flex flex-col">

        <h1 className="text-[18px] font-semibold text-black mb-[24px] text-center">회원가입</h1>

        {/* 이름 */}
        <div className={fieldGap}>
          <FieldLabel label="이름" />
          <div className="flex">
            <input
              type="text"
              autoComplete="off"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력해주세요"
              className={inputBase}
            />
          </div>
        </div>

        {/* 닉네임 */}
        <div className={fieldGap}>
          <FieldLabel label="닉네임" />
          <div className="flex items-center gap-[6px]">
            <input
              type="text"
              autoComplete="off"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임을 입력해주세요"
              className={inputBase}
            />
            {nicknameStatus === "available"
              ? <FilledBtn label="검사 완료" />
              : <OutlineBtn label="중복 검사" onClick={checkNickname} />
            }
          </div>
          {nicknameStatus === "available" && (
            <ValidationMsg msg="사용가능한 닉네임입니다." type="success" />
          )}
          {nicknameStatus === "duplicate" && (
            <ValidationMsg msg="중복된 닉네임입니다." type="error" />
          )}
        </div>

        {/* 이메일 */}
        <div className={fieldGap}>
          <FieldLabel label="이메일" />
          <div className="flex items-center gap-[6px]">
            <input
              type="email"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력해주세요"
              className={inputBase}
            />
            {emailStatus === "verified"
              ? <FilledBtn label="인증 완료" />
              : <OutlineBtn label="인증번호전송" onClick={sendEmailCode} />
            }
          </div>
          {(emailStatus === "sent" || emailStatus === "verified") && (
            <div className="flex items-center gap-[6px] mt-[6px]">
              <input
                type="text"
                autoComplete="off"
                value={emailCode}
                onChange={(e) => setEmailCode(e.target.value)}
                placeholder="인증번호를 입력해주세요"
                className={inputBase}
              />
              {emailStatus === "verified"
                ? <FilledBtn label="인증 완료" />
                : <OutlineBtn label="인증하기" onClick={verifyEmailCode} />
              }
            </div>
          )}
        </div>

        {/* 비밀번호 */}
        <div className={fieldGap}>
          <FieldLabel label="비밀번호" />
          <div className="flex relative">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력해주세요"
              className={`${inputBase} pr-[36px]`}
            />
            <EyeToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
          </div>
          {password && !passwordValid && (
            <ValidationMsg msg="특수문자, 영대소문자를 포함해주세요." type="error" />
          )}
        </div>

        {/* 비밀번호 재입력 */}
        <div className={fieldGap}>
          <FieldLabel label="비밀번호 재입력" />
          <div className="flex relative">
            <input
              type={showConfirmPw ? "text" : "password"}
              autoComplete="new-password"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              placeholder="비밀번호를 다시 입력해주세요"
              className={`${inputBase} pr-[36px]`}
            />
            <EyeToggle show={showConfirmPw} onToggle={() => setShowConfirmPw(!showConfirmPw)} />
          </div>
          {passwordMismatch && (
            <ValidationMsg msg="비밀번호가 일치하지 않습니다." type="error" />
          )}
          {passwordMatch && (
            <ValidationMsg msg="비밀번호가 일치합니다." type="success" />
          )}
        </div>

        {/* 휴대폰 번호 */}
        <div className={fieldGap}>
          <FieldLabel label="휴대폰 번호" />
          <div className="flex items-center gap-[6px]">
            <input
              type="tel"
              autoComplete="off"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="휴대폰 번호를 입력해주세요"
              className={inputBase}
            />
            {phoneStatus === "verified"
              ? <FilledBtn label="인증 완료" />
              : <OutlineBtn label="인증번호전송" onClick={sendPhoneCode} />
            }
          </div>
          {(phoneStatus === "sent" || phoneStatus === "verified") && (
            <div className="flex items-center gap-[6px] mt-[6px]">
              <input
                type="text"
                autoComplete="off"
                value={phoneCode}
                onChange={(e) => setPhoneCode(e.target.value)}
                placeholder="인증번호를 입력해주세요"
                className={inputBase}
              />
              {phoneStatus === "verified"
                ? <FilledBtn label="인증 완료" />
                : <OutlineBtn label="인증완료" onClick={verifyPhoneCode} />
              }
            </div>
          )}
        </div>

        {/* 약관 동의 */}
        <div className="flex items-center gap-[8px] mb-[20px]">
          <Checkbox checked={termsAgreed} onToggle={() => setTermsAgreed(!termsAgreed)} />
          <p className="text-[11px] font-medium text-gray-400">
            <button
              type="button"
              onClick={() => setShowTerms(true)}
              className="text-gray-900 underline hover:text-primary transition-colors"
            >
              약관 동의
            </button>
            에 동의합니다.
          </p>
        </div>

        {/* 약관 모달 */}
        {showTerms && (
          <TermsModel
            onClose={() => setShowTerms(false)}
            onAgree={() => {
              setTermsAgreed(true);
              setShowTerms(false);
            }}
          />
        )}

        {/* 회원가입 버튼 */}
        <button
          type="button"
          onClick={onComplete ?? handleSubmit}
          className="w-full h-[44px] bg-primary rounded-xs text-[13px] font-medium text-white hover:bg-primary-dark transition-colors"
        >
          회원가입
        </button>

      </div>
    </div>
  );
};

export default SignupPage;