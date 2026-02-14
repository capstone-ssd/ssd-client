export interface Comment {
  id: string;
  blockId: number;
  content: string;
  author: string;
  createdAt: Date;
}

export interface Paragraph {
  blockId: number | null;
  content: string;
  role?: string;
  pageNumber?: number;
}
