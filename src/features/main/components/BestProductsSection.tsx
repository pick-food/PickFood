import type { FC } from "react";
import { useProducts } from "../../product/hooks/useProducts";
import ProductCard from "../../product/components/ProductCard";
import type { Product } from "../../product/models/type";

interface BestProductsSectionProps {
  onProductClick?: (product: Product) => void;
}

const FireIcon: FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M12 2c0 0-5 4-5 10a5 5 0 0010 0c0-3-2-5-2-5s0 3-3 3c0 0 0-5 0-8z"
      fill="#E89B26" stroke="#E89B26" strokeWidth="0" />
    <path d="M12 22c-3.31 0-6-2.69-6-6 0-4 3-8 3-8s-1 4 2 5c0 0 0-3 1-5 2 2 3 4 3 6s-1.5 2-1.5 2 .5-2-1.5-2"
      fill="none" stroke="#E89B26" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const BestProductsSection: FC<BestProductsSectionProps> = ({ onProductClick }) => {
  const { products } = useProducts();

  return (
    <section className="py-2 pf-fade-up">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <FireIcon />
          <h2 className="text-[17px] font-bold text-gray-900">실시간 베스트</h2>
        </div>
        <button className="text-[12px] font-medium text-gray-300 hover:text-primary transition-colors">
          전체보기 →
        </button>
      </div>
      <div className="flex items-start gap-4 overflow-x-auto scrollbar-hide pb-2">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => onProductClick?.(product)}
          />
        ))}
      </div>
    </section>
  );
};

export default BestProductsSection;
