import type { SVGProps } from 'react';
import { ChevronRight } from '../icons';

export interface DashboardCardProps {
  title: string;
  tagText: string;
  variant: CardVariant;
  icon: React.ComponentType<SVGProps<SVGSVGElement>>;
  onClick?: () => void;
}

export type CardVariant = 'writing' | 'evaluate' | 'library' | 'calendar';

const HOVER_BORDER_CLASS: Record<CardVariant, string> = {
  writing: 'hover:border-[10px] hover:border-[rgb(245,200,22)]',
  evaluate: 'hover:border-[10px] hover:border-[rgb(135,207,235)]',
  library: 'hover:border-[10px] hover:border-[rgb(173,225,0)]',
  calendar: 'hover:border-[10px] hover:border-[rgb(217,217,217)]',
};

export function DashboardCard({
  title,
  tagText,
  variant,
  icon: Icon,
  onClick,
}: DashboardCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex w-82.5 flex-col gap-7.5 rounded-[20px] bg-white p-10',
        'border-10 border-transparent',
        'cursor-pointer transition-colors duration-200',
        HOVER_BORDER_CLASS[variant],
      ].join(' ')}
      aria-label={`${title} 바로가기`}
    >
      <header className="flex w-full items-center justify-between">
        <h2 className="heading-large text-gray-900">{title}</h2>
        <ChevronRight className="h-6 w-12 shrink-0 text-gray-900" aria-hidden="true" />
      </header>

      {/* 카드 아이콘 영역 */}
      <div className="flex h-40 w-62.5 items-center justify-center" aria-hidden="true">
        <Icon className="h-full w-full" />
      </div>

      {/* 카드 하단 태그 */}
      <span className="body-small self-center rounded-full bg-gray-50 px-10 py-2 text-gray-800">
        {tagText}
      </span>
    </button>
  );
}
