import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { cva } from 'class-variance-authority'

import DotVertical from '@/components/icons/DotVertical'
import IconStar from '@/components/icons/IconStar'
import FolderFilled from '@/components/icons/FolderFilled'

import { cn } from '@/utils/cn'

type LibraryItemType = 'document' | 'folder'

export interface LibraryDocumentProps {
  documentId: string
  itemType?: LibraryItemType
  title: string
  date: string
  thumbnailUrl?: string
  folderColor?: string
  isFavorite?: boolean
  onToggleFavorite?: (documentId: string) => void
  className?: string
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
)

export default function LibraryDocument({
  documentId,
  itemType = 'document',
  title,
  date,
  thumbnailUrl,
  folderColor = 'text-primary-400',
  isFavorite = false,
  onToggleFavorite,
  className,
}: LibraryDocumentProps) {    
  
  // 링크 주소 생성
  const to = '/extract'
  const search = { documentId }


  // 즐겨찾기 버튼 클릭 핸들러
  const handleToggleFavorite = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault()
  e.stopPropagation()
  onToggleFavorite?.(documentId)
}
  // 폴더&썸네일 판단
  const isFolder = itemType === 'folder'
  const hasThumbnail = !!thumbnailUrl

  return (
    <article className={cn(
       [
          'w-[250px] h-[370px]',
          'bg-white rounded-none overflow-hidden text-left',
          'px-[40px] py-[20px]',
          'transition-colors hover:bg-gray-100',
          'flex flex-col relative',
          'ring-1 ring-gray-200',
        ].join(' '),
        className
    )}>
      {/* 썸네일*/}
       <div className={cn('relative z-10', 'flex w-full justify-center')}>
        {/* 썸네일 클릭 시 extract 이동 */}
        <Link
          to={to}
          search={search}
          aria-label={`문서 열기: ${title}`}
          className={thumbnailButtonVariants({ itemType })}
        >
          {isFolder && (
            <FolderFilled
              className={cn('w-[150px] h-auto', folderColor)}
              role="img"
              aria-label="폴더 썸네일"
            />
          )}
          {!isFolder && hasThumbnail && (
            <img
              src={thumbnailUrl}
              alt=""
              className="h-full w-full object-cover"
              draggable={false}
            />
          )}
          {!isFolder && !hasThumbnail && (
            <div className="h-full w-full" aria-hidden="true" />
          )}
        </Link>
        
        {/* 즐겨찾기 */}
        <button
          type="button"
          onClick={handleToggleFavorite}
          aria-label={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
          aria-pressed={isFavorite}
          className={cn(
            [
              'rounded-full',
              'p-2',
              'transition-transform',
              'hover:scale-105',
              'absolute right-0 top-0',
              'bg-transparent backdrop-blur hover:bg-white/50',
            ].join(' ')
          )}
        >
          <IconStar
            className={cn('h-8 w-8', isFavorite ? 'text-primary-200' : 'text-gray-200')}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* 본문 */}
       <div className={cn('relative z-10', 'mt-[10px] flex flex-col flex-1')}>
        {/* 타이틀 클릭 시 extract 이동 */}
        <Link
          to={to}
          search={search}
          title={title}
          aria-label={`문서 열기: ${title}`}
          className={cn(
             [
              'body-medium text-gray-900 leading-snug',
              'overflow-hidden text-ellipsis',
              '[display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]',
              'text-center',
              'flex-1',
            ].join(' ')
          )}
        >
          {title}
        </Link>

        <div className="mt-[10px] flex items-center justify-between">
          <div className="text-[16px] text-gray-700">{date}</div>
          {/*더보기 아이콘만(기능 없음)*/}
          <button type="button" aria-label="더보기"
            className="rounded-full h-10 w-10 flex items-center justify-center text-gray-600 hover:bg-gray-200"
          >
            <DotVertical className="h-10 w-5" aria-hidden="true"/>
          </button>
        </div>
      </div>
    </article>
  )
}
