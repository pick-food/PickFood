import type { FC } from "react";
import { useState } from "react";
import type { Product } from "../models/type";
import cartIcon from "@/assets/icons/shoppingcart.png";
import Toast    from "../../../shared/components/Toast";
import { useToast } from "../hooks/useToast";

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

// 별점 SVG (filled / empty)
const StarFilled: FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#FEE500">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);
const StarEmpty: FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#AAAAAA" strokeWidth="1.5">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

const ProductCard: FC<ProductCardProps> = ({ product, onClick }) => {
  const { brand, name, price, originalPrice, discountRate, rating, reviewCount, badge, badgeBg, badgeColor, imageSrc } = product;

  const [isHearted, setIsHearted] = useState(false);
  const [isCarted,  setIsCarted]  = useState(false);
  const { toast, showToast } = useToast();

  function handleHeart(e: React.MouseEvent) {
    e.stopPropagation();
    const next = !isHearted;
    setIsHearted(next);
    showToast(next ? "heart" : "heartCancel");
  }

  function handleCart(e: React.MouseEvent) {
    e.stopPropagation();
    const next = !isCarted;
    setIsCarted(next);
    showToast(next ? "cart" : "cartCancel");
  }

  const fullStars  = Math.floor(rating);
  const emptyStars = 5 - fullStars;

  return (
    <>
      <div
        className="w-[220px] flex-shrink-0 border border-[#DDDDDD] rounded-[10px] overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
        onClick={onClick}
      >
        {/* 이미지 */}
        <div className="relative w-full h-[222px] bg-gray-100">
          <img src={imageSrc} alt={name} className="w-full h-full object-cover rounded-t-[10px]"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          <span className="absolute top-[8px] left-[8px] px-[9px] py-[4px] rounded-[2px] text-[8px] font-semibold"
            style={{ backgroundColor: badgeBg, color: badgeColor }}>
            {badge}
          </span>
          <div className="absolute bottom-[8px] right-[8px] flex items-center gap-[4px]">
            {/* 하트 */}
            <button onClick={handleHeart} className="w-6 h-6 flex items-center justify-center" aria-label="찜하기">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
                  fill={isHearted ? "#FF0000" : "none"}
                  stroke={isHearted ? "#FF0000" : "white"}
                  strokeWidth="1.5" />
              </svg>
            </button>
            {/* 장바구니 */}
            <button onClick={handleCart} className="w-6 h-6 flex items-center justify-center" aria-label="장바구니">
              <img src={cartIcon} alt="" className={`w-5 h-5 ${isCarted
                ? "[filter:invert(25%)_sepia(80%)_saturate(500%)_hue-rotate(340deg)_brightness(80%)]"
                : "brightness-0 invert"}`} />
            </button>
          </div>
        </div>

        {/* 텍스트 */}
        <div className="p-[10px] flex flex-col gap-[4px]">
          <p className="text-[10px] font-medium text-[#999999]">{brand}</p>
          <p className="text-[12px] font-medium text-[#333333] leading-[140%]">{name}</p>
          {discountRate > 0 && (
            <p className="text-[12px] font-medium text-[#999999] line-through">{originalPrice.toLocaleString()}원</p>
          )}
          <div className="flex items-center gap-[4px]">
            {discountRate > 0 && <span className="text-[12px] font-medium text-[#C0392B]">{discountRate}%</span>}
            <span className="text-[14px] font-medium text-[#333333]">{price.toLocaleString()}원</span>
          </div>
          {/* 별점 SVG */}
          <div className="flex items-center gap-[2px]">
            {Array.from({ length: fullStars  }).map((_, i) => <StarFilled key={`f${i}`} />)}
            {Array.from({ length: emptyStars }).map((_, i) => <StarEmpty  key={`e${i}`} />)}
            <span className="text-[10px] font-medium text-[#999999] ml-1">{rating}</span>
            <span className="text-[10px] text-[#999999]">|</span>
            <span className="text-[10px] font-medium text-[#999999]">{reviewCount}</span>
          </div>
        </div>
      </div>

      <Toast toast={toast} onNavigate={() => {}} />
    </>
  );
};

export default ProductCard;