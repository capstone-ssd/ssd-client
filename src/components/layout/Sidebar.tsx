import SidebarTab from '@/components/sidebar/SidebarTab';
import { useSidebarNavigation } from '@/hooks/useSidebarNavigation';

export function Sidebar() {
  const { currentSidebar } = useSidebarNavigation();

  return (
    <aside className="flex w-100 flex-col border-l border-gray-200 bg-white">
      <SidebarTab />

      <div className="flex-1 overflow-y-auto p-6">
        {currentSidebar === 'summary' && (
          <div>
            <h2 className="body-nav mb-4 font-semibold">요약</h2>
            <p className="body-small text-gray-600">문서 요약 내용이 여기에 표시됩니다.</p>
          </div>
        )}

        {currentSidebar === 'ai-evaluation' && (
          <div>
            <h2 className="body-nav mb-4 font-semibold">AI 평가</h2>
            <p className="body-small text-gray-600">AI 평가 결과가 여기에 표시됩니다.</p>
          </div>
        )}

        {currentSidebar === 'history' && (
          <div>
            <h2 className="body-nav mb-4 font-semibold">기록</h2>
            <p className="body-small text-gray-600">문서 수정 히스토리가 여기에 표시됩니다.</p>
          </div>
        )}

        {currentSidebar === 'review' && (
          <div>
            <h2 className="body-nav mb-4 font-semibold">리뷰</h2>
            <p className="body-small text-gray-600">평가 및 검토 내용이 여기에 표시됩니다.</p>
          </div>
        )}

        {currentSidebar === 'comments' && (
          <div>
            <h2 className="body-nav mb-4 font-semibold">주석</h2>
            <p className="body-small text-gray-600">블록별 코멘트가 여기에 표시됩니다.</p>
          </div>
        )}
      </div>
    </aside>
  );
}
