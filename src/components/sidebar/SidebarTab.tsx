import { useSidebarNavigation } from '@/hooks/useSidebarNavigation';
import { getTabsByRole } from './utils/getTablesByRole';

/**
 * Sidebar Tab Navigation Component
 *
 * 사이드바 탭 네비게이션 컴포넌트로, 사용자 역할에 따라 다른 탭을 표시합니다:
 *
 * **Writer 역할:**
 * - 요약 (Summary): 문서 요약 정보
 * - AI평가 (AI Evaluation): AI 자동 평가 결과
 * - 기록 (History): 문서 수정 히스토리
 * - 주석 (Comments): 블록별 코멘트 및 피드백
 *
 * **Evaluator 역할:**
 * - 요약 (Summary): 문서 요약 정보
 * - AI평가 (AI Evaluation): AI 자동 평가 결과
 * - 리뷰 (Review): 평가 및 검토 내용
 * - 주석 (Comments): 블록별 코멘트 및 피드백
 *
 * URL search parameter를 통해 현재 선택된 탭을 관리하며,
 * 선택된 탭은 시각적으로 하이라이트됩니다.
 */
export default function SidebarTab() {
  const { currentSidebar, currentRole, handleTabClick } = useSidebarNavigation();

  const tabs = getTabsByRole(currentRole);

  return (
    <nav className="flex w-full bg-white" role="navigation" aria-label="사이드바 네비게이션">
      {tabs.map((tab) => {
        const isSelected = currentSidebar === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleTabClick(tab.id)}
            className={`focus-visible:ring-primary-500 flex flex-1 flex-col items-center justify-center gap-1 pt-2 pb-0 transition-colors duration-200 hover:bg-gray-50 focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset ${isSelected ? 'text-gray-900' : 'text-gray-400'} `}
            aria-label={`${tab.label} 사이드바`}
            aria-current={isSelected ? 'page' : undefined}
          >
            {/* Icon */}
            <Icon
              className={`h-6 w-6 transition-colors duration-200 ${isSelected ? 'text-gray-900' : 'text-gray-400'} `}
              aria-hidden="true"
            />

            {/* Label */}
            <span
              className={`body-xsmall transition-colors duration-200 ${isSelected ? 'text-gray-900' : 'text-gray-400'} `}
            >
              {tab.label}
            </span>

            {/* Bottom indicator bar */}
            <div
              className={`mt-1 h-0.5 w-full rounded-sm transition-colors duration-200 ${isSelected ? 'bg-primary-400' : 'bg-gray-300'} `}
              aria-hidden="true"
            />
          </button>
        );
      })}
    </nav>
  );
}
