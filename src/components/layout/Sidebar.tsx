import SidebarTab from '@/components/sidebar/SidebarTab';
import { useSidebarNavigation } from '@/hooks/useSidebarNavigation';
import { SummaryTab } from '@/components/sidebar/tabs/SummaryTab';
import { AiEvaluationTab } from '@/components/sidebar/tabs/AiEvaluationTab';
import { HistoryTab } from '@/components/sidebar/tabs/HistoryTab';
import { CommentsTab } from '@/components/sidebar/tabs/CommentsTab';
import { ReviewTab } from '@/components/sidebar/tabs/ReviewTab';
import { getTabsByRole } from '../sidebar/utils/getTabsByRole';

export function Sidebar() {
  const { currentSidebar, currentRole } = useSidebarNavigation();
  const allowedTabIds = new Set(getTabsByRole(currentRole).map((tab) => tab.id));
  const canRender = !!currentSidebar && allowedTabIds.has(currentSidebar);
  return (
    <aside className="flex w-97.5 flex-col border-l border-gray-200 bg-white">
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
