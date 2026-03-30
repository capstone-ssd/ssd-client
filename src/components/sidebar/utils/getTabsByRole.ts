import type { UserRole } from '@/schemas/roleSchema';
import type { TabItem } from '../types/tab-item-types';
import { EVALUATOR_TABS, WRITER_TABS } from '../constants/tab-items-constants';

/**
 * role에 따라 표시할 탭을 반환
 * - writer: 요약, AI평가, 기록, 주석
 * - evaluator: 요약, AI평가, 리뷰, 주석
 * @param role `'writer'` or `'evaluator'`
 * @returns
 */
export function getTabsByRole(role: UserRole): readonly TabItem[] {
  if (role === 'evaluator') return EVALUATOR_TABS;
  if (role === 'writer') return WRITER_TABS;
  return [];
}
