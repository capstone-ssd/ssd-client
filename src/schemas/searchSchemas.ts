import { z } from 'zod';

export const sidebarSchema = z
  .object({
    sidebar: z.enum(['summary', 'ai-evaluation', 'history', 'comments']).optional(),
    blockId: z.coerce.number().int().positive().optional(),
  })
  .strip();
