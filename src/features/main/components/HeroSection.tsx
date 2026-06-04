import type { FC } from "react";

const HeroSection: FC = () => {
  return (
    <section
      className="relative w-full overflow-hidden pf-fade-up"
      style={{
        borderRadius: 24,
        height: 420,
        backgroundImage: "url(/images/features/feature.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/40 rounded-[20px]" />

      <div className="relative z-10 flex flex-col justify-end h-full px-[53px] pb-[46px] gap-4">
        <h1 className="text-[40px] font-semibold leading-[140%] text-[#F0F0F0] max-w-[326px]">
          식품 알레르기, 이제 걱정 없이 고르세요
        </h1>
        <p className="text-b-16 font-semibold text-warn-tagLight max-w-[391px]">
          복잡한 성분표, 직접 읽지 마세요. OCR로 자동 분석하고 알레르기 성분은 미리 걸러드립니다.
        </p>
        <div className="flex items-center gap-4 mt-1">
          <button className="inline-flex items-center justify-center w-[140px] h-[47px] bg-primary-red rounded-base text-b-16 font-medium text-warn-tagLight hover:bg-warn-active transition-colors">
            시작하기
          </button>
          <button
            className="inline-flex items-center justify-center px-6 h-12 rounded-xl text-[14px] font-semibold text-white transition-all pf-press"
            style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            상품 보러가기
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
