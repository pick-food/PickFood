import type { FC } from "react";
import { useLogin } from "../hooks/useLogin";

import naverLogo  from "@/assets/icons/naver.png";
import kakaoLogo  from "@/assets/icons/kakao.png";
import appleLogo  from "@/assets/icons/apple.png";
import googleLogo from "@/assets/icons/google.png";
import checkIcon  from "@/assets/icons/check.png";

interface LoginPageProps {
  onSignup?:        () => void;
  onFindId?:        () => void;
  onFindPassword?:  () => void;
}

const LoginPage: FC<LoginPageProps> = ({ onSignup, onFindId, onFindPassword }) => {
  const { id, setId, password, setPassword, autoLogin, setAutoLogin, handleLogin } = useLogin();

  return (
    <div className="flex-1 bg-white flex items-center justify-center py-[120px]">
      <div className="w-[280px] flex flex-col">

        {/* 제목 */}
        <h1 className="text-h-14 font-semibold text-black mb-[18px] text-center">로그인</h1>

        {/* 아이디 입력 */}
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="아이디를 입력해주세요"
          className="w-full h-[36px] px-[10px] border border-gray-100 rounded-xs text-[10px] font-medium text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-primary mb-[6px]"
        />

        {/* 비밀번호 입력 */}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호를 입력해주세요"
          className="w-full h-[36px] px-[10px] border border-gray-100 rounded-xs text-[10px] font-medium text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-primary"
        />

        {/* 자동 로그인 + 찾기 링크 */}
        <div className="flex items-center justify-between mt-[10px] mb-[20px]">
          {/* 자동 로그인 체크박스 */}
          <button
            type="button"
            onClick={() => setAutoLogin(!autoLogin)}
            className="flex items-center gap-[6px]"
          >
            <span
              className={[
                "w-[10px] h-[10px] rounded-[1px] flex items-center justify-center flex-shrink-0",
                autoLogin ? "bg-primary" : "border border-gray-300 bg-white",
              ].join(" ")}
            >
              {autoLogin && (
                <img src={checkIcon} alt="" className="w-full h-full object-contain" />
              )}
            </span>
            <span className="text-[8px] font-medium text-gray-400">자동 로그인</span>
          </button>

          {/* 아이디 찾기 | 비밀번호 찾기 */}
          <div className="flex items-center gap-[4px]">
            <button
              onClick={onFindId}
              className="text-[8px] font-medium text-gray-400 hover:text-primary transition-colors"
            >
              아이디 찾기
            </button>
            <span className="text-[8px] text-gray-800">ㅣ</span>
            <button
              onClick={onFindPassword}
              className="text-[8px] font-medium text-gray-400 hover:text-primary transition-colors"
            >
              비밀번호 찾기
            </button>
          </div>
        </div>

        {/* 로그인 버튼 */}
        <button
          onClick={handleLogin}
          className="w-full h-[36px] bg-primary rounded-xs text-[10px] font-medium text-white hover:bg-primary-dark transition-colors mb-[6px]"
        >
          로그인
        </button>

        {/* 회원가입 버튼 */}
        <button
          onClick={onSignup}
          className="w-full h-[36px] border border-primary rounded-xs text-[10px] font-medium text-primary hover:bg-primary-light transition-colors"
        >
          회원가입
        </button>

        {/* 간편 로그인 */}
        <p className="text-h-14 font-semibold text-black mt-[30px] mb-[16px] text-center">간편 로그인</p>

        <div className="flex flex-col gap-[6px]">
          {/* 네이버 */}
          <button className="w-full h-[36px] bg-naver rounded-xs flex items-center relative hover:opacity-90 transition-opacity">
            <img src={naverLogo} alt="네이버" className="w-[14px] h-[14px] absolute left-[20px]" />
            <span className="w-full text-center text-[12px] font-medium text-white tracking-[-0.3px]">
              네이버로 로그인
            </span>
          </button>

          {/* 카카오 */}
          <button className="w-full h-[36px] bg-kakao rounded-xs flex items-center relative hover:opacity-90 transition-opacity">
            <img src={kakaoLogo} alt="카카오" className="w-[14px] h-[14px] absolute left-[20px]" />
            <span className="w-full text-center text-[12px] font-medium text-black tracking-[-0.3px]">
              카카오로 로그인
            </span>
          </button>

          {/* 애플 */}
          <button className="w-full h-[36px] bg-black rounded-xs flex items-center relative hover:opacity-90 transition-opacity">
            <img src={appleLogo} alt="애플" className="w-[14px] h-[14px] absolute left-[20px]" />
            <span className="w-full text-center text-[12px] font-medium text-white tracking-[-0.3px]">
              Apple로 로그인
            </span>
          </button>

          {/* 구글 */}
          <button className="w-full h-[36px] bg-white border border-gray-300 rounded-xs flex items-center relative hover:bg-surface transition-colors">
            <img src={googleLogo} alt="구글" className="w-[14px] h-[14px] absolute left-[20px]" />
            <span className="w-full text-center text-[12px] font-medium text-gray-600 tracking-[-0.3px]">
              Google로 로그인
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;