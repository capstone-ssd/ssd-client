import { useRef, type ChangeEvent, type DragEvent } from 'react';
import { cn } from '@/utils/cn';
import { Upload } from '@/components/icons';

const ACCEPTED_MIME = 'application/pdf';

interface Props {
  isDragOver: boolean;
  onDragOver: (e: DragEvent<HTMLButtonElement>) => void;
  onDragLeave: () => void;
  onDrop: (e: DragEvent<HTMLButtonElement>) => void;
  onFileSelect: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function Dropzone({ isDragOver, onDragOver, onDragLeave, onDrop, onFileSelect }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <button
      type="button"
      aria-label="PDF 파일 드래그 앤 드롭 또는 클릭하여 업로드"
      onClick={() => inputRef.current?.click()}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={cn(
        'flex w-full flex-col items-center justify-center gap-2 px-2.5',
        'cursor-pointer select-none',
        'transition-colors duration-150',
        isDragOver ? 'bg-primary-50' : '',
      )}
    >
      <Upload className="text-gray-400" style={{ width: 60, height: 60 }} aria-hidden="true" />
      <p className="body-small text-gray-400">pdf 파일을 이곳에 드롭하세요</p>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_MIME}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={onFileSelect}
      />
    </button>
  );
}
