import { useState, useCallback } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';

interface UseSearchReturn {
  query: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  onSearch: () => void;
}

export function useSearch(onSubmit?: (query: string) => void): UseSearchReturn {
  const [query, setQuery] = useState('');

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }, []);

  const onSearch = useCallback(() => {
    const trimmed = query.trim();
    if (trimmed) onSubmit?.(trimmed);
  }, [query, onSubmit]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') onSearch();
    },
    [onSearch],
  );

  return { query, onChange, onKeyDown, onSearch };
}