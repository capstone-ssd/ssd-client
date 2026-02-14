import { sidebarSchema } from '@/schemas/searchSchemas';
import { ExtractHeader } from '@/components/layout/extract/ExtractHeader';
import MarkdownViewer from '@/components/markdown/MarkdownViewer';
import type { Paragraph } from '@/components/markdown/types/markdown-view.types';
import { dummyComments } from '@/mock/sampleComments';
import { sampleMarkdown } from '@/mock/sampleMarkdown';
import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';

export const Route = createFileRoute('/extract')({
  component: RouteComponent,
  validateSearch: zodValidator(sidebarSchema),
});

function RouteComponent() {
  const sampleComments = dummyComments;
  const sampleMarkdownText = sampleMarkdown;
  const paragraphs: Paragraph[] = sampleMarkdown
    .split('\n\n')
    .filter((content) => content.trim().length > 0)
    .map((content, index) => ({
      blockId: index + 1,
      content: content
        .trim()
        .replace(/^#{1,6}\s+/, '')
        .replace(/\*\*/g, '')
        .replace(/\*/g, ''),
    }));
  return (
    <>
      <ExtractHeader />
      <div className="min-h-screen bg-gray-50 px-13">
        <MarkdownViewer
          markdown={sampleMarkdownText}
          paragraph={paragraphs}
          comments={sampleComments}
        />
      </div>
    </>
  );
}
