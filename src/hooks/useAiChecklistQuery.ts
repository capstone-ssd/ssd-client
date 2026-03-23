import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/api/axios';
import type { ExternalAiDocumentCheckResponse } from '@/api/api';

export function useAiChecklistQuery(documentId: string | undefined) {
  return useQuery({
    queryKey: ['documents', documentId, 'ai-checklist'],
    queryFn: () =>
      apiRequest<ExternalAiDocumentCheckResponse>({
        url: `api/v1/mock/external-ai/check/new-text/${documentId}`,
      }),
    enabled: !!documentId,
  });
}
