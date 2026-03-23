import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/api/axios';
import type { DocumentBookmarkResponse, GetDocumentResponse } from '@/api/api';

export function useBookmarkToggleMutation(id: string) {
  const queryClient = useQueryClient();
  const queryKey = ['documents', id];

  return useMutation({
    mutationFn: () =>
      apiRequest<DocumentBookmarkResponse>({
        method: 'PATCH',
        url: `api/v1/documents/${id}/bookmark`,
      }),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData<GetDocumentResponse>(queryKey);

      queryClient.setQueryData<GetDocumentResponse>(queryKey, (old) => {
        if (!old) return old;
        return { ...old, bookmark: !old.bookmark };
      });

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
