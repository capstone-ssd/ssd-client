import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MarkdownComponent } from './MarkdownComponent';
import { getBlockIdForContent } from './utils/getBlockIdForContent';
import { getCommentCount } from './utils/getCommentCount';
import { useSidebarNavigation } from '@/hooks/useSidebarNavigation';
import type { Comment, Paragraph } from './types/markdown-view.types';

interface MarkdownViewerProps {
  markdown: string;
  paragraph: Paragraph[];
  comments: Comment[];
}

export default function MarkdownViewer({ markdown, paragraph, comments }: MarkdownViewerProps) {
  const { openSidebar, isBlockSelected } = useSidebarNavigation();

  const annotatedComponents = MarkdownComponent({
    getBlockIdForContent: (content: string) => getBlockIdForContent(content, paragraph),
    getCommentCount: (blockId: number) => getCommentCount(blockId, comments),
    openSidebar,
    isBlockSelected,
  });

  return (
    <div className="min-w-0 flex-1 overflow-x-hidden">
      <div className="mx-auto max-w-4xl p-5">
        <Markdown remarkPlugins={[remarkGfm]} components={annotatedComponents}>
          {markdown}
        </Markdown>
      </div>
    </div>
  );
}
