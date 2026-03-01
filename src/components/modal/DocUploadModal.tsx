import { useRef, useState, type ChangeEvent, type DragEvent, type KeyboardEvent } from 'react';
import { cn } from '@/utils/cn';
import Button from '@/components/common/Button';
import { Close } from '@/components/icons';
import FileTree, { type LibraryData } from '@/components/docs-upload/FileTree';
import Dropzone from './Dropzone';
import FilePickerButton from './FilePickerButton';
import SelectedFileCard, { type SelectedFile } from './SelectedFileCard';

const ACCEPTED_MIME = 'application/pdf';

export interface DocUploadModalProps {
  isOpen: boolean;
  /** 업로드 위치 선택에 사용할 폴더 트리 데이터 */
  data: LibraryData | null;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: (file: File | null, folderId: number | null) => void;
}

function getOnlyPDF(dataTransfer: DataTransfer): File | null {
  return Array.from(dataTransfer.files).find((f) => f.type === ACCEPTED_MIME) ?? null;
}

export default function DocUploadModal({
  isOpen,
  data,
  isLoading,
  onClose,
  onConfirm,
}: DocUploadModalProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const selectedFileRef = useRef<File | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);

  function selectFile(file: File) {
    selectedFileRef.current = file;
    setSelectedFile({ name: file.name, size: file.size });
  }

  function handleFileInputChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) selectFile(file);
    e.target.value = '';
  }

  function handleDragOver(e: DragEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }

  function handleDragLeave() {
    setIsDragOver(false);
  }

  function handleDrop(e: DragEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const file = getOnlyPDF(e.dataTransfer);
    if (file) selectFile(file);
  }

  function handleConfirm() {
    onConfirm(selectedFileRef.current, selectedFolderId);
  }

  function handleClose() {
    setSelectedFile(null);
    selectedFileRef.current = null;
    setSelectedFolderId(null);
    onClose();
  }

  function handleDialogKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Escape') handleClose();
  }

  if (!isOpen) return null;

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center"
      onKeyDown={handleDialogKeyDown}
    >
      <div
        role="presentation"
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
        aria-hidden="true"
        onClick={handleClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={cn(
          'relative z-10 flex w-206.25 max-w-[95vw] flex-col',
          'bg-white shadow-2xl',
          'max-h-[90vh] overflow-y-auto'
        )}
      >
        <header className="flex items-center justify-between border-b border-gray-100 px-10 py-5">
          <span className="w-6" aria-hidden="true" />
          <h2 id="modal-title" className="body-small font-medium text-gray-900">
            문서 업로드
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className={cn(
              'flex h-6 w-6 items-center justify-center rounded',
              'text-gray-700 transition-colors duration-150 hover:text-gray-900',
              'focus-visible:ring-primary-500 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none'
            )}
            aria-label="모달 닫기"
          >
            <Close className="h-4 w-4" aria-hidden="true" />
          </button>
        </header>

        <div className="flex flex-col gap-10 px-10 pt-10">
          <div className="flex flex-col gap-10">
            {/* 파일 업로드 영역 */}
            <section
              aria-label="파일 업로드"
              className="flex flex-col items-center gap-5 rounded-[10px] border border-gray-100 px-10 py-10"
            >
              <Dropzone
                isDragOver={isDragOver}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onFileSelect={handleFileInputChange}
              />
              <FilePickerButton onFileSelect={handleFileInputChange} />
            </section>

            {/* 선택된 파일 */}
            {selectedFile && (
              <section
                aria-label="선택된 파일"
                aria-live="polite"
                className="rounded-[10px] border border-gray-100"
              >
                <SelectedFileCard
                  file={selectedFile}
                  onRemove={() => {
                    selectedFileRef.current = null;
                    setSelectedFile(null);
                  }}
                />
              </section>
            )}

            {/* 업로드 위치 선택 */}
            <div className="flex flex-col gap-2">
              <p className="body-small font-medium text-gray-900">업로드 위치</p>
              <div className="max-h-55 overflow-y-auto">
                <FileTree
                  data={data}
                  isLoading={isLoading}
                  selectedFolderId={selectedFolderId}
                  onSelectFolder={setSelectedFolderId}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-5 py-5">
            <Button variant="normal" rounded="small" type="button" onClick={handleClose}>
              취소
            </Button>
            <Button variant="main" rounded="small" type="button" onClick={handleConfirm}>
              확인
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
