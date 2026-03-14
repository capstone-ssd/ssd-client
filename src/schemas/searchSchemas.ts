import { z } from 'zod';
import { roleSchema } from './roleSchema';

export const sidebarSchema = z
  .object({
    sidebar: z.enum(['summary', 'ai-evaluation', 'history', 'comments', 'review']).optional(),
    blockId: z.coerce.number().int().positive().optional(),
    // 추가
    documentId: z.string().min(1).optional(),
  })
  .strip()
  .merge(roleSchema);

export type SidebarSearch = z.infer<typeof sidebarSchema>;

export const documentSchema = z.object({
  documentId: z.coerce.number().int().positive().optional(),
});

export type DocumentSearch = z.infer<typeof documentSchema>;

export const workspaceSearchSchema = z
  .object({})
  .merge(sidebarSchema)
  .merge(documentSchema)
  .merge(roleSchema);

export type WorkspaceSearch = z.infer<typeof workspaceSearchSchema>;
