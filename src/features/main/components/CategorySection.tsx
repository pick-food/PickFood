import { useCategories } from "../hooks/useCategories";

export default function CategorySection() {
  const { categories } = useCategories();

  return (
    <section className="py-4">
      {/* Section title */}
      <h2 className="mb-4 text-h-14 font-semibold text-gray-900">카테고리</h2>

      {/* Scrollable category row */}
      <div className="flex items-start gap-[66px] overflow-x-auto scrollbar-hide pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className="group flex flex-col items-center gap-2 shrink-0"
          >
            {/* Circle avatar */}
            <div
              className={[
                "w-[50px] h-[50px] rounded-full border border-border-warm flex items-center justify-center text-xl",
                cat.bgColor,
                "group-hover:border-primary transition-colors",
              ].join(" ")}
            >
              {cat.emoji}
            </div>

            {/* Label */}
            <span className="text-[10px] font-semibold leading-[140%] text-gray-600 text-center whitespace-nowrap">
              {cat.label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}