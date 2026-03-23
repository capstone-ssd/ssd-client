import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/api/axios';
import type { ExternalDocumentIdRequest } from '@/api/api';

export function useRefreshSummaryMutation(documentId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      apiRequest<void>({
        method: 'POST',
        url: 'api/v1/mock/external-ai/summarization/basic',
        data: { docId: documentId! } satisfies ExternalDocumentIdRequest,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', documentId, 'summary'] });
    },
  });
}
