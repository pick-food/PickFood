import type { FC } from "react";
import { useProducts } from "../../product/hooks/useProducts";
import ProductCard from "../../product/components/ProductCard";
import type { Product } from "../../product/models/type";

interface BestProductsSectionProps {
  onProductClick?: (product: Product) => void;
}

const StarIcon: FC = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M10 2L12.39 7.26L18 8.18L14 12.14L15.18 18L10 15.27L4.82 18L6 12.14L2 8.18L7.61 7.26L10 2Z"
      stroke="#8B3A1A"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BestProductsSection: FC<BestProductsSectionProps> = ({ onProductClick }) => {
  const { products } = useProducts();

  return (
    <section className="py-5">
      <div className="flex items-center gap-1.5 mb-4">
        <StarIcon />
        <h2 className="text-b-15 font-semibold text-gray-900">실시간 베스트</h2>
      </div>
      <div className="flex items-start gap-[22px] overflow-x-auto scrollbar-hide pb-1">
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