import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/api/axios';
import type { FolderContentResponse } from '@/api/api';
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
    })),
  };
}

// 1. sort 인자를 받도록 수정 (기본값 LATEST)
export function useFolderQuery(sort: string = 'LATEST') {
  return useQuery({
    // 2. queryKey에 sort를 추가해야 정렬이 바뀔 때마다 API를 새로 쏩니다!
    queryKey: ['folders', sort],
    // 3. url 뒤에 쿼리 스트링(?sort=...)을 붙여줍니다.
    queryFn: () =>
      apiRequest<FolderContentResponse>({
        url: `api/v1/folders?sort=${sort}`,
      }),
    select: toLibraryData,
  });
}
