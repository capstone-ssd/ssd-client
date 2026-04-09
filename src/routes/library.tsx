import { useState, useRef } from 'react';
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import LibraryDocument from '@/components/common/LibDoc.tsx';
import Button from '@/components/common/Button';
import { ChevronRight } from '@/components/icons';
import {
  useFolderQuery,
  useBookmarkMutation,
  useCreateFolderMutation,
  useAllFolderQuery,
} from '@/hooks/useFolderQuery';
import { cn } from '@/utils/cn';
import { requireAuth } from '@/utils/authGuard';
import { useDropdown } from '@/hooks/useDropdown';
import FolderCreateModal from '@/components/modal/FolderCreateModal';

type LibrarySearch = {
  selectedId?: number;
  folderId?: number;
  sort?: 'LATEST' | 'OLDEST' | 'NAME' | 'MODIFIED';
  sidebar?: string;
  role?: string;
  blockId?: number;
  documentId?: number;
};

export const Route = createFileRoute('/library')({
  component: RouteComponent,
  beforeLoad: () => requireAuth(),
  validateSearch: (search: Record<string, unknown>): any => {
    return {
      selectedId: search.selectedId ? Number(search.selectedId) : undefined,
      folderId: search.folderId ? Number(search.folderId) : undefined,
      sort: (search.sort as any) || 'LATEST',
      sidebar: search.sidebar,
      role: search.role,
      blockId: search.blockId ? Number(search.blockId) : undefined,
      documentId: search.documentId ? Number(search.documentId) : undefined,
    } as LibrarySearch;
  },
});

interface BreadcrumbProps {
  currentFolderId: number;
  onNavigate: (id: number) => void; // 클릭 시 폴더 이동 함수
}

