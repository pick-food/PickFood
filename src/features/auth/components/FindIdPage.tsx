import type { FC } from "react";
import { useFindId } from "../hooks/useFindId";
import AuthResultPage from "./AuthResultPage";

interface FindIdPageProps {
  onLogin?:  () => void;
  onSignup?: () => void;
  onFindPassword?: () => void;
}

const FindIdPage: FC<FindIdPageProps> = ({ onLogin, onSignup, onFindPassword }) => {
  const {
    name, setName,
    phone, handlePhoneChange, phoneValid,
    phoneCode, setPhoneCode,
    phoneStatus, sendPhoneCode, verifyPhoneCode,
    result, foundId,
    timeLeft, formatTime,
    handleSubmit, reset,
  } = useFindId();

  const inputBase =
    "flex-1 min-w-0 h-[38px] px-[14px] border border-gray-100 rounded-xs text-[12px] font-medium placeholder:text-gray-300 focus:outline-none focus:border-primary";

  const FieldLabel: FC<{ label: string }> = ({ label }) => (
    <p className="text-[12px] font-medium text-gray-900 mb-[6px]">
      {label}
      <span className="text-[#DE0000] ml-[2px]">*</span>
    </p>
  );

  // ── 아이디 없음 결과 ────────────────────────────────────────────────────────
  if (result === "notFound") {
    return (
      <AuthResultPage
        title="사용자의 아이디를 찾을 수 없습니다."
        description={"입력하신 정보와 일치하는 계정을 찾을 수 없습니다.\n입력하신 정보를 다시 확인하거나 회원가입을 진행해주세요."}
        buttons={[
          { label: "로그인하기",  variant: "filled",  onClick: onLogin },
          { label: "회원가입하기", variant: "outline", onClick: onSignup },
        ]}
      />
    );
  }

  // ── 아이디 찾기 성공 결과 ──────────────────────────────────────────────────
  if (result === "found") {
    return (
      <AuthResultPage
        title={`${name}님의 아이디는\n${foundId}입니다.`}
        extra={
          <div className="w-full h-[38px] bg-surface-faint rounded-xs flex items-center px-[14px] gap-[6px]">
            {/* 정보 아이콘 */}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="flex-shrink-0">
              <circle cx="6" cy="6" r="5.5" stroke="#999999" />
              <path d="M6 5.5V8.5M6 3.5V4" stroke="#999999" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <span className="text-[10px] font-medium text-gray-300 flex-1">
              전체 아이디가 표시되었습니다. 보안을 위해 5분 후 다시 인증이 필요합니다.
            </span>
            <span className="text-[10px] font-medium text-gray-900 flex-shrink-0">
              {formatTime(timeLeft)}
            </span>
          </div>
        }
        buttons={[
          { label: "로그인하기",  variant: "filled",  onClick: onLogin },
          { label: "비밀번호 찾기", variant: "outline", onClick: onFindPassword },
        ]}
      />
    );
  }

  // ── 아이디 찾기 입력 폼 ────────────────────────────────────────────────────
  return (
    <div className="flex-1 bg-white flex items-center justify-center">
      <div className="w-[360px] flex flex-col">

        <h1 className="text-[18px] font-semibold text-black mb-[24px] text-center">아이디 찾기</h1>

        {/* 이름 */}
        <div className="mb-[10px]">
          <FieldLabel label="이름" />
          <input
            type="text"
            autoComplete="off"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력해주세요"
            className={`w-full h-[38px] px-[14px] border border-gray-100 rounded-xs text-[12px] font-medium placeholder:text-gray-300 focus:outline-none focus:border-primary`}
          />
        </div>

        {/* 휴대폰 번호 */}
        <div className="mb-[10px]">
          <FieldLabel label="휴대폰 번호" />
          <div className="flex items-center gap-[6px]">
            <input
              type="tel"
              autoComplete="off"
              value={phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="휴대폰 번호를 입력해주세요"
              className={inputBase}
            />
            <button
              type="button"
              onClick={sendPhoneCode}
              disabled={!phoneValid}
              className={[
                "w-[72px] h-[38px] rounded-xs text-[11px] font-medium border transition-colors flex-shrink-0",
                phoneValid
                  ? "border-primary text-primary hover:bg-primary-light"
                  : "border-gray-100 text-gray-300 cursor-not-allowed",
              ].join(" ")}
            >
              인증번호전송
            </button>
          </div>
        </div>

        {/* 인증번호 입력 */}
        {(phoneStatus === "sent" || phoneStatus === "verified") && (
          <div className="flex items-center gap-[6px] mb-[10px]">
            <input
              type="text"
              autoComplete="off"
              value={phoneCode}
              onChange={(e) => setPhoneCode(e.target.value)}
              placeholder="인증번호를 입력해주세요"
              className={inputBase}
            />
            {phoneStatus === "verified" ? (
              <div className="w-[72px] h-[38px] bg-primary rounded-xs text-[11px] font-medium text-white flex items-center justify-center flex-shrink-0">
                인증 완료
              </div>
            ) : (
              <button
                type="button"
                onClick={verifyPhoneCode}
                className="w-[72px] h-[38px] border border-primary rounded-xs text-[11px] font-medium text-primary hover:bg-primary-light transition-colors flex-shrink-0"
              >
                인증하기
              </button>
            )}
          </div>
        )}

        {/* 아이디 찾기 버튼 */}
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full h-[44px] bg-primary rounded-xs text-[13px] font-medium text-white hover:bg-primary-dark transition-colors mt-[10px]"
        >
          아이디 찾기
        </button>

        <button
          type="button"
          onClick={onLogin}
          className="mt-[12px] text-[11px] font-medium text-gray-300 hover:text-gray-600 transition-colors text-center"
        >
          로그인으로 돌아가기
        </button>

      </div>
    </div>
  );
};

export default FindIdPage;