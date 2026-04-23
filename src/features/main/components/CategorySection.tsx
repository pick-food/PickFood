import type { FC } from "react";
import { useCategories } from "../hooks/useCategories";

const CategorySection: FC = () => {
  const { categories } = useCategories();

  return (
    <section className="py-4">
      <h2 className="mb-4 text-h-14 font-semibold text-gray-900">카테고리</h2>
      <div className="flex items-start gap-[60px] overflow-x-auto scrollbar-hide pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className="group flex flex-col items-center gap-2 shrink-0"
          >
            <div className="w-[62px] h-[62px] rounded-full border border-border-warm flex items-center justify-center bg-white group-hover:border-primary transition-colors overflow-hidden">
              <img src={cat.icon} alt="" className="w-full h-full object-cover" />
            </div>
            <span className="text-[11px] font-semibold leading-[140%] text-gray-600 whitespace-nowrap">
              {cat.label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;