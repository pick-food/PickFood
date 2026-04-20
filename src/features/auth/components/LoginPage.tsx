import type { FC } from "react";
import { useLogin } from "../hooks/useLogin";

import naverLogo  from "@/assets/icons/naver.png";
import kakaoLogo  from "@/assets/icons/kakao.png";
import appleLogo  from "@/assets/icons/apple.png";
import googleLogo from "@/assets/icons/google.png";
import checkIcon  from "@/assets/icons/check.png";

interface LoginPageProps {
  onSuccess?:      () => void;
  onSignup?:       () => void;
  onFindId?:       () => void;
  onFindPassword?: () => void;
}

const LoginPage: FC<LoginPageProps> = ({ onSuccess, onSignup, onFindId, onFindPassword }) => {
  const { id, setId, password, setPassword, autoLogin, setAutoLogin, handleLogin, error, loading } = useLogin(onSuccess);

  return (
    <div className="flex-1 bg-white flex items-center justify-center py-8">
      <div className="w-[360px] flex flex-col">

        <h1 className="text-[18px] font-semibold text-black mb-[32px] text-center">로그인</h1>

        <input
          type="text"
          autoComplete="off"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="아이디를 입력해주세요"
          className="w-full h-[44px] px-[14px] border border-gray-100 rounded-xs text-[13px] font-medium text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-primary mb-[8px]"
        />

        <input
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호를 입력해주세요"
          className="w-full h-[44px] px-[14px] border border-gray-100 rounded-xs text-[13px] font-medium text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-primary"
        />

        <div className="flex items-center justify-between mt-[12px] mb-[28px]">
          <button
            type="button"
            onClick={() => setAutoLogin(!autoLogin)}
            className="flex items-center gap-[8px]"
          >
            <span
              className={[
                "w-[13px] h-[13px] rounded-[2px] flex items-center justify-center flex-shrink-0",
                autoLogin ? "bg-primary" : "border border-gray-300 bg-white",
              ].join(" ")}
            >
              {autoLogin && (
                <img src={checkIcon} alt="" className="w-full h-full object-contain" />
              )}
            </span>
            <span className="text-[11px] font-medium text-gray-400">자동 로그인</span>
          </button>

          <div className="flex items-center gap-[6px]">
            <button
              onClick={onFindId}
              className="text-[11px] font-medium text-gray-400 hover:text-primary transition-colors"
            >
              아이디 찾기
            </button>
            <span className="text-[11px] text-gray-200">|</span>
            <button
              onClick={onFindPassword}
              className="text-[11px] font-medium text-gray-400 hover:text-primary transition-colors"
            >
              비밀번호 찾기
            </button>
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <p className="text-[11px] font-medium text-[#FF0000] mb-[8px] text-center">
            {error}
          </p>
        )}

        <button
          onClick={handleLogin}
          className="w-full h-[44px] bg-primary rounded-xs text-[13px] font-medium text-white hover:bg-primary-dark transition-colors mb-[8px]"
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>

        <button
          onClick={onSignup}
          className="w-full h-[44px] border border-primary rounded-xs text-[13px] font-medium text-primary hover:bg-primary-light transition-colors"
        >
          회원가입
        </button>

        <p className="text-[16px] font-semibold text-black mt-[48px] mb-[16px] text-center">간편 로그인</p>

        <div className="flex flex-col gap-[8px]">
          <button className="w-full h-[44px] bg-naver rounded-xs flex items-center relative hover:opacity-90 transition-opacity">
            <img src={naverLogo} alt="네이버" className="w-[18px] h-[18px] absolute left-[20px]" />
            <span className="w-full text-center text-[13px] font-medium text-white tracking-[-0.3px]">네이버로 로그인</span>
          </button>

          <button className="w-full h-[44px] bg-kakao rounded-xs flex items-center relative hover:opacity-90 transition-opacity">
            <img src={kakaoLogo} alt="카카오" className="w-[18px] h-[18px] absolute left-[20px]" />
            <span className="w-full text-center text-[13px] font-medium text-black tracking-[-0.3px]">카카오로 로그인</span>
          </button>

          <button className="w-full h-[44px] bg-black rounded-xs flex items-center relative hover:opacity-90 transition-opacity">
            <img src={appleLogo} alt="애플" className="w-[18px] h-[18px] absolute left-[20px]" />
            <span className="w-full text-center text-[13px] font-medium text-white tracking-[-0.3px]">Apple로 로그인</span>
          </button>

          <button className="w-full h-[44px] bg-white border border-gray-300 rounded-xs flex items-center relative hover:bg-surface transition-colors">
            <img src={googleLogo} alt="구글" className="w-[18px] h-[18px] absolute left-[20px]" />
            <span className="w-full text-center text-[13px] font-medium text-gray-600 tracking-[-0.3px]">Google로 로그인</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;