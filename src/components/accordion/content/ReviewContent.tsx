import * as AccordionPrimitive from '@radix-ui/react-accordion';
import Accordion from '..';
import { ChevronRight } from '@/components/icons';
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
  defaultOpen?: boolean;
  className?: string;
}

/**
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
          <AccordionPrimitive.Header className="group flex items-center justify-between px-5 py-4">
            <AccordionPrimitive.Trigger className="focus-visible:ring-primary-500 flex flex-1 text-left focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none">
              {/* open:N — 프로필 이미지 + col(이름, 종합점수) */}
              <div className="flex flex-1 items-start gap-5 group-data-[state=open]:hidden">
                <div className="mt-0.5 shrink-0" aria-hidden="true">
                  <SvgProfile width={38} height={38} />
                </div>
                <div className="flex flex-1 flex-col gap-0.5">
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
              <div className="hidden flex-1 group-data-[state=open]:block">
                <AccordionProfileSection
                  userName={userName}
                  userEmail={userEmail}
                  timestamp={timestamp}
                />
              </div>
            </AccordionPrimitive.Trigger>

            {/* 화살표 */}
            <ChevronRight
              className="h-2 w-2 shrink-0 text-gray-800 transition-transform duration-200 group-data-[state=open]:rotate-90"
              aria-hidden="true"
            />
          </AccordionPrimitive.Header>

          {/* 펼침 콘텐츠 — ReviewScoreDetail 컴포넌트 */}
          <Accordion.Content className="px-5 pb-5">
            <ReviewScoreDetail
              totalScore={totalScore}
              maxTotalScore={maxTotalScore}
              scoreItems={scoreItems}
            />
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </article>
  );
};

export default ReviewContent;
