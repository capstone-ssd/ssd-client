import MarkdownEditor from '@/components/code-mirror/MarkdownEditor';
import MarkdownViewer from '@/components/markdown/MarkdownViewer';
import type { Paragraph } from '@/components/markdown/types/markdown-view.types';
import { dummyComments } from '@/mock/sampleComments';
import { sampleMarkdown } from '@/mock/sampleMarkdown';
import { sidebarSchema } from '@/schemas/searchSchemas';
import { createInitialParagraphs, syncParagraphsWithTracking } from '@/utils/markdownParagraphs';
import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { useState } from 'react';

export const Route = createFileRoute('/editor')({
  component: RouteComponent,
  validateSearch: zodValidator(sidebarSchema),
});

function RouteComponent() {
  const comments = dummyComments;
  const [text, setText] = useState(sampleMarkdown);
  const [paragraphs, setParagraphs] = useState<Paragraph[]>(() =>
    createInitialParagraphs(sampleMarkdown)
  );

  const handleEditorChange = (newText: string) => {
    setText(newText);
    setParagraphs((prev) => syncParagraphsWithTracking(newText, prev));
  };
  return (
    <div className="flex">
      <MarkdownEditor text={text} onChange={handleEditorChange} />
      <MarkdownViewer markdown={text} comments={comments} paragraph={paragraphs} />
    </div>
  );
}
