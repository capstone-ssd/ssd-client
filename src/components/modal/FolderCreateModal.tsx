import { useState } from 'react';
import { cn } from '@/utils/cn';
import { Close } from '@/components/icons';
import FolderFilled from '@/components/icons/FolderFilled';
import { TypeEvalute } from '../icons';
import { TypeWriting } from '../icons';

export interface FolderCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (folderName: string, folderColor: string) => void;
}
type FolderType = 'write' | 'eval';

export default function FolderCreateModal({ isOpen, onClose, onConfirm }: FolderCreateModalProps) {
  const [folderName, setFolderName] = useState('');
  const [folderType, setFolderType] = useState<FolderType>('write');

  // 모드별 테마 컬러 설정
  const THEME = {
    write: {
      color: 'primary-500',
      label: '작성',
    },
    eval: {
      color: 'secondary-200',
      label: '평가',
    },
  };

  function handleClose() {
    setFolderName('');
    setFolderType('write');
    onClose();
  }

  function handleConfirm() {
    if (!folderName.trim()) {
      alert('폴더 이름을 입력해주세요!');
      return;
    }
    onConfirm(folderName, THEME[folderType].color);
    handleClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative z-10 flex w-[700px] flex-col overflow-hidden rounded-sm bg-white shadow-2xl">
        <header className="relative flex h-16 items-center justify-center border-b border-gray-100 px-6">
          <h2 className="text-2xl font-bold text-black">새 폴더 만들기</h2>
          <button
            onClick={handleClose}
            className="absolute right-6 text-gray-400 hover:text-gray-600"
          >
            <Close className="h-7 w-7" />
          </button>
        </header>

        <div className="flex flex-col items-center px-16 py-10">
          {/* 모드 선택 탭 */}
          <div className="mb-8 flex w-64 rounded-xl bg-gray-100 p-1">
            {(['write', 'eval'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFolderType(type)}
                className={cn(
                  'flex-1 rounded-lg py-2 text-xl font-semibold transition-all',
                  folderType === type
                    ? 'bg-white text-black shadow-sm'
                    : 'text-gray-400 hover:text-gray-600'
                )}
              >
                {THEME[type].label}
              </button>
            ))}
          </div>

          {/* 폴더 아이콘 (모드에 따라 색상 변경) */}
          <div className="relative mb-10 transition-transform duration-300 ease-out">
            {/* 1. 폴더 본체: 색상은 고정하거나 테마에 맞게 둡니다 */}
            <FolderFilled className="h-32 w-auto transition-colors duration-300" />

            {/* 2. 추가된 부분: 버튼(탭) 선택에 따라 라벨 SVG를 폴더 위에 겹쳐서 보여줌 */}
            <div className="absolute -top-2 -left-2 scale-110">
              {folderType === 'eval' ? (
                <TypeEvalute className="h-auto w-16" />
              ) : (
                <TypeWriting className="h-auto w-16" />
              )}
            </div>
          </div>

          <div className="w-full">
            <input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder={`${THEME[folderType].label} 폴더 이름을 입력하세요`}
              className={cn(
                'h-14 w-full rounded-lg border border-gray-200 px-4 text-center text-lg transition-all',
                'placeholder:text-gray-300 focus:border-gray-400 focus:outline-none'
              )}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
            />
          </div>

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
