import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';
import LibraryDocument from '@/components/common/LibDoc.tsx';
import { useFolderQuery } from '@/hooks/useFolderQuery';
//TODO: 라이브러리 간격 조절 및 API 연동 코드 추가

// 라우트 등록 (TanStack Router 사용 시)
export const Route = createFileRoute('/library')({
  component: LibraryPage,
});

export default function LibraryPage() {
  // 임시 하드코딩 데이터
  const mockData = {
    folders: [
      { id: 1, name: '프로젝트 자료', color: 'text-yellow-400', updatedAt: '2025-02-02T10:00:00' },
      { id: 2, name: '기획안 모음', color: 'text-blue-400', updatedAt: '2025-02-03T11:00:00' },
      { id: 3, name: '레퍼런스', color: 'text-primary-400', updatedAt: '2025-02-04T12:00:00' },
    ],
    documents: [
      { id: 101, title: '심사임당_최종_발표자료.pdf', updatedAt: '2025-03-01T15:30:00' },
      { id: 102, title: '데이터_분석_결과보고서', updatedAt: '2025-03-02T09:00:00' },
      { id: 103, title: 'UI_UX_가이드라인_v2', updatedAt: '2025-03-03T18:20:00' },
      { id: 104, title: '중간보고서_초안', updatedAt: '2025-03-04T10:00:00' },
    ],
  };
  const data = mockData;

  return (
    <div className="min-h-screen w-full bg-white p-8">
      <div className="mb-10 flex justify-end gap-3">
        <select className="rounded-md border border-gray-200 px-3 py-1.5 text-[14px]">
          <option>문서 유형</option>
        </select>
        <select className="rounded-md border border-gray-200 px-3 py-1.5 text-[14px]">
          <option>정렬 순서</option>
        </select>
      </div>

      <main className="flex flex-wrap justify-center gap-x-[20px] gap-y-[40px] px-8">
        {data.folders.map((folder) => (
          <LibraryDocument
            key={`folder-${folder.id}`}
            documentId={folder.id}
            itemType="folder"
            title={folder.name}
            date={folder.updatedAt.split('T')[0]}
            folderColor={folder.color}
          />
        ))}

        {/* 문서 렌더링 */}
        {data.documents.map((doc) => (
          <LibraryDocument
            key={`doc-${doc.id}`}
            documentId={doc.id}
            itemType="document"
            title={doc.title}
            date={doc.updatedAt.split('T')[0]}
          />
        ))}
      </main>
    </div>
  );
}
