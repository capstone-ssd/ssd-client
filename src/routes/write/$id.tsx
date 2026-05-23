import { useState, useRef, useEffect, useCallback } from 'react';
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
import { DocsHeader } from '@/components/layout/DocsHeader';
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
  const navigate = useNavigate();

  if (isLoading) return null;

  if (error || !data) {
    return (
      <div className="flex h-screen">
        <LeftSidebar
          selectedDocumentId={Number(id)}
          onSelectDocument={(docId) => navigate({ to: '/write/$id', params: { id: String(docId) } })}
        />
        <div className="flex flex-1 items-center justify-center">
          {error && <DocumentErrorView error={error} />}
        </div>
      </div>
    );
  }

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
  const [viewerText, setViewerText] = useState(initialText);
  const [paragraphs, setParagraphs] = useState<Paragraph[]>(initialParagraphs);
  const { mutate: updateDocument, isPending: isSaving } = useUpdateDocumentMutation(id);
  const { mutate: toggleBookmark } = useBookmarkToggleMutation(id);
  const { data } = useGetDocument(id);
  const navigate = useNavigate();

  const latestTextRef = useRef(initialText);
  const latestParagraphsRef = useRef<Paragraph[]>(initialParagraphs);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  const handleEditorChange = useCallback((newText: string) => {
    latestTextRef.current = newText;
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      const newParagraphs = syncParagraphsWithTracking(newText, latestParagraphsRef.current);
      latestParagraphsRef.current = newParagraphs;
      setParagraphs(newParagraphs);
      setViewerText(newText);
    }, 300);
  }, []);

  function handleSave() {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
      const newParagraphs = syncParagraphsWithTracking(latestTextRef.current, latestParagraphsRef.current);
      latestParagraphsRef.current = newParagraphs;
    }
    updateDocument({
      title,
      text: latestTextRef.current,
      paragraphs: latestParagraphsRef.current.map((p) => ({
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
          <MarkdownEditor text={initialText} onChange={handleEditorChange} />
          <MarkdownViewer markdown={viewerText} comments={[]} paragraph={paragraphs} />
        </div>
      </div>
    </div>
  );
}
