import type { ChangeEvent, KeyboardEvent } from 'react';
import searchIcon from '../../../assets/icons/search.png';

interface SearchBarProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  onSearch: () => void;
}

export function SearchBar({ value, onChange, onKeyDown, onSearch }: SearchBarProps) {
  return (
    // Figma: 전체 너비 500px + 버튼 33px = 533px
    <div className="flex items-center w-[533px] flex-shrink-0">
      {/* Figma: width 500px, height 40px, border 2px #8B3A1A, border-radius 2px */}
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder="식품명, 브랜드, 성분 검색"
        className="
          w-[500px] h-10 px-3
          border-2 border-primary
          rounded-l-[2px]
          text-[13px] font-medium leading-[140%] tracking-[-0.025em]
          text-gray-800 placeholder:text-gray-300
          bg-white outline-none focus:ring-0
        "
      />
      {/* Figma: width 33px, height 40px, bg #8B3A1A, border-radius 0 2px 2px 0 */}
      <button
        onClick={onSearch}
        aria-label="검색"
        className="
          w-[33px] h-10 flex-shrink-0
          bg-primary hover:bg-primary-dark
          rounded-r-[2px]
          flex items-center justify-center
          transition-colors
        "
      >
        <img src={searchIcon} alt="" aria-hidden="true" className="w-5 h-5 brightness-0 invert" />
      </button>
    </div>
  );
}