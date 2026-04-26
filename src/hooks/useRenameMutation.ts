import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/api/axios';

export function useUpdateFolderNameMutation(folderId?: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, newName }: { id: number; newName: string }) =>
      apiRequest({
        method: 'PATCH',
        url: `/api/v1/folders/${id}`,
        data: { name: newName },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      if (folderId) {
        queryClient.invalidateQueries({ queryKey: ['folders', folderId] });
      }
      console.log('폴더 이름 변경 성공');
    },
    onError: (error) => {
      console.error('폴더 수정 실패:', error);
    },
  });
}

export function useUpdateDocumentNameMutation(folderId?: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, newTitle }: { id: number; newTitle: string }) => {
      const detail: any = await apiRequest({ method: 'GET', url: `/api/v1/documents/${id}` });
      return apiRequest({
        method: 'PUT',
        url: `/api/v1/documents/${id}`,
        data: {
          title: newTitle,
          text: detail.data.text,
          paragraphs: detail.data.paragraphs,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      if (folderId) {
        queryClient.invalidateQueries({ queryKey: ['folders', folderId] });
      }
      console.log('문서 이름 변경 및 본문 보존 성공');
    },
    onError: (error) => {
      console.error('이름 변경 실패:', error);
      alert('이름 변경 중 오류가 발생했습니다.');
    },
  });
}
