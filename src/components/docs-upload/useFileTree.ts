import { useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';

/**
 * FileTree 컴포넌트에 필요한 상태와 네비게이션 로직을 캡슐화한 훅.
 *
 * - `selectedFolderId` / `onSelectFolder`: 업로드 목적지 폴더 (로컬 상태)
 * - `selectedDocumentId` / `onSelectDocument`: 현재 열람 문서 (search param `documentId`)
 *
 * 반환값을 FileTree에 그대로 spread해서 사용한다.
 *
 * @example 업로드 모달
 * ```tsx
 * const fileTree = useFileTree();
 * <FileTree {...fileTree} data={data} />
 * ```
 *
 * @example 왼쪽 사이드바 (문서 탐색)
 * ```tsx
 * const fileTree = useFileTree();
 * <FileTree {...fileTree} data={data} />
 * ```
 */
export function useFileTree() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false });

  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);

  const selectedDocumentId = search.documentId ?? null;

  const onSelectFolder = (folderId: number | null) => {
    setSelectedFolderId(folderId);
  };

  const onSelectDocument = (documentId: number) => {
    navigate({
      to: '.',
      search: (prev: Record<string, unknown>) => ({
        ...prev,
        documentId,
      }),
    });
  };

  return {
    selectedFolderId,
    onSelectFolder,
    selectedDocumentId,
    onSelectDocument,
  };
}
