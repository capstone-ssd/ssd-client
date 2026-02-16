import { useEffect, useState } from 'react';
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

export interface ExtractHeaderProps {
  isFavorite?: boolean;
  onToggleFavorite?: (next: boolean) => void;
}

export function ExtractHeader({
  isFavorite = false,
  onToggleFavorite,
}: ExtractHeaderProps) {
  // 내부 UI state (Optimistic UI)
  const [starred, setStarred] = useState<boolean>(isFavorite);

  // 외부 상태 변경(서버/상위 store 반영 등) 시 내부 state 동기화
  useEffect(() => {
    setStarred(isFavorite);
  }, [isFavorite]);

  const handleToggleStar = () => {
    setStarred((prev) => {
      const next = !prev;
      onToggleFavorite?.(next);
      return next;
    });
  };

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
        <button className={actionButtonVariants()}>
          <IconSave className="w-5 h-5" />
          <span className="body-xxsmall">저장</span>
        </button>

        {/* <button className={actionButtonVariants({ active: false })}>
          <IconStar className="w-5 h-5" />
          <span className="body-xxsmall">즐겨찾기</span>
        </button> */}
         <button
          type="button"
          onClick={handleToggleStar}
          aria-label={starred ? '즐겨찾기 해제' : '즐겨찾기 추가'}
          aria-pressed={starred}
          className={actionButtonVariants({ active: starred })}
        >
          <IconStarN
            className={[
              'w-5 h-5',
              'stroke-current',
              // active일 때만 fill을 채움
              starred ? 'fill-current' : 'fill-white',
            ].join(' ')}
            aria-hidden="true"
          />
          <span className="body-xxsmall">즐겨찾기</span>
        </button>

        <button className={actionButtonVariants()}>
          <IconShare className="w-5 h-5" />
          <span className="body-xxsmall">공유</span>
        </button>
      </div>
    </header>
  );
}
