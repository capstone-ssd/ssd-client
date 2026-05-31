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
    .replace(/^[-*+]\s+/, '')
    .replace(/^\d+\.\s+/, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '');
};

const isListLine = (line: string): boolean =>
  /^[-*+]\s/.test(line) || /^\d+\.\s/.test(line);

/**
 * 원본 텍스트를 블록 단위로 분리. 리스트 블록은 항목별로 개별 분리.
 */
const splitIntoBlocks = (text: string): string[] => {
  const doubleNewlineBlocks = text.split('\n\n').filter((block) => block.trim().length > 0);
  const result: string[] = [];

  for (const block of doubleNewlineBlocks) {
    const lines = block.split('\n').filter((line) => line.trim().length > 0);
    const isListBlock = lines.length > 1 && lines.every((line) => isListLine(line.trim()));

    if (isListBlock) {
      lines.forEach((line) => result.push(line.trim()));
    } else {
      result.push(block);
    }
  }

  return result;
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

/**
 *
 * @param newParagraphs syncParagraphsWithTracking()로 반환된 수정 이후 Paragraphs[]
 * @param prevParagraphs 기존 Paragraphs[]
 * @returns 수정 이후 변화가 생긴 Paragraphs[]
 */
export const getChangedParagraphs = (
  newParagraphs: Paragraph[],
  prevParagraphs: Paragraph[]
): Paragraph[] => {
  const prevIds = new Set(prevParagraphs.map((paragraph) => paragraph.blockId));
  return newParagraphs.filter((paragraph) => !prevIds.has(paragraph.blockId));
};
