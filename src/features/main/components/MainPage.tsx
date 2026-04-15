import type { FC } from "react";
import CategorySection from "./CategorySection";
import BannerSection from "./BannerSection";
import BestProductsSection from "./BestProductsSection";

const MainPage: FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* 카테고리 */}
        <CategorySection />

        {/* 구분선 */}
        <hr className="border-t border-border-mid mb-5" />

        {/* 배너 */}
        <BannerSection />

        {/* 구분선 */}
        <hr className="border-t border-border-mid my-5" />

        {/* 실시간 베스트 */}
        <BestProductsSection />
      </div>
    </div>
  );
};

export default MainPage;