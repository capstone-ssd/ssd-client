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
      bookmark: (f as any).bookmark ?? false,
    })),
    documents: (res.documents ?? []).map((d) => ({
      id: d.id ?? 0,
      title: d.title ?? '',
      folderId: d.folderId ?? 0,
      updatedAt: d.updatedAt ?? '',
      bookmark: (d as any).bookmark ?? false,
    })),
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
