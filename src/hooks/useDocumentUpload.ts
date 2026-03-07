import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { extractPDFCompound } from '@/utils/extractPDFCompound';
import { convertToMarkdown } from '@/utils/convertToMarkdown';
import { createInitialParagraphs } from '@/utils/markdownParagraphs';
import type { Paragraph } from '@/components/markdown/types/markdown-view.types';

type UploadMode = 'writing' | 'evaluate';

interface CreateDocumentRequest {
  markdown: string;
  paragraphs: Paragraph[];
  folderId: number | null;
}

interface CreateDocumentResponse {
  id: number;
}

async function createDocument(body: CreateDocumentRequest): Promise<CreateDocumentResponse> {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}api/v1/documents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`문서 저장 실패: ${res.status}`);
  return res.json() as Promise<CreateDocumentResponse>;
}

export function useDocumentUpload() {
  const navigate = useNavigate();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function upload(file: File, folderId: number | null, mode: UploadMode) {
    setIsPending(true);
    setError(null);
    try {
      const pdfContent = await extractPDFCompound(file);
      const markdown = convertToMarkdown(pdfContent);
      const paragraphs = createInitialParagraphs(markdown);

      const { id } = await createDocument({ markdown, paragraphs, folderId });

      if (mode === 'evaluate') {
        navigate({ to: '/extract/$id', params: { id: String(id) } });
      } else {
        navigate({ to: '/write/$id', params: { id: String(id) } });
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error('알 수 없는 오류'));
    } finally {
      setIsPending(false);
    }
  }

  return { upload, isPending, error };
}
