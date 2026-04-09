import { useState } from 'react';
import { cn } from '@/utils/cn';
import Button from '@/components/common/Button';
import { Close } from '@/components/icons';
import FileTree, { type LibraryData } from '@/components/docs-upload/FileTree';

export interface FolderCreateModalProps {
  isOpen: boolean;
  /** 어느 폴더 안에 만들지 선택할 데이터 */
  data: LibraryData | null;
  isLoading?: boolean;
  onClose: () => void;
  /** ✅ 수정: 확인 버튼을 눌렀을 때 (이름, 부모ID, 색상) 3가지를 넘겨줍니다 */
  onConfirm: (folderName: string, parentFolderId: number | null, color: string) => void;
}

export default function FolderCreateModal({
  isOpen,
  data,
  isLoading,
  onClose,
  onConfirm,
}: FolderCreateModalProps) {
  // 1. 상태 관리: 폴더 이름, 선택된 위치, 그리고 색상(추가)
  const [folderName, setFolderName] = useState('');
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);
  // ✅ 수정: 컴포넌트 내부로 이동하고, '작성(빨강)'을 기본값으로 설정
  const [selectedColor, setSelectedColor] = useState('#EF4444');

  // 닫기 버튼이나 취소를 눌렀을 때 초기화
  function handleClose() {
    setFolderName('');
    setSelectedParentId(null);
    setSelectedColor('#EF4444'); // ✅ 닫을 때 색상도 기본값으로 초기화
    onClose();
  }

  // 확인 버튼 클릭
  function handleConfirm() {
    if (!folderName.trim()) {
      alert('폴더 이름을 입력해주세요!');
      return;
    }
    // ✅ 수정: 이름, 위치 ID, 그리고 선택한 색상까지 서버로 보냅니다.
    onConfirm(folderName, selectedParentId, selectedColor);
    // 💡 참고: 메인 페이지에서 성공적으로 처리한 후 handleClose()를 호출하는 것이 좋습니다.
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 어둡게 */}
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative z-10 flex w-[500px] flex-col bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-gray-100 px-10 py-5">
          <span className="w-6" />
          <h2 className="body-small font-medium text-gray-900">새 폴더 생성</h2>
          <button onClick={handleClose} className="text-gray-700 hover:text-gray-900">
            <Close className="h-6 w-6" />
          </button>
        </header>

        <div className="flex flex-col gap-8 px-10 pt-10">
          {/* 폴더 이름 입력 영역 */}
          <div className="flex flex-col gap-2">
            <label className="body-small font-medium text-gray-900">폴더 이름</label>
            <input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="생성할 폴더 이름을 입력하세요"
              className="h-12 w-full rounded-[10px] border border-gray-100 px-4 focus:border-blue-500 focus:outline-none"
              autoFocus
            />
          </div>

          {/* ✅ 새로 추가: 폴더 유형(색상) 선택 영역 */}
          <div className="flex flex-col gap-3">
            <label className="body-small font-medium text-gray-900">폴더 유형 선택</label>
            <div className="flex gap-4">
              {[
                { label: '작성 전용 (빨강)', color: '#EF4444' }, // 작성 폴더용
                { label: '평가 전용 (파랑)', color: '#3B82F6' }, // 평가 폴더용
              ].map((item) => (
                <button
                  key={item.color}
                  type="button"
                  onClick={() => setSelectedColor(item.color)}
                  className={cn(
                    'flex h-12 flex-1 items-center justify-center rounded-[10px] border-2 font-medium transition-all',
                    selectedColor === item.color
                      ? 'border-gray-900 bg-gray-900 text-white shadow-md' // 선택됨
                      : 'border-gray-100 bg-white text-gray-500 hover:border-gray-300' // 미선택
                  )}
                >
                  <div
                    className="mr-2 h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 위치 선택 영역 (기존 코드 활용) */}
          <div className="flex flex-col gap-2">
            <p className="body-small font-medium text-gray-900">생성 위치 (미선택 시 최상위)</p>
            <div className="max-h-55 overflow-y-auto rounded-[10px] border border-gray-100 p-2">
              <FileTree
                data={data}
                isLoading={isLoading}
                selectedFolderId={selectedParentId}
                onSelectFolder={setSelectedParentId}
              />
            </div>
          </div>

          {/* 하단 버튼 */}
          <div className="flex items-center justify-end gap-5 py-5">
            <Button variant="normal" rounded="small" onClick={handleClose}>
              취소
            </Button>
            <Button variant="main" rounded="small" onClick={handleConfirm}>
              생성하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
