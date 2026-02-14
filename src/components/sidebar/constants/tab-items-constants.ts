import { File, AiEvaluation, ClockForward, Bookmark, Review } from '@/components/icons';
import type { TabItem } from '../types/tab-item-types';

export const WRITER_TABS: TabItem[] = [
  {
    id: 'summary',
    label: '요약',
    icon: File,
  },
  {
    id: 'ai-evaluation',
    label: 'AI평가',
    icon: AiEvaluation,
  },
  {
    id: 'history',
    label: '기록',
    icon: ClockForward,
  },
  {
    id: 'comments',
    label: '주석',
    icon: Bookmark,
  },
] as const;

export const EVALUATOR_TABS: TabItem[] = [
  {
    id: 'summary',
    label: '요약',
    icon: File,
  },
  {
    id: 'ai-evaluation',
    label: 'AI평가',
    icon: AiEvaluation,
  },
  {
    id: 'review',
    label: '리뷰',
    icon: Review,
  },
  {
    id: 'comments',
    label: '주석',
    icon: Bookmark,
  },
] as const;
