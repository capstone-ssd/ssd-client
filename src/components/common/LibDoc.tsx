// src/components/common/LibraryDocument.tsx
import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { cva } from 'class-variance-authority'

// generated icons 
import DotVertical from '@/components/icons/DotVertical'
import IconStar from '@/components/icons/IconStar'
import Folder from '@/components/icons/Folder'

// import IconStarFilled from '@/components/icons/IconStarFilled'
// import IconStarFilled2 from '@/components/icons/IconStarFilled2'

// 추가함 -- clsx와 cn중에 뭐로 해야 하나요?
// import clsx from 'clsx'

// cn 유틸
function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

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
  isChecked?: boolean // 멀티 선택(체크박스) (부가기능)
  

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

// const checkButtonVariants = cva(  // 문서 다중 선택(부가기능)
//   [
//     'absolute left-0 top-0',
//     'p-1',
//     'bg-transparent backdrop-blur hover:bg-white/50',
//   ].join(' ')
// )

export default function LibraryDocument({
  documentId,
  itemType = 'document',
  title,
  date,
  thumbnailUrl,
  folderColor = 'text-primary-400',

  isFavorite = false,
  isChecked = false,
  isActive = false,

  onCheck,
  onToggleFavorite,
  onMore,

  className,
}: LibraryDocumentProps) {    // 링크 주소 생성
  const to = `/extract?documentId=${encodeURIComponent(documentId)}`

  // 즐겨찾기: 로컬 state로 즉시 UI 변화 보장 + 부모 콜백도 호출
  const [fav, setFav] = React.useState<boolean>(isFavorite)
  React.useEffect(() => {
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

        {/* 체크박스(멀티 선택) - 부가기능 */}
        {onCheck && (
          <button
            type="button"
            onClick={(e) => {
              stopLink(e)
              onCheck(documentId, !isChecked)
            }}
            // aria-label={isChecked ? '선택 해제' : '선택'}
            // aria-pressed={isChecked}
            // className={clsx(iconButtonBase(), checkButtonVariants())}
          >
            {/* TODO: 체크 아이콘 생성되면 여기 교체 */}
            {/* <span className={cn(
              'text-[18px] leading-none', 
              isChecked ? 'text-primary-500' : 'text-gray-300')}>
              {isChecked ? '✓' : '□'}
            </span> */}
          </button>
        )}

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

// function FolderThumbnail({
//   color = 'text-primary-400',
//   className = '',
//   title = '폴더',
// }: {
//   color?: string
//   className?: string
//   title?: string
// }) {
//   return (
//     <svg
//       viewBox="0 0 320 260"
//       role="img"
//       aria-label={title}
//       className={className}
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <path
//         d="M36 60
//            C36 49 45 40 56 40
//            H138
//            C144 40 150 43 154 47
//            L190 83
//            C194 87 200 90 206 90
//            H284
//            C295 90 304 99 304 110
//            V120
//            H36
//            Z"
//         fill="currentColor"
//       />
//       <path
//         d="M36 100
//            H304
//            V214
//            C304 228 293 240 279 240
//            H61
//            C47 240 36 228 36 214
//            Z"
//         fill="currentColor"
//       />
//     </svg>
//   )
// }

// 사용
{/* <LibDoc
  documentId="doc-001"
  itemType="document"
  title="이건 cva 코드"
  date="2025.02.02"
  thumbnailUrl="" // 빈 문자열이면 false로 취급되어 placeholder 로직이면 placeholder로 갈 가능성 큼
  isFavorite={false}
  isChecked={false}
  isActive={false}
  className=""
/> */}