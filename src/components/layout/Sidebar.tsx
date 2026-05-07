import SidebarTab from '@/components/sidebar/SidebarTab';
import { useSidebarNavigation } from '@/hooks/useSidebarNavigation';
import { SummaryTab } from '@/components/sidebar/tabs/SummaryTab';
import { AiEvaluationTab } from '@/components/sidebar/tabs/AiEvaluationTab';
import { HistoryTab } from '@/components/sidebar/tabs/HistoryTab';
import { CommentsTab } from '@/components/sidebar/tabs/CommentsTab';
import { ReviewTab } from '@/components/sidebar/tabs/ReviewTab';
import { getTabsByRole } from '../sidebar/utils/getTabsByRole';
import { SidebarLoadingState } from '@/components/common/SidebarLoadingState';
import { useParams } from '@tanstack/react-router';
import { useMutationState } from '@tanstack/react-query';
import { useKeywordQuery } from '@/hooks/useKeywordQuery';
import { useSummaryQuery } from '@/hooks/useSummaryQuery';
import { useAiEvaluationQuery } from '@/hooks/useAiEvaluationQuery';
import { useAiChecklistQuery } from '@/hooks/useAiChecklistQuery';
import { useDocumentLogsQuery } from '@/hooks/useDocumentLogsQuery';
import { useDocumentCommentsQuery } from '@/hooks/useDocumentCommentsQuery';
import { useDocumentReviewsQuery } from '@/hooks/useDocumentReviewsQuery';

function useSidebarLoading(documentId: string | undefined) {
  const { isFetching: isKeywordFetching } = useKeywordQuery(documentId);
  const { isFetching: isSummaryFetching } = useSummaryQuery(documentId);
  const { isFetching: isEvaluationFetching } = useAiEvaluationQuery(documentId);
  const { isFetching: isChecklistFetching } = useAiChecklistQuery(documentId);
  const { isFetching: isLogsFetching } = useDocumentLogsQuery(documentId);
  const { isFetching: isCommentsFetching } = useDocumentCommentsQuery(documentId);
  const { isFetching: isReviewsFetching } = useDocumentReviewsQuery(documentId);

  const isKeywordRefreshing = useMutationState({
    filters: { mutationKey: ['refresh-keyword', documentId], status: 'pending' },
  }).length > 0;

  const isSummaryRefreshing = useMutationState({
    filters: { mutationKey: ['refresh-summary', documentId], status: 'pending' },
  }).length > 0;

  const isChecklistRefreshing = useMutationState({
    filters: { mutationKey: ['refresh-checklist', documentId], status: 'pending' },
  }).length > 0;

  const isEvaluationRefreshing = useMutationState({
    filters: { mutationKey: ['refresh-evaluation', documentId], status: 'pending' },
  }).length > 0;

  return (
    isKeywordFetching || isSummaryFetching || isEvaluationFetching || isChecklistFetching ||
    isLogsFetching || isCommentsFetching || isReviewsFetching ||
    isKeywordRefreshing || isSummaryRefreshing || isChecklistRefreshing || isEvaluationRefreshing
  );
}

export function Sidebar() {
  const { currentSidebar, currentRole } = useSidebarNavigation();
  const { id: documentId } = useParams({ strict: false });
  const allowedTabIds = new Set(getTabsByRole(currentRole).map((tab) => tab.id));
  const canRender = !!currentSidebar && allowedTabIds.has(currentSidebar);
  const isLoading = useSidebarLoading(documentId);

  return (
    <aside className="relative flex w-97.5 flex-col border-l border-gray-200 bg-white">
      {isLoading && <SidebarLoadingState />}
      <SidebarTab />
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-5">
        {canRender && currentSidebar === 'summary' && <SummaryTab />}
        {canRender && currentSidebar === 'ai-evaluation' && <AiEvaluationTab />}
        {canRender && currentSidebar === 'history' && <HistoryTab />}
        {canRender && currentSidebar === 'comments' && <CommentsTab />}
        {canRender && currentSidebar === 'review' && <ReviewTab />}
      </div>
    </aside>
  );
}
