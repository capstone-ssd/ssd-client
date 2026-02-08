import { z } from 'zod';
import { roleSchema } from './roleSchema';

export const sidebarSchema = z
  .object({
    sidebar: z.enum(['summary', 'ai-evaluation', 'history', 'comments', 'review']).optional(),
    blockId: z.coerce.number().int().positive().optional(),
  })
  .strip()
  .merge(roleSchema);

export type SidebarSearch = z.infer<typeof sidebarSchema>;
