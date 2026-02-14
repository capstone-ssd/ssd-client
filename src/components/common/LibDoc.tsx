// src/components/common/LibraryDocument.tsx
import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { cva } from 'class-variance-authority'
import { useState, useEffect } from 'react'


// generated icons 
import DotVertical from '@/components/icons/DotVertical'
import IconStar from '@/components/icons/IconStar'
import Folder from '@/components/icons/Folder'

import { cn } from '@/utils/cn'

type LibraryItemType = 'document' | 'folder'

export interface LibraryDocumentProps {
  documentId: string

  itemType?: LibraryItemType
  title: string
  date: string
  thumbnailUrl?: string
  folderColor?: string

  // 상태(표시용)
  isFavorite?: boolean
  isActive?: boolean // 현재/최근 열었던 문서 하이라이트
  

  // 액션(부가 기능)
  onCheck?: (documentId: string, next: boolean) => void
  onToggleFavorite?: (documentId: string) => void
  onMore?: (documentId: string) => void

  className?: string
}

const cardVariants = cva(
  [
    'w-[250px] h-[370px]',
    'bg-white rounded-none overflow-hidden text-left',
    'px-[40px] py-[20px]',
    'transition-colors',
    'hover:bg-gray-100',
    'flex flex-col',
    'relative',
  ].join(' '),
  {
    variants: {
      active: {
        true: 'ring-2 ring-primary-400',
        false: 'ring-1 ring-gray-200',
      },
    },
    defaultVariants: {
      active: false,
    },
  }
)

const thumbnailButtonVariants = cva(  // 문서 썸네일
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

const titleButtonVariants = cva(    // 문서 제목
  [
    'body-medium text-gray-900 leading-snug',
    'overflow-hidden text-ellipsis',
    '[display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]',
    'text-center',
    'transition-transform',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
  ].join(' ')
)

const iconButtonBase = cva(    // 즐겨찾기 버튼, 더보기 버튼 공통
  [
    'rounded-full',
    'focus-visible:outline-none',
    'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
  ].join(' ')
)

const favoriteButtonVariants = cva(    // 즐겨찾기 버튼
  [
    'p-2',
    'transition-transform',
    'absolute right-0 top-0',
    'bg-transparent backdrop-blur hover:bg-white/50',
  ].join(' ')
)

const moreButtonVariants = cva(    // 더보기 버튼
  [
    'p-2',
    'transition-colors',
    'hover:bg-gray-200 active:bg-gray-300',
  ].join(' ')
)


const contentLayer = 'relative z-10'

export default function LibraryDocument({
  documentId,
  itemType = 'document',
  title,
  date,
  thumbnailUrl,
  folderColor = 'text-primary-400',

  isFavorite = false,
  isActive = false,

  onToggleFavorite,
  onMore,

  className,
}: LibraryDocumentProps) {    // 링크 주소 생성
  // const to = `/extract?documentId=${encodeURIComponent(documentId)}`
  const to = '/extract'
  const search = { documentId }


  // 즐겨찾기
  const [fav, setFav] = useState<boolean>(isFavorite)
    useEffect(() => {
    setFav(isFavorite)
  }, [isFavorite])

  const stopLink = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleToggleFavorite = (e: React.MouseEvent<HTMLButtonElement>) => {
    stopLink(e)
    setFav((prev) => !prev)
    onToggleFavorite?.(documentId)
  }

  return (
    <article className={cn(cardVariants({ active: isActive }), className)}>
      {/* 썸네일 + 체크/즐겨찾기 */}
      <div className={cn(contentLayer, 'relative flex w-full justify-center')}>
        {/* 썸네일 클릭 시 extract 이동 */}
        <Link
          to={to}
          search={search}
          aria-label={`문서 열기: ${title}`}
          className={thumbnailButtonVariants({ itemType })}
        >
          {itemType === 'folder' ? (
            <Folder
              className={cn('w-[150px] h-auto', folderColor)}
              role="img"
              aria-label="폴더 썸네일"
            />
          ) : thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt=""
              className="h-full w-full object-cover"
              draggable={false}
            />
          ) : (
            <div className="h-full w-full" aria-hidden="true" />
          )}
        </Link>

       

        {/* 즐겨찾기 */}
        <button
          type="button"
          onClick={handleToggleFavorite}
          aria-label={fav ? '즐겨찾기 해제' : '즐겨찾기 추가'}
          aria-pressed={fav}
          className={cn(iconButtonBase(), favoriteButtonVariants())}
        >
          {fav ? (
            <IconStar className="h-8 w-8 text-primary-200" aria-hidden="true" />
          ) : (
            <IconStar className="h-8 w-8 text-gray-200" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* 본문 */}
      <div className={cn(contentLayer, 'mt-[10px] flex flex-col flex-1')}>
        {/* 타이틀 클릭 시 extract 이동 */}
        <Link
          to={to}
          search={search}
          className={cn(titleButtonVariants(), 'flex-1')}
          title={title}
          aria-label={`문서 열기: ${title}`}
        >
          {title}
        </Link>

        <div className="mt-[10px] flex items-center justify-between">
          <div className="text-[16px] text-gray-700">{date}</div>

          {/* 더보기 */}
          <button
            type="button"
            onClick={(e) => {
              stopLink(e)
              onMore?.(documentId)
            }}
            aria-label="더보기"
            className={cn(iconButtonBase(), moreButtonVariants())}
          >
            <DotVertical className="h-5 w-5 text-gray-600" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  )
}
