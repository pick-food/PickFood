import type { ChangeEvent, KeyboardEvent } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  onSearch: () => void;
}

export function SearchBar({ value, onChange, onKeyDown, onSearch }: SearchBarProps) {
  return (
    <div className="flex items-center flex-1 max-w-[520px]">
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder="식품명, 브랜드, 성분 검색"
        className="flex-1 h-10 px-4 bg-white/95 rounded-l-lg text-[13px] font-medium text-gray-900 placeholder:text-gray-300 outline-none focus:ring-0 border-0"
        style={{ borderRadius: '8px 0 0 8px' }}
      />
      <button
        onClick={onSearch}
        aria-label="검색"
        className="h-10 w-11 flex-shrink-0 flex items-center justify-center transition-colors"
        style={{ background: '#A8E063', borderRadius: '0 8px 8px 0' }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="8" stroke="#0F1E12" strokeWidth="2"/>
          <path d="M21 21L16.65 16.65" stroke="#0F1E12" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}
