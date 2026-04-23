import { useState, useEffect, useRef } from "react";
import profileIcon  from '@/assets/icons/profile.png';
import supportIcon  from '@/assets/icons/support.png';
import signupIcon   from '@/assets/icons/signup.png';
import dropdownIcon from '@/assets/icons/dropdown.png';
import heartIcon    from '@/assets/icons/heart.png';
import cartIcon     from '@/assets/icons/shoppingcart.png';
import ordersIcon   from '@/assets/icons/orders.png';
import { useAuth } from '../../../features/auth/store/useAuth';;

interface UserActionsProps {
  onLogin?:        () => void;
  onSignup?:       () => void;
  onSupport?:      () => void;
  isLoginActive?:  boolean;
  isSignupActive?: boolean;
  isLoggedIn?:     boolean;
}

const PRIMARY_FILTER =
  "brightness-0 saturate-100 [filter:invert(22%)_sepia(60%)_saturate(600%)_hue-rotate(340deg)_brightness(80%)_contrast(90%)]";

const GRAY_FILTER =
  "brightness-0 saturate-100 [filter:invert(20%)_sepia(0%)_saturate(0%)_hue-rotate(0deg)_brightness(40%)_contrast(90%)]";

function ActionBtn({
  icon,
  label,
  hasArrow = false,
  isActive = false,
  forceGray = false,
  onClick,
}: {
  icon: string;
  label: string;
  hasArrow?: boolean;
  isActive?: boolean;
  forceGray?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-[3px] group w-[44px]"
    >
      <img
        src={icon}
        alt=""
        aria-hidden="true"
        className={`w-6 h-6 transition-all ${
          isActive ? PRIMARY_FILTER : forceGray ? GRAY_FILTER : ""
        }`}
      />
      <span
        className={[
          "flex items-center gap-[2px] text-[13px] font-medium leading-[140%] tracking-[-0.025em] transition-colors whitespace-nowrap",
          isActive ? "text-primary" : "text-gray-600 group-hover:text-primary",
        ].join(" ")}
      >
        {label}
        {hasArrow && (
          <img src={dropdownIcon} alt="" aria-hidden="true" className="w-4 h-4" />
        )}
      </span>
    </button>
  );
}

export function UserActions({
  onLogin,
  onSignup,
  onSupport,
  isLoginActive,
  isSignupActive,
  isLoggedIn,
}: UserActionsProps) {
  const { logout } = useAuth();
  const [showMyMenu, setShowMyMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 바깥 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMyMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-[25px] flex-shrink-0">

        {/* 마이페이지 + 드롭다운 */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMyMenu(!showMyMenu)}
            className="flex flex-col items-center gap-[3px] group w-[44px]"
          >
            <img
              src={profileIcon}
              alt=""
              aria-hidden="true"
              className={`w-6 h-6 transition-all ${GRAY_FILTER}`}
            />
            <span className="text-[13px] font-medium text-gray-600 whitespace-nowrap group-hover:text-primary transition-colors">
              마이페이지
            </span>
          </button>

          {showMyMenu && (
            <div className="absolute top-[52px] right-0 w-[120px] bg-white border border-gray-200 rounded-md shadow-lg z-50 overflow-hidden">
              <button
                onClick={() => setShowMyMenu(false)}
                className="w-full px-4 py-3 text-[13px] text-gray-600 hover:bg-gray-50 text-left"
              >
                마이페이지
              </button>
              <button
                onClick={() => { logout(); setShowMyMenu(false); }}
                className="w-full px-4 py-3 text-[13px] text-red-500 hover:bg-red-50 text-left border-t border-gray-100"
              >
                로그아웃
              </button>
            </div>
          )}
        </div>

        <ActionBtn icon={heartIcon}  label="찜"      forceGray />
        <ActionBtn icon={cartIcon}   label="장바구니" forceGray />
        <ActionBtn icon={ordersIcon} label="주문내역" forceGray />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-5 flex-shrink-0">
      <ActionBtn icon={profileIcon} label="로그인"   onClick={onLogin}   isActive={isLoginActive}  />
      <ActionBtn icon={signupIcon}  label="회원가입" onClick={onSignup}  isActive={isSignupActive} />
      <ActionBtn icon={supportIcon} label="고객지원" onClick={onSupport} hasArrow />
    </div>
  );
}