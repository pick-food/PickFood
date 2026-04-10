import { BOTTOM_LINKS } from '../models/footer.model';
import { FooterLinkItem } from './FooterLinkItem';

export function FooterBottom() {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[13px] font-medium leading-[140%] tracking-[-0.025em] text-gray-400">
        © PickFood (픽푸). All Rights Reserved.
      </span>
      <div className="flex items-center gap-5">
        {BOTTOM_LINKS.map((link) => (
          <FooterLinkItem key={link.href} {...link} />
        ))}
      </div>
    </div>
  );
}