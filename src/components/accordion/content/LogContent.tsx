import Accordion from '..';
import AccordionProfileSection from './AccordionProfileSection';

export interface LogEntry {
  id: string;
  userName: string;
  userEmail: string;
  timestamp: string;
  actionType: string;
  content: string;
}

/**
 * LogContent
 *
 * Figma "accodion/log" 컴포넌트를 구현합니다.
 * 날짜별로 그룹화된 편집 로그를 아코디언 형태로 표시합니다.
 *
 * @param date - 로그 날짜 문자열 (예: "2025-12-15")
 * @param entries - 해당 날짜에 속한 로그 항목 배열
 * @param defaultOpen - 초기 열림 상태 (기본: false)
 * @param className - 외부 컨테이너에 추가할 클래스
 */
export interface LogContentProps {
  date: string;
  entries: LogEntry[];
  defaultOpen?: boolean;
  className?: string;
}

const LogContent = ({ date, entries, defaultOpen = false, className }: LogContentProps) => {
  const itemValue = 'log-section';

  return (
    <section
      className={`rounded-xl border border-gray-100 bg-white ${className ?? ''}`}
      aria-label={`${date} 편집 로그`}
    >
      <Accordion type="single" collapsible defaultValue={defaultOpen ? itemValue : undefined}>
        <Accordion.Item value={itemValue} className="mb-0 rounded-xl border-0 bg-white">
          <Accordion.Trigger
            trailing={<span className="body-xsmall text-gray-700">{entries.length}건</span>}
          >
            <span className="heading-medium">{date}</span>
          </Accordion.Trigger>

          <Accordion.Content className="px-5 pb-5">
            <ul className="flex flex-col gap-2.5" aria-label={`${date} 로그 목록`}>
              {entries.map((entry) => (
                <li key={entry.id}>
                  <article
                    className="rounded-xl border border-gray-100 bg-white p-5"
                    aria-label={`${entry.userName}의 ${entry.actionType} 로그`}
                  >
                    <AccordionProfileSection
                      userName={entry.userName}
                      userEmail={entry.userEmail}
                      timestamp={entry.timestamp}
                    >
                      <div className="rounded bg-gray-50 px-5 py-0.5">
                        <span className="body-xsmall text-gray-800">{entry.content}</span>
                      </div>
                    </AccordionProfileSection>
                  </article>
                </li>
              ))}
            </ul>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </section>
  );
};

export default LogContent;
