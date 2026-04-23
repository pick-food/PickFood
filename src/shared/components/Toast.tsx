import type { FC } from "react";

export type ToastType = "heart" | "heartCancel" | "cart" | "cartCancel";

export interface ToastMessage {
  type: ToastType;
  visible: boolean;
}

const TOAST_CONFIG: Record<ToastType, { message: string; cta?: string }> = {
  heart:       { message: "찜 리스트에 추가했습니다.",   cta: "바로가기" },
  heartCancel: { message: "찜이 취소되었습니다." },
  cart:        { message: "장바구니에 추가되었습니다.", cta: "바로가기" },
  cartCancel:  { message: "장바구니에서 제거되었습니다." },
};

interface ToastProps {
  toast: ToastMessage;
  onNavigate?: () => void;
}

const Toast: FC<ToastProps> = ({ toast, onNavigate }) => {
  if (!toast.visible) return null;
  const config = TOAST_CONFIG[toast.type];

  return (
    <div className="fixed bottom-[30px] left-1/2 -translate-x-1/2 z-50 w-[400px] h-[40px] flex items-center justify-between px-[14px] bg-gray-800 border border-black rounded-xs">
      <span className="text-[12px] font-semibold text-primary-light">{config.message}</span>
      {config.cta && onNavigate && (
        <button
          type="button"
          onClick={onNavigate}
          className="flex items-center gap-[4px] text-[12px] font-semibold text-warn-border"
        >
          {config.cta}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3L13 8L8 13M3 8H13" stroke="#F5C5B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Toast;