import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/api/axios';
import type { GetDocumentResponse, DocumentParagraphDto } from '@/api/api';
import type { Paragraph } from '@/components/markdown/types/markdown-view.types';

function toParagraph(dto: DocumentParagraphDto): Paragraph {
  return {
    blockId: dto.blockId ?? null,
    content: dto.content ?? '',
    role: dto.role,
    pageNumber: dto.pageNumber,
  };
}

export function useGetDocument(id: string) {
  return useQuery({
    queryKey: ['documents', id],
    queryFn: () => apiRequest<GetDocumentResponse>({ url: `api/v1/documents/${id}` }),
    select: (data) => ({
      ...data,
      paragraphs: (data.paragraphs ?? []).map(toParagraph),
    }),
  });
}
