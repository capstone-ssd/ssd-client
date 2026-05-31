import type { Paragraph } from '../types/markdown-view.types';

const stripListPrefix = (text: string): string =>
  text.trim().replace(/^[-*+]\s+/, '').replace(/^\d+\.\s+/, '');

/**
 * 렌더링된 content를 originalParagraphs와 매칭하여 blockId를 찾습니다.
 * 서버에 저장된 content가 "- item" 형태일 때도 렌더링된 "item"과 매칭되도록
 * 리스트 접두사를 제거한 버전도 함께 비교합니다.
 */
export function getBlockIdForContent(content: string, paragraphs: Paragraph[]): number | null {
  const trimmedContent = content.trim();
  const found = paragraphs.find(
    (p) => p.content === trimmedContent || stripListPrefix(p.content) === trimmedContent,
  );
  return found ? found.blockId : null;
}
