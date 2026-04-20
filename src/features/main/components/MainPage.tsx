import type { FC } from "react";
import { useAuth } from "../../auth/store/useAuth";
import HeroSection from "./HeroSection";
import FeatureCards from "./FeatureCards";
import CategorySection from "./CategorySection";
import BannerSection, { PromoBannerSection } from "./BannerSection";
import BestProductsSection from "./BestProductsSection";

const MainPage: FC = () => {
  const { isLoggedIn } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1200px] mx-auto px-4 flex flex-col gap-5 py-5">

        {/* 비로그인 시에만 표시 */}
        {!isLoggedIn && <HeroSection />}
        {!isLoggedIn && <FeatureCards />}

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