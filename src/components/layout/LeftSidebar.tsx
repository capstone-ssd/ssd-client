import { useState } from 'react';
import FileTree from '@/components/docs-upload/FileTree';
import { useFolderQuery } from '@/hooks/useFolderQuery';

interface LeftSidebarProps {
  selectedDocumentId?: number | null;
  onSelectDocument: (documentId: number) => void;
}

export function LeftSidebar({ selectedDocumentId, onSelectDocument }: LeftSidebarProps) {
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const { data, isLoading } = useFolderQuery();

  return (
    <aside className="flex w-[280px] shrink-0 flex-col overflow-y-auto border-r border-gray-200 bg-white px-4 py-2">
      <FileTree
        selectedFolderId={selectedFolderId}
        onSelectFolder={setSelectedFolderId}
        selectedDocumentId={selectedDocumentId}
        onSelectDocument={onSelectDocument}
        data={data ?? null}
        isLoading={isLoading}
        className="rounded-none border-0 p-0"
      />
    </aside>
  );
}
