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
import DocUploadModal from '@/components/modal/DocUploadModal';
import { useQueryClient } from '@tanstack/react-query';
import { useDocumentUpload } from '@/hooks/useDocumentUpload';

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
  onNavigate: (id: number) => void;
}

export function FolderBreadcrumb({ currentFolderId, onNavigate }: BreadcrumbProps) {
  const { data, isLoading } = useAllFolderQuery(currentFolderId);
  if (isLoading || !data) return <div className="h-6 animate-pulse rounded bg-gray-100" />;

  return (
    <div className="body-xlarge pl-5">
      <div className="flex flex-wrap items-center gap-y-2">
        {data.breadcrumb.map((item, index) => (
          <div key={item.id} className="flex items-center">
            <span
              className={cn(
                'text-large cursor-pointer transition-colors hover:text-black',
                index === data.breadcrumb.length - 1
                  ? 'font-bold text-gray-900'
                  : 'font-medium text-gray-400'
              )}
              onClick={() => onNavigate(item.id)}
            >
              {item.name}
            </span>
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
  const allSearch = Route.useSearch();
  const { selectedId, folderId, sort = 'LATEST' } = allSearch;

  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadMode, setUploadMode] = useState<'evaluate' | 'writing'>('evaluate');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'WRITING' | 'EVALUATED'>('ALL');

  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: serverData } = useFolderQuery(sort, folderId || 0);
  const { mutate: toggleBookmark } = useBookmarkMutation();
  const { mutate: createFolder } = useCreateFolderMutation();
  const { mutate: uploadDoc, isPending: isUploading } = useDocumentUpload();

  const addDropdown = useDropdown();
  const statusDropdown = useDropdown();
  const sortDropdown = useDropdown();
  const queryClient = useQueryClient();

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
        (navigate as any)({ search: (prev: any) => ({ ...prev, selectedId: docId }) });
        clickTimer.current = null;
      }, 250);
    }
  };

  const hasDocumentType = (folder: any, targetType: 'WRITING' | 'EVALUATED'): boolean => {
    const hasInDocs = folder.documents?.some((doc: any) =>
      targetType === 'WRITING' ? doc.status !== 'DONE' : doc.status === 'DONE'
    );
    if (hasInDocs) return true;
    return folder.childFolders?.some((child: any) => hasDocumentType(child, targetType)) ?? false;
  };

  const displayFolders = (serverData?.folders ?? []).filter((folder) => {
    if (selectedStatus === 'ALL') return true;
    return hasDocumentType(folder, selectedStatus);
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
    <div className="relative min-h-screen w-full overflow-x-hidden bg-white">
      {/* 내비게이션 영역 */}
      <div className="flex flex-col items-start gap-4 pt-10 pl-20">
        <FolderBreadcrumb currentFolderId={folderId || 0} onNavigate={handleNavigate} />
        {folderId !== undefined && folderId !== 0 && (
          <Link
            to="/library"
            search={(prev: any) => ({ ...prev, folderId: undefined, selectedId: undefined })}
            className="flex w-fit items-center gap-2 pl-5 opacity-50 transition-opacity hover:opacity-100"
          >
            <span className="text-2xl">📂↑</span>
            <span className="text-[14px] font-bold text-gray-500 underline underline-offset-4">
              홈으로
            </span>
          </Link>
        )}
      </div>

      <div
        className={cn('flex-1 px-20 pt-8 transition-all duration-300', selectedId ? 'mr-80' : '')}
      >
        {/* 필터 및 생성 영역 */}
        <div className="relative mb-12 flex justify-end gap-3">
          {/* ✅ 추가 기능 드롭다운 (다른 필터들과 같은 스타일) */}
          <div className="relative" ref={addDropdown.ref}>
            <Button
              variant="main" // 강조를 위해 색상을 다르게 할 수 있음
              onClick={addDropdown.toggle}
              className="flex h-[40px] w-[140px] items-center justify-between px-3"
            >
              <span className="font-bold">+ 추가하기</span>
              <ChevronRight
                className={cn(
                  'h-4 w-4 transition-transform',
                  addDropdown.isOpen ? 'rotate-90' : ''
                )}
              />
            </Button>
            {addDropdown.isOpen && (
              <div className="absolute right-0 z-50 mt-1 w-[180px] rounded-md border bg-white py-1 shadow-lg">
                <button
                  onClick={() => {
                    setIsFolderModalOpen(true);
                    addDropdown.close();
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-gray-100"
                >
                  📁 새 폴더 생성
                </button>
                <div className="my-1 h-[1px] bg-gray-100" />
                <button
                  onClick={() => {
                    setUploadMode('evaluate');
                    setIsUploadModalOpen(true);
                    addDropdown.close();
                  }}
                  className="text-primary-600 flex w-full items-center gap-2 px-4 py-2 text-left text-sm font-medium hover:bg-gray-100"
                >
                  🔍 문서 업로드 (평가)
                </button>
                <button
                  onClick={() => {
                    setUploadMode('writing');
                    setIsUploadModalOpen(true);
                    addDropdown.close();
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  ✍️ 문서 업로드 (작성)
                </button>
              </div>
            )}
          </div>

          {/* 기존 필터들 */}
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

        {/* 메인 리스트 */}
        <main className="mx-auto grid max-w-[1400px] grid-cols-6 justify-items-center gap-x-10 gap-y-14 px-4 pb-20">
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
                isBookmarked={doc.bookmark}
                documentId={doc.id}
                date={doc.updatedAt?.split('T')[0]}
                onBookmarkClick={(id) => {
                  toggleBookmark(id, {
                    onSuccess: (res: any) => {
                      const updatedStatus = res.data ? res.data.bookmark : res.bookmark;
                      queryClient.setQueryData(['folders', sort, folderId || 0], (oldData: any) => {
                        if (!oldData) return oldData;
                        const newDocs = oldData.documents.map((d: any) =>
                          d.id === id ? { ...d, bookmark: updatedStatus } : d
                        );
                        return { ...oldData, documents: newDocs };
                      });
                    },
                  });
                }}
              />
            </div>
          ))}
        </main>
      </div>

      {/* 우측 상세 정보창 (기존 코드와 동일) */}
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
            <div className="flex flex-1 items-center justify-center">정보를 불러오는 중...</div>
          ) : (
            <div className="space-y-6">
              <div className="flex h-48 w-full items-center justify-center rounded-xl bg-gray-50 text-6xl">
                📄
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-400">이름</label>
                  <p className="font-semibold text-gray-900">{selectedItem.title}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400">마지막 수정일</label>
                  <p className="text-sm text-gray-600">{selectedItem.updatedAt?.split('T')[0]}</p>
                </div>
              </div>
            </div>
          )}
        </aside>
      )}

      {/* 모달들 */}
      <FolderCreateModal
        isOpen={isFolderModalOpen}
        data={serverData ?? null}
        onClose={() => setIsFolderModalOpen(false)}
        onConfirm={(name, pId, color) =>
          createFolder(
            { name, parentId: pId || undefined, color },
            { onSuccess: () => setIsFolderModalOpen(false) }
          )
        }
      />
      <DocUploadModal
        isOpen={isUploadModalOpen}
        data={serverData ?? null}
        isLoading={isUploading}
        onClose={() => setIsUploadModalOpen(false)}
        onConfirm={(file, fId) => {
          if (file) uploadDoc({ file, folderId: fId, mode: uploadMode });
        }}
      />
    </div>
  );
}
