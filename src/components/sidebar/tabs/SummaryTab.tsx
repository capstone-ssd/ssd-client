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
  const { data: keywordData } = useKeywordQuery(documentId);
  const { data: summaryData } = useSummaryQuery(documentId);
  const { mutate: refreshKeyword } = useRefreshKeywordMutation(documentId);
  const { mutate: refreshSummary } = useRefreshSummaryMutation(documentId);

  const keywords = parseKeywords(keywordData?.keyword);
  const summary = summaryData?.summary ?? '';

  return (
    <div className="flex flex-1 flex-col gap-4">
      <KeywordContent
        keywords={keywords}
        showRefreshIcon={!!documentId}
        onRefresh={documentId ? () => refreshKeyword() : undefined}
      />
      <TextContent
        title="요약"
        content={summary}
        showRefreshIcon={!!documentId}
        onRefresh={documentId ? () => refreshSummary() : undefined}
      />
    </div>
  );
}
