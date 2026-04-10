import profileIcon  from '../../../assets/icons/profile.png';
import supportIcon  from '../../../assets/icons/orderlist.png';

interface UserActionsProps {
  onLogin?:   () => void;
  onSignup?:  () => void;
  onSupport?: () => void;
}

function ActionBtn({
  icon,
  label,
  hasArrow = false,
  onClick,
}: {
  icon: string;
  label: string;
  hasArrow?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-[3px] group"
    >
      <img src={icon} alt="" aria-hidden="true" className="w-6 h-6" />
      <span className="flex items-center gap-[2px] text-[13px] font-medium leading-[140%] tracking-[-0.025em] text-gray-600 group-hover:text-primary transition-colors whitespace-nowrap">
        {label}
        {hasArrow && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </span>
    </button>
  );
}

export function UserActions({ onLogin, onSignup, onSupport }: UserActionsProps) {
  return (
    <div className="flex items-center gap-5 flex-shrink-0">
      <ActionBtn icon={profileIcon} label="로그인"   onClick={onLogin}   />
      <ActionBtn icon={profileIcon} label="회원가입" onClick={onSignup}  />
      <ActionBtn icon={supportIcon} label="고객지원" onClick={onSupport} hasArrow />
    </div>
  );
}