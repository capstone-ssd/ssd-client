import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { sidebarSchema } from '@/schemas/searchSchemas';
import MarkdownEditor from '@/components/code-mirror/MarkdownEditor';
import MarkdownViewer from '@/components/markdown/MarkdownViewer';
import type { Paragraph } from '@/components/markdown/types/markdown-view.types';
import { syncParagraphsWithTracking } from '@/utils/markdownParagraphs';
import { useGetDocument } from '@/hooks/useGetDocument';

export const Route = createFileRoute('/write/$id')({
  component: RouteComponent,
  validateSearch: zodValidator(sidebarSchema),
});

function RouteComponent() {
  const { id } = Route.useParams();
  const { data, isLoading } = useGetDocument(id);

  if (isLoading) return null;
  if (!data) return null;

  return <WriteEditor initialText={data.text ?? ''} initialParagraphs={data.paragraphs} />;
}

interface WriteEditorProps {
  initialText: string;
  initialParagraphs: Paragraph[];
}

function WriteEditor({ initialText, initialParagraphs }: WriteEditorProps) {
  const [text, setText] = useState(initialText);
  const [paragraphs, setParagraphs] = useState<Paragraph[]>(initialParagraphs);

  function handleEditorChange(newText: string) {
    setText(newText);
    setParagraphs((prev) => syncParagraphsWithTracking(newText, prev));
  }

  return (
    <div className="flex">
      <MarkdownEditor text={text} onChange={handleEditorChange} />
      <MarkdownViewer markdown={text} comments={[]} paragraph={paragraphs} />
    </div>
  );
}
