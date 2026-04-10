import profileIcon  from '../../../assets/icons/profile.png';
import supportIcon  from '../../../assets/icons/support.png';
import signupIcon from '@/assets/icons/signup.png';
import dropdownIcon from '@/assets/icons/dropdown.png';

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
      className="flex flex-col items-center gap-[3px] group w-[44px]"
    >
      <img src={icon} alt="" aria-hidden="true" className="w-6 h-6" />
      <span className="flex items-center gap-[2px] text-[13px] font-medium leading-[140%] tracking-[-0.025em] text-gray-600 group-hover:text-primary transition-colors whitespace-nowrap">
        {label}
        {hasArrow && (
        <img src={dropdownIcon} alt="" aria-hidden="true" className="w-4 h-4" />
        )}
      </span>
    </button>
  );
}

export function UserActions({ onLogin, onSignup, onSupport }: UserActionsProps) {
  return (
    <div className="flex items-center gap-5 flex-shrink-0">
      <ActionBtn icon={profileIcon} label="로그인"   onClick={onLogin}   />
      <ActionBtn icon={signupIcon} label="회원가입" onClick={onSignup}  />
      <ActionBtn icon={supportIcon} label="고객지원" onClick={onSupport} hasArrow />
    </div>
  );
}