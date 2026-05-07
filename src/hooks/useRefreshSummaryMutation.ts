import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/api/axios';
import type { ExternalDocumentIdRequest } from '@/api/api';

export function useRefreshSummaryMutation(documentId: string | undefined) {
  const queryClient = useQueryClient();

  const canRefresh = !!documentId;

  return useMutation({
    mutationKey: ['refresh-summary', documentId],
    mutationFn: () => {
      if (!canRefresh) return Promise.reject(new Error('documentId is required'));
      return apiRequest<void>({
        method: 'POST',
        url: 'api/v1/external-ai/summarization/basic',
        data: { docId: documentId } satisfies ExternalDocumentIdRequest,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', documentId, 'summary'] });
    },
  });
}
