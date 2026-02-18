import { cn } from '@/utils/cn';
import AccordionBookmark from './AccordionBookmark';

/**
 *
 * @param userName - 북마크를 작성한 사용자 이름
 * @param userEmail - 사용자 이메일
 * @param timestamp - 북마크 작성 시각 (예: "오후 14:30:00")
 * @param quotedText - 북마크한 본문 발췌 인용문
 * @param comment - 해당 본문에 대한 사용자 코멘트
 * @param className - 외부 컨테이너에 추가할 클래스
 *
 * @example
 * ```tsx
 * <BookmarkItem
 *   userName="홍길동"
 *   userEmail="honggildong@hanyang.ac.kr"
 *   timestamp="오후 14:30:00"
 *   quotedText="발췌한 본문 내용을 넣습니다"
 *   comment="해당 본문에 대한 유저의 코멘트를 적습니다"
 * />
 * ```
 */
export interface BookmarkItemProps {
  userName: string;
  userEmail: string;
  timestamp: string;
  quotedText: string;
  comment: string;
  className?: string;
}

const BookmarkItem = ({
  userName,
  userEmail,
  timestamp,
  quotedText,
  comment,
  className,
}: BookmarkItemProps) => (
  <article
    className={`${cn('rounded-xl border border-gray-100 bg-white p-5', className)}`}
    aria-label={`${userName}의 북마크`}
  >
    <AccordionBookmark userName={userName} userEmail={userEmail} timestamp={timestamp}>
      {/* 북마크 내용 */}
      <div className="flex flex-col gap-1.5">
        {/* 인용문 */}
        <div className="px-1 py-1">
          <blockquote className="text-xsmall text-gray-800">&ldquo;{quotedText}&rdquo;</blockquote>
        </div>
        <hr />
        {/* 코멘트 */}
        <div className="rounded bg-gray-50 px-5 py-0.5">
          <p className="text-xxsmall text-gray-800">{comment}</p>
        </div>
      </div>
    </AccordionBookmark>
  </article>
);

export default BookmarkItem;
