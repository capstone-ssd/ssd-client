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

const CHECKLIST_LABEL_MAP: Record<string, string> = {
  differentiation_is_clear: '차별점이 명확함',
  differentiation_is_realistic: '차별점이 실현 가능함',
  target_specific_advantage: '특정 타겟에 대한 강점이 있음',
  entry_barrier_exists: '진입 장벽이 존재함',
  problem_is_clear: '문제가 명확함',
  problem_is_real: '문제가 실재함',
  target_and_context_are_specific: '타겟과 맥락이 구체적임',
  existing_solution_has_limits: '기존 솔루션의 한계가 있음',
  market_definition_is_correct: '시장 정의가 적절함',
  market_size_is_realistic: '시장 규모가 현실적임',
  willingness_to_pay_is_clear: '지불 의향이 명확함',
  revenue_model_is_clear: '수익 모델이 명확함',
  problem_founder_fit: '문제와 창업자 간 적합성이 있음',
  experience_alignment: '경험이 사업과 연관되어 있음',
  team_structure_is_clear: '팀 구조가 명확함',
  capability_gap_plan_exists: '역량 부족에 대한 보완 계획이 있음',
};

function toChecklistItems(checkList: Record<string, boolean>): ChecklistItem[] {
  return Object.entries(checkList).map(([key, checked], index) => ({
    id: String(index),
    label: CHECKLIST_LABEL_MAP[key] ?? key,
    checked,
  }));
}

export function AiEvaluationTab() {
  const { id: documentId } = useParams({ strict: false });
  const { data: evaluationData, isLoading: isEvaluationLoading } = useAiEvaluationQuery(documentId);
  const { data: checklistData, isLoading: isChecklistLoading } = useAiChecklistQuery(documentId);

  const checklistItems = checklistData?.checkList ? toChecklistItems(checklistData.checkList) : [];

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
