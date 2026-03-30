import { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { requireAuth } from '@/utils/authGuard';
import { zodValidator } from '@tanstack/zod-adapter';
import { sidebarSchema } from '@/schemas/searchSchemas';
import MarkdownEditor from '@/components/code-mirror/MarkdownEditor';
import MarkdownViewer from '@/components/markdown/MarkdownViewer';
import type { Paragraph } from '@/components/markdown/types/markdown-view.types';
import { syncParagraphsWithTracking } from '@/utils/markdownParagraphs';
import { useGetDocument } from '@/hooks/useGetDocument';
import { useUpdateDocumentMutation } from '@/hooks/useUpdateDocumentMutation';
import { useBookmarkToggleMutation } from '@/hooks/useBookmarkToggleMutation';
import { DocsHeader } from '@/components/layout/extract/DocsHeader';
import { LeftSidebar } from '@/components/layout/LeftSidebar';
import { DocumentErrorView } from '@/components/common/DocumentErrorView';

export const Route = createFileRoute('/write/$id')({
  component: RouteComponent,
  validateSearch: zodValidator(sidebarSchema),
  beforeLoad: () => requireAuth(),
});

function RouteComponent() {
  const { id } = Route.useParams();
  const { data, isLoading, error } = useGetDocument(id);

  if (isLoading) return null;
  if (error) return <DocumentErrorView error={error} />;
  if (!data) return null;

  return (
    <WriteEditor
      key={id}
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
  const { mutate: toggleBookmark } = useBookmarkToggleMutation(id);
  const { data } = useGetDocument(id);
  const navigate = useNavigate();

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
    });
  }

  return (
    <div className="flex h-screen">
      <LeftSidebar
        selectedDocumentId={Number(id)}
        onSelectDocument={(docId) => navigate({ to: '/write/$id', params: { id: String(docId) } })}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DocsHeader
          role="writer"
          title={title}
          onTitleChange={setTitle}
          onSave={handleSave}
          isSaving={isSaving}
          isFavorite={data?.bookmark ?? false}
          onToggleFavorite={() => toggleBookmark()}
        />
        <div className="flex flex-1 overflow-hidden">
          <MarkdownEditor text={text} onChange={handleEditorChange} />
          <MarkdownViewer markdown={text} comments={[]} paragraph={paragraphs} />
        </div>
      </div>
    </div>
  );
}
