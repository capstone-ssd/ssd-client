import * as React from 'react';
import { cva } from 'class-variance-authority';

import DotVertical from '@/components/icons/DotVertical';
import IconStar from '@/components/icons/IconStar';
import FolderFilled from '@/components/icons/FolderFilled';
import { TypeEvalute, TypeWriting, Writing, Folder, Close } from '../icons';
import { cn } from '@/utils/cn';

type LibraryItemType = 'document' | 'folder';

export interface LibraryDocumentProps {
  documentId: number;
  itemType?: LibraryItemType;
  title: string;
  date: string;
  thumbnailUrl?: string;
  folderColor?: string;
  isBookmarked?: boolean;
  onBookmarkClick?: (documentId: number) => void;
  onDeleteClick?: (documentId: number) => void;
  onRenameClick?: (documentId: number) => void;
  onMoveClick?: (documentId: number) => void;
  className?: string;
}
// 문서 썸네일
const thumbnailButtonVariants = cva(
  [
    'relative h-[232px] w-[170px]',
    'overflow-hidden',
    'transition-transform',
    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-400 focus-visible:ring-offset-2',
    'flex items-center justify-center',
  ].join(' '),
  {
    variants: {
      itemType: {
        document: 'bg-sky-200',
        folder: 'bg-transparent',
      },
    },
    defaultVariants: {
      itemType: 'document',
    },
  }
);

export default function LibraryDocument({
  documentId,
  itemType = 'document',
  title,
  date,
  thumbnailUrl,
  folderColor,
  isBookmarked = false,
  onBookmarkClick,
  onDeleteClick, // 핸들러들 추가
  onRenameClick,
  onMoveClick,
  className,
}: LibraryDocumentProps) {
  const handleToggleFavorite = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onBookmarkClick?.(documentId);
  };
  console.log('아이디:', documentId, ' | 넘어온 컬러값:', folderColor);
  const isFolder = itemType === 'folder';
  const hasThumbnail = !!thumbnailUrl;
  const status =
    folderColor === 'var(--color-secondary-200)' // 사용하지 않는 폴더 색상으로 테마 유형 구분하게 설정, UI에 나타나는 색은 기본값
      ? 'evaluate'
      : folderColor === 'var(--color-primary-500)'
        ? 'writing'
        : undefined;

  const renderThumbnail = () => {
    if (isFolder) {
      return <FolderFilled className="text-primary-400 h-auto w-[150px]" role="img" />;
    }
    return hasThumbnail ? (
      <img src={thumbnailUrl} alt="" className="h-full w-full object-cover" draggable={false} />
    ) : (
      <div className="h-full w-full bg-sky-200" aria-hidden="true" />
    );
  };

  const renderOverlay = () => {
    return (
      <>
        {status && (
          <div className="absolute top-0 left-0 z-20">
            {status === 'evaluate' ? (
              <TypeEvalute className="h-auto w-[64px]" />
            ) : (
              <TypeWriting className="h-auto w-[64px]" />
            )}
          </div>
        )}

        {!isFolder && (
          <button
            type="button"
            onClick={handleToggleFavorite}
            className="absolute top-[6px] right-[6px] z-30 flex items-center justify-center p-1"
          >
            <IconStar
              className={cn(
                'h-8 w-8 transition-all',
                isBookmarked
                  ? 'fill-primary-400 text-primary-400'
                  : 'fill-transparent text-gray-300'
              )}
            />
          </button>
        )}
      </>
    );
  };
  return (
    <article
      className={cn(
        'relative flex h-[370px] w-[250px] flex-col overflow-hidden bg-white px-[40px] py-[20px] text-left transition-colors hover:bg-gray-100',
        className
      )}
    >
      <div className="relative z-10 flex w-full justify-center">
        <div className={thumbnailButtonVariants({ itemType })}>{renderThumbnail()}</div>
        {renderOverlay()}
      </div>
      <div className="relative z-10 mt-[10px] flex flex-1 flex-col">
        <div className="body-medium [display:-webkit-box] flex-1 overflow-hidden text-center leading-snug text-ellipsis text-gray-900 [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
          {title}
        </div>

        <div className="mt-[10px] flex items-center justify-between">
          <div className="text-[16px] text-gray-700">{date}</div>
          <button
            type="button"
            aria-label="더보기"
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-600 hover:bg-gray-200"
          >
            <DotVertical className="h-10 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}
