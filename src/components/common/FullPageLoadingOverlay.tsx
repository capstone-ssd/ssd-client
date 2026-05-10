import { LoadingSpinner } from './LoadingSpinner';

export function FullPageLoadingOverlay() {
  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-4 bg-gray-900/50 backdrop-blur-sm"
      aria-live="assertive"
      aria-label="문서 업로드 중"
    >
      <LoadingSpinner label="문서 업로드 중" />
      <p className="body-small font-medium text-white">문서를 업로드하는 중입니다...</p>
    </div>
  );
}
