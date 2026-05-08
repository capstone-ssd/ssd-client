import { cn } from '@/utils/cn';
import SvgSpinner from '@/components/icons/Spinner';

export interface LoadingSpinnerProps {
  label?: string;
  className?: string;
}

export function LoadingSpinner({ label = '로딩 중', className }: LoadingSpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn('inline-flex items-center justify-center', className)}
    >
      <SvgSpinner
        aria-hidden="true"
        width={48}
        height={48}
        className="animate-spin"
        style={{
          color: '#9d9d9d',
          animationDuration: '0.8s',
          animationTimingFunction: 'linear',
        }}
      />
    </span>
  );
}

export default LoadingSpinner;
