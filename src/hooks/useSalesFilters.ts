import { useMemo, useState } from 'react';
import { DEFAULT_PAGE_SIZE, LOCAL_STORAGE_FILTERS_KEY } from '../constants/sales';
import { useLocalStorageState } from './useLocalStorageState';
import { useDebouncedValue } from './useDebouncedValue';
import type { OrderStatus, SalesQueryParams, SortField, SortOrder } from '../types/sales';

export interface PersistedFilters {
  status: OrderStatus | '';
  category: string;
  startDate: string | null;
  endDate: string | null;
  sortBy: SortField;
  sortOrder: SortOrder;
  limit: number;
}

const DEFAULT_FILTERS: PersistedFilters = {
  status: '',
  category: '',
  startDate: null,
  endDate: null,
  sortBy: 'orderDate',
  sortOrder: 'desc',
  limit: DEFAULT_PAGE_SIZE,
};

export function useSalesFilters() {
  const [filters, setFilters] = useLocalStorageState<PersistedFilters>(
    LOCAL_STORAGE_FILTERS_KEY,
    DEFAULT_FILTERS
  );
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebouncedValue(searchInput, 400);

  const updateFilters = (patch: Partial<PersistedFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    setPage(1);
  };

  const setSearch = (value: string) => {
    setSearchInput(value);
    setPage(1);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchInput('');
    setPage(1);
  };

  const queryParams: SalesQueryParams = useMemo(
    () => ({
      page,
      limit: filters.limit,
      search: debouncedSearch || undefined,
      status: filters.status || undefined,
      category: filters.category || undefined,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
      startDate: filters.startDate ?? undefined,
      endDate: filters.endDate ?? undefined,
    }),
    [page, filters, debouncedSearch]
  );

  return {
    filters,
    updateFilters,
    resetFilters,
    searchInput,
    setSearch,
    page,
    setPage,
    queryParams,
  };
}
