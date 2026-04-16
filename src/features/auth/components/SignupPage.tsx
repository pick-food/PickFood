import type { FC } from "react";
import { useSignup } from "../hooks/useSignup";

import checkIcon from "@/assets/icons/check.png";

// ── 공통 서브 컴포넌트 ─────────────────────────────────────────────────────────

const FieldLabel: FC<{ label: string }> = ({ label }) => (
  <p className="text-[10px] font-medium text-gray-900 mb-[4px]">
    {label}
    <span className="text-[#FF0000] ml-[2px]">*</span>
  </p>
);

const OutlineBtn: FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-[56px] h-[30px] border border-primary rounded-xs text-[8px] font-medium text-primary hover:bg-primary-light transition-colors flex-shrink-0"
  >
    {label}
  </button>
);

const FilledBtn: FC<{ label: string }> = ({ label }) => (
  <div className="w-[56px] h-[30px] bg-primary rounded-xs text-[8px] font-medium text-white flex items-center justify-center flex-shrink-0">
    {label}
  </div>
);

const EyeToggle: FC<{ show: boolean; onToggle: () => void }> = ({ show, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className="absolute right-[10px] top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
    aria-label={show ? "비밀번호 숨기기" : "비밀번호 보기"}
  >
    {show ? (
      // eye — 비밀번호 보이는 상태
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ) : (
      // eye-close — 기본 상태 (비밀번호 가려짐)
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
      "w-[10px] h-[10px] rounded-[1px] flex-shrink-0 flex items-center justify-center transition-colors",
      checked ? "bg-primary" : "border border-gray-300 bg-white",
    ].join(" ")}
    aria-checked={checked}
  >
    {checked && (
      <img src={checkIcon} alt="" className="w-full h-full object-contain" />
    )}
  </button>
);

// ── SignupPage ─────────────────────────────────────────────────────────────────
interface SignupPageProps {
  onBack?: () => void;
}

const SignupPage: FC<SignupPageProps> = ({ onBack: _onBack }) => {
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

  // flex-1 + min-w-0으로 모든 input 너비 통일
  const inputBase =
    "flex-1 min-w-0 h-[30px] px-[10px] border border-gray-100 rounded-xs text-[8px] font-medium placeholder:text-gray-300 focus:outline-none focus:border-primary";

  return (
    <div className="flex-1 bg-white flex items-center justify-center py-10">
      <div className="w-[280px] flex flex-col">

        <h1 className="text-h-14 font-semibold text-black mb-[22px] text-center">회원가입</h1>

        {/* 이름 */}
        <div className="mb-[14px]">
          <FieldLabel label="이름" />
          <div className="flex">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력해주세요"
              className={inputBase}
            />
          </div>
        </div>

        {/* 닉네임 */}
        <div className="mb-[4px]">
          <FieldLabel label="닉네임" />
          <div className="flex items-center gap-[4px]">
            <input
              type="text"
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
        </div>
        <div className="h-[14px] mb-[10px]">
          {nicknameStatus === "available" && (
            <p className="text-[8px] font-medium text-[#00C900]">사용가능한 닉네임입니다.</p>
          )}
          {nicknameStatus === "duplicate" && (
            <p className="text-[8px] font-medium text-[#FF0000]">중복된 닉네임입니다.</p>
          )}
        </div>

        {/* 이메일 */}
        <div className="mb-[4px]">
          <FieldLabel label="이메일" />
          <div className="flex items-center gap-[4px]">
            <input
              type="email"
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
        </div>
        {(emailStatus === "sent" || emailStatus === "verified") && (
          <div className="flex items-center gap-[4px] mt-[4px]">
            <input
              type="text"
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
        <div className="h-[4px] mb-[10px]" />

        {/* 비밀번호 */}
        <div className="mb-[4px]">
          <FieldLabel label="비밀번호" />
          <div className="flex relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력해주세요"
              className={`${inputBase} pr-[32px]`}
            />
            <EyeToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
          </div>
        </div>
        <div className="h-[14px] mb-[10px]">
          {password && !passwordValid && (
            <p className="text-[8px] font-medium text-[#FF0000]">특수문자, 영대소문자를 포함해주세요.</p>
          )}
        </div>

        {/* 비밀번호 재입력 */}
        <div className="mb-[4px]">
          <FieldLabel label="비밀번호 재입력" />
          <div className="flex relative">
            <input
              type={showConfirmPw ? "text" : "password"}
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              placeholder="비밀번호를 다시 입력해주세요"
              className={`${inputBase} pr-[32px]`}
            />
            <EyeToggle show={showConfirmPw} onToggle={() => setShowConfirmPw(!showConfirmPw)} />
          </div>
        </div>
        <div className="h-[14px] mb-[10px]">
          {passwordMismatch && (
            <p className="text-[8px] font-medium text-[#FF0000]">비밀번호가 일치하지 않습니다.</p>
          )}
          {passwordMatch && (
            <p className="text-[8px] font-medium text-[#00C900]">비밀번호가 일치합니다.</p>
          )}
        </div>

        {/* 휴대폰 번호 */}
        <div className="mb-[4px]">
          <FieldLabel label="휴대폰 번호" />
          <div className="flex items-center gap-[4px]">
            <input
              type="tel"
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
        </div>
        {(phoneStatus === "sent" || phoneStatus === "verified") && (
          <div className="flex items-center gap-[4px] mt-[4px]">
            <input
              type="text"
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
        <div className="h-[4px] mb-[16px]" />

        {/* 약관 동의 */}
        <div className="flex items-center gap-[6px] mb-[16px]">
          <Checkbox checked={termsAgreed} onToggle={() => setTermsAgreed(!termsAgreed)} />
          <p className="text-[8px] font-medium text-gray-400">
            <button type="button" className="text-gray-900 underline hover:text-primary transition-colors">
              약관 동의
            </button>
            에 동의합니다.
          </p>
        </div>

        {/* 다음으로 버튼 */}
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full h-[36px] bg-primary rounded-xs text-[10px] font-medium text-white hover:bg-primary-dark transition-colors"
        >
          다음으로
        </button>

      </div>
    </div>
  );
};

export default SignupPage;