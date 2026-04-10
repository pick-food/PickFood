import shieldIcon from '../../../assets/icons/shield.png';
import { FILTER_ITEMS } from '../models/filter.model';
import type { FilterId } from '../models/filter.model';

interface FilterBarProps {
  isActive: (id: FilterId) => boolean;
  onToggle: (id: FilterId) => void;
}

export function FilterBar({ isActive, onToggle }: FilterBarProps) {
  return (
    <div className="flex items-center gap-[6px] w-full overflow-hidden">

      <div className="flex items-center gap-1 flex-shrink-0">
        <img src={shieldIcon} alt="" aria-hidden="true" className="w-5 h-5" />
        <span className="text-b-13 font-medium text-gray-400 whitespace-nowrap">
          알레르기•질병 필터
        </span>
      </div>

      <div className="flex items-center gap-[6px] overflow-x-auto scrollbar-hide">
        {FILTER_ITEMS.map((item) => {
          const active = isActive(item.id);
          return (
            <button
              key={item.id}
              onClick={() => onToggle(item.id)}
              className={`
                flex-shrink-0 h-6 px-[18px]
                rounded-base border
                text-b-13 font-medium whitespace-nowrap
                transition-colors
                ${active
                  ? 'bg-primary border-primary text-white'
                  : 'bg-white border-gray-300 text-gray-300 hover:border-primary hover:text-primary'
                }
              `}
            >
              {item.label}
            </button>
          );
        })}
      </div>

    </div>
  );
}