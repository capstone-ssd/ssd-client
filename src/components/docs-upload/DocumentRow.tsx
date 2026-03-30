import { cn } from '@/utils/cn';
import SvgFileTree from '@/components/icons/FileTree';
import type { DocumentItem } from './fileTreeTypes';

export interface DocumentRowProps {
  document: DocumentItem;
  /** 좌측 들여쓰기 (px). 부모 폴더 depth에 따라 계산. */
  paddingLeft: number;
  /** selectedDocumentId와 일치하면 true → 하이라이트 적용 */
  isSelected: boolean;
  /**
   * 클릭 시 호출되는 콜백.
   * 제공되지 않으면 클릭 불가 상태(div)로 렌더링한다.
   */
  onSelect?: () => void;
}

export default function DocumentRow({ document, paddingLeft, isSelected, onSelect }: DocumentRowProps) {
  const baseClassName = cn(
    'flex h-[30px] w-full items-center gap-0.5 py-[3px] pr-[50px] rounded',
    'transition-colors duration-150',
    isSelected ? 'bg-gray-100' : onSelect ? 'hover:bg-gray-50' : '',
  );

  const content = (
    <>
      <SvgFileTree className="h-6 w-6 shrink-0 text-gray-500" aria-hidden="true" />
      <span className="body-xsmall ml-0.5 truncate text-gray-700">{document.title}</span>
    </>
  );

  return (
    <li role="treeitem" aria-selected={isSelected}>
      {onSelect ? (
        <button
          type="button"
          onClick={onSelect}
          className={cn(
            baseClassName,
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-1',
          )}
          style={{ paddingLeft: `${paddingLeft}px` }}
          aria-label={`${document.title} 문서 열기`}
          aria-current={isSelected ? true : undefined}
        >
          {content}
        </button>
      ) : (
        <div className={baseClassName} style={{ paddingLeft: `${paddingLeft}px` }}>
          {content}
        </div>
      )}
    </li>
  );
}
