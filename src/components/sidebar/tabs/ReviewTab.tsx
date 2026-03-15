import { useState } from 'react';
import {
  ReviewContent,
  ReviewWritingContent,
  type ReviewScoreItem,
  type ReviewWritingScoreField,
  type ReviewWritingFormData,
} from '@/components/accordion';
import Button from '@/components/common/Button';

const SAMPLE_REVIEW_SCORE_ITEMS: ReviewScoreItem[] = [
  { label: '사업타당성', score: 70 },
  { label: '사업차별성', score: 85 },
  { label: '재무적정성', score: 60 },
];

const SAMPLE_REVIEWS = [
  {
    reviewId: 'review-1',
    userName: '홍길동',
    userEmail: 'honggildong@hanyang.ac.kr',
    timestamp: '오후 14:30:00',
    totalScore: 72,
    scoreItems: SAMPLE_REVIEW_SCORE_ITEMS,
  },
  {
    reviewId: 'review-2',
    userName: '김철수',
    userEmail: 'kimcs@hanyang.ac.kr',
    timestamp: '오전 10:00:00',
    totalScore: 58,
    scoreItems: SAMPLE_REVIEW_SCORE_ITEMS,
  },
];

const SAMPLE_SCORE_FIELDS: ReviewWritingScoreField[] = [
  { key: 'feasibility', label: '사업타당성' },
  { key: 'differentiation', label: '사업차별성' },
  { key: 'finance', label: '재무적정성' },
];

export function ReviewTab() {
  const [isWritingOpen, setIsWritingOpen] = useState(false);

  function handleSubmit(data: ReviewWritingFormData) {
    console.log('review submitted:', data);
    setIsWritingOpen(false);
  }

  return (
    <div className="flex flex-col gap-4">
      {isWritingOpen ? (
        <>
          <Button onClick={() => setIsWritingOpen(false)} variant="normal">
            뒤로가기
          </Button>
          <ReviewWritingContent scoreFields={SAMPLE_SCORE_FIELDS} onSubmit={handleSubmit} />
        </>
      ) : (
        <>
          <Button onClick={() => setIsWritingOpen(true)} variant="normal">
            리뷰 쓰기
          </Button>
          {SAMPLE_REVIEWS.map((review) => (
            <ReviewContent key={review.reviewId} {...review} />
          ))}
        </>
      )}
    </div>
  );
}
