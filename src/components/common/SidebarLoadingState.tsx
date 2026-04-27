import { LoadingSpinner } from './LoadingSpinner';

export interface SidebarLoadingStateProps {
  label?: string;
}

export function SidebarLoadingState({ label = '불러오는 중' }: SidebarLoadingStateProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className="absolute inset-0 z-10 flex items-center justify-center bg-gray-600/60"
    >
      <LoadingSpinner label={label} />
    </div>
  );
}

export default SidebarLoadingState;
