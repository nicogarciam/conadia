import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/config/api';
import { FunctionalUnit } from '../types';

export function useFunctionalUnits(consortiumId?: string) {
  return useQuery<FunctionalUnit[]>({
    queryKey: ['functional-units', consortiumId],
    queryFn: async () => {
      const { data } = await apiClient.get('/functional-units', {
        params: { consortium_id: consortiumId },
      });
      return data;
    },
    enabled: !!consortiumId,
  });
}
