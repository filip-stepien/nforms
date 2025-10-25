import z from 'zod';

export const RespondentCategorySchema = z.object({
    id: z.string(),
    category: z.string(),
    color: z.string()
});

export type RespondentCategory = z.infer<typeof RespondentCategorySchema>;
