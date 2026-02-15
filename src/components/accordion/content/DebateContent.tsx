import AccordionSection from './AccordionSection';
import SvgDebateNote from '@/components/icons/DebateNote';

/**
 * DebateContent
 *
 * Figma "accodion/content, menu=debate" 변형을 구현한 토론하기 컴포넌트.
 *
 * 두 개의 서브 영역으로 구성됩니다:
 * 1. **질문 영역** (accordion/debate/asking): 어두운 골드 배경(#7f6400)에
 *    사용자 질문 입력 또는 질문 텍스트를 표시합니다.
 * 2. **답변 영역** (accodion/debate/answering): 흰 배경에 AI 아이콘(노란 사각형)과
 *    답변 텍스트를 수직으로 표시합니다.
 *
 * @param question - 사용자 질문 텍스트. undefined이면 placeholder를 표시합니다.
 * @param answer - AI 답변 텍스트. undefined이면 답변 대기 메시지를 표시합니다.
 * @param onAsk - 질문하기 버튼 클릭 핸들러 (question이 없을 때 표시)
 * @param showRefreshIcon - 새로고침 아이콘 표시 여부 (기본: false)
 * @param onRefresh - 새로고침 클릭 핸들러
 * @param defaultOpen - 초기 열림 상태 (기본: true)
 *
 * @example
 * ```tsx
 * <DebateContent
 *   question="Attention 메커니즘이 왜 효과적인가요?"
 *   answer="핵심은 모든 위치들 간의 직접 연결을 허용하여 정보 전달 경로를 단축합니다."
 *   onAsk={() => openQuestionModal()}
 * />
 * ```
 */
export interface DebateContentProps {
  question?: string;
  onQuestionChange?: (value: string) => void;
  onAsk?: () => void;
  answer?: string;
  showRefreshIcon?: boolean;
  onRefresh?: () => void;
  defaultOpen?: boolean;
}

const QUESTION_PLACEHOLDER =
  '문서 내용에 대한 질문을 입력하세요. 질문에 대한 답을 AI가 하단에 작성해줍니다.';

const ANSWER_PLACEHOLDER = 'AI가 질문에 대한 답을 작성합니다.';

const DebateContent = ({
  question = '',
  onQuestionChange,
  onAsk,
  answer,
  showRefreshIcon = false,
  onRefresh,
  defaultOpen = true,
}: DebateContentProps) => (
  <AccordionSection
    title="토론하기"
    showRefreshIcon={showRefreshIcon}
    onRefresh={onRefresh}
    defaultOpen={defaultOpen}
  >
    <div className="flex flex-col gap-2.5 py-2.5">
      <section
        aria-label="질문 영역"
        className="flex min-h-[97px] flex-col gap-2.5 rounded-lg bg-[#7f6400] px-2.5 py-[17px]"
      >
        <textarea
          value={question}
          onChange={(e) => onQuestionChange?.(e.target.value)}
          placeholder={QUESTION_PLACEHOLDER}
          rows={3}
          className="w-full resize-none bg-transparent text-[14px] leading-normal text-white placeholder-white/60 outline-none"
        />
        {onAsk !== undefined && (
          <button
            type="button"
            onClick={onAsk}
            disabled={question.trim() === ''}
            className="self-end rounded-lg bg-white/20 px-4 py-2 text-[14px] font-semibold text-white transition-colors hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-40"
          >
            질문하기
          </button>
        )}
      </section>

      <section
        aria-label="AI 답변 영역"
        className="flex flex-col gap-2.5 rounded-lg bg-white p-2.5"
      >
        <span
          aria-label="AI"
          className="bg-primary-100 flex h-6 w-6 shrink-0 items-center justify-center rounded-[4px]"
        >
          <SvgDebateNote />
        </span>

        {/* AI 답변 텍스트 */}
        <div className="text-xsmall text-gray-900">
          {answer !== undefined ? (
            <p>{answer}</p>
          ) : (
            <p className="text-gray-400">{ANSWER_PLACEHOLDER}</p>
          )}
        </div>
      </section>
    </div>
  </AccordionSection>
);

export default DebateContent;
