// hooks/useDeleteDocument.ts (또는 해당 훅이 정의된 파일)

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/api/axios';

export function useDeleteLibraryItemMutation(folderId?: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, type }: { id: number; type: 'folder' | 'document' }) => {
      const url = type === 'folder' ? `/api/v1/folders/${id}` : `/api/v1/documents/${id}`;

      return apiRequest({
        method: 'DELETE',
        url: url,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });

      if (folderId) {
        queryClient.invalidateQueries({ queryKey: ['folders', folderId] });
      }

      console.log('삭제 성공 및 캐시 갱신 완료');
    },
    onError: (error) => {
      console.error('삭제 실패:', error);
      alert('삭제 중 오류가 발생했습니다.');
    },
  });
}
