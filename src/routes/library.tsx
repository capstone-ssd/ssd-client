import { createFileRoute } from '@tanstack/react-router';
import LibraryDocument from '@/components/common/LibDoc.tsx';
import { useFolderQuery } from '@/hooks/useFolderQuery';

export const Route = createFileRoute('/library')({
  component: LibraryPage,
});

// 하드코딩 데이터
const mockLibraryData = {
  folders: [
    {
      id: 1,
      name: '2026_심사임당_기획',
      updatedAt: '2026-03-30T10:00:00',
      color: 'text-yellow-400',
    },
    { id: 2, name: '참고문헌_모음', updatedAt: '2026-03-28T14:30:00', color: 'text-blue-400' },
    { id: 3, name: '디자인_에셋', updatedAt: '2026-03-25T09:00:00', color: 'text-purple-400' },
  ],
  documents: [
    {
      id: 101,
      title: '최종_발표_자료_수정_진짜최종.pdf',
      updatedAt: '2026-03-30T15:20:00',
      thumbnailUrl: 'https://picsum.photos/200/300',
    },
    { id: 102, title: '중간보고서_초안', updatedAt: '2026-03-29T11:00:00' }, // 썸네일 없는 경우 테스트
    {
      id: 103,
      title: '회의록_260330',
      updatedAt: '2026-03-30T09:00:00',
      thumbnailUrl: 'https://picsum.photos/200/301',
    },
    {
      id: 103,
      title: '회의록_260330',
      updatedAt: '2026-03-30T09:00:00',
      thumbnailUrl: 'https://picsum.photos/200/301',
    },
    {
      id: 103,
      title: '회의록_260330',
      updatedAt: '2026-03-30T09:00:00',
      thumbnailUrl: 'https://picsum.photos/200/301',
    },
    {
      id: 103,
      title: '회의록_260330',
      updatedAt: '2026-03-30T09:00:00',
      thumbnailUrl: 'https://picsum.photos/200/301',
    },
  ],
};
// 하드코딩 데이터

export default function LibraryPage() {
  const libraryData = mockLibraryData; // 하드코딩 데이터
  // const { data: libraryData } = useFolderQuery();

  return (
    <div className="min-h-screen w-full bg-white p-8">
      {/* 상단 필터/정렬 영역 */}
      <div className="mb-10 flex justify-end gap-3">
        <select className="h-[30px] w-[140px] rounded-md border border-gray-200 text-[20px]">
          <option value="" disabled selected hidden>
            문서 유형
          </option>
        </select>
        <select className="h-[30px] w-[140px] rounded-md border border-gray-200 text-[20px]">
          <option value="" disabled selected hidden>
            정렬 순서
          </option>
        </select>
      </div>
      <main className="mx-auto mt-10 grid max-w-[1700px] grid-cols-6 justify-items-center gap-x-[40px] gap-y-[60px] px-8">
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
