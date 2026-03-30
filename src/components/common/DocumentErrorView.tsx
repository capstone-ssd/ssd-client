import type { AxiosError } from 'axios';

interface DocumentErrorViewProps {
  error: unknown;
}

function getStatusMessage(error: unknown): string {
  const status = (error as AxiosError)?.response?.status;
  if (status === 403) return '해당 문서에 접근할 권한이 없습니다.';
  if (status === 404) return '문서를 찾을 수 없습니다.';
  return '문서를 불러오는 중 오류가 발생했습니다.';
}

export function DocumentErrorView({ error }: DocumentErrorViewProps) {
  return (
    <div className="flex h-full flex-1 items-center justify-center">
      <p className="text-sm text-gray-500">{getStatusMessage(error)}</p>
    </div>
  );
}
