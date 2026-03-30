import { useQuery } from '@tanstack/react-query';
import { apiRequest, getAccessToken } from '@/api/axios';
import type { GetMyMemberResponse } from '@/api/api';

export function useMeQuery() {
  return useQuery({
    queryKey: ['me'],
    queryFn: () => apiRequest<GetMyMemberResponse>({ url: 'api/v1/members/me' }),
    enabled: !!getAccessToken(),
  });
}
