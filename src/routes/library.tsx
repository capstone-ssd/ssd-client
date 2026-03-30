import { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import LibraryDocument from '@/components/common/LibDoc.tsx';
import Button from '@/components/common/Button';
import { ChevronRight } from '@/components/icons';
import { useFolderQuery } from '@/hooks/useFolderQuery';
import { cn } from '@/utils/cn';
import { requireAuth } from '@/utils/authGuard';

export const Route = createFileRoute('/library')({
  component: RouteComponent,
  beforeLoad: () => requireAuth(),
});

export default function RouteComponent() {
  const navigate = useNavigate();

  const [currentSort, setCurrentSort] = useState<'LATEST' | 'OLDEST' | 'NAME' | 'MODIFIED'>(
    'LATEST'
  );
  const [currentFolderId, setCurrentFolderId] = useState<number>(0);
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('문서 유형');

  const { data: serverData, isLoading } = useFolderQuery(currentSort, currentFolderId);

  const sortMap = {
    LATEST: '최신순',
    OLDEST: '오래된순',
    NAME: '이름순',
    MODIFIED: '최근 수정일순',
  };

  const folders = serverData?.folders ?? [];
  const documents = serverData?.documents ?? [];
  const isDataEmpty = !isLoading && folders.length === 0 && documents.length === 0;

  const handleSort = (sortKey: keyof typeof sortMap) => {
    setCurrentSort(sortKey);
    setIsSortOpen(false);
  };

  const handleFolderClick = (id: number) => {
    setCurrentFolderId(id);
  };

  const handleDocumentClick = (docId: number) => {
    navigate({
      to: '/evaluate/$id',
      params: { id: String(docId) },
    });
  };

  const handleBookmarkToggle = (id: number) => {
    console.log(`${id}번 문서 즐겨찾기 토글 요청!`);
  };

  return (
    <div className="min-h-screen w-full bg-white px-20 pt-16">
      <div className="relative mb-12 flex justify-end gap-3">
        {/* 문서 유형 드롭다운 */}
        <div className="relative">
          <Button
            variant="normal"
            onClick={() => {
              setIsTypeOpen(!isTypeOpen);
              setIsSortOpen(false);
            }}
            className={cn(
              'flex h-[30px] w-[140px] items-center justify-between border px-3 text-[20px] transition-all duration-200',
              // 디자인에 따라 버튼 배경은 선택 여부와 상관없이 유지할지 결정 가능 (현재는 흰색 유지)
              'border-gray-200 bg-white text-gray-900'
            )}
          >
            <span>{selectedType}</span>
            <ChevronRight
              className={cn('h-4 w-4 transition-transform', isTypeOpen ? 'rotate-90' : '')}
            />
          </Button>

          {isTypeOpen && (
            <div className="absolute left-0 z-50 mt-1 w-full overflow-hidden rounded-md border border-gray-100 bg-white shadow-lg">
              {['일반문서', '공유문서'].map((opt) => {
                const isSelected = selectedType === opt;

                return (
                  <button
                    key={opt}
                    onClick={() => {
                      setSelectedType(opt);
                      setIsTypeOpen(false);
                    }}
                    className={cn(
                      'flex w-full items-center px-3 py-2 text-left text-[16px] transition-colors',
                      isSelected
                        ? 'bg-gray-300 text-gray-900'
                        : 'bg-white text-gray-900 hover:bg-gray-100'
                    )}
                  >
                    <span className={cn('mr-2 w-4 shrink-0', isSelected ? 'visible' : 'invisible')}>
                      ✓
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 정렬 드롭다운 */}
        <div className="relative">
          <Button
            variant="normal"
            onClick={() => {
              setIsSortOpen(!isSortOpen);
              setIsTypeOpen(false);
            }}
            className="flex h-[30px] w-[140px] items-center justify-between border border-gray-200 bg-white px-3 text-[20px]"
          >
            <span>{sortMap[currentSort]}</span>
            <ChevronRight
              className={cn('h-4 w-4 transition-transform', isSortOpen ? 'rotate-90' : '')}
            />
          </Button>
          {isSortOpen && (
            <div className="absolute right-0 z-50 mt-1 w-[160px] rounded-md border border-gray-100 bg-white shadow-lg">
              {(Object.entries(sortMap) as [keyof typeof sortMap, string][]).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => handleSort(key)}
                  className="w-full px-4 py-2 text-left text-[16px] hover:bg-gray-100"
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <main className="mx-auto grid min-h-[500px] max-w-[1400px] grid-cols-6 justify-items-center gap-x-10 gap-y-14">
        {!isLoading && currentFolderId !== 0 && (
          <button
            onClick={() => setCurrentFolderId(serverData?.parentId || 0)}
            className="col-span-6 mb-4 flex w-full items-center text-[18px] text-blue-500 hover:text-blue-700"
          >
            ← 상위 폴더로 이동
          </button>
        )}

        {folders.map((folder) => (
          <div
            key={`folder-${folder.id}`}
            onClick={() => handleFolderClick(folder.id)}
            className="cursor-pointer transition-transform hover:scale-105"
          >
            <LibraryDocument
              documentId={folder.id}
              itemType="folder"
              title={folder.name}
              date={folder.updatedAt?.split('T')[0] || '-'}
              isBookmarked={folder.bookmark}
              onBookmarkClick={handleBookmarkToggle}
            />
          </div>
        ))}

        {documents.map((doc) => (
          <div
            key={`doc-${doc.id}`}
            onClick={() => handleDocumentClick(doc.id)}
            className="cursor-pointer transition-transform hover:scale-105"
          >
            <LibraryDocument
              documentId={doc.id}
              itemType="document"
              title={doc.title}
              date={doc.updatedAt?.split('T')[0] || '-'}
              isBookmarked={doc.bookmark}
              onBookmarkClick={handleBookmarkToggle}
            />
          </div>
        ))}

        {isDataEmpty && (
          <div className="col-span-6 flex flex-col items-center py-40 text-gray-400">
            <p className="text-[20px] font-medium">아직 등록된 폴더나 문서가 없습니다.</p>
          </div>
        )}
      </main>
    </div>
  );
}
