import type { FC } from "react";
import type { Product } from "../../product/models/type";

const BagIcon: FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M6.5 2H17.5L21 6V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V6L6.5 2Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M3 6H21" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M16 10C16 12.2091 14.2091 14 12 14C9.79086 14 8 12.2091 8 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

function formatPrice(price: number) {
  return price.toLocaleString("ko-KR") + "원";
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const { brand, name, price, originalPrice, discountRate, rating, reviewCount, badge, badgeBg, badgeColor, imageSrc } = product;

  return (
    <article className="w-[240px] shrink-0 border border-border-mid rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
      <div className="relative">
        {imageSrc ? (
          <img src={imageSrc} alt={name} className="w-full h-[248px] object-cover" />
        ) : (
          <div className="w-full h-[248px] bg-gray-100 flex items-center justify-center">
            <span className="text-5xl opacity-30">🛒</span>
          </div>
        )}
        <span
          className="absolute top-2 left-2 inline-flex items-center px-[9px] py-1 rounded-xs text-[8px] font-semibold"
          style={{ backgroundColor: badgeBg, color: badgeColor }}
        >
          {badge}
        </span>
        <button
          aria-label="장바구니 담기"
          className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-primary-dark transition-colors"
        >
          <BagIcon />
        </button>
      </div>

      <div className="p-3 flex flex-col gap-0.5">
        <span className="text-[10px] font-medium text-gray-300">{brand}</span>
        <p className="text-b-12 font-medium text-gray-400 leading-[140%] line-clamp-2">{name}</p>
        {originalPrice > price && (
          <p className="text-[12px] font-medium text-gray-300 line-through">{originalPrice.toLocaleString()}원</p>
        )}
        <div className="flex items-baseline gap-1 mt-1">
          {discountRate > 0 && (
            <span className="text-b-12 font-medium text-primary-red">{discountRate}%</span>
          )}
          <span className="text-b-14 font-medium text-gray-600">{formatPrice(price)}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[#FEE500] text-[12px]">★</span>
          <span className="text-[10px] font-medium text-gray-300">{rating}</span>
          <span className="text-[10px] text-gray-300">|</span>
          <span className="text-[10px] font-medium text-gray-300">{reviewCount}</span>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;