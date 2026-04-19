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
import { useKeywordQuery } from '@/hooks/useKeywordQuery';
import { useSummaryQuery } from '@/hooks/useSummaryQuery';
import { useAiEvaluationQuery } from '@/hooks/useAiEvaluationQuery';
import { useAiChecklistQuery } from '@/hooks/useAiChecklistQuery';
import { useDocumentLogsQuery } from '@/hooks/useDocumentLogsQuery';
import { useDocumentCommentsQuery } from '@/hooks/useDocumentCommentsQuery';
import { useDocumentReviewsQuery } from '@/hooks/useDocumentReviewsQuery';

function useSidebarLoading(currentSidebar: string | null, documentId: string | undefined) {
  const { isLoading: isKeywordLoading } = useKeywordQuery(documentId);
  const { isLoading: isSummaryLoading } = useSummaryQuery(documentId);
  const { isLoading: isEvaluationLoading } = useAiEvaluationQuery(documentId);
  const { isLoading: isChecklistLoading } = useAiChecklistQuery(documentId);
  const { isLoading: isLogsLoading } = useDocumentLogsQuery(documentId);
  const { isLoading: isCommentsLoading } = useDocumentCommentsQuery(documentId);
  const { isLoading: isReviewsLoading } = useDocumentReviewsQuery(documentId);

  switch (currentSidebar) {
    case 'summary':
      return isKeywordLoading || isSummaryLoading;
    case 'ai-evaluation':
      return isEvaluationLoading || isChecklistLoading;
    case 'history':
      return isLogsLoading;
    case 'comments':
      return isCommentsLoading;
    case 'review':
      return isReviewsLoading;
    default:
      return false;
  }
}

export function Sidebar() {
  const { currentSidebar, currentRole } = useSidebarNavigation();
  const { id: documentId } = useParams({ strict: false });
  const allowedTabIds = new Set(getTabsByRole(currentRole).map((tab) => tab.id));
  const canRender = !!currentSidebar && allowedTabIds.has(currentSidebar);
  const isLoading = useSidebarLoading(currentSidebar, documentId);

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
