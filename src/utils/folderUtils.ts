import type { FolderContentResponse } from '@/api/api';
import type { LibraryData } from '@/components/docs-upload/fileTreeTypes';

export function toLibraryData(res: FolderContentResponse): LibraryData {
  return {
    parentId: res.parentId ?? 0,
    folders: (res.folders ?? []).map((f) => {
      let status: 'writing' | 'evaluate' | undefined;

      if (f.color === 'primary-500') {
        status = 'writing';
      } else if (f.color === 'secondary-200') {
        status = 'evaluate';
      }
      // 일단 색상으로 폴더 유형 구별 가능하게 만들었는데, 나중에 시간 더 남으면 api에 폴더 status도 추가하는게 장기적으론 좋을 거 같습니다!

      return {
        id: f.id ?? 0,
        name: f.name ?? '',
        color: f.color || '',
        status: status,
        parentId: f.parentId ?? 0,
        updatedAt: f.updatedAt ?? '',
      };
    }),
    documents: (res.documents ?? []).map((d: any) => ({
      id: d.id ?? 0,
      title: d.title ?? '',
      folderId: d.folderId ?? 0,
      updatedAt: d.updatedAt ?? '',
      bookmark: d.bookmark ?? d.isBookmarked ?? d.isBookmark ?? false,
      purpose: d.purpose,
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
