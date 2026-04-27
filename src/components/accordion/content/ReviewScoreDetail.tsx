import type { ReviewScoreItem } from './ReviewContent';

interface ScoreBarProps {
  label: string;
  score: number;
  maxScore: number;
  barColor?: string;
  review?: string;
}

const ScoreBar = ({ label, score, maxScore, barColor = '#1f2937', review }: ScoreBarProps) => {
  const percentage = maxScore > 0 ? Math.min(100, Math.max(0, (score / maxScore) * 100)) : 0;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2.5">
        <span className="body-xxsmall min-w-[70px] shrink-0 font-medium text-gray-800">
          {label}
        </span>
        <span className="body-xxsmall font-medium text-gray-800">{score}</span>
      </div>
      <div
        className="h-3 w-full rounded-lg bg-gray-200"
        role="progressbar"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={maxScore}
        aria-label={`${label} 점수`}
      >
        <div
          className="h-3 rounded-lg transition-all duration-300"
          style={{ width: `${percentage}%`, backgroundColor: barColor }}
        />
      </div>
      {review && <p className="body-xxsmall text-gray-500">{review}</p>}
    </div>
  );
};

/**
 * ReviewScoreDetail Props
 *
 * @param totalScore - 종합 점수 (0~100)
 * @param maxTotalScore - 최대 종합 점수
 * @param scoreItems - 카테고리별 점수 배열
 */
export interface ReviewScoreDetailProps {
  totalScore: number;
  maxTotalScore: number;
  scoreItems: ReviewScoreItem[];
  comment?: string;
  barColor?: string;
}

/**
 * @example
 * ```tsx
 * <ReviewScoreDetail
 *   totalScore={72}
 *   maxTotalScore={100}
 *   scoreItems={[
 *     { label: '사업타당성', score: 70 },
 *     { label: '사업차별성', score: 85 },
 *   ]}
 * />
 * ```
 */
const ReviewScoreDetail = ({
  totalScore,
  maxTotalScore,
  scoreItems,
  comment,
  barColor,
}: ReviewScoreDetailProps) => (
  <div className="flex flex-col gap-2.5">
    {/* 종합평점 레이블 + 대형 점수 */}
    <div className="flex flex-col gap-2.5">
      <span className="body-xxsmall text-gray-800">종합평점</span>
      <p
        className="heading-xlarge text-gray-800"
        aria-label={`종합평점 ${totalScore}점 만점 ${maxTotalScore}점`}
      >
        {totalScore} <span className="body-medium text-gray-400">/ {maxTotalScore}</span>
      </p>
    </div>

    {/* 카테고리별 점수 바 */}
    {scoreItems.length > 0 && (
      <ul className="flex flex-col gap-2.5" aria-label="카테고리별 점수">
        {scoreItems.map((item) => (
          <li key={item.label}>
            <ScoreBar
              label={item.label}
              score={item.score}
              maxScore={item.maxScore ?? 100}
              barColor={barColor}
              review={item.review}
            />
          </li>
        ))}
      </ul>
    )}

    {/* 상세의견 */}
    {comment && (
      <div className="flex flex-col gap-1">
        <span className="body-xxsmall font-medium text-gray-800">상세의견</span>
        <p className="body-xxsmall text-gray-600">{comment}</p>
      </div>
    )}
  </div>
);

export default ReviewScoreDetail;
