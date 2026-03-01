import { cn } from '@/utils/cn';
import { Close, FilePdf } from '@/components/icons';

export interface SelectedFile {
  name: string;
  size: number;
}

interface Props {
  file: SelectedFile;
  onRemove: () => void;
}

function formatFileSize(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(2)}MB`;
}

export default function SelectedFileCard({ file, onRemove }: Props) {
  return (
    <div
      className="flex w-full items-center rounded-[10px] border border-gray-100 px-10 py-0"
      aria-label={`선택된 파일: ${file.name}`}
    >
      <div className="flex shrink-0 items-center justify-center pr-3">
        <FilePdf className="h-17.75 w-17.75 text-gray-700" aria-hidden="true" />
      </div>
      <div className="flex flex-1 flex-col justify-center overflow-hidden px-5">
        <span className="body-small truncate text-gray-900">{file.name}</span>
        <span className="body-tiny text-gray-400">{formatFileSize(file.size)}</span>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className={cn(
          'flex shrink-0 items-center justify-center rounded p-1',
          'text-gray-400 transition-colors duration-150 hover:text-gray-700',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1',
        )}
        aria-label={`${file.name} 파일 제거`}
      >
        <Close className="h-6 w-6" aria-hidden="true" />
      </button>
    </div>
  );
}
