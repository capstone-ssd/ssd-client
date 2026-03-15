import { KeywordContent, TextContent } from '@/components/accordion';

const SAMPLE_KEYWORDS = ['엔지니어링', 'Web', 'AI', '머신러닝', 'React', 'TypeScript'];

const SAMPLE_SUMMARY =
  '신체화 AI(Embodied AI)는 물리적 신체와 센서를 갖추어 실제 환경과 직접 상호작용하며 인간의 인지·지각·운동 기능을 모방하는 차세대 AI 기술로, 다양한 사회 현안 해결의 게임체인저로 주목받고 있습니다.\n특히 중국은 이를 국가 전략 산업으로 지정하고 대규모 투자와 전방위적 지원으로 시장을 선도하고 있습니다.';

export function SummaryTab() {
  return (
    <>
      <KeywordContent keywords={SAMPLE_KEYWORDS} />
      <TextContent title="요약" content={SAMPLE_SUMMARY} />
    </>
  );
}
