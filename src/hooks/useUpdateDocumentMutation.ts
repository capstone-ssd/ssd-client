import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/api/axios';
import type { CreateDocumentRequest, UpdateDocumentResponse } from '@/api/api';

export function useUpdateDocumentMutation(id: string) {
  return useMutation({
    mutationFn: (body: CreateDocumentRequest) =>
      apiRequest<UpdateDocumentResponse>({
        method: 'PUT',
        url: `api/v1/documents/${id}`,
        data: body,
      }),
  });
}
