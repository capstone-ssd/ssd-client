import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/api/axios';
import type { EvaluatorReviewCreateRequest, EvaluatorReviewIdResponse } from '@/api/api';

export function useCreateReviewMutation(documentId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: EvaluatorReviewCreateRequest) =>
      apiRequest<EvaluatorReviewIdResponse>({
        method: 'POST',
        url: `api/v1/documents/${documentId}/reviews`,
        data: body,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', documentId, 'reviews'] });
      queryClient.invalidateQueries({ queryKey: ['documents', documentId, 'reviews', 'me'] });
    },
  });
}
