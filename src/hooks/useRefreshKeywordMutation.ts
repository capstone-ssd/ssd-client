import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/api/axios';
import type { ExternalDocumentIdRequest } from '@/api/api';

export function useRefreshKeywordMutation(documentId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      apiRequest<void>({
        method: 'POST',
        url: 'api/v1/mock/external-ai/summarization/keyword',
        data: { docId: documentId } satisfies ExternalDocumentIdRequest,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', documentId, 'keyword'] });
    },
  });
}
