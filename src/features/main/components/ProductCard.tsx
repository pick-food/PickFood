import type { FC } from "react";
import type { Product, BadgeType } from "../models/types";

// ── Shopping bag icon ──────────────────────────────────────────────────────────
function BagIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M6.5 2H17.5L21 6V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V6L6.5 2Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M3 6H21"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M16 10C16 12.2091 14.2091 14 12 14C9.79086 14 8 12.2091 8 10"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ── Badge colors ───────────────────────────────────────────────────────────────
const BADGE_STYLE: Record<BadgeType, string> = {
  BEST: "bg-primary text-warn-light",
  SALE: "bg-gray-800 text-warn-light",
  NEW:  "bg-safe text-white",
};

// ── Helpers ────────────────────────────────────────────────────────────────────
function formatPrice(price: number): string {
  return price.toLocaleString("ko-KR") + "원";
}

// ── Component ──────────────────────────────────────────────────────────────────
interface ProductCardProps {
  product: Product;
}

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const {
    brand,
    name,
    price,
    discount,
    origin,
    badge,
    gradientFrom,
    gradientTo,
  } = product;

  return (
    <article className="w-[220px] shrink-0 border border-border-mid rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
      {/* Image area */}
      <div className="relative">
        <div
          className={`w-full h-[222px] bg-gradient-to-br ${gradientFrom} ${gradientTo} flex items-center justify-center`}
        >
          {/* Placeholder graphic */}
          <span className="text-5xl opacity-40">🛒</span>
        </div>

        {/* Badge */}
        <span
          className={`absolute top-2 left-2 inline-flex items-center px-[9px] py-1 rounded-xs text-[8px] font-semibold leading-[140%] ${BADGE_STYLE[badge]}`}
        >
          {badge}
        </span>

        {/* Cart button */}
        <button
          aria-label="장바구니 담기"
          className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-primary-dark transition-colors"
        >
          <BagIcon />
        </button>
      </div>

      {/* Info area */}
      <div className="p-3 flex flex-col gap-0.5">
        {/* Brand */}
        <span className="text-[10px] font-medium text-gray-300">{brand}</span>

        {/* Product name */}
        <p className="text-b-12 font-medium text-gray-400 leading-[140%] line-clamp-2">
          {name}
        </p>

        {/* Price row */}
        <div className="flex items-baseline gap-1 mt-1">
          {discount > 0 && (
            <span className="text-b-12 font-medium text-primary-red">
              {discount}%
            </span>
          )}
          <span className="text-b-14 font-medium text-gray-600">
            {formatPrice(price)}
          </span>
        </div>

        {/* Origin */}
        <span className="text-[10px] font-medium text-gray-300">{origin}</span>
      </div>
    </article>
  );
};

export default ProductCard;