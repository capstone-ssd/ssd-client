import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/api/axios';
import type { ExternalDocumentIdRequest } from '@/api/api';

export function useRefreshEvaluationMutation(documentId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['refresh-evaluation', documentId],
    mutationFn: () => {
      if (!documentId) return Promise.reject(new Error('documentId is required'));
      return apiRequest<void>({
        method: 'POST',
        url: `api/v1/external-ai/evaluate`,
        data: { docId: documentId } satisfies ExternalDocumentIdRequest,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', documentId, 'ai-evaluation'] });
    },
  });
}
