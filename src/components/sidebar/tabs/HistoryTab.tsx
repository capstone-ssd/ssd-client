import { useParams } from '@tanstack/react-router';
import { LogContent, type LogEntry } from '@/components/accordion';
import { useDocumentLogsQuery } from '@/hooks/useDocumentLogsQuery';
import type { DocumentLogItemResponse } from '@/api/api';

function toLogEntry(log: DocumentLogItemResponse, index: number): LogEntry {
  const parts: string[] = [];
  if (log.createdBlockCount) parts.push(`${log.createdBlockCount}개 블록 추가`);
  if (log.deletedBlockCount) parts.push(`${log.deletedBlockCount}개 블록 삭제`);

  return {
    id: String(index),
    userName: log.editorName ?? '',
    userEmail: log.editorEmail ?? '',
    timestamp: log.savedTime ?? '',
    actionType: '수동 편집',
    content: parts.length > 0 ? parts.join(', ') : '문서 수정',
  };
}

export function HistoryTab() {
  const { id: documentId } = useParams({ strict: false });
  const { data, isLoading } = useDocumentLogsQuery(documentId);

  const records = data?.records ?? [];

  if (isLoading) return <p className="body-xsmall text-gray-400">불러오는 중...</p>;

  if (records.length === 0) {
    return <p className="body-xsmall text-gray-400">기록이 없습니다.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {records.map((group, index) => (
        <LogContent
          key={group.savedDate ?? index}
          date={group.savedDate ?? ''}
          entries={(group.logs ?? []).map(toLogEntry)}
          defaultOpen={index === 0}
        />
      ))}
    </div>
  );
}
