import { useQuery } from '@tanstack/react-query';
import { fetchReports } from '../services/salesService';

export function useReports() {
  return useQuery({
    queryKey: ['reports'],
    queryFn: fetchReports,
    staleTime: 60_000,
    retry: 1,
  });
}
