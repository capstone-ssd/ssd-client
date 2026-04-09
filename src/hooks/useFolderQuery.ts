import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/api/axios';
import type { FolderContentResponse, DocumentBookmarkResponse } from '@/api/api';
import type { LibraryData } from '@/components/docs-upload/fileTreeTypes';
import type { CreateFolderRequest } from '@/api/api';

function toLibraryData(res: FolderContentResponse): LibraryData {
  return {
    parentId: res.parentId ?? 0,
    folders: (res.folders ?? []).map((f) => ({
      id: f.id ?? 0,
      name: f.name ?? '',
      color: f.color ?? '',
      parentId: f.parentId ?? 0,
      updatedAt: f.updatedAt ?? '',
    })),
    documents: (res.documents ?? []).map((d) => ({
      id: d.id ?? 0,
      title: d.title ?? '',
      folderId: d.folderId ?? 0,
      updatedAt: d.updatedAt ?? '',
      bookmark: false,
    })),
  };
}

function toBookmarked(res: DocumentBookmarkResponse) {
  return {
    documentId: res.id ?? 0,
    isBookmarked: res.bookmark ?? false,
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

export function useBookmarkMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: number) =>
      apiRequest<DocumentBookmarkResponse>({
        method: 'PATCH',
        url: `api/v1/documents/${documentId}/bookmark`,
      }),
    onSuccess: (data) => {
      const { documentId, isBookmarked } = toBookmarked(data);

      queryClient.setQueriesData({ queryKey: ['folders'] }, (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          documents: oldData.documents.map((doc: any) =>
            doc.id === documentId ? { ...doc, bookmark: isBookmarked } : doc
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
        data: data, // 이제 color가 포함되어도 에러가 안 납니다.
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
  });
}
