import { useState, useEffect, useRef } from "react";
import { useAuth } from '../../../features/auth/store/useAuth';

interface UserActionsProps {
  onLogin?:        () => void;
  onSignup?:       () => void;
  onSupport?:      () => void;
  isLoginActive?:  boolean;
  isSignupActive?: boolean;
  isLoggedIn?:     boolean;
}

function IconBtn({ icon, label, onClick, active = false }: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-[3px] group min-w-[44px]"
    >
      <div className={`w-6 h-6 flex items-center justify-center transition-colors ${active ? 'text-[#A8E063]' : 'text-white/80 group-hover:text-[#A8E063]'}`}>
        {icon}
      </div>
      <span className={`text-[11px] font-medium whitespace-nowrap transition-colors ${active ? 'text-[#A8E063]' : 'text-white/70 group-hover:text-[#A8E063]'}`}>
        {label}
      </span>
    </button>
  );
}

const PersonIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);
const SignupIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M15 3h6v6M21 3L10 14M18 14v5a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const HeartIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"}>
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" strokeWidth="1.8"/>
  </svg>
);
const CartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="1.8"/>
  </svg>
);
const OrdersIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.8"/>
    <line x1="9" y1="12" x2="15" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="9" y1="16" x2="13" y2="16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

export function UserActions({
  onLogin,
  onSignup,
  isLoginActive,
  isSignupActive,
  isLoggedIn,
}: UserActionsProps) {
  const { logout } = useAuth();
  const [showMyMenu, setShowMyMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
      <div className="flex items-center gap-5 flex-shrink-0">
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMyMenu(!showMyMenu)}
            className="flex flex-col items-center gap-[3px] group min-w-[44px]"
          >
            <div className="w-6 h-6 flex items-center justify-center text-white/80 group-hover:text-[#A8E063] transition-colors">
              <PersonIcon />
            </div>
            <span className="text-[11px] font-medium text-white/70 group-hover:text-[#A8E063] whitespace-nowrap transition-colors">
              마이페이지
            </span>
          </button>
          {showMyMenu && (
            <div className="absolute top-[54px] right-0 w-[130px] bg-white border border-border rounded-xl overflow-hidden z-50" style={{ boxShadow: '0 8px 24px rgba(15,30,18,0.14)' }}>
              <button
                onClick={() => setShowMyMenu(false)}
                className="w-full px-4 py-3 text-[13px] text-gray-700 hover:bg-surface text-left"
              >
                마이페이지
              </button>
              <button
                onClick={() => { logout(); setShowMyMenu(false); }}
                className="w-full px-4 py-3 text-[13px] text-warn hover:bg-warn-light text-left border-t border-border"
              >
                로그아웃
              </button>
            </div>
          )}
        </div>
        <IconBtn icon={<HeartIcon />}  label="찜" />
        <IconBtn icon={<CartIcon />}   label="장바구니" />
        <IconBtn icon={<OrdersIcon />} label="주문내역" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-5 flex-shrink-0">
      <IconBtn icon={<PersonIcon />} label="로그인"   onClick={onLogin}  active={isLoginActive} />
      <IconBtn icon={<SignupIcon />} label="회원가입" onClick={onSignup} active={isSignupActive} />
    </div>
  );
}
