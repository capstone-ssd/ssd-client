import { useState } from 'react';
import { useParams } from '@tanstack/react-router';
import { BookmarkItem } from '@/components/accordion';
import { useSidebarNavigation } from '@/hooks/useSidebarNavigation';
import { useDocumentCommentsQuery } from '@/hooks/useDocumentCommentsQuery';
import { useCreateCommentMutation } from '@/hooks/useCreateCommentMutation';

export function CommentsTab() {
  const { id: documentId } = useParams({ strict: false });
  const { currentBlockId } = useSidebarNavigation();
  const { data: comments } = useDocumentCommentsQuery(documentId);
  const { mutate: createComment, isPending: isSubmitting } = useCreateCommentMutation(documentId);
  const [commentText, setCommentText] = useState('');

  function handleSubmit() {
    if (!documentId || !currentBlockId || !commentText.trim()) return;
    createComment(
      { blockId: currentBlockId, comment: commentText.trim() },
      { onSuccess: () => setCommentText('') }
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {currentBlockId && (
        <div className="flex flex-col gap-2.5 rounded-xl border border-gray-100 bg-white p-5">
          <p className="body-xsmall font-semibold text-gray-800">블록 {currentBlockId} 주석 작성</p>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="주석을 입력하세요"
            rows={3}
            className="body-xsmall w-full resize-none rounded-[10px] border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !commentText.trim()}
            className="body-xsmall w-full rounded-[10px] bg-gray-700 py-2.5 text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? '등록 중...' : '등록하기'}
          </button>
        </div>
      )}

      {comments?.length === 0 && (
        <p className="body-xsmall text-gray-400">등록된 주석이 없습니다.</p>
      )}
      {comments?.map((comment, index) => (
        <BookmarkItem
          key={index}
          userName={comment.username ?? ''}
          userEmail={comment.email ?? ''}
          timestamp={comment.createdAt ?? ''}
          quotedText={comment.content ?? ''}
          comment={comment.comment ?? ''}
        />
      ))}
    </div>
  );
}
