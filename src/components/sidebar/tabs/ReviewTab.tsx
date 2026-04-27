import { useState } from 'react';
import { useParams } from '@tanstack/react-router';
import {
  ReviewContent,
  ReviewWritingContent,
  type ReviewWritingScoreField,
  type ReviewWritingFormData,
} from '@/components/accordion';
import Button from '@/components/common/Button';
import { useDocumentReviewsQuery } from '@/hooks/useDocumentReviewsQuery';
import { useMyReviewQuery } from '@/hooks/useMyReviewQuery';
import { useCreateReviewMutation } from '@/hooks/useCreateReviewMutation';
import { useUpdateReviewMutation } from '@/hooks/useUpdateReviewMutation';

const SCORE_FIELDS: ReviewWritingScoreField[] = [
  { key: 'feasibility', label: '사업타당성' },
  { key: 'differentiation', label: '사업차별성' },
  { key: 'finance', label: '재무적정성' },
];

export function ReviewTab() {
  const { id: documentId } = useParams({ strict: false });
  const [isWritingOpen, setIsWritingOpen] = useState(false);

  const { data: reviewList } = useDocumentReviewsQuery(documentId);
  const { data: myReview } = useMyReviewQuery(documentId);
  const { mutate: createReview, isPending: isCreating } = useCreateReviewMutation(documentId);
  const { mutate: updateReview, isPending: isUpdating } = useUpdateReviewMutation(documentId);

  const hasMyReview = !!myReview?.reviewId;
  const isPending = isCreating || isUpdating;

  const defaultValues: ReviewWritingFormData | undefined = hasMyReview
    ? {
        scores: {
          feasibility: myReview.feasibility ?? '',
          differentiation: myReview.differentiation ?? '',
          finance: myReview.financial ?? '',
        },
        comment: myReview.comment ?? '',
      }
    : undefined;

  function handleSubmit(data: ReviewWritingFormData) {
    const body = {
      feasibility: Number(data.scores['feasibility'] || 0),
      differentiation: Number(data.scores['differentiation'] || 0),
      financial: Number(data.scores['finance'] || 0),
      comment: data.comment,
    };

    if (hasMyReview) {
      updateReview(body, { onSuccess: () => setIsWritingOpen(false) });
    } else {
      createReview(body, { onSuccess: () => setIsWritingOpen(false) });
    }
  }

  const reviews = reviewList?.reviews ?? [];

  return (
    <div className="flex flex-col gap-4">
      {isWritingOpen ? (
        <>
          <Button onClick={() => setIsWritingOpen(false)} variant="normal" disabled={isPending}>
            뒤로가기
          </Button>
          <ReviewWritingContent
            key={myReview?.reviewId ?? 'new'}
            scoreFields={SCORE_FIELDS}
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
          />
        </>
      ) : (
        <>
          <Button onClick={() => setIsWritingOpen(true)} variant="normal">
            {hasMyReview ? '리뷰 수정' : '리뷰 쓰기'}
          </Button>

          {reviews.length === 0 && (
            <p className="body-xsmall text-gray-400">등록된 리뷰가 없습니다.</p>
          )}
          {reviews.map((review, index) => (
            <ReviewContent
              key={review.reviewId ?? `review-${index}`}
              reviewId={String(index)}
              userName={review.reviewerName ?? ''}
              userEmail=""
              timestamp=""
              totalScore={review.totalScore ?? 0}
              scoreItems={[
                { label: '사업타당성', score: review.feasibility ?? 0 },
                { label: '사업차별성', score: review.differentiation ?? 0 },
                { label: '재무적정성', score: review.financial ?? 0 },
              ]}
              comment={review.comment}
            />
          ))}
        </>
      )}
    </div>
  );
}
