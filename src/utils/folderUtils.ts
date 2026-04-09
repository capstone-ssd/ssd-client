import type { FolderContentResponse } from '@/api/api';
import type { LibraryData } from '@/components/docs-upload/fileTreeTypes';


// 기존에 있던 변환 로직
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
    documents: (res.documents ?? []).map((d) => ({
      id: d.id ?? 0,
      title: d.title ?? '',
      folderId: d.folderId ?? 0,
      updatedAt: d.updatedAt ?? '',
      bookmark: false,
    })),
  };
}

// [추가] 경로(Breadcrumb) 계산 로직
export function calculatePath(folders: any[], targetId: number) {
  if (!targetId || targetId === 0) return [{ id: 0, name: '루트' }];

  const folderMap = new Map(folders.map((f) => [f.id, f]));
  const path = [];
  let currentId = targetId;

  while (currentId !== 0) {
    const folder = folderMap.get(currentId);
    if (!folder) break;
    path.unshift({ id: folder.id, name: folder.name });
    currentId = folder.parentId;
  }

  return [{ id: 0, name: '루트' }, ...path];
}
