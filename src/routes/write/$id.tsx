import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { sidebarSchema } from '@/schemas/searchSchemas';
import MarkdownEditor from '@/components/code-mirror/MarkdownEditor';
import MarkdownViewer from '@/components/markdown/MarkdownViewer';
import type { Paragraph } from '@/components/markdown/types/markdown-view.types';
import { syncParagraphsWithTracking } from '@/utils/markdownParagraphs';
import { useGetDocument } from '@/hooks/useGetDocument';
import { useUpdateDocumentMutation } from '@/hooks/useUpdateDocumentMutation';
import { WriterHeader } from '@/components/layout/extract/WirterHeader';

export const Route = createFileRoute('/write/$id')({
  component: RouteComponent,
  validateSearch: zodValidator(sidebarSchema),
});

function RouteComponent() {
  const { id } = Route.useParams();
  const { data, isLoading } = useGetDocument(id);

  if (isLoading) return null;
  if (!data) return null;

  return (
    <WriteEditor
      id={id}
      initialTitle={data.title ?? ''}
      initialText={data.text ?? ''}
      initialParagraphs={data.paragraphs}
    />
  );
}

interface WriteEditorProps {
  id: string;
  initialTitle: string;
  initialText: string;
  initialParagraphs: Paragraph[];
}

function WriteEditor({ id, initialTitle, initialText, initialParagraphs }: WriteEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [text, setText] = useState(initialText);
  const [paragraphs, setParagraphs] = useState<Paragraph[]>(initialParagraphs);
  const { mutate: updateDocument, isPending: isSaving } = useUpdateDocumentMutation(id);

  function handleEditorChange(newText: string) {
    setText(newText);
    setParagraphs((prev) => syncParagraphsWithTracking(newText, prev));
  }

  function handleSave() {
    updateDocument({
      title,
      text,
      paragraphs: paragraphs.map((p) => ({
        content: p.content,
        role: p.role ?? '',
        blockId: p.blockId ?? undefined,
      })),
      folderId: 0,
    });
  }

  return (
    <>
      <WriterHeader role="writer" title={title} onTitleChange={setTitle} onSave={handleSave} isSaving={isSaving} />
      <div className="flex">
        <MarkdownEditor text={text} onChange={handleEditorChange} />
        <MarkdownViewer markdown={text} comments={[]} paragraph={paragraphs} />
      </div>
    </>
  );
}
