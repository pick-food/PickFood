import type { FC, ReactNode } from "react";

interface ActionButton {
  label: string;
  variant: "filled" | "outline";
  onClick?: () => void;
}

interface AuthResultPageProps {
  // 체크 아이콘 색상 (기본 green)
  iconColor?: string;
  // 메인 타이틀
  title: string;
  // 타이틀 아래 설명 (선택)
  description?: string;
  // 타이틀과 버튼 사이 추가 콘텐츠 (선택)
  extra?: ReactNode;
  // 하단 버튼들 (1~2개)
  buttons: ActionButton[];
}

/**
 * 회원가입 완료 / 아이디 찾기 결과 / 비밀번호 변경 완료 등
 * 동일한 레이아웃을 공유하는 결과 페이지 공통 컴포넌트
 */
const AuthResultPage: FC<AuthResultPageProps> = ({
  iconColor = "#00C900",
  title,
  description,
  extra,
  buttons,
}) => {
  return (
    <div className="flex-1 bg-white flex items-center justify-center">
      <div className="w-[360px] flex flex-col items-center">

        {/* 체크 아이콘 */}
        <svg
          width="60"
          height="60"
          viewBox="0 0 60 60"
          fill="none"
          className="mb-[20px]"
        >
          <path
            d="M10 32L24 46L50 18"
            stroke={iconColor}
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* 메인 타이틀 */}
        <h1 className="text-[18px] font-medium leading-[140%] text-black text-center mb-[10px]">
          {title}
        </h1>

        {/* 설명 */}
        {description && (
          <p className="text-[13px] font-medium leading-[140%] text-gray-600 text-center mb-[16px]">
            {description}
          </p>
        )}

        {/* 추가 콘텐츠 (아이디 표시 박스 등) */}
        {extra && (
          <div className="w-full mb-[20px]">{extra}</div>
        )}

        {/* 버튼 영역 */}
        <div className="w-full flex gap-[8px]">
          {buttons.map((btn, i) => (
            btn.variant === "filled" ? (
              <button
                key={i}
                type="button"
                onClick={btn.onClick}
                className="flex-1 h-[44px] bg-primary rounded-xs text-[13px] font-medium text-white hover:bg-primary-dark transition-colors"
              >
                {btn.label}
              </button>
            ) : (
              <button
                key={i}
                type="button"
                onClick={btn.onClick}
                className="flex-1 h-[44px] border border-primary rounded-xs text-[13px] font-medium text-primary hover:bg-primary-light transition-colors"
              >
                {btn.label}
              </button>
            )
          ))}
        </div>

      </div>
    </div>
  );
};

export default AuthResultPage;