import { createFileRoute } from '@tanstack/react-router';
import LibraryDocument from '@/components/common/LibDoc.tsx';
import { useFolderQuery } from '@/hooks/useFolderQuery';

export const Route = createFileRoute('/library')({
  component: LibraryPage,
});

export default function LibraryPage() {
  const { data: libraryData } = useFolderQuery();

  return (
    <div className="min-h-screen w-full bg-white p-8">
      {/* 상단 필터/정렬 영역 */}
      <div className="mb-10 flex justify-end gap-3">
        <select className="h-[30px] w-[140px] rounded-md border border-gray-200 text-center text-[20px]">
          <option value="" disabled selected hidden>
            문서 유형
          </option>
        </select>
        <select className="h-[30px] w-[140px] rounded-md border border-gray-200 text-center text-[20px]">
          <option value="" disabled selected hidden>
            정렬 순서
          </option>
        </select>
      </div>
      <main className="flex flex-wrap justify-start gap-x-[32px] gap-y-[48px] px-8">
        {/* 폴더 렌더링: libraryData가 있을 때만 실행됨 */}
        {libraryData?.folders.map((folder) => (
          <LibraryDocument
            key={`folder-${folder.id}`}
            documentId={folder.id}
            itemType="folder"
            title={folder.name}
            date={folder.updatedAt.split('T')[0]}
            folderColor={folder.color || 'text-yellow-400'}
          />
        ))}

        {/* 문서 렌더링: libraryData가 있을 때만 실행됨 */}
        {libraryData?.documents.map((doc) => (
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
