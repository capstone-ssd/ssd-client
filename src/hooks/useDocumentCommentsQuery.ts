import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/api/axios';
import type { DocumentCommentItemResponse } from '@/api/api';

export function useDocumentCommentsQuery(documentId: string | undefined) {
  return useQuery({
    queryKey: ['documents', documentId, 'comments'],
    queryFn: () =>
      apiRequest<DocumentCommentItemResponse[]>({
        url: `api/v1/documents/${documentId}/comments`,
      }),
    enabled: !!documentId,
  });
}
