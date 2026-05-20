import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/api/axios';
import type { FolderContentResponse, DocumentBookmarkResponse } from '@/api/api';
import type { CreateFolderRequest } from '@/api/api';
import { toLibraryData, calculatePath } from '@/utils/folderUtils';

interface MoveDocumentRequest {
  documentId: number;
  targetFolderId: number;
}

interface MoveDocumentResponse {
  code: string;
  msg: string;
  data: {
    documentId: number;
    folderId: number | null; // 루트면 null
  };
}

export function useFolderQuery(sort: string = 'LATEST', folderId?: number) {
  return useQuery({
    queryKey: ['folders', sort, folderId],
    queryFn: () =>
      apiRequest<FolderContentResponse>({
        url: 'api/v1/folders',
        params: {
          sort,
          parentId: folderId,
        },
      }),
    select: toLibraryData,
  });
}

export function useBookmarkMutation(sort: string = 'LATEST', folderId: number = 0) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: number) =>
      apiRequest<DocumentBookmarkResponse>({
        method: 'PATCH',
        url: `/api/v1/documents/${documentId}/bookmark`,
      }),
    onSuccess: (res, documentId) => {
      const updatedStatus = res.bookmark;
      queryClient.setQueryData(['folders', sort, folderId], (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          documents: oldData.documents.map((d: any) =>
            d.id === documentId ? { ...d, bookmark: updatedStatus } : d
          ),
        };
      });
    },
  });
}
export function useCreateFolderMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFolderRequest) =>
      apiRequest({
        method: 'POST',
        url: 'api/v1/folders',
        data: data,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
  });
}

export function useAllFolderQuery(currentFolderId?: number) {
  return useQuery({
    queryKey: ['folders', 'all'],
    queryFn: () =>
      apiRequest<FolderContentResponse>({
        url: 'api/v1/folders/all',
      }),
    select: (data) => ({
      fullData: toLibraryData(data),
      breadcrumb: calculatePath(data.folders || [], currentFolderId ?? 0),
    }),
  });
}

export function useMoveFolderMutation(sort: string = 'LATEST', currentFolderId: number = 0) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ folderId, targetFolderId }: { folderId: number; targetFolderId: number }) =>
      apiRequest({
        method: 'PATCH',
        url: `api/v1/folders/${folderId}`,
        data: {
          parentId: targetFolderId === 0 ? 0 : targetFolderId,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders', sort, currentFolderId] });
      queryClient.invalidateQueries({ queryKey: ['folders', 'all'] });
    },
  });
}

export function useMoveDocumentMutation(sort: string = 'LATEST', currentFolderId: number = 0) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ documentId, targetFolderId }: MoveDocumentRequest) =>
      apiRequest<MoveDocumentResponse>({
        method: 'PATCH',
        url: `/api/v1/documents/${documentId}/folder`,
        data: {
          folderId: targetFolderId,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders', sort, currentFolderId] });
      queryClient.invalidateQueries({ queryKey: ['folders', 'all'] });
    },
    onError: (error) => {
      console.error('문서 이동 실패:', error);
      alert('문서를 이동하는 중 오류가 발생했습니다.');
    },
  });
}
