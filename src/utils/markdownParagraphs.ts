import type { Paragraph } from '@/components/markdown/types/markdown-view.types';

/**
 * ReactMarkdown에서 파싱된 이후 content에 담기는 내용 형태에 맞춤
 * @param text 원본 .md 형식의 텍스트
 * @returns
 */
const cleanContent = (text: string): string => {
  return text
    .trim()
    .replace(/^#{1,6}\s+/, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '');
};

/**
 * 원본 텍스트를 \n\n 기준으로 나누어 순수 텍스트 배열로 반환
 */
const splitIntoBlocks = (text: string): string[] => {
  return text.split('\n\n').filter((block) => block.trim().length > 0);
};

/**
 *
 * @param text 원본 .md 형식의 텍스트
 * @returns \n를 기준으로 block을 나누어 id 부여한 Paragraphs[]
 */
export const createInitialParagraphs = (text: string): Paragraph[] => {
  return splitIntoBlocks(text).map((block, index) => ({
    blockId: index + 1,
    content: cleanContent(block),
  }));
};

/**
 * 새로운 텍스트와 기존 Paragraph 배열을 비교하여 ID 유지 또는 새 ID 발급
 * @param newRawText 수정된 .md 문법의 텍스트
 * @param prevParagraphs 수정 이전의 paragraphs[]
 * @returns
 */
export const syncParagraphsWithTracking = (
  newRawText: string,
  prevParagraphs: Paragraph[]
): Paragraph[] => {
  const newBlocks = splitIntoBlocks(newRawText);

  let maxId = prevParagraphs.reduce((max, p) => Math.max(max, p.blockId ?? 0), 0);

  const idPoolMap = new Map<string, number[]>();
  prevParagraphs.forEach((p) => {
    if (p.blockId !== null) {
      const ids = idPoolMap.get(p.content) || [];
      idPoolMap.set(p.content, [...ids, p.blockId]);
    }
  });

  return newBlocks.map((rawBlock) => {
    const cleaned = cleanContent(rawBlock);
    const availableIds = idPoolMap.get(cleaned);

    if (availableIds && availableIds.length > 0) {
      const existingId = availableIds.shift()!;
      return {
        blockId: existingId,
        content: cleaned,
      };
    }

    return {
      blockId: ++maxId,
      content: cleaned,
    };
  });
};
