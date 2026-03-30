import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/api/axios';
import type { EvaluatorReviewDetailResponse } from '@/api/api';

export function useMyReviewQuery(documentId: string | undefined) {
  return useQuery({
    queryKey: ['documents', documentId, 'reviews', 'me'],
    queryFn: () =>
      apiRequest<EvaluatorReviewDetailResponse>({
        url: `api/v1/documents/${documentId}/reviews/me`,
      }),
    enabled: !!documentId,
  });
}
