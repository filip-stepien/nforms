import z from 'zod';
import { FieldType } from './form-fields';

const TextFieldSettingsSchema = z.object({
    required: z.boolean(),
    analyseSentiment: z.boolean(),
    extractKeywords: z.boolean(),
    summarize: z.boolean()
});

const SelectionFieldSettingsSchema = z.object({
    required: z.boolean(),
    multiSelection: z.boolean()
});

export const FieldSettingsSchema = z.object({
    fieldId: z.string(),
    settings: z.union([TextFieldSettingsSchema, SelectionFieldSettingsSchema])
});

export type FieldSettingsMap = {
    [FieldType.TEXT]: z.infer<typeof TextFieldSettingsSchema>;
    [FieldType.SELECTION]: z.infer<typeof SelectionFieldSettingsSchema>;
};
