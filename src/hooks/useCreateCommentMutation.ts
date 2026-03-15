import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/api/axios';
import type { DocumentCommentRequest, DocumentCommentResponse } from '@/api/api';

export function useCreateCommentMutation(documentId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: DocumentCommentRequest) =>
      apiRequest<DocumentCommentResponse>({
        method: 'POST',
        url: `api/v1/documents/${documentId}/comments`,
        data: body,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', documentId, 'comments'] });
    },
  });
}
