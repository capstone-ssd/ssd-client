import type { DashboardCardProps } from './DashboardCard';
import SvgWriting from '../icons/Writing';
import SvgEvaluate from '../icons/Evaluate';
import SvgLibrary from '../icons/Library';
import SvgCalendar from '../icons/Calendar';

export const CARD_META: Omit<DashboardCardProps, 'onClick'>[] = [
  { title: '작성하기', tagText: 'AI로 간편한 작성', variant: 'writing', icon: SvgWriting },
  { title: '평가하기', tagText: 'AI로 간편한 평가', variant: 'evaluate', icon: SvgEvaluate },
  { title: '라이브러리', tagText: '문서 한눈에 보기', variant: 'library', icon: SvgLibrary },
  { title: '일정 관리', tagText: '나만의 일정관리', variant: 'calendar', icon: SvgCalendar },
];
