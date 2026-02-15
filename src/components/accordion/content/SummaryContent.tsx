import AccordionSection from './AccordionSection';

/**
 * SummaryContent
 * AccordionSection 내부에 요약 텍스트를 표시합니다.
 *
 * @param summary - 표시할 요약 문자열. 줄바꿈(\n)이 포함된 경우 단락으로 분리됩니다.
 * @param showRefreshIcon - 새로고침 아이콘 표시 여부 (기본: true)
 * @param onRefresh - 새로고침 클릭 핸들러
 * @param defaultOpen - 초기 열림 상태 (기본: true)
 *
 * @example
 * ```tsx
 * <SummaryContent
 *   summary="AI 기술은 다양한 분야에서 활용되고 있습니다.\n특히 헬스케어 분야에서 두각을 나타내고 있습니다."
 *   showRefreshIcon
 *   onRefresh={() => fetchSummary()}
 * />
 * ```
 */
export interface SummaryContentProps {
  summary: string;
  showRefreshIcon?: boolean;
  onRefresh?: () => void;
  defaultOpen?: boolean;
}

const SummaryContent = ({
  summary,
  showRefreshIcon = true,
  onRefresh,
  defaultOpen = true,
}: SummaryContentProps) => {
  const paragraphs = summary.split('\n').filter((line) => line.trim().length > 0);

  return (
    <AccordionSection
      title="요약"
      showRefreshIcon={showRefreshIcon}
      onRefresh={onRefresh}
      defaultOpen={defaultOpen}
    >
      <div className="flex flex-col gap-4">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="text-body-xsmall leading-normal text-gray-900">
            {paragraph}
          </p>
        ))}
      </div>
    </AccordionSection>
  );
};

export default SummaryContent;
