import { useState, useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import LibraryDocument from '@/components/common/LibDoc.tsx';
import Button from '@/components/common/Button';
import { ChevronRight } from '@/components/icons';
import { useFolderQuery } from '@/hooks/useFolderQuery';

export const Route = createFileRoute('/library')({
  component: LibraryPage,
});

// 하드코딩 데이터
/* const mockData = {
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
    { id: 101, title: '최종_발표_자료_수정_진짜최종.pdf', updatedAt: '2026-03-30T15:20:00' },
    { id: 102, title: '중간보고서_초안', updatedAt: '2026-03-29T11:00:00' },
    { id: 103, title: '회의록_260330', updatedAt: '2026-03-30T09:00:00' },
    { id: 104, title: '비즈니스_모델_캔버스', updatedAt: '2026-03-27T16:00:00' },
    { id: 105, title: '시장조사_결과보고서', updatedAt: '2026-03-26T13:00:00' },
  ],
};
*/

export default function LibraryPage() {
  const { data: serverData } = useFolderQuery();
  //const [libraryData, setLibraryData] = useState(mockData);

  // 1. 전체 데이터를 상태로 관리 (정렬 반영용)
  const [libraryData, setLibraryData] = useState(serverData);

  // 2. 드롭다운 상태 관리
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const [selectedType, setSelectedType] = useState('문서 유형');
  const [selectedSort, setSelectedSort] = useState('정렬 순서');

  const typeOptions = ['일반문서', '공유문서'];
  const sortOptions = ['최신순', '오래된순', '이름순', '최근 수정일순'];

  // 서버 데이터 로드 시 초기화
  useEffect(() => {
    if (serverData) setLibraryData(serverData);
  }, [serverData]);

  // 3. 정렬 로직
  const handleSort = (option: string) => {
    setSelectedSort(option);
    setIsSortOpen(false);
    if (!libraryData) return;

    const sortedFolders = [...libraryData.folders];
    const sortedDocs = [...libraryData.documents];
    if (option === '최신순') {
      // 생성일 필요, 없을 시 교체 필요
      sortedFolders.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      sortedDocs.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    } else if (option === '최근 수정일순') {
      // 수정된 시간이 가장 최근인 순서
      sortedFolders.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      sortedDocs.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    } else if (option === '오래된순') {
      // 과거부터 현재 순서
      sortedFolders.sort(
        (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
      );
      sortedDocs.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
    } else if (option === '이름순') {
      // 가나다순
      sortedFolders.sort((a, b) => a.name.localeCompare(b.name));
      sortedDocs.sort((a, b) => a.title.localeCompare(b.title));
    }

    setLibraryData({ ...libraryData, folders: sortedFolders, documents: sortedDocs });
  };

  return (
    <div className="min-h-screen w-full bg-white p-8">
      {/* 상단 필터/정렬 영역 */}
      <div className="relative mb-10 flex justify-end gap-3">
        {/* 1. 문서 유형 드롭다운 */}
        <div className="relative">
          <Button
            variant="normal"
            onClick={() => {
              setIsTypeOpen(!isTypeOpen);
              setIsSortOpen(false);
            }}
            className={`flex h-[30px] !min-h-0 w-[140px] items-center justify-between border border-gray-200 bg-white px-3 text-[20px] font-normal transition-colors ${
              selectedType !== '문서 유형' ? 'font-medium text-gray-900' : 'text-gray-700'
            }`}
          >
            <span className="truncate whitespace-nowrap">{selectedType}</span>
            <ChevronRight
              className={`h-3 w-3 shrink-0 transition-transform ${isTypeOpen ? 'rotate-90' : ''}`}
            />
          </Button>
          {isTypeOpen && (
            <div className="absolute top-[35px] left-0 z-50 w-full rounded-md border border-gray-100 bg-white py-1 shadow-lg">
              {typeOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setSelectedType(opt);
                    setIsTypeOpen(false);
                  }}
                  className={`flex w-full items-center px-3 py-2 text-[16px] transition-colors hover:bg-gray-100 ${
                    selectedType === opt ? 'font-medium text-gray-900' : 'text-gray-700'
                  }`}
                >
                  <span
                    className={`mr-2 w-3 ${selectedType === opt ? 'visible text-gray-900' : 'invisible'}`}
                  >
                    ✓
                  </span>
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2. 정렬 순서 드롭다운 */}
        <div className="relative">
          <Button
            variant="normal"
            onClick={() => {
              setIsSortOpen(!isSortOpen);
              setIsTypeOpen(false);
            }}
            className={`flex h-[30px] !min-h-0 w-[140px] items-center justify-between border border-gray-200 bg-white px-3 text-[20px] font-normal transition-colors ${
              selectedSort !== '정렬 순서' ? 'font-medium text-gray-900' : 'text-gray-700'
            }`}
          >
            <span className="truncate whitespace-nowrap">{selectedSort}</span>
            <ChevronRight
              className={`h-3 w-3 shrink-0 transition-transform ${isSortOpen ? 'rotate-90' : ''}`}
            />
          </Button>
          {isSortOpen && (
            <div className="absolute top-[35px] right-0 z-50 w-[160px] rounded-md border border-gray-100 bg-white py-1 shadow-lg">
              {sortOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleSort(opt)}
                  className={`flex w-full items-center px-4 py-2 text-[16px] transition-colors hover:bg-gray-100 ${
                    selectedSort === opt ? 'font-medium text-gray-900' : 'text-gray-700'
                  }`}
                >
                  <span
                    className={`mr-2 w-3 ${selectedSort === opt ? 'visible text-gray-900' : 'invisible'}`}
                  >
                    ✓
                  </span>
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <main className="mx-auto mt-10 grid max-w-[1700px] grid-cols-6 justify-items-center gap-x-[40px] gap-y-[60px] px-8">
        {libraryData?.folders.map((folder) => (
          <LibraryDocument
            key={`folder-${folder.id}`}
            documentId={folder.id}
            itemType="folder"
            title={folder.name}
            date={folder.updatedAt.split('T')[0] || '2026-03-30'}
            folderColor={folder.color || 'text-yellow-400'}
          />
        ))}

        {libraryData?.documents.map((doc) => (
          <LibraryDocument
            key={`doc-${doc.id}`}
            documentId={doc.id}
            itemType="document"
            title={doc.title}
            date={doc.updatedAt.split('T')[0] || '2026-03-30'}
          />
        ))}
      </main>
    </div>
  );
}
