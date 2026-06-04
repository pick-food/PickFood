import { FILTER_ITEMS } from '../models/filter.model';
import type { FilterId } from '../models/filter.model';

interface FilterBarProps {
  isActive: (id: FilterId) => boolean;
  onToggle: (id: FilterId) => void;
}

const ShieldIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L4 6v6c0 5.5 3.5 10.7 8 12 4.5-1.3 8-6.5 8-12V6L12 2z" stroke="#A8E063" strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M9 12l2 2 4-4" stroke="#A8E063" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export function FilterBar({ isActive, onToggle }: FilterBarProps) {
  return (
    <div className="flex items-center gap-2 w-full overflow-hidden">

      <div className="flex items-center gap-1.5 flex-shrink-0">
        <ShieldIcon />
        <span className="text-[12px] font-medium text-white/60 whitespace-nowrap">
          알레르기·질병 필터
        </span>
      </div>

      <div className="w-px h-4 bg-white/20 flex-shrink-0 mx-1" />

      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
        {FILTER_ITEMS.map((item) => {
          const active = isActive(item.id);
          return (
            <button
              key={item.id}
              onClick={() => onToggle(item.id)}
              className="flex-shrink-0 h-6 px-3 rounded-full text-[11px] font-medium whitespace-nowrap transition-all pf-press"
              style={active
                ? { background: '#A8E063', color: '#0F1E12' }
                : { background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.65)', border: '1px solid rgba(255,255,255,0.15)' }
              }
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
