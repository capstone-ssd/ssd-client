import { useState, useEffect, useRef } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import LibraryDocument from '@/components/common/LibDoc.tsx';
import Button from '@/components/common/Button';
import { ChevronRight } from '@/components/icons';
import { useFolderQuery, useBookmarkMutation } from '@/hooks/useFolderQuery';
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

  // ✅ 상세 정보 사이드바 및 클릭 제어 상태
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const [selectedType, setSelectedType] = useState('일반문서');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'WRITING' | 'EVALUATED'>('ALL');

  const typeRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  const { data: serverData } = useFolderQuery(currentSort, currentFolderId);
  const { mutate: toggleBookmark } = useBookmarkMutation();

  // ✅ 클릭 로직: 단일 클릭은 사이드바, 더블 클릭은 진입
  const handleItemClick = (item: any, isFolder: boolean) => {
    if (clickTimer.current) {
      // 더블 클릭 발생
      clearTimeout(clickTimer.current);
      clickTimer.current = null;

      if (isFolder) {
        setCurrentFolderId(item.id);
        setSelectedItem(null); // 폴더 진입 시 사이드바 닫기
      } else {
        navigate({ to: '/evaluate/$id', params: { id: String(item.id) } });
      }
    } else {
      // 단일 클릭 대기
      clickTimer.current = setTimeout(() => {
        setSelectedItem(item); // 사이드바에 정보 표시
        clickTimer.current = null;
      }, 250);
    }
  };

  const sortMap = {
    LATEST: '최신순',
    OLDEST: '오래된순',
    NAME: '이름순',
    MODIFIED: '최근 수정일순',
  };
  const statusMap = {
    ALL: '전체 문서',
    WRITING: '작성 문서',
    EVALUATED: '평가 문서',
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (typeRef.current && !typeRef.current.contains(target)) setIsTypeOpen(false);
      if (sortRef.current && !sortRef.current.contains(target)) setIsSortOpen(false);
      if (statusRef.current && !statusRef.current.contains(target)) setIsStatusOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ✅ 데이터 가공: 최상위(0)일 때는 기본 폴더 2개만 노출
  const displayFolders =
    currentFolderId === 0
      ? [
          { id: 1001, name: '작성 폴더', updatedAt: new Date().toISOString() },
          { id: 1002, name: '평가 폴더', updatedAt: new Date().toISOString() },
        ]
      : (serverData?.folders ?? []);

  const displayDocuments = currentFolderId === 0 ? [] : (serverData?.documents ?? []);

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* 메인 영역 */}
      <div className={cn('flex-1 px-20 pt-16 transition-all', selectedItem ? 'mr-80' : '')}>
        <div className="relative mb-12 flex justify-end gap-3">
          {/* 정렬 드롭다운 (최상위가 아닐 때만 의미 있음) */}
          <div className="relative" ref={sortRef}>
            <Button
              variant="normal"
              onClick={() => {
                setIsSortOpen(!isSortOpen);
                setIsTypeOpen(false);
                setIsStatusOpen(false);
              }}
              className="flex h-[40px] w-[140px] items-center justify-between border border-gray-200 bg-white px-3 text-[20px] text-gray-900"
            >
              <span>{sortMap[currentSort]}</span>
              <ChevronRight
                className={cn('h-4 w-4 transition-transform', isSortOpen ? 'rotate-90' : '')}
              />
            </Button>
            {isSortOpen && (
              <div className="absolute right-0 z-50 mt-1 w-[160px] rounded-md border border-gray-100 bg-white shadow-lg">
                {(Object.entries(sortMap) as [keyof typeof sortMap, string][]).map(
                  ([key, label]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setCurrentSort(key);
                        setIsSortOpen(false);
                      }}
                      className={cn(
                        'flex w-full items-center px-3 py-2 text-left text-[16px]',
                        currentSort === key ? 'bg-gray-300' : 'hover:bg-gray-100'
                      )}
                    >
                      {label}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        <main className="mx-auto grid max-w-[1400px] grid-cols-6 justify-items-center gap-x-10 gap-y-14 px-4">
          {/* 뒤로가기 (상위 폴더 이동) */}
          {currentFolderId !== 0 && (
            <div
              onClick={() => setCurrentFolderId(0)}
              className="flex cursor-pointer flex-col items-center opacity-50 hover:opacity-100"
            >
              <div className="text-4xl">📂↑</div>
              <span className="mt-2 text-sm">상위 폴더</span>
            </div>
          )}

          {displayFolders.map((folder) => (
            <div
              key={`folder-${folder.id}`}
              onClick={() => handleItemClick(folder, true)}
              className="cursor-pointer"
            >
              <LibraryDocument
                documentId={folder.id}
                itemType="folder"
                title={folder.name}
                date={folder.updatedAt?.split('T')[0] || '-'}
              />
            </div>
          ))}

          {displayDocuments.map((doc) => (
            <div
              key={`doc-${doc.id}`}
              onClick={() => handleItemClick(doc, false)}
              className="cursor-pointer"
            >
              <LibraryDocument
                documentId={doc.id}
                itemType="document"
                title={doc.title}
                date={doc.updatedAt?.split('T')[0] || '-'}
                isBookmarked={doc.bookmark}
                onBookmarkClick={(id) => toggleBookmark(id)}
              />
            </div>
          ))}
        </main>
      </div>

      {/* ✅ 상세 정보 사이드바 */}
      {selectedItem && (
        <aside className="fixed top-0 right-0 h-full w-80 border-l border-gray-200 bg-gray-50 p-6 pt-24 shadow-xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold">상세 정보</h2>
            <button
              onClick={() => setSelectedItem(null)}
              className="text-gray-400 hover:text-black"
            >
              ✕
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex h-40 items-center justify-center rounded-md border border-gray-200 bg-white">
              {selectedItem.title ? '📄 문서 아이콘' : '📂 폴더 아이콘'}
            </div>
            <p>
              <strong>이름:</strong> {selectedItem.name || selectedItem.title}
            </p>
            <p>
              <strong>수정일:</strong> {selectedItem.updatedAt?.split('T')[0]}
            </p>
            <div className="mt-8 rounded-lg bg-blue-50 p-4 text-sm text-blue-600">
              💡 항목을 <strong>더블 클릭</strong>하면 해당 위치로 이동하거나 파일을 엽니다.
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
