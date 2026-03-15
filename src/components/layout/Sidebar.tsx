import { useState } from 'react';
import SidebarTab from '@/components/sidebar/SidebarTab';
import { useSidebarNavigation } from '@/hooks/useSidebarNavigation';
import {
  KeywordContent,
  TextContent,
  ChecklistContent,
  type ChecklistItem,
  LogContent,
  type LogEntry,
  BookmarkItem,
  ReviewContent,
  type ReviewScoreItem,
  ReviewWritingContent,
  type ReviewWritingScoreField,
  type ReviewWritingFormData,
} from '@/components/accordion';
import Button from '@/components/common/Button';

const SAMPLE_KEYWORDS: string[] = ['엔지니어링', 'Web', 'AI', '머신러닝', 'React', 'TypeScript'];

const SAMPLE_SUMMARY =
  '신체화 AI(Embodied AI)는 물리적 신체와 센서를 갖추어 실제 환경과 직접 상호작용하며 인간의 인지·지각·운동 기능을 모방하는 차세대 AI 기술로, 다양한 사회 현안 해결의 게임체인저로 주목받고 있습니다.\n특히 중국은 이를 국가 전략 산업으로 지정하고 대규모 투자와 전방위적 지원으로 시장을 선도하고 있습니다.';

const SAMPLE_AI_EVALUATION =
  '이 사업 계획서는 시장 분석과 기술 스택 선정 측면에서 우수한 완성도를 보입니다.\n다만 재무 계획 부분에서 구체적인 수익 예측 근거가 부족하며, 리스크 관리 방안을 보완할 필요가 있습니다.\n전반적인 사업 아이디어의 독창성과 실현 가능성은 높이 평가됩니다.';

const SAMPLE_CHECKLIST: ChecklistItem[] = [
  { id: '1', label: '사업 개념', checked: true, blockId: 1 },
  { id: '2', label: '사업 목표', checked: true, blockId: 2 },
  { id: '3', label: '제품 설명 및 차별화', checked: true, blockId: 3 },
  { id: '4', label: '목표 시장', checked: true, blockId: 4 },
  { id: '5', label: '마케팅 전략', checked: true, blockId: 5 },
  { id: '6', label: '재무 상태', checked: false, blockId: 6 },
];

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

const SAMPLE_BOOKMARKS = [
  {
    userName: '홍길동',
    userEmail: 'honggildong@hanyang.ac.kr',
    timestamp: '오후 14:30:00',
    quotedText: '신체화 AI는 물리적 신체와 센서를 갖추어 실제 환경과 직접 상호작용하는 차세대 AI 기술입니다.',
    comment: '시장 분석 부분에서 신체화 AI의 성장 가능성을 좀 더 구체적인 수치로 뒷받침했으면 좋겠습니다.',
  },
  {
    userName: '김철수',
    userEmail: 'kimcs@hanyang.ac.kr',
    timestamp: '오전 10:00:00',
    quotedText: '재무 계획에서 연간 매출 목표를 제시합니다.',
    comment: '매출 근거 데이터가 부족합니다. 구체적인 시장 점유율 예측이 필요합니다.',
  },
];

const SAMPLE_REVIEW_SCORE_ITEMS: ReviewScoreItem[] = [
  { label: '사업타당성', score: 70 },
  { label: '사업차별성', score: 85 },
  { label: '재무적정성', score: 60 },
];

const SAMPLE_REVIEWS = [
  {
    reviewId: 'review-1',
    userName: '홍길동',
    userEmail: 'honggildong@hanyang.ac.kr',
    timestamp: '오후 14:30:00',
    totalScore: 72,
    scoreItems: SAMPLE_REVIEW_SCORE_ITEMS,
  },
  {
    reviewId: 'review-2',
    userName: '김철수',
    userEmail: 'kimcs@hanyang.ac.kr',
    timestamp: '오전 10:00:00',
    totalScore: 58,
    scoreItems: SAMPLE_REVIEW_SCORE_ITEMS,
  },
];

const SAMPLE_SCORE_FIELDS: ReviewWritingScoreField[] = [
  { key: 'feasibility', label: '사업타당성' },
  { key: 'differentiation', label: '사업차별성' },
  { key: 'finance', label: '재무적정성' },
];

export function Sidebar() {
  const { currentSidebar } = useSidebarNavigation();
  const [isWritingOpen, setIsWritingOpen] = useState(false);

  function handleReviewSubmit(data: ReviewWritingFormData) {
    console.log('review submitted:', data);
    setIsWritingOpen(false);
  }

  return (
    <aside className="flex w-[390px] flex-col border-l border-gray-200 bg-white">
      <SidebarTab />

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-5">
        {currentSidebar === 'summary' && (
          <>
            <KeywordContent keywords={SAMPLE_KEYWORDS} />
            <TextContent title="요약" content={SAMPLE_SUMMARY} />
          </>
        )}

        {currentSidebar === 'ai-evaluation' && (
          <>
            <ChecklistContent items={SAMPLE_CHECKLIST} />
            <TextContent title="AI 상세평가" content={SAMPLE_AI_EVALUATION} />
          </>
        )}

        {currentSidebar === 'history' && (
          <LogContent date="2025-12-15" entries={SAMPLE_LOG_ENTRIES} defaultOpen />
        )}

        {currentSidebar === 'comments' && (
          <div className="flex flex-col gap-4">
            {SAMPLE_BOOKMARKS.map((bookmark, index) => (
              <BookmarkItem key={index} {...bookmark} />
            ))}
          </div>
        )}

        {currentSidebar === 'review' && (
          <div className="flex flex-col gap-4">
            {isWritingOpen ? (
              <>
                <Button onClick={() => setIsWritingOpen(false)} variant="normal">
                  뒤로가기
                </Button>
                <ReviewWritingContent
                  scoreFields={SAMPLE_SCORE_FIELDS}
                  onSubmit={handleReviewSubmit}
                />
              </>
            ) : (
              <>
                <Button onClick={() => setIsWritingOpen(true)} variant="normal">
                  리뷰 쓰기
                </Button>
                {SAMPLE_REVIEWS.map((review) => (
                  <ReviewContent key={review.reviewId} {...review} />
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
