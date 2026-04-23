import type { FC } from "react";
import type { Product } from "../models/type";
import ProductCard from "./ProductCard";
import starIcon from "@/assets/icons/star.png";

interface ProductGridProps {
  title: string;
  products: Product[];
  onProductClick?: (product: Product) => void;
}

const ProductGrid: FC<ProductGridProps> = ({ title, products, onProductClick }) => {
  return (
    <section className="py-4">
      <div className="flex items-center gap-[4px] mb-[16px]">
        <img src={starIcon} alt="" className="w-5 h-5" />
        <h2 className="text-[15px] font-semibold text-[#1A1A1A]">{title}</h2>
      </div>
      <div className="flex gap-[15px] overflow-x-auto scrollbar-hide pb-2">
        {(products ?? []).map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            onClick={() => onProductClick?.(p)}
          />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;