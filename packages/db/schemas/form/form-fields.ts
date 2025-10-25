import z from 'zod';

export enum FieldType {
    TEXT = 'Text',
    SELECTION = 'Selection'
}

export const FieldSchema = z.object({
    id: z.string(),
    title: z.string(),
    type: z.enum(FieldType)
});

export type Field = z.infer<typeof FieldSchema>;
