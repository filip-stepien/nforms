import z from 'zod';

export const FieldOptionSchema = z.object({
    id: z.string(),
    fieldId: z.string(),
    content: z.string(),
    order: z.number()
});

export type FieldOption = z.infer<typeof FieldOptionSchema>;
