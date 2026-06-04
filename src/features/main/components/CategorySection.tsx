import type { FC } from "react";
import { useCategories } from "../hooks/useCategories";

const CategorySection: FC = () => {
  const { categories } = useCategories();

  return (
    <section className="py-2 pf-fade-up">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[16px] font-bold text-gray-900">카테고리</h2>
      </div>
      <div className="flex items-start gap-6 overflow-x-auto scrollbar-hide pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className="group flex flex-col items-center gap-2.5 flex-shrink-0 pf-press"
          >
            <div
              className="w-[60px] h-[60px] rounded-2xl flex items-center justify-center overflow-hidden transition-all group-hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #EBF5EC 0%, #DEEBD5 100%)',
                border: '1px solid #E5E7E1',
              }}
            >
              <img src={cat.icon} alt="" className="w-full h-full object-cover rounded-2xl" />
            </div>
            <span className="text-[11px] font-semibold text-gray-600 whitespace-nowrap group-hover:text-primary transition-colors">
              {cat.label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
