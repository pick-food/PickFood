import { SUPPORT_LINKS } from '../models/footer.model';
import { FooterLinkItem } from './FooterLinkItem';

export function FooterSupport() {
  return (
    <div className="flex flex-col gap-[15px]">
      <span className="text-[15px] font-medium leading-[18px] tracking-[-0.025em] text-black">
        고객지원
      </span>
      <div className="flex flex-col gap-[5px]">
        {SUPPORT_LINKS.map((link) => (
          <FooterLinkItem key={link.href} {...link} />
        ))}
      </div>
    </div>
  );
}