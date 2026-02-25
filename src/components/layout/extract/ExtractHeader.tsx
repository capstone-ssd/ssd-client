// components/layout/extract/ExtractHeader.tsx
import { cva } from 'class-variance-authority';
import IconSave from '@/components/icons/IconSave';
import IconStarN from '@/components/icons/IconStarN';
import IconShare from '@/components/icons/IconShare';

const actionButtonVariants = cva(
  [
    'flex flex-col items-center',
    'transition-colors',
    'text-gray-600',
    'hover:text-gray-900',
  ].join(' '),
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


export function ExtractHeader() {
  // 임시값 -추후 api 호출
  const isFavorite = false
  const onToggleFavorite = () => {
  }

  //버튼 클릭 이벤트 핸들러
  const handleToggleFavorite = () => onToggleFavorite()

  return (
    <header
      className="
        flex items-center justify-between
        h-[70px]
        px-[20px] py-[10px]
        border-b border-gray-200
        bg-white
      "
    >
      <div className="body-small text-gray-900">
        문서 제목을 작성합니다
      </div>

      <div className="flex items-center gap-[20px]">
        {/* 저장 버튼 */}
        <button type="button" className={actionButtonVariants()}>
          <IconSave className="w-5 h-5" />
          <span className="body-xxsmall">저장</span>
        </button>

        {/* 즐겨찾기 버튼 */}
         <button
          type="button"
          onClick={handleToggleFavorite}
          aria-label={isFavorite  ? '즐겨찾기 해제' : '즐겨찾기 추가'}
          aria-pressed={isFavorite }
          className={actionButtonVariants({ active: isFavorite  })}
        >
          <IconStarN
            className={[
              'w-5 h-5',
              'stroke-current',
              // active일 때만 fill을 채움
              isFavorite  ? 'fill-current' : 'fill-white',
            ].join(' ')}
            aria-hidden="true"
          />
          <span className="body-xxsmall">즐겨찾기</span>
        </button>
        
        {/* 공유 버튼 */}
        <button type="button"className={actionButtonVariants()}>
          <IconShare className="w-5 h-5" />
          <span className="body-xxsmall">공유</span>
        </button>
      </div>
    </header>
  );
}
