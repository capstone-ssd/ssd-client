import SidebarTab from '@/components/sidebar/SidebarTab';
import { useSidebarNavigation } from '@/hooks/useSidebarNavigation';
import { SummaryTab } from '@/components/sidebar/tabs/SummaryTab';
import { AiEvaluationTab } from '@/components/sidebar/tabs/AiEvaluationTab';
import { HistoryTab } from '@/components/sidebar/tabs/HistoryTab';
import { CommentsTab } from '@/components/sidebar/tabs/CommentsTab';
import { ReviewTab } from '@/components/sidebar/tabs/ReviewTab';

export function Sidebar() {
  const { currentSidebar } = useSidebarNavigation();

  return (
    <aside className="flex w-[390px] flex-col border-l border-gray-200 bg-white">
      <SidebarTab />

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-5">
        {currentSidebar === 'summary' && <SummaryTab />}
        {currentSidebar === 'ai-evaluation' && <AiEvaluationTab />}
        {currentSidebar === 'history' && <HistoryTab />}
        {currentSidebar === 'comments' && <CommentsTab />}
        {currentSidebar === 'review' && <ReviewTab />}
      </div>
    </aside>
  );
}
