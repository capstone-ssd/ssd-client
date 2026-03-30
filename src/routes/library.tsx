import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import LibraryDocument from '@/components/common/LibDoc.tsx';
import Button from '@/components/common/Button';
import { ChevronRight } from '@/components/icons';
import { useFolderQuery } from '@/hooks/useFolderQuery';
// import { requireAuth } from '@/utils/authGuard';

export const Route = createFileRoute('/library')({
  component: RouteComponent,
  // beforeLoad: () => requireAuth(),
});

export default function RouteComponent() {
  const [currentSort, setCurrentSort] = useState<'LATEST' | 'OLDEST' | 'NAME' | 'MODIFIED'>(
    'LATEST'
  );
  const { data: serverData } = useFolderQuery(currentSort);

  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('문서 유형');

  const sortMap = {
    LATEST: '최신순',
    OLDEST: '오래된순',
    NAME: '이름순',
    MODIFIED: '최근 수정일순',
  };

  const handleSort = (sortKey: keyof typeof sortMap) => {
    setCurrentSort(sortKey);
    setIsSortOpen(false);
  };

  return (
    <div className="min-h-screen w-full bg-white p-8">
      <div className="relative mb-10 flex justify-end gap-3">
        {/* 1. 문서 유형 드롭다운 (isTypeOpen 사용해서 경고 해결!) */}
        <div className="relative">
          <Button
            variant="normal"
            onClick={() => {
              setIsTypeOpen(!isTypeOpen);
              setIsSortOpen(false);
            }}
            className={`flex h-[30px] !min-h-0 w-[140px] items-center justify-between border border-gray-200 bg-white px-3 text-[20px] font-normal transition-colors ${
              selectedType !== '문서 유형' ? 'font-medium text-gray-900' : 'text-gray-700'
            }`}
          >
            <span className="truncate whitespace-nowrap">{selectedType}</span>
            <ChevronRight
              className={`h-3 w-3 shrink-0 transition-transform ${isTypeOpen ? 'rotate-90' : ''}`}
            />
          </Button>

          {isTypeOpen && (
            <div className="absolute top-[35px] left-0 z-50 w-full rounded-md border border-gray-100 bg-white py-1 shadow-lg">
              {['일반문서', '공유문서'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setSelectedType(opt);
                    setIsTypeOpen(false);
                  }}
                  className={`flex w-full items-center px-3 py-2 text-[16px] transition-colors hover:bg-gray-100 ${
                    selectedType === opt ? 'font-medium text-gray-900' : 'text-gray-700'
                  }`}
                >
                  <span
                    className={`mr-2 w-3 ${selectedType === opt ? 'visible text-gray-900' : 'invisible'}`}
                  >
                    ✓
                  </span>
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2. 정렬 순서 드롭다운 (작성하신 코드 그대로 유지) */}
        <div className="relative">
          <Button
            variant="normal"
            onClick={() => {
              setIsSortOpen(!isSortOpen);
              setIsTypeOpen(false);
            }}
            className={`flex h-[30px] !min-h-0 w-[140px] items-center justify-between border border-gray-200 bg-white px-3 text-[20px] font-normal transition-colors ${
              currentSort !== 'LATEST' ? 'font-medium text-gray-900' : 'text-gray-700'
            }`}
          >
            <span className="truncate whitespace-nowrap">{sortMap[currentSort]}</span>
            <ChevronRight
              className={`h-3 w-3 shrink-0 transition-transform ${isSortOpen ? 'rotate-90' : ''}`}
            />
          </Button>

          {isSortOpen && (
            <div className="absolute top-[35px] right-0 z-50 w-[160px] rounded-md border border-gray-100 bg-white py-1 shadow-lg">
              {(Object.entries(sortMap) as [keyof typeof sortMap, string][]).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => handleSort(key)}
                  className={`flex w-full items-center px-4 py-2 text-[16px] transition-colors hover:bg-gray-100 ${
                    currentSort === key ? 'font-medium text-gray-900' : 'text-gray-700'
                  }`}
                >
                  <span
                    className={`mr-2 w-3 ${currentSort === key ? 'visible text-gray-900' : 'invisible'}`}
                  >
                    ✓
                  </span>
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <main className="mx-auto mt-10 grid max-w-[1700px] grid-cols-6 justify-items-center gap-x-[40px] gap-y-[60px] px-8">
        {serverData?.folders.map((folder) => (
          <LibraryDocument
            key={`folder-${folder.id}`}
            documentId={folder.id}
            itemType="folder"
            title={folder.name}
            date={folder.updatedAt?.split('T')[0] || '-'}
          />
        ))}
        {serverData?.documents.map((doc) => (
          <LibraryDocument
            key={`doc-${doc.id}`}
            documentId={doc.id}
            itemType="document"
            title={doc.title}
            date={doc.updatedAt?.split('T')[0] || '-'}
          />
        ))}
      </main>
    </div>
  );
}