export function FolderBreadcrumb({ currentFolderId, onNavigate }: BreadcrumbProps) {
  // 우리가 만든 'all' 쿼리 호출!
  const { data, isLoading } = useAllFolderQuery(currentFolderId);

  if (isLoading || !data) return <div className="h-6 animate-pulse rounded bg-gray-100" />;

  return (
    // 1. 레이아웃(좌우 여백)은 .body-xlarge로 유지해서 다른 요소들과 줄을 맞춥니다.
    <div className="body-xlarge mb-6 pt-2 pl-5">
      <div className="flex flex-wrap items-center gap-y-2">
        {data.breadcrumb.map((item, index) => (
          <div key={item.id} className="flex items-center">
            <span
              className={cn(
                'cursor-pointer transition-colors hover:text-black',
                // ✅ 핵심: 경로 텍스트에만 .text-xlarge를 적용합니다.
                'text-large',
                index === data.breadcrumb.length - 1
                  ? 'font-bold text-gray-900'
                  : 'font-medium text-gray-400'
              )}
              onClick={() => onNavigate(item.id)}
            >
              {item.name}
            </span>

            {/* 화살표도 글자 크기에 맞춰서 살짝 존재감 있게 조정 */}
            {index < data.breadcrumb.length - 1 && (
              <ChevronRight className="mx-2 h-5 w-5 text-gray-300" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RouteComponent() {
  const navigate = useNavigate();
  const allSearch = Route.useSearch(); // ✅ 상단에서 한 번만 선언
  const { selectedId, folderId, sort = 'LATEST' } = allSearch;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'WRITING' | 'EVALUATED'>('ALL');

  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: serverData } = useFolderQuery(sort, folderId || 0);
  const { mutate: toggleBookmark } = useBookmarkMutation();
  const { mutate: createFolder } = useCreateFolderMutation();

  const statusDropdown = useDropdown();
  const sortDropdown = useDropdown();

  const statusMap = { ALL: '전체 문서', WRITING: '작성 문서', EVALUATED: '평가 문서' };
  const sortMap = {
    LATEST: '최신순',
    OLDEST: '오래된순',
    NAME: '이름순',
    MODIFIED: '최근 수정일순',
  };

  const hasSelectedId = selectedId !== undefined;
  const selectedItem = serverData?.documents?.find((doc) => doc.id === selectedId) || null;

  const handleDocumentClick = (docId: number) => {
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
      navigate({ to: '/evaluate/$id', params: { id: String(docId) } });
    } else {
      clickTimer.current = setTimeout(() => {
        (navigate as any)({
          search: (prev: any) => ({ ...prev, selectedId: docId }),
        });
        clickTimer.current = null;
      }, 250);
    }
  };

  const displayFolders = (serverData?.folders ?? []).filter((folder) => {
    if (selectedStatus === 'ALL') return true;
    if (selectedStatus === 'WRITING') return folder.color === '#EF4444';
    if (selectedStatus === 'EVALUATED') return folder.color === '#3B82F6';
    return true;
  });

  const displayDocuments = serverData?.documents ?? [];

  const handleNavigate = (id: number) => {
    (navigate as any)({
      search: (prev: any) => ({
        ...prev,
        folderId: id === 0 ? undefined : id,
        selectedId: undefined,
      }),
    });
  };

  return (
    <div className="relative flex min-h-screen w-full overflow-x-hidden bg-white">
      <div className="text-xlarge mb-10 justify-start">
        <FolderBreadcrumb currentFolderId={folderId || 0} onNavigate={handleNavigate} />
      </div>

      <div
        className={cn('flex-1 px-20 pt-16 transition-all duration-300', selectedId ? 'mr-80' : '')}
      >
        <div className="relative mb-12 flex justify-end gap-3">
          {/* 필터 영역 생략 (기존과 동일) */}
          <div className="relative" ref={statusDropdown.ref}>
            <Button
              variant="normal"
              onClick={statusDropdown.toggle}
              className="flex h-[40px] w-[140px] items-center justify-between border border-gray-200 bg-white px-3"
            >
              <span>{statusMap[selectedStatus]}</span>
              <ChevronRight
                className={cn(
                  'h-4 w-4 transition-transform',
                  statusDropdown.isOpen ? 'rotate-90' : ''
                )}
              />
            </Button>
            {statusDropdown.isOpen && (
              <div className="absolute right-0 z-50 mt-1 w-[140px] rounded-md border bg-white shadow-lg">
                {Object.entries(statusMap).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedStatus(key as any);
                      statusDropdown.close();
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-gray-100"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative" ref={sortDropdown.ref}>
            <Button
              variant="normal"
              onClick={sortDropdown.toggle}
              className="flex h-[40px] w-[140px] items-center justify-between border border-gray-200 bg-white px-3"
            >
              <span>{sortMap[sort as keyof typeof sortMap]}</span>
              <ChevronRight
                className={cn(
                  'h-4 w-4 transition-transform',
                  sortDropdown.isOpen ? 'rotate-90' : ''
                )}
              />
            </Button>
            {sortDropdown.isOpen && (
              <div className="absolute right-0 z-50 mt-1 w-[140px] rounded-md border bg-white shadow-lg">
                {Object.entries(sortMap).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => {
                      (navigate as any)({ search: (prev: any) => ({ ...prev, sort: key }) });
                      sortDropdown.close();
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-gray-100"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <main className="mx-auto grid max-w-[1400px] grid-cols-6 justify-items-center gap-x-10 gap-y-14 px-4 pb-20">
          {folderId !== undefined && folderId !== 0 && (
            <Link
              to="/library"
              search={(prev: any) => ({ ...prev, folderId: undefined, selectedId: undefined })}
              className="justift-start flex cursor-pointer flex-col items-center opacity-50 hover:opacity-100"
            >
              <div className="text-4xl">📂↑</div>
              <span className="mt-2 text-[14px] font-bold text-gray-500">홈으로</span>
            </Link>
          )}

          {/* 📂 폴더 렌더링 */}
          {displayFolders.map((folder) => (
            <Link
              key={`folder-${folder.id}`}
              to="/library"
              search={(prev: any) => ({ ...prev, folderId: folder.id, selectedId: undefined })}
              className="cursor-pointer"
            >
              <LibraryDocument
                itemType="folder"
                documentId={folder.id}
                title={folder.name}
                date={folder.updatedAt?.split('T')[0]}
                folderColor={folder.color}
              />
            </Link>
          ))}

          {displayDocuments.map((doc) => (
            <div
              key={`doc-${doc.id}`}
              onClick={() => handleDocumentClick(doc.id)}
              className="cursor-pointer"
            >
              <LibraryDocument
                itemType="document"
                title={doc.title}
                documentId={doc.id}
                date={doc.updatedAt?.split('T')[0]}
                isBookmarked={doc.bookmark}
                onBookmarkClick={() => toggleBookmark(doc.id)}
              />
            </div>
          ))}
        </main>
      </div>

      {hasSelectedId && (
        <aside className="fixed top-0 right-0 z-[9999] flex h-full w-80 flex-col border-l border-gray-200 bg-white p-6 pt-24 shadow-2xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">상세 정보</h2>
            <Link
              to="/library"
              search={(prev: any) => ({ ...prev, selectedId: undefined })}
              className="text-2xl text-gray-400 hover:text-black"
            >
              ✕
            </Link>
          </div>
          {!selectedItem ? (
            <div className="flex flex-1 items-center justify-center text-gray-400">
              정보를 불러오는 중...
            </div>
          ) : (
            <div className="space-y-6 text-left">
              <div className="flex h-48 w-full items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 text-6xl">
                📄
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">이름</label>
                  <p className="mt-1 text-lg font-semibold break-all text-gray-900">
                    {selectedItem.title}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">마지막 수정일</label>
                  <p className="mt-1 text-sm text-gray-600">
                    {selectedItem.updatedAt?.split('T')[0]}
                  </p>
                </div>
              </div>
            </div>
          )}
        </aside>
      )}

      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed right-10 bottom-10 z-40 h-16 w-16 rounded-full bg-gray-900 text-3xl text-white shadow-2xl hover:scale-110 active:scale-95"
      >
        +
      </button>
      <FolderCreateModal
        isOpen={isModalOpen}
        data={serverData ?? null}
        onClose={() => setIsModalOpen(false)}
        onConfirm={(name, pId, color) =>
          createFolder(
            { name, parentId: pId || undefined, color },
            { onSuccess: () => setIsModalOpen(false) }
          )
        }
      />
    </div>
  );
}
