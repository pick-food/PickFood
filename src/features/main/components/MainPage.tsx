import type { FC } from "react";
import { useAuth } from "../../auth/store/useAuth";
import HeroSection from "./HeroSection";
import FeatureCards from "./FeatureCards";
import CategorySection from "./CategorySection";
import BannerSection, { PromoBannerSection } from "./BannerSection";
import BestProductsSection from "./BestProductsSection";
import type { Product } from "../../product/models/type";

interface MainPageProps {
  onProductClick?: (product: Product) => void;
}

const MainPage: FC<MainPageProps> = ({ onProductClick }) => {
  const { isLoggedIn } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1200px] mx-auto px-4 flex flex-col gap-5 py-5">

        {!isLoggedIn && <HeroSection />}
        {!isLoggedIn && <FeatureCards />}

        <CategorySection />

        <hr className="border-t border-border-mid" />

        <BannerSection />

        <hr className="border-t border-border-mid" />

        <BestProductsSection onProductClick={onProductClick} />

        <PromoBannerSection />

      </div>
    </div>
  );
};

export default MainPage;