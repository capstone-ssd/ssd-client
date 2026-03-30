import Accordion from '..';
import SvgProfile from '@/components/icons/Profile';
import AccordionProfileSection from './AccordionProfileSection';
import ReviewScoreDetail from './ReviewScoreDetail';

/**
 * 리뷰 카테고리별 점수 항목
 *
 * @param label - 카테고리 이름 (예: "사업타당성")
 * @param score - 해당 카테고리 점수 (0~100)
 * @param maxScore - 최대 점수 (기본: 100)
 */
export interface ReviewScoreItem {
  label: string;
  score: number;
  maxScore?: number;
}

/**
 * ReviewContent Props
 *
 * @param reviewId - 리뷰 고유 식별자
 * @param userName - 리뷰어 이름
 * @param userEmail - 리뷰어 이메일
 * @param timestamp - 리뷰 작성 시각 (예: "오후 14:30:00")
 * @param totalScore - 종합 점수 (0~100)
 * @param maxTotalScore - 종합 최대 점수 (기본: 100)
 * @param scoreItems - 카테고리별 점수 배열
 * @param defaultOpen - 초기 열림 상태 (기본: false)
 * @param className - 외부 컨테이너에 추가할 클래스
 */
export interface ReviewContentProps {
  reviewId: string;
  userName: string;
  userEmail: string;
  timestamp: string;
  totalScore: number;
  maxTotalScore?: number;
  scoreItems: ReviewScoreItem[];
  comment?: string;
  barColor?: string;
  defaultOpen?: boolean;
  className?: string;
}

/**
 * ReviewContent
 *
 * Figma "accodion/review" 컴포넌트 (Property 1: review)를 구현합니다.
 *
 * ## 상태별 트리거 레이아웃
 *
 * **open:N (closed)**
 * ```
 * [profile pic] | col(이름, 종합점수) | chevron →
 * ```
 *
 * **open:Y (open)** — AccordionProfileSection 재활용
 * ```
 * [profile pic] | col(이름, 이메일, 시각) | chevron ↓
 * ```
 * → Accordion.Content: ReviewScoreDetail (종합평점 + 점수 바)
 *
 * @example
 * ```tsx
 * <ReviewContent
 *   reviewId="review-1"
 *   userName="홍길동"
 *   userEmail="honggildong@hanyang.ac.kr"
 *   timestamp="오후 14:30:00"
 *   totalScore={72}
 *   scoreItems={[
 *     { label: '사업타당성', score: 70 },
 *     { label: '사업차별성', score: 85 },
 *     { label: '재무적정성', score: 60 },
 *   ]}
 *   defaultOpen
 * />
 * ```
 */
const ReviewContent = ({
  reviewId,
  userName,
  userEmail,
  timestamp,
  totalScore,
  maxTotalScore = 100,
  scoreItems,
  comment,
  barColor,
  defaultOpen = false,
  className,
}: ReviewContentProps) => {
  const itemValue = `review-${reviewId}`;

  return (
    <article
      className={`rounded-xl border border-gray-100 bg-white ${className ?? ''}`}
      aria-label={`${userName}의 리뷰`}
    >
      <Accordion type="single" collapsible defaultValue={defaultOpen ? itemValue : undefined}>
        <Accordion.Item value={itemValue} className="mb-0 rounded-xl border-0 bg-white">
          <Accordion.Trigger className="items-start">
            {/* open:N — 프로필 이미지 + col(이름, 종합점수) */}
            <div className="flex gap-5 group-data-[state=open]:hidden">
              <div
                className="flex h-[65px] w-[38px] shrink-0 flex-col items-center justify-center"
                aria-hidden="true"
              >
                <SvgProfile width={38} height={38} />
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <span className="body-xsmall font-medium text-gray-800">{userName}</span>
                <span
                  className="heading-medium text-gray-800"
                  aria-label={`종합점수 ${totalScore}점 만점 ${maxTotalScore}점`}
                >
                  {totalScore}
                  <span className="body-xsmall text-gray-400">/{maxTotalScore}</span>
                </span>
              </div>
            </div>

            {/* open:Y — AccordionProfileSection 재활용 */}
            <div className="hidden group-data-[state=open]:block">
              <AccordionProfileSection
                userName={userName}
                userEmail={userEmail}
                timestamp={timestamp}
              />
            </div>
          </Accordion.Trigger>

          <Accordion.Content className="px-5 pb-5">
            <ReviewScoreDetail
              totalScore={totalScore}
              maxTotalScore={maxTotalScore}
              scoreItems={scoreItems}
              comment={comment}
              barColor={barColor}
            />
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </article>
  );
};

export default ReviewContent;
