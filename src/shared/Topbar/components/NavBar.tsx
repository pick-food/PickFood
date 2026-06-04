import type { NavTab, NavTabId } from '../models/navigation.model';

interface NavBarProps {
  tabs: NavTab[];
  activeTab: string | null;
  onTabChange: (id: NavTabId) => void;
}

export function NavBar({ tabs, activeTab, onTabChange }: NavBarProps) {
  return (
    <nav style={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto' }} className="scrollbar-hide">
      {tabs.map((tab) => {
        const active = activeTab !== null && tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              padding: '16px 18px',
              fontFamily: 'inherit',
              fontSize: 14,
              fontWeight: active ? 700 : 500,
              color: active ? '#1F4D2C' : '#3A4A3F',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              borderBottom: `2px solid ${active ? '#1F4D2C' : 'transparent'}`,
              whiteSpace: 'nowrap',
              transition: 'color 160ms, border-color 160ms',
              flexShrink: 0,
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
