import type { FolderContentResponse } from '@/api/api';
import type { LibraryData } from '@/components/docs-upload/fileTreeTypes';

export function toLibraryData(res: FolderContentResponse): LibraryData {
  return {
    parentId: res.parentId ?? 0,
    folders: (res.folders ?? []).map((f) => ({
      id: f.id ?? 0,
      name: f.name ?? '',
      color: f.color ?? '',
      parentId: f.parentId ?? 0,
      updatedAt: f.updatedAt ?? '',
    })),
    documents: (res.documents ?? []).map((d: any) => ({
      id: d.id ?? 0,
      title: d.title ?? '',
      folderId: d.folderId ?? 0,
      updatedAt: d.updatedAt ?? '',
      bookmark: d.bookmark ?? d.isBookmarked ?? d.isBookmark ?? false,
    })),
  };
}

export function calculatePath(folders: any[], targetId: number) {
  if (!targetId || targetId === 0) return [{ id: 0, name: '라이브러리' }];

  const folderMap = new Map(folders.map((f) => [f.id, f]));
  const path = [];
  let currentId = targetId;

  while (currentId !== 0) {
    const folder = folderMap.get(currentId);
    if (!folder) break;
    path.unshift({ id: folder.id, name: folder.name });
    currentId = folder.parentId;
  }

  return [{ id: 0, name: '라이브러리' }, ...path];
}
