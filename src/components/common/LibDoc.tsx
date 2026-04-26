import * as React from 'react';
import { cva } from 'class-variance-authority';

import DotVertical from '@/components/icons/DotVertical';
import IconStar from '@/components/icons/IconStar';
import FolderFilled from '@/components/icons/FolderFilled';
import { TypeEvalute, TypeWriting, Writing, Folder, Close } from '../icons';
import { cn } from '@/utils/cn';
import { useDropdown } from '@/hooks/useDropdown';

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
  onDeleteClick?: (id: number, type: LibraryItemType) => void;
  onRenameClick?: (documentId: number) => void;
  onMoveClick?: (documentId: number) => void;
  className?: string;

  purpose?: 'WRITING' | 'EVALUATION';
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
  purpose,
}: LibraryDocumentProps) {
  const dropdown = useDropdown();

  const handleToggleFavorite = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onBookmarkClick?.(documentId);
  };

  const handleAction = (e: React.MouseEvent, actionFn?: (id: number) => void) => {
    e.preventDefault();
    e.stopPropagation();
    actionFn?.(documentId);
    dropdown.close();
  };

  const handleDeleteAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      onDeleteClick?.(documentId, itemType);
      dropdown.close();
    }
  };

  const isFolder = itemType === 'folder';
  const hasThumbnail = !!thumbnailUrl;

  const status = isFolder
    ? folderColor?.includes('secondary')
      ? 'evaluate'
      : 'writing'
    : purpose === 'EVALUATION'
      ? 'evaluate'
      : 'writing';

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

          {/* 더보기 버튼 및 드롭다운 메뉴 영역 */}
          <div className="relative" ref={dropdown.ref}>
            <button
              type="button"
              aria-label="더보기"
              onClick={(e) => {
                // [수정] e.preventDefault()를 통해 브라우저 기본 이동 본능을 차단함
                e.preventDefault();
                e.stopPropagation();
                dropdown.toggle();
              }}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full transition-colors',
                dropdown.isOpen ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-200'
              )}
            >
              <DotVertical className="h-10 w-5" aria-hidden="true" />
            </button>

            {/* 드롭다운 메뉴 본체 */}
            {dropdown.isOpen && (
              <div className="absolute right-0 bottom-full z-[60] mb-2 w-[160px] rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl">
                {/* 이름 바꾸기 버튼 */}
                <button
                  type="button"
                  onClick={(e) => handleAction(e, onRenameClick)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                >
                  <Writing className="h-4 w-4 text-gray-500" />
                  <span>이름바꾸기</span>
                </button>

                {/* 이동 버튼 */}
                <button
                  type="button"
                  onClick={(e) => handleAction(e, onMoveClick)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                >
                  <Folder className="h-4 w-4 text-gray-500" />
                  <span>이동</span>
                </button>

                <div className="mx-1 my-1 h-[1px] bg-gray-100" />

                {/* 삭제 버튼 - 텍스트 색상 red-500 적용 */}
                <button
                  type="button"
                  onClick={handleDeleteAction}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
                >
                  <Close className="h-4 w-4 opacity-70" />
                  <span>삭제</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
