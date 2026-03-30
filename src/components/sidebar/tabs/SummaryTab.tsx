import { useParams } from '@tanstack/react-router';
import { KeywordContent, TextContent } from '@/components/accordion';
import { useKeywordQuery } from '@/hooks/useKeywordQuery';
import { useSummaryQuery } from '@/hooks/useSummaryQuery';
import { useRefreshKeywordMutation } from '@/hooks/useRefreshKeywordMutation';
import { useRefreshSummaryMutation } from '@/hooks/useRefreshSummaryMutation';

function parseKeywords(keyword: string | undefined): string[] {
  if (!keyword) return [];
  return keyword
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean);
}

export function SummaryTab() {
  const { id: documentId } = useParams({ strict: false });
  const { data: keywordData, isLoading: isKeywordLoading } = useKeywordQuery(documentId);
  const { data: summaryData, isLoading: isSummaryLoading } = useSummaryQuery(documentId);
  const { mutate: refreshKeyword, isPending: isKeywordRefreshing } = useRefreshKeywordMutation(documentId);
  const { mutate: refreshSummary, isPending: isSummaryRefreshing } = useRefreshSummaryMutation(documentId);

  const keywords = parseKeywords(keywordData?.keyword);
  const summary = summaryData?.summary ?? '';

  return (
    <>
      <KeywordContent
        keywords={keywords}
        showRefreshIcon={!!documentId}
        onRefresh={documentId ? () => refreshKeyword() : undefined}
      />
      {(isKeywordLoading || isKeywordRefreshing) && keywords.length === 0 && (
        <p className="body-xsmall px-1 text-gray-400">키워드 불러오는 중...</p>
      )}
      {isSummaryLoading ? (
        <p className="body-xsmall px-1 text-gray-400">요약 불러오는 중...</p>
      ) : (
        <TextContent
          title="요약"
          content={summary}
          showRefreshIcon={!!documentId}
          onRefresh={documentId ? () => refreshSummary() : undefined}
        />
      )}
      {isSummaryRefreshing && (
        <p className="body-xsmall px-1 text-gray-400">요약 재생성 중...</p>
      )}
    </>
  );
}
