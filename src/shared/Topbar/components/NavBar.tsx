import type { NavTab, NavTabId } from '../models/navigation.model';

interface NavBarProps {
  tabs: NavTab[];
  activeTab: NavTabId;
  onTabChange: (id: NavTabId) => void;
}

export function NavBar({ tabs, activeTab, onTabChange }: NavBarProps) {
  return (
    <nav className="flex items-center gap-5">
      {tabs.map((tab) => {
        const active = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              relative py-[10px]
              text-b-13 font-medium
              transition-colors
              ${active ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}
            `}
          >
            {tab.label}
            {active && (
              <span className="absolute bottom-0 left-0 w-full h-[4px] bg-primary rounded-[2px]" />
            )}
          </button>
        );
      })}
    </nav>
  );
}