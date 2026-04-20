import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/api/axios';
import type { ExternalAiEvaluationCardResponse } from '@/api/api';

export function useAiEvaluationQuery(documentId: string | undefined) {
  return useQuery({
    queryKey: ['documents', documentId, 'ai-evaluation'],
    queryFn: () =>
      apiRequest<ExternalAiEvaluationCardResponse>({
        url: `api/v1/external-ai/evaluate/${documentId}`,
      }),
    enabled: !!documentId,
  });
}
