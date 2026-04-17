import type { FC } from "react";
import { useFindPassword } from "../hooks/useFindPassword";
import AuthResultPage from "./AuthResultPage";

interface FindPasswordPageProps {
  onLogin?:  () => void;
  onSignup?: () => void;
}

const FindPasswordPage: FC<FindPasswordPageProps> = ({ onLogin, onSignup }) => {
  const {
    email, setEmail, emailValid,
    result, error, loading,
    handleSubmit,
  } = useFindPassword();

  const inputBase =
    "flex-1 min-w-0 h-[38px] px-[14px] border border-gray-100 rounded-xs text-[12px] font-medium placeholder:text-gray-300 focus:outline-none focus:border-primary";

  const FieldLabel: FC<{ label: string }> = ({ label }) => (
    <p className="text-[12px] font-medium text-gray-900 mb-[6px]">
      {label}
      <span className="text-[#DE0000] ml-[2px]">*</span>
    </p>
  );

  // ── 계정 없음 ──────────────────────────────────────────────────────────────
  if (result === "notFound") {
    return (
      <AuthResultPage
        title="일치하는 계정을 찾을 수 없습니다."
        description={"입력하신 이메일과 일치하는 계정이 없습니다.\n이메일을 다시 확인하거나 회원가입을 진행해주세요."}
        buttons={[
          { label: "로그인하기",   variant: "filled",  onClick: onLogin },
          { label: "회원가입하기", variant: "outline", onClick: onSignup },
        ]}
      />
    );
  }

  // ── 메일 발송 완료 ─────────────────────────────────────────────────────────
  if (result === "found") {
    return (
      <AuthResultPage
        title="비밀번호 재설정 메일이 발송되었습니다."
        description={"입력하신 이메일로 비밀번호 재설정 링크를 발송했습니다.\n메일함을 확인해주세요."}
        buttons={[
          { label: "로그인하기", variant: "filled", onClick: onLogin },
        ]}
      />
    );
  }

  // ── 비밀번호 찾기 입력 폼 ─────────────────────────────────────────────────
  return (
    <div className="flex-1 bg-white flex items-center justify-center">
      <div className="w-[360px] flex flex-col">

        <h1 className="text-[18px] font-semibold text-black mb-[24px] text-center">비밀번호 찾기</h1>

        {/* 이메일 */}
        <div className="mb-[10px]">
          <FieldLabel label="이메일" />
          <input
            type="email"
            autoComplete="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력해주세요"
            className={`w-full h-[38px] px-[14px] border border-gray-100 rounded-xs text-[12px] font-medium placeholder:text-gray-300 focus:outline-none focus:border-primary`}
          />
        </div>

        {/* 에러 메시지 */}
        {error && (
          <p className="text-[11px] font-medium text-[#FF0000] mb-[10px]">{error}</p>
        )}

        {/* 비밀번호 찾기 버튼 */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!emailValid || loading}
          className={[
            "w-full h-[44px] rounded-xs text-[13px] font-medium transition-colors mt-[10px]",
            emailValid && !loading
              ? "bg-primary text-white hover:bg-primary-dark"
              : "bg-gray-100 text-gray-300 cursor-not-allowed",
          ].join(" ")}
        >
          {loading ? "확인 중..." : "비밀번호 찾기"}
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

export default FindPasswordPage;