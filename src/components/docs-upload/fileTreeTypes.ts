export interface FolderItem {
  id: number;
  name: string;
  color: string;
  parentId: number;
  updatedAt: string;
}

export interface DocumentItem {
  id: number;
  title: string;
  folderId: number;
  updatedAt: string;
}

export interface LibraryData {
  parentId: number;
  folders: FolderItem[];
  documents: DocumentItem[];
}
