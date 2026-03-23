import { ChecklistContent, TextContent, type ChecklistItem } from '@/components/accordion';

const SAMPLE_CHECKLIST: ChecklistItem[] = [
  { id: '1', label: '사업 개념', checked: true, blockId: 1 },
  { id: '2', label: '사업 목표', checked: true, blockId: 2 },
  { id: '3', label: '제품 설명 및 차별화', checked: true, blockId: 3 },
  { id: '4', label: '목표 시장', checked: true, blockId: 4 },
  { id: '5', label: '마케팅 전략', checked: true, blockId: 5 },
  { id: '6', label: '재무 상태', checked: false, blockId: 6 },
];

const SAMPLE_AI_EVALUATION =
  '이 사업 계획서는 시장 분석과 기술 스택 선정 측면에서 우수한 완성도를 보입니다.\n다만 재무 계획 부분에서 구체적인 수익 예측 근거가 부족하며, 리스크 관리 방안을 보완할 필요가 있습니다.\n전반적인 사업 아이디어의 독창성과 실현 가능성은 높이 평가됩니다.';

export function AiEvaluationTab() {
  return (
    <>
      <ChecklistContent items={SAMPLE_CHECKLIST} />
      <TextContent title="AI 상세평가" content={SAMPLE_AI_EVALUATION} />
    </>
  );
}
