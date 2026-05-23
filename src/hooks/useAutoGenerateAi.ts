import { useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/api/axios';
import { useAiEvaluationQuery } from './useAiEvaluationQuery';
import type { ExternalDocumentIdRequest } from '@/api/api';

export function useAutoGenerateAi(documentId: string | undefined) {
  const queryClient = useQueryClient();
  const { data: evaluationData, isFetched } = useAiEvaluationQuery(documentId);

  const { mutate: generateAll, isPending: isGenerating } = useMutation({
    mutationKey: ['generate-all', documentId],
    mutationFn: () => {
      if (!documentId) return Promise.reject(new Error('documentId is required'));
      return apiRequest({
        method: 'POST',
        url: 'api/v1/external-ai/generate-all',
        data: { docId: documentId } satisfies ExternalDocumentIdRequest,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', documentId, 'keyword'] });
      queryClient.invalidateQueries({ queryKey: ['documents', documentId, 'summary'] });
      queryClient.invalidateQueries({ queryKey: ['documents', documentId, 'ai-evaluation'] });
      queryClient.invalidateQueries({ queryKey: ['documents', documentId, 'ai-checklist'] });
    },
  });

  useEffect(() => {
    if (isFetched && evaluationData?.totalScore == null) {
      generateAll();
    }
  }, [isFetched, evaluationData?.totalScore, generateAll]);

  return isGenerating;
}
