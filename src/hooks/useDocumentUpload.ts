import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { extractPDFCompound } from '@/utils/extractPDFCompound';
import { convertToMarkdown } from '@/utils/convertToMarkdown';
import { apiRequest } from '@/api/axios';
import type {
  CreateDocumentRequest,
  CreateDocumentResponse,
  DocumentParagraphDto,
} from '@/api/api';

type UploadMode = 'writing' | 'evaluate';

interface UploadVariables {
  file: File;
  folderId: number | null;
  mode: UploadMode;
}

async function uploadDocument({ file, folderId, mode }: UploadVariables) {
  const pdfContent = await extractPDFCompound(file);
  const markdown = convertToMarkdown(pdfContent);

  const paragraphs: DocumentParagraphDto[] = pdfContent.paragraphs.map((p, index) => ({
    blockId: index + 1,
    content: p.content,
    role: p.role,
    pageNumber: 1,
  }));

  const body: CreateDocumentRequest = {
    text: markdown,
    paragraphs,
    folderId: folderId ?? 0,
  };

  const res = await apiRequest<CreateDocumentResponse>({
    method: 'POST',
    url: 'api/v1/documents',
    data: body,
  });
  if (res.id == null) throw new Error('응답에 document id가 없습니다');

  return { id: res.id, mode };
}

export function useDocumentUpload() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: uploadDocument,
    onSuccess: ({ id, mode }) => {
      if (mode === 'evaluate') navigate({ to: '/extract/$id', params: { id: String(id) } });
      if (mode === 'writing') navigate({ to: '/write/$id', params: { id: String(id) } });
    },
  });
}
