import profileIcon  from '../../../assets/icons/profile.png';
import supportIcon  from '../../../assets/icons/support.png';
import signupIcon   from '@/assets/icons/signup.png';
import dropdownIcon from '@/assets/icons/dropdown.png';

interface UserActionsProps {
  onLogin?:        () => void;
  onSignup?:       () => void;
  onSupport?:      () => void;
  isLoginActive?:  boolean;
  isSignupActive?: boolean;
}

const PRIMARY_FILTER =
  "brightness-0 saturate-100 [filter:invert(22%)_sepia(60%)_saturate(600%)_hue-rotate(340deg)_brightness(80%)_contrast(90%)]";

function ActionBtn({
  icon,
  label,
  hasArrow = false,
  isActive = false,
  onClick,
}: {
  icon: string;
  label: string;
  hasArrow?: boolean;
  isActive?: boolean;
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
        className={`w-6 h-6 transition-all ${isActive ? PRIMARY_FILTER : ""}`}
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
}: UserActionsProps) {
  return (
    <div className="flex items-center gap-5 flex-shrink-0">
      <ActionBtn icon={profileIcon} label="로그인"   onClick={onLogin}   isActive={isLoginActive}  />
      <ActionBtn icon={signupIcon}  label="회원가입" onClick={onSignup}  isActive={isSignupActive} />
      <ActionBtn icon={supportIcon} label="고객지원" onClick={onSupport} hasArrow />
    </div>
  );
}