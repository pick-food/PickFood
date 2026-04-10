import type { FooterLink } from '../models/footer.model';

// 내부 라우팅 / 외부 URL 모두 처리하는 공통 링크 컴포넌트
// 추후 react-router 쓰면 internal은 <Link>로 교체하면 됨
export function FooterLinkItem({ label, href, external }: FooterLink) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="text-[13px] font-medium leading-[140%] tracking-[-0.025em] text-gray-600 hover:text-primary transition-colors w-fit"
    >
      {label}
    </a>
  );
}