import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/api/axios';
import type { EvaluatorReviewListResponse } from '@/api/api';

export function useDocumentReviewsQuery(documentId: string | undefined) {
  return useQuery({
    queryKey: ['documents', documentId, 'reviews'],
    queryFn: () =>
      apiRequest<EvaluatorReviewListResponse>({
        url: `api/v1/documents/${documentId}/reviews`,
      }),
    enabled: !!documentId,
  });
}
