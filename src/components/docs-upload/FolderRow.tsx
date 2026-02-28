import { useState } from 'react';
import { ChevronDown, Folder } from '@/components/icons';
import { cn } from '@/utils/cn';
import DocumentRow from './DocumentRow';
import type { FolderItem, DocumentItem } from './fileTreeTypes';

export interface FolderRowProps {
  folder: FolderItem;
  allFolders: FolderItem[];
  allDocuments: DocumentItem[];
  depth: number;
  selectedFolderId: number | null;
  onSelectFolder: (folderId: number | null) => void;
  selectedDocumentId?: number | null;
  onSelectDocument?: (documentId: number) => void;
}

function getChildFolders(folders: FolderItem[], parentId: number): FolderItem[] {
  return folders.filter((f) => f.parentId === parentId);
}

function getDocumentsInFolder(documents: DocumentItem[], folderId: number): DocumentItem[] {
  return documents.filter((doc) => doc.folderId === folderId);
}

export default function FolderRow({
  folder,
  allFolders,
  allDocuments,
  depth,
  selectedFolderId,
  onSelectFolder,
  selectedDocumentId,
  onSelectDocument,
}: FolderRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const childFolders = getChildFolders(allFolders, folder.id);
  const childDocuments = getDocumentsInFolder(allDocuments, folder.id);
  const hasChildren = childFolders.length > 0 || childDocuments.length > 0;
  const isSelected = selectedFolderId === folder.id;

  // 폴더 들여쓰기
  const paddingLeft = depth === 0 ? 0 : 50 + (depth - 1) * 16;
  // 문서 들여쓰기(같은 레벨 폴더보다 더 깊은 들여쓰기)
  const documentPaddingLeft = 94 + depth * 16;

  function handleClick() {
    onSelectFolder(folder.id);
    if (hasChildren) {
      setIsExpanded((prev) => !prev);
    }
  }

  return (
    <li
      role="treeitem"
      aria-expanded={hasChildren ? isExpanded : undefined}
      aria-selected={isSelected}
    >
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          'flex w-full items-center gap-0.5 rounded',
          'transition-colors duration-150',
          'focus-visible:ring-primary-400 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none',
          depth === 0
            ? 'h-7 py-0.5'
            : cn('h-7.5 py-0.75', isSelected ? 'bg-gray-300' : 'hover:bg-gray-100')
        )}
        style={{ paddingLeft: `${paddingLeft}px` }}
        aria-label={`${folder.name} 폴더${isSelected ? ' (선택됨)' : ''}`}
      >
        <ChevronDown
          className={cn(
            'h-6 w-6 shrink-0 transition-transform duration-150',
            depth === 0 ? 'text-gray-700' : 'text-gray-500',
            isExpanded && hasChildren ? 'rotate-0' : '-rotate-90'
          )}
          aria-hidden="true"
        />
        <Folder
          className="h-6 w-6 shrink-0 transition-colors duration-150"
          aria-hidden="true"
          fill={isSelected ? '#f6d347' : 'none'}
        />
        <span className="body-xsmall ml-0.5 truncate text-gray-900">{folder.name}</span>
      </button>

      {isExpanded && hasChildren && (
        <ul role="group" className="flex flex-col gap-0.5">
          {childFolders.map((child) => (
            <FolderRow
              key={child.id}
              folder={child}
              allFolders={allFolders}
              allDocuments={allDocuments}
              depth={depth + 1}
              selectedFolderId={selectedFolderId}
              onSelectFolder={onSelectFolder}
              selectedDocumentId={selectedDocumentId}
              onSelectDocument={onSelectDocument}
            />
          ))}
          {childDocuments.map((doc) => (
            <DocumentRow
              key={doc.id}
              document={doc}
              paddingLeft={documentPaddingLeft}
              isSelected={selectedDocumentId === doc.id}
              onSelect={onSelectDocument ? () => onSelectDocument(doc.id) : undefined}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
