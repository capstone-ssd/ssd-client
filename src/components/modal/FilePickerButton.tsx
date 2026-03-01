import { type ChangeEvent } from 'react';
import { cn } from '@/utils/cn';
import { FilePdf } from '@/components/icons';

const ACCEPTED_MIME = 'application/pdf';

interface Props {
  onFileSelect: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function FilePickerButton({ onFileSelect }: Props) {
  return (
    <label
      className={cn(
        'flex h-15 w-45 cursor-pointer items-center justify-center gap-2',
        'rounded-xl bg-primary-400',
        'body-small font-medium text-gray-900',
        'transition-all duration-150 hover:brightness-95 active:scale-[0.98]',
        'focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2',
      )}
      aria-label="PDF 파일 선택하여 업로드"
    >
      <FilePdf className="h-8 w-8 shrink-0" aria-hidden="true" />
      <span>업로드</span>
      <input
        type="file"
        accept={ACCEPTED_MIME}
        className="sr-only"
        tabIndex={0}
        onChange={onFileSelect}
      />
    </label>
  );
}
