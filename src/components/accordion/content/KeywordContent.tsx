import AccordionSection from './AccordionSection';

/**
 * KeywordContent
 *
 * Figma "accodion/content, menu=keyword" 변형을 구현한 컴포넌트.
 * AccordionSection 내부에 키워드 뱃지들을 flex-wrap 레이아웃으로 표시합니다.
 *
 * @param keywords - 표시할 키워드 문자열 배열
 * @param showRefreshIcon - 새로고침 아이콘 표시 여부 (기본: true)
 * @param onRefresh - 새로고침 클릭 핸들러
 * @param defaultOpen - 초기 열림 상태 (기본: true)
 *
 * @example
 * ```tsx
 * <KeywordContent
 *   keywords={['AI', '엔지니어링', 'Web', '머신러닝']}
 *   showRefreshIcon
 *   onRefresh={() => fetchKeywords()}
 * />
 * ```
 */
export interface KeywordContentProps {
  keywords: string[];
  showRefreshIcon?: boolean;
  onRefresh?: () => void;
  defaultOpen?: boolean;
}

const KeywordContent = ({
  keywords,
  showRefreshIcon = true,
  onRefresh,
  defaultOpen = true,
}: KeywordContentProps) => (
  <AccordionSection
    title="키워드"
    showRefreshIcon={showRefreshIcon}
    onRefresh={onRefresh}
    defaultOpen={defaultOpen}
  >
    <div className="flex flex-wrap gap-2.5">
      {keywords.map((keyword) => (
        <span
          key={keyword}
          className={`inline-flex items-center rounded-lg bg-gray-700 px-2.5 py-1 text-[14px] leading-normal font-semibold text-white`}
        >
          {keyword}
        </span>
      ))}
    </div>
  </AccordionSection>
);

export default KeywordContent;
