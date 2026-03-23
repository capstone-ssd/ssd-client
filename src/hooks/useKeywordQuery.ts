import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/api/axios';
import type { ExternalAiKeywordResponse } from '@/api/api';

export function useKeywordQuery(documentId: string | undefined) {
  return useQuery({
    queryKey: ['documents', documentId, 'keyword'],
    queryFn: () =>
      apiRequest<ExternalAiKeywordResponse>({
        url: `api/v1/mock/external-ai/summarization/keyword/${documentId}`,
      }),
    enabled: !!documentId,
  });
}
