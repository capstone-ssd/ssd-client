import { useParams } from '@tanstack/react-router';
import { ChecklistContent, type ChecklistItem } from '@/components/accordion';
import ReviewContent from '@/components/accordion/content/ReviewContent';
import { useAiEvaluationQuery } from '@/hooks/useAiEvaluationQuery';
import { useAiChecklistQuery } from '@/hooks/useAiChecklistQuery';
import type { ExternalAiEvaluationCardResponse } from '@/api/api';
import type { ReviewScoreItem } from '@/components/accordion/content/ReviewContent';

function toScoreItems(data: ExternalAiEvaluationCardResponse): ReviewScoreItem[] {
  const metrics = [
    data.problemRecognition,
    data.feasibility,
    data.growthStrategy,
    data.businessModel,
    data.teamComposition,
  ];

  return metrics
    .filter((m) => !!m)
    .map((m) => ({
      label: m!.label ?? '',
      score: m!.score ?? 0,
    }));
}

function toChecklistItems(checkList: Record<string, boolean>): ChecklistItem[] {
  return Object.entries(checkList).map(([label, checked], index) => ({
    id: String(index),
    label,
    checked,
  }));
}

export function AiEvaluationTab() {
  const { id: documentId } = useParams({ strict: false });
  const { data: evaluationData, isLoading: isEvaluationLoading } =
    useAiEvaluationQuery(documentId);
  const { data: checklistData, isLoading: isChecklistLoading } =
    useAiChecklistQuery(documentId);

  const checklistItems = checklistData?.checkList
    ? toChecklistItems(checklistData.checkList)
    : [];

  const scoreItems = evaluationData ? toScoreItems(evaluationData) : [];

  return (
    <>
      {isChecklistLoading ? (
        <p className="body-xsmall px-1 text-gray-400">체크리스트 불러오는 중...</p>
      ) : (
        <ChecklistContent items={checklistItems} />
      )}
      {isEvaluationLoading ? (
        <p className="body-xsmall px-1 text-gray-400">AI 평가 불러오는 중...</p>
      ) : (
        <ReviewContent
          reviewId="ai-evaluation"
          userName="AI 상세평가"
          userEmail=""
          timestamp=""
          totalScore={evaluationData?.totalScore ?? 0}
          scoreItems={scoreItems}
          barColor="#facc15"
        />
      )}
    </>
  );
}
