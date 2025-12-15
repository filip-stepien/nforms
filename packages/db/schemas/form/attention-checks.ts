import z from 'zod';

export const AttentionCheckSchema = z.object({
    id: z.string(),
    categoryId: z.string(),
    score: z.number(),
    condition: z.string(),
    operator: z.string(),
    value: z.string(),
    fields: z.array(z.string())
});

export type AttentionCheck = z.infer<typeof AttentionCheckSchema>;
