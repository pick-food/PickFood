import type { FC } from "react";
import HeroSection from "./HeroSection";
import FeatureCards from "./FeatureCards";
import CategorySection from "./CategorySection";
import BannerSection, { PromoBannerSection } from "./BannerSection";
import BestProductsSection from "./BestProductsSection";

/**
 * MainPage — 비로그인 메인화면 레이아웃
 *
 * ① HeroSection        — 대형 랜딩 히어로 (시작하기 / 상품 보러가기)
 * ② FeatureCards       — OCR 자동 분석 / 알레르기 필터링 / 안전한 상품 추천
 * ③ CategorySection    — 카테고리 10개 가로 스크롤
 * ─────────────────────── divider
 * ④ BannerSection      — 히어로 배너(70%) + 사이드 배너(30%) + 광고 배너 3개
 * ─────────────────────── divider
 * ⑤ BestProductsSection — 실시간 베스트 가로 스크롤
 * ⑥ PromoBannerSection  — 기획전 / 신규 입점 프로모 배너 2개
 */
const MainPage: FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1200px] mx-auto px-4 flex flex-col gap-5 py-5">

        {/* ① 랜딩 히어로 */}
        <HeroSection />

        {/* ② 기능 설명 카드 3개 */}
        <FeatureCards />

        {/* ③ 카테고리 */}
        <CategorySection />

        <hr className="border-t border-border-mid" />

        {/* ④ 배너 영역 */}
        <BannerSection />

        <hr className="border-t border-border-mid" />

        {/* ⑤ 실시간 베스트 */}
        <BestProductsSection />

        {/* ⑥ 프로모 배너 */}
        <PromoBannerSection />

      </div>
    </div>
  );
};

export default MainPage;