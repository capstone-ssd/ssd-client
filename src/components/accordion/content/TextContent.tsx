import { AccordionSection } from '..';

/**
 * TextContent
 *
 * 텍스트 기반 콘텐츠를 AccordionSection으로 감싸서 표시합니다.
 * 줄바꿈(\n)을 기준으로 단락을 분리합니다.
 *
 * @param title - 아코디언 제목
 * @param content - 표시할 텍스트 내용
 * @param showRefreshIcon - 새로고침 아이콘 표시 여부
 * @param onRefresh - 새로고침 핸들러
 * @param defaultOpen - 초기 열림 상태
 */
export interface TextContentProps {
  title: string;
  content: string;
  showRefreshIcon?: boolean;
  onRefresh?: () => void;
  defaultOpen?: boolean;
}

const TextContent = ({
  title,
  content,
  showRefreshIcon = true,
  onRefresh,
  defaultOpen = true,
}: TextContentProps) => {
  const paragraphs = content.split('\n').filter((line) => line.trim().length > 0);

  return (
    <AccordionSection
      title={title}
      showRefreshIcon={showRefreshIcon}
      onRefresh={onRefresh}
      defaultOpen={defaultOpen}
    >
      <div className="flex flex-col gap-4">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="body-xsmall">
            {paragraph}
          </p>
        ))}
      </div>
    </AccordionSection>
  );
};

export default TextContent;
