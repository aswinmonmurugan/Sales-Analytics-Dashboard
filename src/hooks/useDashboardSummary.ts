import { useQuery } from '@tanstack/react-query';
import { fetchDashboardSummary } from '../services/salesService';

export function useDashboardSummary() {
  return useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: fetchDashboardSummary,
    staleTime: 60_000,
    retry: 1,
  });
}
