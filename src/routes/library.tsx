import { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import LibraryDocument from '@/components/common/LibDoc.tsx';
import Button from '@/components/common/Button';
import { ChevronRight } from '@/components/icons';
import { useFolderQuery } from '@/hooks/useFolderQuery';
import { cn } from '@/utils/cn';
//import { requireAuth } from '@/utils/authGuard';

export const Route = createFileRoute('/library')({
  component: RouteComponent,
  //beforeLoad: () => requireAuth(),
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

  const { data: serverData } = useFolderQuery(currentSort, currentFolderId);

  const sortMap = {
    LATEST: '최신순',
    OLDEST: '오래된순',
    NAME: '이름순',
    MODIFIED: '최근 수정일순',
  };

  const folders = serverData?.folders ?? [];
  const documents = serverData?.documents ?? [];

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
    console.log(`${id}번 즐겨찾기 요청`); // api 추가 필요
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
            className="flex h-[40px] w-[140px] items-center justify-between border border-gray-200 bg-white px-3 text-[20px] text-gray-900"
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
              {(Object.entries(sortMap) as [keyof typeof sortMap, string][]).map(([key, label]) => {
                const isSelected = currentSort === key;

                return (
                  <button
                    key={key}
                    onClick={() => handleSort(key)}
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
                    {label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <main className="mx-auto grid max-w-[1400px] grid-cols-6 justify-items-center gap-x-10 gap-y-14 px-4">
        {folders.map((folder) => (
          <div
            key={`folder-${folder.id}`}
            onClick={() => handleFolderClick(folder.id)}
            className="cursor-pointer"
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
            className="cursor-pointer"
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
      </main>
    </div>
  );
}
