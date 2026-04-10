import { useState, useCallback } from 'react';
import { useSearch } from './useSearch';
import { useFilter } from './useFilter';
import { NAV_TABS } from '../models/navigation.model';
import type { NavTabId } from '../models/navigation.model';

export function useTopBar(onSearch?: (q: string) => void) {
  const search = useSearch(onSearch);
  const filter = useFilter();
  const [activeTab, setActiveTab] = useState<NavTabId>('all');

  const handleTabChange = useCallback((id: NavTabId) => {
    setActiveTab(id);
  }, []);

  return {
    search,
    filter,
    activeTab,
    setActiveTab: handleTabChange,
    tabs: NAV_TABS,
  };
}