import z from 'zod';

export const FieldResponseSchema = z.object({
    id: z.string(),
    fieldId: z.string(),
    response: z.string()
});

export const FormResponseSchema = z.object({
    id: z.string(),
    email: z.string().nullable(),
    responses: z.array(FieldResponseSchema)
});

export type FieldResponse = z.infer<typeof FieldResponseSchema>;

export type FormResponse = z.infer<typeof FormResponseSchema>;
