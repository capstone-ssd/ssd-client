import type { Components } from 'react-markdown';
import BlockWrapper from './BlockWrapper';
import { extractTextFromChildren } from './utils/extractTextFromChildren';
import { cn } from '@/utils/cn';
import type { SidebarSearch } from '@/schemas/searchSchemas';

interface MarkdownComponentProps {
  getBlockIdForContent: (content: string) => number | null;
  getCommentCount: (blockId: number) => number;
  openSidebar: (sidebar: SidebarSearch['sidebar'], blockId: SidebarSearch['blockId']) => void;
  isBlockSelected: (id: number) => boolean;
}

export function MarkdownComponent({
  getBlockIdForContent,
  getCommentCount,
  openSidebar,
  isBlockSelected,
}: MarkdownComponentProps): Components {
  return {
    h1: ({ children, ...props }) => {
      const content = extractTextFromChildren(children).trim();
      const blockId = getBlockIdForContent(content);

      if (!blockId) {
        return (
          <h1 className="mt-6 mb-4 border-b pb-2 text-3xl font-bold text-gray-900" {...props}>
            {children}
          </h1>
        );
      }

      return (
        <BlockWrapper blockId={blockId} hasComments={getCommentCount(blockId) > 0}>
          <h1 className="text-3xl font-bold text-gray-900" {...props}>
            {children}
          </h1>
        </BlockWrapper>
      );
    },

    h2: ({ children, ...props }) => {
      const content = extractTextFromChildren(children).trim();
      const blockId = getBlockIdForContent(content);
      if (!blockId) {
        return (
          <h2 className="mt-5 mb-3 text-2xl font-bold text-gray-800" {...props}>
            {children}
          </h2>
        );
      }

      return (
        <BlockWrapper blockId={blockId} hasComments={getCommentCount(blockId) > 0}>
          <h2 className="text-2xl font-bold text-gray-800" {...props}>
            {children}
          </h2>
        </BlockWrapper>
      );
    },

    h3: ({ children, ...props }) => {
      const content = extractTextFromChildren(children).trim();
      const blockId = getBlockIdForContent(content);

      if (!blockId) {
        return (
          <h3 className="mt-4 mb-2 text-xl font-semibold text-gray-800" {...props}>
            {children}
          </h3>
        );
      }

      return (
        <BlockWrapper blockId={blockId} hasComments={getCommentCount(blockId) > 0}>
          <h3 className="text-xl font-semibold text-gray-800" {...props}>
            {children}
          </h3>
        </BlockWrapper>
      );
    },

    h4: ({ children, ...props }) => {
      const content = extractTextFromChildren(children).trim();
      const blockId = getBlockIdForContent(content);

      if (!blockId) {
        return (
          <h4 className="mt-4 mb-2 text-lg font-semibold text-gray-800" {...props}>
            {children}
          </h4>
        );
      }

      return (
        <BlockWrapper blockId={blockId} hasComments={getCommentCount(blockId) > 0}>
          <h4 className="text-lg font-semibold text-gray-800" {...props}>
            {children}
          </h4>
        </BlockWrapper>
      );
    },

    h5: ({ children, ...props }) => {
      const content = extractTextFromChildren(children).trim();
      const blockId = getBlockIdForContent(content);

      if (!blockId) {
        return (
          <h5 className="mt-3 mb-2 text-base font-semibold text-gray-800" {...props}>
            {children}
          </h5>
        );
      }

      return (
        <BlockWrapper blockId={blockId} hasComments={getCommentCount(blockId) > 0}>
          <h5 className="text-base font-semibold text-gray-800" {...props}>
            {children}
          </h5>
        </BlockWrapper>
      );
    },

    h6: ({ children, ...props }) => {
      const content = extractTextFromChildren(children).trim();
      const blockId = getBlockIdForContent(content);

      if (!blockId) {
        return (
          <h6 className="mt-3 mb-2 text-sm font-semibold text-gray-700" {...props}>
            {children}
          </h6>
        );
      }

      return (
        <BlockWrapper blockId={blockId} hasComments={getCommentCount(blockId) > 0}>
          <h6 className="text-sm font-semibold text-gray-700" {...props}>
            {children}
          </h6>
        </BlockWrapper>
      );
    },

    p: ({ children, ...props }) => {
      const content = extractTextFromChildren(children).trim();
      const blockId = getBlockIdForContent(content);

      if (!blockId) {
        return (
          <p className="mb-4 leading-7 text-gray-700" {...props}>
            {children}
          </p>
        );
      }

      return (
        <BlockWrapper blockId={blockId} hasComments={getCommentCount(blockId) > 0}>
          <p className="leading-7 text-gray-700" {...props}>
            {children}
          </p>
        </BlockWrapper>
      );
    },

    strong: ({ children, ...props }) => (
      <strong className="font-bold text-gray-900" {...props}>
        {children}
      </strong>
    ),
    ul: ({ children, ...props }) => (
      <ul className="mb-4 list-disc space-y-2 pl-5" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="mb-4 list-decimal space-y-2 pl-5" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => {
      const content = extractTextFromChildren(children).trim();
      const blockId = getBlockIdForContent(content);

      if (!blockId) {
        return (
          <li className="text-gray-700" {...props}>
            {children}
          </li>
        );
      }

      const isSelected = isBlockSelected(blockId);
      const hasComments = getCommentCount(blockId) > 0;

      return (
        <li
          data-block-id={blockId}
          onClick={() => openSidebar('comments', blockId)}
          className={cn(
            'cursor-pointer rounded px-2 transition-all duration-200 text-gray-700',
            isSelected && 'bg-blue-100',
            !isSelected && hasComments && 'bg-yellow-50 hover:bg-yellow-100',
            !isSelected && !hasComments && 'hover:bg-gray-100',
          )}
          {...props}
        >
          {children}
        </li>
      );
    },
    table: ({ children, ...props }) => (
      <div className="my-6 overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300" {...props}>
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }) => (
      <thead className="bg-gray-100" {...props}>
        {children}
      </thead>
    ),
    tbody: ({ children, ...props }) => <tbody {...props}>{children}</tbody>,
    tr: ({ children, ...props }) => (
      <tr className="border-b border-gray-200 hover:bg-gray-50" {...props}>
        {children}
      </tr>
    ),
    th: ({ children, ...props }) => (
      <th
        className="border border-gray-300 bg-gray-50 px-4 py-3 text-left font-semibold text-gray-900"
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td className="border border-gray-300 px-4 py-3 text-gray-700" {...props}>
        {children}
      </td>
    ),
    img: ({ ...props }) => (
      <img className="my-6 h-auto max-w-full rounded-lg shadow-md" {...props} />
    ),
    blockquote: ({ children, ...props }) => (
      <blockquote className="my-4 border-l-4 border-gray-300 pl-4 text-gray-600 italic" {...props}>
        {children}
      </blockquote>
    ),
    code: ({ inline, children, ...props }: any) =>
      inline ? (
        <code className="rounded bg-gray-100 px-2 py-1 font-mono text-sm text-red-600" {...props}>
          {children}
        </code>
      ) : (
        <code
          className="block overflow-x-auto rounded-lg bg-gray-100 p-4 font-mono text-sm"
          {...props}
        >
          {children}
        </code>
      ),
  };
}
