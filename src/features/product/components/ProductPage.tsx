import type { FC } from "react";
import ProductFilter from "./ProductFilter";
import ProductGrid   from "./ProductGrid";
import CategorySection from "../../main/components/CategorySection";
import { useProducts } from "../hooks/useProducts";
import type { Product } from "../models/type";

interface ProductPageProps {
  onProductClick?: (product: Product) => void;
}

const ProductPage: FC<ProductPageProps> = ({ onProductClick }) => {
  const { products } = useProducts();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1200px] mx-auto px-4 py-5 flex flex-col gap-4">

        <ProductFilter />

        <hr className="border-t border-[#BBBBBB]" />

        <CategorySection />

        <hr className="border-t border-[#BBBBBB]" />

        <ProductGrid
          title="실시간 베스트"
          products={products}
          onProductClick={onProductClick}
        />

        <hr className="border-t border-[#BBBBBB]" />

        <ProductGrid
          title="이벤트"
          products={products}
          onProductClick={onProductClick}
        />

      </div>
    </div>
  );
};

export default ProductPage;