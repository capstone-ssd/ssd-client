import { useState } from 'react';

/**
 * 리뷰 쓰기 폼의 점수 입력 카테고리 항목
 *
 * @param key - 카테고리 고유 키 (form 상태 관리용)
 * @param label - 카테고리 이름 (예: "사업타당성")
 * @param maxScore - 해당 카테고리 최대 점수 (기본: 100)
 */
export interface ReviewWritingScoreField {
  key: string;
  label: string;
  maxScore?: number;
}

/**
 * 리뷰 쓰기 폼 제출 데이터
 *
 * @param scores - 카테고리별 입력 점수 (key → score)
 * @param comment - 상세 의견 텍스트
 */
export interface ReviewWritingFormData {
  scores: Record<string, number | ''>;
  comment: string;
}

/**
 * ReviewWritingContent Props
 *
 * @param scoreFields - 점수 입력 카테고리 목록
 * @param maxCommentLength - 상세 의견 최대 글자 수 (기본: 200)
 * @param onSubmit - 폼 제출 핸들러
 * @param className - 외부 컨테이너에 추가할 클래스
 */
export interface ReviewWritingContentProps {
  scoreFields: ReviewWritingScoreField[];
  maxCommentLength?: number;
  onSubmit?: (data: ReviewWritingFormData) => void;
  className?: string;
}

interface ScoreInputFieldProps {
  label: string;
  fieldKey: string;
  value: number | '';
  maxScore: number;
  onChange: (key: string, value: number | '') => void;
}

const ScoreInputField = ({ label, fieldKey, value, maxScore, onChange }: ScoreInputFieldProps) => {
  const inputId = `score-input-${fieldKey}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === '') {
      onChange(fieldKey, '');
      return;
    }
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed)) {
      onChange(fieldKey, Math.min(maxScore, Math.max(0, parsed)));
    }
  };

  return (
    <div className="flex flex-col gap-2.5">
      <label htmlFor={inputId} className="body-xsmall font-semibold text-gray-800">
        {label}
      </label>
      <div className="flex items-center gap-2.5">
        <div className="flex flex-1 items-center rounded-[10px] border border-gray-200 bg-gray-50 px-5 py-2.5">
          <input
            id={inputId}
            type="number"
            min={0}
            max={maxScore}
            value={value}
            onChange={handleChange}
            placeholder="0"
            className="body-xxsmall w-full [appearance:textfield] bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            aria-label={`${label} 점수 입력 (0~${maxScore})`}
          />
        </div>
        <span className="body-xxsmall shrink-0 text-gray-400" aria-hidden="true">
          | {maxScore}
        </span>
      </div>
    </div>
  );
};

/**
 * ReviewWritingContent
 *
 * - 카테고리별 점수 숫자 입력 (`| 100` 최대 점수 표시)
 * - 상세의견 textarea (글자 수 카운터 포함)
 * - 등록하기 제출 버튼
 *
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 *
 * <>
 *   <button onClick={() => setIsOpen(true)}>리뷰 쓰기</button>
 *   {isOpen && (
 *     <ReviewWritingContent
 *       scoreFields={[
 *         { key: 'feasibility', label: '사업타당성' },
 *         { key: 'differentiation', label: '사업차별성' },
 *         { key: 'finance', label: '재무적정성' },
 *       ]}
 *       onSubmit={(data) => console.log(data)}
 *     />
 *   )}
 * </>
 * ```
 */
const ReviewWritingContent = ({
  scoreFields,
  maxCommentLength = 200,
  onSubmit,
  className,
}: ReviewWritingContentProps) => {
  const [scores, setScores] = useState<Record<string, number | ''>>(() => {
    const initial: Record<string, number | ''> = {};
    scoreFields.forEach((field) => {
      initial[field.key] = '';
    });
    return initial;
  });

  const [comment, setComment] = useState('');

  const handleScoreChange = (key: string, value: number | '') => {
    setScores((prev) => ({ ...prev, [key]: value }));
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= maxCommentLength) {
      setComment(text);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit?.({ scores, comment });
  };

  return (
    <section
      className={`w-90 rounded-xl border border-gray-100 bg-white p-5 ${className ?? ''}`}
      aria-label="리뷰 쓰기"
    >
      <form onSubmit={handleSubmit} noValidate aria-label="리뷰 입력 폼">
        <div className="flex flex-col gap-5">
          {scoreFields.map((field) => (
            <ScoreInputField
              key={field.key}
              label={field.label}
              fieldKey={field.key}
              value={scores[field.key] ?? ''}
              maxScore={field.maxScore ?? 100}
              onChange={handleScoreChange}
            />
          ))}

          <div className="flex flex-col gap-2.5">
            <label htmlFor="review-comment" className="body-xsmall font-semibold text-gray-800">
              상세의견
            </label>
            <div className="flex flex-col gap-2.5">
              <div className="rounded-[10px] border border-gray-200 bg-gray-50 px-5 py-2.5">
                <textarea
                  id="review-comment"
                  value={comment}
                  onChange={handleCommentChange}
                  placeholder={`상세 의견을 입력하세요(${maxCommentLength}자 이내)`}
                  rows={4}
                  className="body-xxsmall w-full resize-none bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none"
                  aria-label={`상세 의견 입력 (최대 ${maxCommentLength}자)`}
                  aria-describedby="review-comment-count"
                />
              </div>
              <p
                id="review-comment-count"
                className="body-tiny text-right text-gray-400"
                aria-live="polite"
                aria-atomic="true"
              >
                {comment.length} / {maxCommentLength}
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="body-xsmall flex w-full items-center justify-center rounded-[10px] bg-gray-700 px-5 py-2.5 text-white transition-colors hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-gray-700 focus-visible:ring-offset-2 focus-visible:outline-none active:bg-gray-900"
            aria-label="리뷰 등록하기"
          >
            등록하기
          </button>
        </div>
      </form>
    </section>
  );
};

export default ReviewWritingContent;
