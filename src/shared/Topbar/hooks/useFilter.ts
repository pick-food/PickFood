import { useState, useCallback } from 'react';
import type { FilterId } from '../models/filter.model';

interface UseFilterReturn {
  activeFilters: Set<FilterId>;
  toggle: (id: FilterId) => void;
  isActive: (id: FilterId) => boolean;
  reset: () => void;
}

export function useFilter(): UseFilterReturn {
  const [activeFilters, setActiveFilters] = useState<Set<FilterId>>(new Set());

  const toggle = useCallback((id: FilterId) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const isActive = useCallback(
    (id: FilterId) => activeFilters.has(id),
    [activeFilters],
  );

  const reset = useCallback(() => setActiveFilters(new Set()), []);

  return { activeFilters, toggle, isActive, reset };
}