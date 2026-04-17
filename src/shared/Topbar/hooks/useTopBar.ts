import { useSearch } from './useSearch';
import { useFilter } from './useFilter';
import { NAV_TABS } from '../models/navigation.model';

export function useTopBar(onSearch?: (q: string) => void) {
  const search = useSearch(onSearch);
  const filter = useFilter();

  return {
    search,
    filter,
    tabs: NAV_TABS,
  };
}