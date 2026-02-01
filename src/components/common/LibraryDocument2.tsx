// src/components/common/LibraryDocument.tsx

type LibraryDocumentMode = 'default' | 'selected';
type LibraryItemType = 'document' | 'folder';

interface LibraryDocumentProps {
  // data
  itemType?: LibraryItemType;  // 기본: document
  title: string;
  date: string;
  thumbnailUrl?: string; 
  isFavorite?: boolean; // 즐겨찾기

  // actions
  onClick?: () => void;
  onToggleFavorite?: () => void;
  onMore?: () => void;  // 더보기 버튼

  mode?: LibraryDocumentMode;
  className?: string;

  // 폴더일 때 색상코드
  folderColor?:string;
}

const styles = {
  cardBase: [
    'w-[250px] h-[370px]',
    'bg-white rounded-none overflow-hidden text-left',
    'px-[40px] py-[20px]',
    // 'ring-1 ring-gray-200',
    'transition-colors',
    'hover:bg-gray-100',
    // 'hover:ring-gray-300',
  ].join(' '),

  cardMode: {
    default: 'ring-gray-200',
    selected: 'ring-2 ring-primary-400',
  },

  thumbnailButtonBase: [
    'relative h-[232px] w-[170px]',
    'overflow-hidden',
    'transition-transform',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2', // 키보드만
  ].join(' '),
  thumbnailButtonDocument: 'bg-sky-200 bg-[var(--color-skyblue-200)]',
  thumbnailButtonFolder: 'bg-transparent',

  title: [
    'text-[20px] font-semibold text-gray-900 leading-snug',
    'overflow-hidden text-ellipsis',
    '[display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]',
    'text-left',
    'transition-transform',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
  ].join(' '),

  iconBase: [
    'rounded-full',
    'focus-visible:outline-none',
    'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
  ].join(' '),

  iconFavorite: [
    'p-1',                      // 클릭 영역 최소
    'transition-transform',
    // 'active:scale-90',          // 눌리는 느낌
  ].join(' '),

  iconMore: [
    'p-1',
    'transition-colors',
    'hover:bg-gray-200 active:bg-gray-300',
  ].join(' '),

};

// 메인 컴포넌트 선언
export default function LibraryDocument({
  itemType = 'document',
  folderColor = '#F5C816',
  title,
  date,
  thumbnailUrl,
  isFavorite = false,
  onClick,
  onToggleFavorite,
  onMore,
  mode = 'default',
  className = '',
}: LibraryDocumentProps) {
  return (
    <article // 카드 전체 컨테이너
      className={[
        styles.cardBase,
        styles.cardMode[mode],
        'flex flex-col',
        className,
      ].join(' ')}
    >
      {/* 썸네일 + 즐겨찾기 */}
      <div className="relative flex w-full justify-center">
        <button
          type="button"
          onClick={onClick}
          className={[
            styles.thumbnailButtonBase,
            'flex items-center justify-center',
            itemType === 'folder' ? styles.thumbnailButtonFolder : styles.thumbnailButtonDocument, 
          ].join(' ')}
          aria-label={itemType === 'folder' ? '폴더 열기' : '문서 열기'}
        >
          {itemType === 'folder' ? (
            <FolderThumbnail
              color={folderColor}
              className="w-[150px] h-auto"
              title="폴더 썸네일"
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
        </button>


        <button  // 별 아이콘
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.();
          }}
          aria-label={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
          aria-pressed={isFavorite}
          className={[
            styles.iconBase,
            styles.iconFavorite,
            'absolute right-0 top-0 bg-transparent backdrop-blur hover:bg-white/50',
          ].join(' ')}
        >
          <StarIcon filled={isFavorite} />
        </button>
      </div>

      {/* 본문 */}
      <div className="mt-[10px] flex flex-col flex-1">
        <button
          type="button"
          onClick={onClick}
          className={[styles.title, 'flex-1'].join(' ')}
          title={title}
        >
          {title}
        </button>

        <div className="mt-[10px] flex items-center justify-between">
          <div className="text-[16px] text-gray-700">{date}</div>

          <button  // 더보기 버튼
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMore?.();
            }}
            aria-label="더보기"
            className={[
                styles.iconBase,
                styles.iconMore
            ].join(' ')}
          >
            <MoreIcon />
          </button>
        </div>
      </div>
    </article>
  );
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={filled ? 'text-primary-400' : 'text-gray-200'}
      aria-hidden="true"
    >
      <path
        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-gray-600"
      aria-hidden="true"
    >
      <path d="M12 5.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 10.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
    </svg>
  );
}

function FolderThumbnail({
  color = '#F6D247',
  className = '',
  title = '폴더',
}: {
  color?: string;
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 320 260"
      role="img"
      aria-label={title}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 폴더 탭(윗부분) */}
      <path
        d="M36 60
           C36 49 45 40 56 40
           H138
           C144 40 150 43 154 47
           L190 83
           C194 87 200 90 206 90
           H284
           C295 90 304 99 304 110
           V120
           H36
           Z"
        fill={color}
      />

      {/* 폴더 본체 */}
      <path
        d="M36 100
           H304
           V214
           C304 228 293 240 279 240
           H61
           C47 240 36 228 36 214
           Z"
        fill={color}
      />
    </svg>
  );
}






// 실행하기
{/* <LibraryDocument2
          itemType='document'
          title="문서제목이 들어가는 곳입니다. 글자수를 넘으면 줄입니다."
          date="2025.02.02"
          thumbnailUrl="" // 빈 문자열이면 이미지가 없으니 파란색 placeholder가 보임
          isFavorite={false}
          onClick={() => {
            // 아직 편집 페이지가 없으니 클릭 모션만
            console.log('open document');
          }}
          onToggleFavorite={() => {
            // 아직 상태 연결 전이므로 클릭 확인만
            console.log('toggle favorite');
          }}
          onMore={() => {
            // 아직 메뉴(팝업) 없으니 클릭 확인만
            console.log('open more menu');
          }}
          mode="default"
          // mode="selected"
        /> */}
