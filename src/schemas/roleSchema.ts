import z from 'zod';

export const roleSchema = z.object({
  role: z.enum(['writer', 'evaluator']).optional(),
});

export type UserRole = z.infer<typeof roleSchema>['role'];
