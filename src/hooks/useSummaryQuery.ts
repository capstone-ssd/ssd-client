import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/api/axios';
import type { ExternalAiSummaryResponse } from '@/api/api';

export function useSummaryQuery(documentId: string | undefined) {
  return useQuery({
    queryKey: ['documents', documentId, 'summary'],
    queryFn: () =>
      apiRequest<ExternalAiSummaryResponse>({
        url: `api/v1/external-ai/summarization/basic/${documentId}`,
      }),
    enabled: !!documentId,
  });
}
