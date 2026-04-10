import logo from '/logo.svg';
import { SOCIAL_LINKS } from '../models/footer.model';

export function FooterInfo() {
  return (
    <div className="flex flex-col gap-[10px]">
      {/* 로고 + 브랜드명 */}
      <div className="flex items-center gap-[10px]">
        <img src={logo} alt="PickFood" className="w-[50px] h-10" />
        <span className="text-[20px] font-semibold leading-[140%] tracking-[-0.025em] text-gray-900">
          PickFood
        </span>
      </div>

      {/* 주소 */}
      <span className="text-[13px] font-medium leading-[140%] tracking-[-0.025em] text-gray-400">
        주소: 한양대학교 55 제 5공학관 지하 1층
      </span>

      {/* 소셜 아이콘 — 추후 개발: SOCIAL_LINKS에 데이터 추가하면 자동 렌더링 */}
      {SOCIAL_LINKS.length > 0 && (
        <div className="flex items-center gap-3">
          {SOCIAL_LINKS.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
            >
              <img src={social.icon} alt={social.name} className="w-6 h-6" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}