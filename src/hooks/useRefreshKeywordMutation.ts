import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/api/axios';
import type { ExternalDocumentIdRequest } from '@/api/api';

export function useRefreshKeywordMutation(documentId: string | undefined) {
  const queryClient = useQueryClient();

  const canRefresh = !!documentId;

  return useMutation({
    mutationFn: () => {
      if (!canRefresh) return Promise.reject(new Error('documentId is required'));
      return apiRequest<void>({
        method: 'POST',
        url: 'api/v1/mock/external-ai/summarization/keyword',
        data: { docId: documentId } satisfies ExternalDocumentIdRequest,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', documentId, 'keyword'] });
    },
  });
}
