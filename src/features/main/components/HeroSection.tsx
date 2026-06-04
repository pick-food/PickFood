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
      {/* 그라디언트 오버레이 */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(135deg, rgba(15,30,18,0.88) 0%, rgba(31,77,44,0.70) 60%, rgba(31,77,44,0.30) 100%)' }}
      />

      {/* 장식 원형 */}
      <div
        className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-10"
        style={{ background: '#A8E063' }}
      />
      <div
        className="absolute -bottom-8 right-32 w-40 h-40 rounded-full opacity-8"
        style={{ background: '#A8E063' }}
      />

      {/* 컨텐츠 */}
      <div className="relative z-10 flex flex-col justify-between h-full px-14 py-12">
        <div>
          {/* 태그 */}
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold mb-5"
            style={{ background: 'rgba(168,224,99,0.18)', color: '#A8E063', border: '1px solid rgba(168,224,99,0.3)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#A8E063]" />
            AI 알레르기 분석
          </span>

          <h1
            className="text-[38px] font-bold leading-tight text-white max-w-[360px]"
            style={{ letterSpacing: '-0.02em' }}
          >
            식품 알레르기,<br />
            <span style={{ color: '#A8E063' }}>이제 걱정 없이</span><br />
            고르세요
          </h1>
          <p className="text-[15px] text-white/70 mt-4 max-w-[360px] leading-relaxed">
            복잡한 성분표, 직접 읽지 마세요.<br />
            OCR로 자동 분석하고 알레르기 성분은 미리 걸러드립니다.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="inline-flex items-center justify-center px-6 h-12 rounded-xl text-[14px] font-bold text-[#0F1E12] transition-all pf-press"
            style={{ background: '#A8E063', boxShadow: '0 4px 16px rgba(168,224,99,0.35)' }}
          >
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
