import { LogContent, type LogEntry } from '@/components/accordion';

const SAMPLE_LOG_ENTRIES: LogEntry[] = [
  {
    id: '1',
    userName: '홍길동',
    userEmail: 'honggildong@hanyang.ac.kr',
    timestamp: '오후 14:30:00',
    actionType: '수동 편집',
    content: '3단락 내용 추가 및 수정',
  },
  {
    id: '2',
    userName: '김철수',
    userEmail: 'kimcs@hanyang.ac.kr',
    timestamp: '오전 11:15:00',
    actionType: 'AI 편집',
    content: '5단락 시장 분석 내용 보완',
  },
];

export function HistoryTab() {
  return <LogContent date="2025-12-15" entries={SAMPLE_LOG_ENTRIES} defaultOpen />;
}
