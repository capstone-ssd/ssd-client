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

export function useFolderQuery() {
  return useQuery({
    queryKey: ['folders'],
    queryFn: () => apiRequest<FolderContentResponse>({ url: 'api/v1/folders' }),
    select: toLibraryData,
  });
}
