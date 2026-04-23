import type { FC } from "react";
import { useState, useRef, useEffect } from "react";
import dropdownIcon from "@/assets/icons/dropdown.png";

// ── 체크 아이콘 ────────────────────────────────────────────────────────────────
const CheckIcon: FC = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path
      d="M2 6.5L4.5 9L10 3"
      stroke="#8B3A1A"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ── 태그 버튼 ──────────────────────────────────────────────────────────────────
const Tag: FC<{
  label: string;
  selected: boolean;
  onToggle: () => void;
}> = ({ label, selected, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className={[
      "inline-flex items-center gap-[4px] px-[8px] h-[22px] rounded-[10px] text-[11px] font-medium transition-colors",
      selected
        ? "border border-primary text-primary"
        : "border border-[#BBBBBB] text-gray-600",
    ].join(" ")}
  >
    {selected && <CheckIcon />}
    {label}
  </button>
);

// ── 드롭다운 패널 ──────────────────────────────────────────────────────────────
const DropdownPanel: FC<{
  title: string;
  items: string[];
  selected: string[];
  onToggle: (item: string) => void;
  onSelectAll: () => void;
}> = ({ title, items, selected, onToggle, onSelectAll }) => (
  <div className="absolute top-[calc(100%+6px)] left-0 z-50 w-[200px] bg-white border border-[#BBBBBB] rounded-xs shadow-md p-[10px]">
    {/* 헤더 */}
    <p className="text-[12px] font-medium text-black mb-[10px]">
      Filter by {title}
    </p>

    {/* 태그 목록 */}
    <div className="flex flex-wrap gap-[4px] mb-[14px]">
      {items.map((item) => (
        <Tag
          key={item}
          label={item}
          selected={selected.includes(item)}
          onToggle={() => onToggle(item)}
        />
      ))}
    </div>

    {/* select all */}
    <button
      type="button"
      onClick={onSelectAll}
      className="px-[8px] h-[22px] bg-[#F0F0F0] rounded-[4px] text-[11px] font-medium text-gray-800 hover:bg-gray-200 transition-colors"
    >
      select all
    </button>
  </div>
);

// ── 데이터 ─────────────────────────────────────────────────────────────────────
const PICKY_ITEMS   = ["새우", "소고기", "닭고기", "올리브", "파프리카", "오이", "브로콜리"];
const ALLERGY_ITEMS = ["우유", "밀", "달걀", "땅콩", "대두", "견과류", "생선", "갑각류", "글루텐"];
const SORT_OPTIONS  = ["인기순", "최신순", "가격 낮은순", "가격 높은순"];

// ── ProductFilter ──────────────────────────────────────────────────────────────
const ProductFilter: FC = () => {
  const [pickySelected,   setPickySelected]   = useState<string[]>([]);
  const [allergySelected, setAllergySelected] = useState<string[]>([]);
  const [openDropdown,    setOpenDropdown]     = useState<"picky" | "allergy" | null>(null);
  const [activeSort,      setActiveSort]       = useState<string>("인기순");

  const pickyRef   = useRef<HTMLDivElement>(null);
  const allergyRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        pickyRef.current   && !pickyRef.current.contains(e.target as Node) &&
        allergyRef.current && !allergyRef.current.contains(e.target as Node)
      ) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function toggle(list: string[], item: string, setList: (v: string[]) => void) {
    setList(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  }

  const pickyActive   = pickySelected.length > 0;
  const allergyActive = allergySelected.length > 0;

  return (
    <div className="flex items-center justify-between py-[12px]">
      {/* 필터 버튼들 */}
      <div className="flex items-center gap-[8px]">

        {/* 편식 제외하기 */}
        <div ref={pickyRef} className="relative">
          <button
            type="button"
            onClick={() => setOpenDropdown(openDropdown === "picky" ? null : "picky")}
            className={[
              "flex items-center gap-[4px] px-[10px] py-[7px] rounded-[10px] text-[13px] font-medium transition-colors",
              pickyActive || openDropdown === "picky"
                ? "border border-primary text-primary"
                : "border border-[#BBBBBB] text-[#555555] hover:border-primary",
            ].join(" ")}
          >
            편식 제외하기
            {pickyActive && (
              <span className="ml-[2px] text-[11px] font-semibold text-primary">
                {pickySelected.length}
              </span>
            )}
            <img
              src={dropdownIcon}
              alt=""
              className={`w-[18px] h-[18px] transition-transform ${openDropdown === "picky" ? "rotate-180" : ""}`}
            />
          </button>

          {openDropdown === "picky" && (
            <DropdownPanel
              title="제외 식품"
              items={PICKY_ITEMS}
              selected={pickySelected}
              onToggle={(item) => toggle(pickySelected, item, setPickySelected)}
              onSelectAll={() => setPickySelected(PICKY_ITEMS)}
            />
          )}
        </div>

        {/* 알레르기 제외하기 */}
        <div ref={allergyRef} className="relative">
          <button
            type="button"
            onClick={() => setOpenDropdown(openDropdown === "allergy" ? null : "allergy")}
            className={[
              "flex items-center gap-[4px] px-[10px] py-[7px] rounded-[10px] text-[13px] font-medium transition-colors",
              allergyActive || openDropdown === "allergy"
                ? "border border-primary text-primary"
                : "border border-[#BBBBBB] text-[#555555] hover:border-primary",
            ].join(" ")}
          >
            알레르기 제외하기
            {allergyActive && (
              <span className="ml-[2px] text-[11px] font-semibold text-primary">
                {allergySelected.length}
              </span>
            )}
            <img
              src={dropdownIcon}
              alt=""
              className={`w-[18px] h-[18px] transition-transform ${openDropdown === "allergy" ? "rotate-180" : ""}`}
            />
          </button>

          {openDropdown === "allergy" && (
            <DropdownPanel
              title="알레르기"
              items={ALLERGY_ITEMS}
              selected={allergySelected}
              onToggle={(item) => toggle(allergySelected, item, setAllergySelected)}
              onSelectAll={() => setAllergySelected(ALLERGY_ITEMS)}
            />
          )}
        </div>

      </div>

      {/* 정렬 옵션 */}
      <div className="flex items-center gap-[4px]">
        {SORT_OPTIONS.map((opt, i) => (
          <div key={opt} className="flex items-center gap-[4px]">
            <button
              onClick={() => setActiveSort(opt)}
              className={[
                "text-[14px] font-medium transition-colors tracking-[-0.025em]",
                activeSort === opt ? "text-primary" : "text-[#555555] hover:text-primary",
              ].join(" ")}
            >
              {opt}
            </button>
            {i < SORT_OPTIONS.length - 1 && (
              <span className="text-[14px] text-[#555555]">ㅣ</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductFilter;