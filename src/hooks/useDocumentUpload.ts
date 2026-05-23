import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { extractPDFCompound } from '@/utils/extractPDFCompound';
import { convertToMarkdown } from '@/utils/convertToMarkdown';
import { apiRequest } from '@/api/axios';
import type {
  CreateDocumentBlockRequest,
  CreateDocumentRequest,
  CreateDocumentResponse,
  DocumentImageMetaRequest,
} from '@/api/api';

type UploadMode = 'writing' | 'evaluate';

interface UploadVariables {
  file: File;
  folderId: number | null;
  mode: UploadMode;
  purpose: 'WRITING' | 'EVALUATION';
}

async function uploadDocument({ file, folderId, mode, purpose }: UploadVariables) {
  const pdfContent = await extractPDFCompound(file);
  const markdown = convertToMarkdown(pdfContent);

  const imageKeys = pdfContent.images.map((_, i) => `img-${Date.now()}-${i}`);

  // 마크다운의 로컬 blob URL을 blobKey로 교체
  let processedMarkdown = markdown;
  pdfContent.images.forEach((image, i) => {
    processedMarkdown = processedMarkdown.replace(image.data, imageKeys[i]);
  });

  let blockId = 1;
  const textParagraphs: CreateDocumentBlockRequest[] = pdfContent.paragraphs.map((p) => ({
    type: 'PARAGRAPH' as const,
    blockId: blockId++,
    content: p.content,
    role: p.role ?? '',
  }));

  const imageParagraphs: CreateDocumentBlockRequest[] = pdfContent.images.map((_, i) => ({
    type: 'IMAGE' as const,
    blockId: blockId++,
    blobKey: imageKeys[i],
  }));

  const requestData: CreateDocumentRequest = {
    text: processedMarkdown,
    paragraphs: [...textParagraphs, ...imageParagraphs],
    folderId: folderId ?? 0,
    purpose,
  };

  const imageMetas: DocumentImageMetaRequest[] = pdfContent.images.map((_, i) => ({
    blobKey: imageKeys[i],
    blockId: imageParagraphs[i].blockId!,
  }));

  const formData = new FormData();
  formData.append('request', new Blob([JSON.stringify(requestData)], { type: 'application/json' }));
  if (imageMetas.length > 0) {
    formData.append('imageMetas', new Blob([JSON.stringify(imageMetas)], { type: 'application/json' }));
    pdfContent.images.forEach((image, i) => {
      formData.append('files', image.file, `${imageKeys[i]}.jpg`);
    });
  }

  const res = await apiRequest<CreateDocumentResponse>({
    method: 'POST',
    url: 'api/v1/documents',
    data: formData,
  });
  if (res.id == null) throw new Error('응답에 document id가 없습니다');

  return { id: res.id, mode };
}

export function useDocumentUpload() {
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ['document-upload'],
    mutationFn: uploadDocument,
    onSuccess: ({ id, mode }) => {
      if (mode === 'evaluate') navigate({ to: '/evaluate/$id', params: { id: String(id) } });
      if (mode === 'writing') navigate({ to: '/write/$id', params: { id: String(id) } });
    },
  });
}
