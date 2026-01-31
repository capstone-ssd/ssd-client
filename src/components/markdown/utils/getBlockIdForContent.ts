import type { Paragraph } from '../types/markdown-view.types';

/**
 * 렌더링된 content를 originalParagraphs와 매칭하여 blockId를 찾습니다
 * @param content - React Markdown이 렌더링한 텍스트 content
 * @param paragraphs - 원본 paragraphs 배열
 * @returns blockId 또는 null
 */
export function getBlockIdForContent(content: string, paragraphs: Paragraph[]): number | null {
  const trimmedContent = content.trim();
  const found = paragraphs.find((p) => p.content === trimmedContent);
  return found ? found.blockId : null;
}
