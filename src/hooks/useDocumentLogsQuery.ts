import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/api/axios';
import type { DocumentLogResponse } from '@/api/api';

export function useDocumentLogsQuery(documentId: string | undefined) {
  return useQuery({
    queryKey: ['documents', documentId, 'logs'],
    queryFn: () =>
      apiRequest<DocumentLogResponse>({
        url: `api/v1/documents/${documentId}/logs`,
      }),
    enabled: !!documentId,
  });
}
