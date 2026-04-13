import { useState } from 'react';
import { cn } from '@/utils/cn';
import { Close } from '@/components/icons';
import FolderFilled from '@/components/icons/FolderFilled'; // 기존 폴더 아이콘 사용

export interface FolderCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  // 이미지 레이아웃에 맞춰 필요한 인자만 유지 (이름, 색상 등)
  onConfirm: (folderName: string, folderColor: string) => void;
}

export default function FolderCreateModal({ isOpen, onClose, onConfirm }: FolderCreateModalProps) {
  const [folderName, setFolderName] = useState('');
  // 기본 폴더 색상 (이미지의 노란색 계열)
  const DEFAULT_COLOR = '#F2D060';

  function handleClose() {
    setFolderName('');
    onClose();
  }

  function handleConfirm() {
    if (!folderName.trim()) {
      alert('폴더 이름을 입력해주세요!');
      return;
    }
    onConfirm(folderName, DEFAULT_COLOR);
    handleClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 어둡게 */}
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={handleClose} />

      {/* 모달 본체: 이미지 비율에 맞춰 너비 조정 */}
      <div className="relative z-10 flex w-[700px] flex-col overflow-hidden rounded-sm bg-white shadow-2xl">
        {/* 헤더: 중앙 제목과 우측 닫기 아이콘 */}
        <header className="relative flex h-16 items-center justify-center border-b border-gray-100 px-6">
          <h2 className="text-2xl font-bold text-black">새 폴더 만들기</h2>
          <button
            onClick={handleClose}
            className="absolute right-6 text-gray-400 hover:text-gray-600"
          >
            <Close className="h-7 w-7" />
          </button>
        </header>

        <div className="flex flex-col items-center px-16 py-12">
          {/* 중앙 폴더 아이콘: 이미지처럼 크게 배치 */}
          <div className="mb-10">
            <FolderFilled className="h-32 w-auto" style={{ color: DEFAULT_COLOR }} />
          </div>

          {/* 입력창: 테두리를 연하게 하고 중앙 정렬 placeholder */}
          <div className="w-full">
            <input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="이름 없는 폴더"
              className={cn(
                'h-14 w-full rounded-lg border border-gray-200 px-4 text-center text-lg',
                'focus:border-primary-400 placeholder:text-gray-300 focus:outline-none'
              )}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
            />
          </div>

          {/* 하단 버튼 영역: 나란히 배치 */}
          <div className="mt-12 flex w-full justify-end gap-4">
            <button
              onClick={handleClose}
              className="h-12 w-32 rounded-lg border border-gray-200 bg-white text-xl font-medium text-black transition-colors hover:bg-gray-50"
            >
              닫기
            </button>
            <button
              onClick={handleConfirm}
              className="h-12 w-32 rounded-lg bg-[#F2D060] text-xl font-medium text-black transition-opacity hover:opacity-90"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
