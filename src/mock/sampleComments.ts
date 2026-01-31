import type { Comment } from '@/components/markdown/MarkdownViewer';

export const dummyComments: Comment[] = [
  {
    id: '1',
    blockId: 1,
    content: '사업 개요가 명확하게 작성되었습니다.',
    author: '평가자1',
    createdAt: new Date('2025-01-25'),
  },
  {
    id: '2',
    blockId: 3,
    content: '시장 규모에 대한 근거 자료를 추가해주세요.',
    author: '평가자2',
    createdAt: new Date('2025-01-26'),
  },
  {
    id: '3',
    blockId: 5,
    content: '비전이 구체적이고 달성 가능해 보입니다.',
    author: '평가자1',
    createdAt: new Date('2025-01-27'),
  },
  {
    id: '4',
    blockId: 10,
    content: '경쟁사 분석이 부족합니다. 구체적인 비교 데이터가 필요합니다.',
    author: '평가자3',
    createdAt: new Date('2025-01-28'),
  },
];
