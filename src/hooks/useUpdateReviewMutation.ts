import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/api/axios';
import type { EvaluatorReviewUpdateRequest, EvaluatorReviewDetailResponse } from '@/api/api';

export function useUpdateReviewMutation(documentId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: EvaluatorReviewUpdateRequest) =>
      apiRequest<EvaluatorReviewDetailResponse>({
        method: 'PUT',
        url: `api/v1/documents/${documentId}/reviews`,
        data: body,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', documentId, 'reviews'] });
      queryClient.invalidateQueries({ queryKey: ['documents', documentId, 'reviews', 'me'] });
    },
  });
}
