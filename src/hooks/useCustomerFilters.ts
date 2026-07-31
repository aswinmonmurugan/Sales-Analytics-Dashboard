import { useMemo, useState } from 'react';
import { useDebouncedValue } from './useDebouncedValue';
import type { CustomerQueryParams, CustomerSortField, SortOrder } from '../types/sales';

const DEFAULT_SORT_BY: CustomerSortField = 'totalSpent';
const DEFAULT_SORT_ORDER: SortOrder = 'desc';
const DEFAULT_LIMIT = 10;

export function useCustomerFilters() {
  const [searchInput, setSearchInput] = useState('');
  const [sortBy, setSortBy] = useState<CustomerSortField>(DEFAULT_SORT_BY);
  const [sortOrder, setSortOrder] = useState<SortOrder>(DEFAULT_SORT_ORDER);
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebouncedValue(searchInput, 400);

  const setSearch = (value: string) => {
    setSearchInput(value);
    setPage(1);
  };

  const handleSortChange = (field: CustomerSortField) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setPage(1);
  };

  const resetFilters = () => {
    setSearchInput('');
    setSortBy(DEFAULT_SORT_BY);
    setSortOrder(DEFAULT_SORT_ORDER);
    setPage(1);
  };

  const queryParams: CustomerQueryParams = useMemo(
    () => ({
      page,
      limit: DEFAULT_LIMIT,
      search: debouncedSearch || undefined,
      sortBy,
      sortOrder,
    }),
    [page, debouncedSearch, sortBy, sortOrder]
  );

  return {
    searchInput,
    setSearch,
    sortBy,
    sortOrder,
    handleSortChange,
    page,
    setPage,
    resetFilters,
    queryParams,
  };
}
