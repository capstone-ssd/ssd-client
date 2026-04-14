import { useState } from 'react';
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import LibraryDocument from '@/components/common/LibDoc.tsx';
import Button from '@/components/common/Button';
import { ChevronRight } from '@/components/icons';
import { ChevronDown } from '@/components/icons';
import { Plus } from '@/components/icons';

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
  if (isLoading || !data) return <div className="h-6 rounded bg-gray-100" />;

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
              <ChevronRight className="mx-5 h-5 w-5 text-gray-300" />
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
  const { folderId, sort = 'LATEST' } = allSearch;

  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadMode, setUploadMode] = useState<'evaluate' | 'writing'>('evaluate');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'WRITING' | 'EVALUATED'>('ALL');

  const { data: serverData } = useFolderQuery(sort, folderId || 0);
  const { mutate: toggleBookmark } = useBookmarkMutation(sort as string, folderId || 0);
  const { mutate: createFolder } = useCreateFolderMutation();
  const { mutate: uploadDoc, isPending: isUploading } = useDocumentUpload();

  const addDropdown = useDropdown();
  const statusDropdown = useDropdown();
  const sortDropdown = useDropdown();
  const queryClient = useQueryClient();

  const FOLDER_THEME = {
    WRITING: 'var(--color-primary-500)',
    EVALUATED: 'var(--color-secondary-200)',
  };

  const createFolderMap = {
    FOLDER: '새 폴더',
    WRITE: '새 파일 (작성)',
    EVALUATE: '새 파일 (평가)',
  };
  const statusMap = { ALL: '전체 문서', WRITING: '작성 문서', EVALUATED: '평가 문서' };
  const sortMap = {
    LATEST: '최신순',
    OLDEST: '오래된순',
    NAME: '이름순',
    MODIFIED: '최근 수정일순',
  };

  const handleDocumentClick = (docId: number) => {
    if (uploadMode === 'writing') {
      navigate({ to: '/write/$id', params: { id: String(docId) } });
    } else {
      navigate({ to: '/evaluate/$id', params: { id: String(docId) } });
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

    if (selectedStatus === 'WRITING') {
      return folder.color === FOLDER_THEME.WRITING;
    }

    if (selectedStatus === 'EVALUATED') {
      return folder.color === FOLDER_THEME.EVALUATED;
    }

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
    <div className="relative min-h-screen w-full overflow-x-hidden bg-white">
      <div className="flex flex-col items-start gap-4 pt-3 pl-5">
        <FolderBreadcrumb currentFolderId={folderId || 0} onNavigate={handleNavigate} />
      </div>

      <div className="flex-1 px-20 pt-8">
        {/* 필터 및 생성 영역 */}
        <div className="relative mb-12 flex justify-end gap-3">
          {/* 1. 상태 필터 */}
          <div className="relative" ref={statusDropdown.ref}>
            <Button
              variant="normal"
              onClick={statusDropdown.toggle}
              className="flex h-[40px] w-[140px] items-center justify-between border border-gray-200 bg-white px-2"
            >
              <span className="text-[20px] leading-none text-gray-900">
                {statusMap[selectedStatus]}
              </span>
              <ChevronDown className="h-5 w-5 transition-transform" />
            </Button>
            {statusDropdown.isOpen && (
              <div className="absolute right-0 z-50 mt-1 w-[140px] rounded-md border bg-white py-1 shadow-lg">
                {Object.entries(statusMap).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedStatus(key as any);
                      statusDropdown.close();
                    }}
                    className="w-full px-3 py-2 text-left text-[16px] hover:bg-gray-100"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. 정렬 필터 */}
          <div className="relative" ref={sortDropdown.ref}>
            <Button
              variant="normal"
              onClick={sortDropdown.toggle}
              className="flex h-[40px] w-[140px] items-center justify-between border border-gray-200 bg-white px-2"
            >
              <span className="text-[20px] leading-none text-gray-900">
                {sortMap[sort as keyof typeof sortMap]}
              </span>
              <ChevronDown className="h-5 w-5 transition-transform" />
            </Button>
            {sortDropdown.isOpen && (
              <div className="absolute right-0 z-50 mt-1 w-[140px] rounded-md border bg-white py-1 shadow-lg">
                {Object.entries(sortMap).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => {
                      (navigate as any)({ search: (prev: any) => ({ ...prev, sort: key }) });
                      sortDropdown.close();
                    }}
                    className="w-full px-3 py-2 text-left text-[16px] hover:bg-gray-100"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 3. 새로만들기 */}
          <div className="relative" ref={addDropdown.ref}>
            <Button
              variant="normal"
              onClick={addDropdown.toggle}
              className="flex h-[40px] w-[140px] items-center justify-between border border-gray-200 bg-white px-2"
            >
              <span className="text-[20px] leading-none text-gray-900">새로만들기</span>
              <Plus
                className={cn(
                  'h-5 w-5 transition-transform',
                  addDropdown.isOpen ? 'rotate-90' : ''
                )}
              />
            </Button>
            {addDropdown.isOpen && (
              <div className="absolute right-0 z-50 mt-1 w-[140px] rounded-md border bg-white py-1 shadow-lg">
                {Object.entries(createFolderMap).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => {
                      if (key === 'FOLDER') setIsFolderModalOpen(true);
                      if (key === 'WRITE') {
                        setUploadMode('writing');
                        setIsUploadModalOpen(true);
                      }
                      if (key === 'EVALUATE') {
                        setUploadMode('evaluate');
                        setIsUploadModalOpen(true);
                      }
                      addDropdown.close();
                    }}
                    className="w-full px-3 py-2 text-left text-[16px] leading-tight text-gray-700 hover:bg-gray-100"
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
                  toggleBookmark(id);
                }}
              />
            </div>
          ))}
        </main>
      </div>

      <FolderCreateModal
        isOpen={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        onConfirm={(name, color) =>
          createFolder(
            { name, parentId: folderId || undefined, color },
            {
              onSuccess: () => {
                setIsFolderModalOpen(false);
                queryClient.invalidateQueries({ queryKey: ['folders'] });
              },
            }
          )
        }
      />
      <DocUploadModal
        isOpen={isUploadModalOpen}
        data={serverData ?? null}
        isLoading={isUploading}
        onClose={() => setIsUploadModalOpen(false)}
        onConfirm={(file, fId) => {
          if (file) {
            uploadDoc({
              file,
              folderId: fId || folderId || null,
              mode: uploadMode,
            });
          }
        }}
      />
    </div>
  );
}
