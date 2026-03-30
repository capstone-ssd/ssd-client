import { cva } from 'class-variance-authority';
import IconSave from '@/components/icons/IconSave';
import IconStarN from '@/components/icons/IconStarN';
import IconShare from '@/components/icons/IconShare';

type ExtractRole = 'writer' | 'evaluator';

const actionButtonVariants = cva(
  ['flex flex-col items-center', 'transition-colors', 'text-gray-600', 'hover:text-gray-900'].join(
    ' '
  ),
  {
    variants: {
      active: {
        true: 'text-primary-400 hover:text-primary-800',
        false: '',
      },
    },
    defaultVariants: {
      active: false,
    },
  }
);

interface ExtractHeaderProps {
  role: ExtractRole;
  title?: string;
  onTitleChange?: (title: string) => void;
  onSave?: () => void;
  isSaving?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export function DocsHeader({
  role,
  title = '',
  onTitleChange,
  onSave,
  isSaving,
  isFavorite = false,
  onToggleFavorite,
}: ExtractHeaderProps) {
  // 현재 role이 작성자인 경우만 저장버튼 활성화
  const canSave = role === 'writer';

  return (
    <header className="flex h-[70px] items-center justify-between border-b border-gray-200 bg-white px-[20px] py-[10px]">
      <input
        type="text"
        value={title}
        onChange={(e) => onTitleChange?.(e.target.value)}
        placeholder="문서 제목을 입력하세요"
        className="body-small w-full max-w-sm bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none"
      />

      <div className="flex items-center gap-[20px]">
        {/* 저장 버튼: 작성자만 노출*/}
        {canSave && (
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className={actionButtonVariants()}
          >
            <IconSave className="h-5 w-5" />
            <span className="body-xxsmall">{isSaving ? '저장 중...' : '저장'}</span>
          </button>
        )}

        {/* 즐겨찾기 버튼 */}
        <button
          type="button"
          onClick={onToggleFavorite}
          aria-label={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
          aria-pressed={isFavorite}
          className={actionButtonVariants({ active: isFavorite })}
        >
          <IconStarN
            className={[
              'h-5 w-5',
              'stroke-current',
              // active일 때만 fill을 채움
              isFavorite ? 'fill-current' : 'fill-white',
            ].join(' ')}
            aria-hidden="true"
          />
          <span className="body-xxsmall">즐겨찾기</span>
        </button>

        {/* 공유 버튼 */}
        <button type="button" className={actionButtonVariants()}>
          <IconShare className="h-5 w-5" />
          <span className="body-xxsmall">공유</span>
        </button>
      </div>
    </header>
  );
}
