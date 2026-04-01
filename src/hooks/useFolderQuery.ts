import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/api/axios';
import type { FolderContentResponse, DocumentBookmarkResponse } from '@/api/api';
import type { LibraryData } from '@/components/docs-upload/fileTreeTypes';

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

export function useFolderQuery(
  sort: string = 'LATEST',
  folderId?: number,
  type: string = 'NORMAL', // '일반문서'(NORMAL), '공유문서'(SHARED) 등
  status: string = 'ALL' // '전체'(ALL), '작성중'(WRITING) 등
) {
  return useQuery({
    // ✅ 중요: queryKey에 모든 필터 조건을 넣어야 값이 바뀔 때마다 새로 불러옵니다!
    queryKey: ['folders', sort, folderId, type, status],
    queryFn: () =>
      apiRequest<FolderContentResponse>({
        url: 'api/v1/folders',
        params: {
          sort,
          parentId: folderId,
          type, // 서버 API 명세에 맞춰 키값 확인 필요
          status, // 서버 API 명세에 맞춰 키값 확인 필요
        },
      }),
    select: toLibraryData,
    // ... 생략
  });
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
        method: 'POST',
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
