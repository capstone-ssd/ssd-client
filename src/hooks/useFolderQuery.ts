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

export function useBookmarkMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: number) =>
      apiRequest<DocumentBookmarkResponse>({
        method: 'PATCH',
        // ✅ url 맨 앞에 '/'를 붙여보세요. (상대경로 vs 절대경로 문제)
        url: `/api/v1/documents/${documentId}/bookmark`,
      }),
    onSuccess: (res) => {
      console.log('진짜 북마크 상태:', res.bookmark);
      queryClient.invalidateQueries({
        queryKey: ['folders'],
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

// 2. 신규: 전체 구조 조회 (경로 추적용)
export function useAllFolderQuery(currentFolderId?: number) {
  return useQuery({
    queryKey: ['folders', 'all'],
    queryFn: () =>
      apiRequest<FolderContentResponse>({
        url: 'api/v1/folders/all', // 새로 발견한 API!
      }),
    // select를 활용해 데이터가 오자마자 현재 위치의 경로를 계산해버립니다.
    select: (data) => ({
      fullData: toLibraryData(data),
      breadcrumb: calculatePath(data.folders || [], currentFolderId ?? 0),
    }),
  });
}
