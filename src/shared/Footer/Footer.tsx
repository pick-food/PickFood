import { FooterInfo }    from './components/FooterInfo';
import { FooterSupport } from './components/FooterSupport';
import { FooterContact } from './components/FooterContact';
import { FooterBottom }  from './components/FooterBottom';

export function Footer() {
  return (
    <footer className="w-full bg-border-light">
      <div className="max-w-[1920px] mx-auto px-[160px] h-[240px] flex flex-col justify-between py-[35px] whitespace-nowrap">

        {/* 상단: 로고+주소+소셜 / 고객지원 / 고객센터 */}
        <div className="flex items-start">
          <FooterInfo />
          <div className="w-[320px] flex-shrink-[56] min-w-[40px]" />
          <FooterSupport />
          <div className="w-[250px] flex-shrink-[44] min-w-[30px]" />
          <FooterContact />
        </div>

        {/* 구분선 */}
        <div className="w-full h-px bg-gray-300" />

        {/* 하단 */}
        <FooterBottom />

      </div>
    </footer>
  );
}