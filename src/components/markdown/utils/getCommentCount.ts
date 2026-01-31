import type { Comment } from '../MarkdownViewer';

/**
 * 특정 blockId에 달린 주석 개수를 반환합니다
 * @param blockId - 주석을 찾을 blockId
 * @param comments - 전체 주석 배열
 * @returns 주석 개수
 */
export function getCommentCount(blockId: number, comments: Comment[]): number {
  return comments.filter((c) => c.blockId === blockId).length;
}
