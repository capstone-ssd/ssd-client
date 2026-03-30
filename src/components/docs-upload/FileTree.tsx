import { Book05 } from '@/components/icons';
import { cn } from '@/utils/cn';
import DocumentRow from './DocumentRow';
import FolderRow from './FolderRow';
import type { LibraryData, FolderItem, DocumentItem } from './fileTreeTypes';

export type { FolderItem, DocumentItem, LibraryData } from './fileTreeTypes';

export interface FileTreeProps {
  /** 현재 선택된 폴더 ID. null이면 라이브러리 루트 선택 상태 */
  selectedFolderId: number | null;
  /** 폴더(또는 라이브러리 루트) 선택 시 호출되는 콜백 */
  onSelectFolder: (folderId: number | null) => void;
  /** 현재 활성화된 문서 ID. 해당 문서 행을 하이라이트한다. */
  selectedDocumentId?: number | null;
  /**
   * 문서 행 클릭 시 호출되는 콜백.
   * 제공되지 않으면 문서 행은 클릭 불가(div)로 렌더링된다.
   */
  onSelectDocument?: (documentId: number) => void;
  /** 부모 컴포넌트에서 fetch 후 전달하는 API 응답 데이터 */
  data: LibraryData | null;
  /** 로딩 상태 */
  isLoading?: boolean;
  /** 추가 클래스명 */
  className?: string;
}

function getRootFolders(folders: FolderItem[], rootParentId: number): FolderItem[] {
  return folders.filter((folder) => folder.parentId === rootParentId);
}

function getRootDocuments(documents: DocumentItem[], rootParentId: number): DocumentItem[] {
  return documents.filter((doc) => doc.folderId === rootParentId);
}

function SkeletonRows() {
  return (
    <div className="flex flex-col gap-1" aria-label="파일 목록 로딩 중" aria-busy="true">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-6 animate-pulse rounded bg-gray-100"
          style={{ width: `${60 + i * 10}%` }}
        />
      ))}
    </div>
  );
}

/**
 * FileTree
 *
 * 라이브러리의 폴더/문서 구조를 트리 형태로 표시하는 컴포넌트.
 *
 * **업로드 모달에서**: `onSelectFolder`로 업로드 목적지 폴더 선택
 * **왼쪽 사이드바에서**: `onSelectDocument`로 현재 열람 문서 전환
 *
 * @example
 * ```tsx
 * const fileTree = useFileTree();
 * <FileTree {...fileTree} data={data} />
 * ```
 */
export default function FileTree({
  selectedFolderId,
  onSelectFolder,
  selectedDocumentId,
  onSelectDocument,
  data,
  isLoading = false,
  className,
}: FileTreeProps) {
  const isLibrarySelected = selectedFolderId === null;

  const rootFolders = data != null ? getRootFolders(data.folders, data.parentId) : [];
  const rootDocuments = data != null ? getRootDocuments(data.documents, data.parentId) : [];
  const allFolders = data?.folders ?? [];
  const allDocuments = data?.documents ?? [];

  return (
    <div
      className={cn(
        'flex flex-col gap-0.5 rounded-lg border border-gray-400 bg-white px-5 py-4.5',
        className
      )}
      role="tree"
      aria-label="파일 트리"
      aria-multiselectable="false"
    >
      {/* 라이브러리 루트 행 */}
      <div role="treeitem" aria-selected={isLibrarySelected}>
        <button
          type="button"
          onClick={() => onSelectFolder(null)}
          className={cn(
            'flex h-6 w-full items-center gap-1 rounded',
            'transition-colors duration-150 hover:bg-gray-50',
            'focus-visible:ring-primary-400 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none'
          )}
          aria-label="라이브러리"
          aria-current={isLibrarySelected ? true : undefined}
        >
          <Book05 className="h-6 w-6 shrink-0 text-gray-800" aria-hidden="true" />
          <span className="body-xsmall text-gray-900">라이브러리</span>
        </button>
      </div>

      {/* 폴더 트리 본문 */}
      {isLoading ? (
        <SkeletonRows />
      ) : data == null ? (
        <p className="body-xsmall py-2 text-center text-gray-400">
          폴더 목록을 불러올 수 없습니다.
        </p>
      ) : rootFolders.length === 0 && rootDocuments.length === 0 ? (
        <p className="body-xsmall py-2 text-center text-gray-400">항목이 없습니다.</p>
      ) : (
        <ul className="flex flex-col gap-0.5" role="group">
          {rootFolders.map((folder) => (
            <FolderRow
              key={folder.id}
              folder={folder}
              allFolders={allFolders}
              allDocuments={allDocuments}
              depth={0}
              selectedFolderId={selectedFolderId}
              onSelectFolder={onSelectFolder}
              selectedDocumentId={selectedDocumentId}
              onSelectDocument={onSelectDocument}
            />
          ))}
          {rootDocuments.map((doc) => (
            <DocumentRow
              key={doc.id}
              document={doc}
              paddingLeft={26}
              isSelected={selectedDocumentId === doc.id}
              onSelect={onSelectDocument ? () => onSelectDocument(doc.id) : undefined}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
