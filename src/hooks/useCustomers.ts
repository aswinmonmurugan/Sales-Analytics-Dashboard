import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchCustomers } from '../services/salesService';
import type { CustomerQueryParams } from '../types/sales';

export function useCustomers(params: CustomerQueryParams) {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: () => fetchCustomers(params),
    placeholderData: keepPreviousData,
    retry: 1,
  });
}
