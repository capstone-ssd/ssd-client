import * as React from 'react';
import Accordion from '..';

/**
 * AccordionSection
 *
 * Figma "accodion/content" 컴포넌트 세트의 공통 카드 래퍼.
 * 각 메뉴(keyword, summary, checklist, AImore, debate)에서 공유하는
 * 외곽 레이아웃(흰 배경, 테두리, 둥근 모서리, 패딩)을 제공합니다.
 *
 * @param title - 아코디언 헤더에 표시될 제목
 * @param showRefreshIcon - 새로고침 아이콘 표시 여부 (기본: false)
 * @param onRefresh - 새로고침 클릭 핸들러
 * @param defaultOpen - 초기 열림 상태 (기본: true)
 * @param children - 아코디언 콘텐츠 영역에 렌더링될 내용
 * @param className - 외부 컨테이너에 추가할 클래스
 *
 * @example
 * ```tsx
 * <AccordionSection title="키워드" showRefreshIcon onRefresh={() => {}}>
 *   <KeywordContent keywords={['AI', 'Web']} />
 * </AccordionSection>
 * ```
 */
export interface AccordionSectionProps {
  title: string;
  showRefreshIcon?: boolean;
  onRefresh?: () => void;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
}

const AccordionSection = ({
  title,
  showRefreshIcon = false,
  onRefresh,
  defaultOpen = true,
  children,
  className,
}: AccordionSectionProps) => {
  const itemValue = 'section';

  return (
    <section
      className={`rounded-xl border border-gray-100 bg-white ${className ?? ''}`}
      aria-label={title}
    >
      <Accordion type="single" collapsible defaultValue={defaultOpen ? itemValue : undefined}>
        <Accordion.Item value={itemValue} className="mb-0 rounded-xl border-0 bg-white">
          <Accordion.Trigger showRefreshIcon={showRefreshIcon} onRefresh={onRefresh}>
            {title}
          </Accordion.Trigger>
          <Accordion.Content className="px-5 pb-5">{children}</Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </section>
  );
};

export default AccordionSection;
