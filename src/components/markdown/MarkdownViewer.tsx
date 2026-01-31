import { useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MarkdownComponent } from './MarkdownComponent';
import { getBlockIdForContent } from './utils/getBlockIdForContent';
import { getCommentCount } from './utils/getCommentCount';
import type { Comment, Paragraph } from './types/markdown-view.types';

interface MarkdownViewerProps {
  markdown: string;
  paragraph: Paragraph[];
  comments: Comment[];
}

export default function MarkdownViewer({ markdown, paragraph, comments }: MarkdownViewerProps) {
  const [selectedBlockId, setSelectedBlockId] = useState<number | null>(null);

  const annotatedComponents = MarkdownComponent({
    getBlockIdForContent: (content: string) => getBlockIdForContent(content, paragraph),
    getCommentCount: (blockId: number) => getCommentCount(blockId, comments),
    selectedBlockId,
    onClick: setSelectedBlockId,
  });

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-4xl">
        <Markdown remarkPlugins={[remarkGfm]} components={annotatedComponents}>
          {markdown}
        </Markdown>
      </div>
    </div>
  );
}
