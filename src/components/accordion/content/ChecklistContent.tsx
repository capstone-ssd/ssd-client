import { Check, ChecklistLink, NonCheck } from '@/components/icons';
import AccordionSection from './AccordionSection';

/**
 * 체크리스트 항목 데이터 타입
 *
 * @param id - 항목 고유 식별자
 * @param label - 표시될 항목 이름
 * @param checked - 체크 완료 여부 (true: 초록 원, false: 회색 원)
 * @param blockId - 연결된 문서 블록 ID (링크 배지 클릭 시 이동 대상)
 */
export interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  blockId?: number;
}

/**
 * ChecklistItemRow
 *
 * 개별 체크리스트 항목 행을 렌더링하는 내부 컴포넌트.
 * Figma "checklist" 인스턴스 구조를 구현합니다.
 *
 * - 초록 원 + 체크마크: checked=true
 * - 회색 원 + X 마크: checked=false
 * - 노란 링크 배지: checked=true (primary-400 = #f5c816)
 * - 회색 링크 배지: checked=false
 */
interface ChecklistItemRowProps {
  item: ChecklistItem;
  onLinkClick?: (blockId: number) => void;
}

const ChecklistItemRow = ({ item, onLinkClick }: ChecklistItemRowProps) => {
  const handleLinkClick = (): void => {
    if (item.blockId !== undefined) {
      onLinkClick?.(item.blockId);
    }
  };

  return (
    <li className="flex items-center gap-5 px-5 py-2.5">
      <span
        aria-hidden="true"
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
          item.checked ? 'bg-[#00ca00]' : 'bg-gray-300'
        }`}
      >
        {item.checked ? <Check /> : <NonCheck />}
      </span>

      <div className="flex items-center gap-1.5 px-0.75">
        <span className="body-xsmall text-gray-900">{item.label}</span>

        {item.blockId !== undefined && (
          <button
            type="button"
            onClick={handleLinkClick}
            aria-label={`${item.label} 블록으로 이동`}
            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] transition-opacity hover:opacity-80`}
          >
            <ChecklistLink />
          </button>
        )}
      </div>
    </li>
  );
};

/**
 * ChecklistContent
 *
 * Figma "accodion/content, menu=checklist" 변형을 구현한 컴포넌트.
 * 체크리스트 항목들을 세로로 나열하며, 각 항목에는
 * 완료 여부 아이콘, 레이블, 그리고 관련 블록으로의 링크 배지가 포함됩니다.
 *
 * @param items - 표시할 체크리스트 항목 배열
 * @param showRefreshIcon - 새로고침 아이콘 표시 여부 (기본: true)
 * @param onRefresh - 새로고침 클릭 핸들러
 * @param onLinkClick - 링크 배지 클릭 시 호출될 핸들러 (blockId 전달)
 * @param defaultOpen - 초기 열림 상태 (기본: true)
 *
 * @example
 * ```tsx
 * <ChecklistContent
 *   items={[
 *     { id: '1', label: '사업 개념', checked: true, blockId: 1 },
 *     { id: '2', label: '재무 상태', checked: false, blockId: 5 },
 *   ]}
 *   showRefreshIcon
 *   onRefresh={() => fetchChecklist()}
 *   onLinkClick={(blockId) => openSidebar('comments', blockId)}
 * />
 * ```
 */
export interface ChecklistContentProps {
  items: ChecklistItem[];
  showRefreshIcon?: boolean;
  onRefresh?: () => void;
  onLinkClick?: (blockId: number) => void;
  defaultOpen?: boolean;
}

const ChecklistContent = ({
  items,
  showRefreshIcon = true,
  onRefresh,
  onLinkClick,
  defaultOpen = true,
}: ChecklistContentProps) => (
  <AccordionSection
    title="체크리스트"
    showRefreshIcon={showRefreshIcon}
    onRefresh={onRefresh}
    defaultOpen={defaultOpen}
  >
    <ul aria-label="체크리스트 항목" className="flex flex-col">
      {items.map((item) => (
        <ChecklistItemRow key={item.id} item={item} onLinkClick={onLinkClick} />
      ))}
    </ul>
  </AccordionSection>
);

export default ChecklistContent;
