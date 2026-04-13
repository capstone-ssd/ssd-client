import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/api/axios';
import type { FolderContentResponse, DocumentBookmarkResponse } from '@/api/api';
import type { CreateFolderRequest } from '@/api/api';
import { toLibraryData, calculatePath } from '@/utils/folderUtils';

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
