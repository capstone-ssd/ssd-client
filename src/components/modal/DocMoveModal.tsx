import { useState, type KeyboardEvent } from 'react';
import { cn } from '@/utils/cn';
import Button from '@/components/common/Button';
import { Close } from '@/components/icons';
import FileTree, { type LibraryData } from '@/components/docs-upload/FileTree';

export interface DocMoveModalProps {
  isOpen: boolean;
  /** 이동 위치 선택에 사용할 폴더 트리 데이터 */
  data: LibraryData | null;
  isLoading?: boolean;
  /** 이동 대상 문서의 제목 (안내용) */
  documentTitle?: string;
  onClose: () => void;
  /** 최종 이동 승인 핸들러 */
  onConfirm: (targetFolderId: number) => void;
}

export default function DocMoveModal({
  isOpen,
  data,
  isLoading,
  documentTitle = '선택한 문서',
  onClose,
  onConfirm,
}: DocMoveModalProps) {
  // 기본 목적지를 루트(0) 혹은 null 상태로 세팅합니다.
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);

  function handleConfirm() {
    // 백엔드 명세 규칙: 0이면 루트로 이동하므로 null이나 undefined면 0으로 치환하여 전송
    onConfirm(selectedFolderId ?? 0);
  }

  function handleClose() {
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
      {/* 배경 딤드 처리 */}
      <div
        role="presentation"
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
        aria-hidden="true"
        onClick={handleClose}
      />

      {/* 모달 바디 본체 */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="move-modal-title"
        className={cn(
          'relative z-10 flex w-[500px] max-w-[95vw] flex-col', // 이동창에 적합한 아담한 너비로 조정
          'rounded-lg bg-white shadow-2xl',
          'max-h-[80vh] overflow-y-auto'
        )}
      >
        <header className="flex items-center justify-between border-b border-gray-100 px-8 py-4">
          <span className="w-6" aria-hidden="true" />
          <h2 id="move-modal-title" className="text-lg font-semibold text-gray-900">
            문서 위치 이동
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className={cn(
              'flex h-6 w-6 items-center justify-center rounded',
              'text-gray-500 transition-colors duration-150 hover:text-gray-900',
              'focus-visible:ring-primary-500 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none'
            )}
            aria-label="모달 닫기"
          >
            <Close className="h-5 w-5" aria-hidden="true" />
          </button>
        </header>

        <div className="flex flex-col gap-6 px-8 pt-6">
          {/* 가이드 안내 정보 */}
          <div className="rounded-md border border-gray-100 bg-gray-50 p-4">
            <p className="text-sm leading-relaxed text-gray-600">
              이동할 문서: <span className="font-bold text-gray-900">{documentTitle}</span>
            </p>
          </div>

          {/* 폴더 트리 선택 영역 */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-gray-900">목적지 폴더 선택</p>
            <div className="max-h-60 overflow-y-auto rounded-md border border-gray-200 bg-white p-2">
              <FileTree
                data={data}
                isLoading={isLoading}
                selectedFolderId={selectedFolderId}
                onSelectFolder={setSelectedFolderId}
              />
            </div>
            <p className="mt-1 text-xs text-gray-400">
              * 선택하지 않고 확인을 누르면 대분류(최상위 루트)로 이동합니다.
            </p>
          </div>

          {/* 하단 액션 버튼 */}
          <div className="mt-4 flex items-center justify-end gap-3 border-t border-gray-100 py-4">
            <Button variant="normal" rounded="small" type="button" onClick={handleClose}>
              취소
            </Button>
            <Button variant="main" rounded="small" type="button" onClick={handleConfirm}>
              이동하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
