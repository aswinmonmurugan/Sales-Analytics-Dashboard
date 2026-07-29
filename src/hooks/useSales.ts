import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchSales } from '../services/salesService';
import type { SalesQueryParams } from '../types/sales';

export function useSales(params: SalesQueryParams) {
  return useQuery({
    queryKey: ['sales', params],
    queryFn: () => fetchSales(params),
    placeholderData: keepPreviousData,
    retry: 1,
  });
}
