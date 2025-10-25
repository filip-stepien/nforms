import z from 'zod';
import { FieldSettingsSchema } from './field-settings';
import { FieldSchema } from './form-fields';
import { RespondentCategorySchema } from './respondent-categories';
import { RespondentCategoryRulesSchema } from './respondent-category-rules';
import { FieldRulesSchema } from './field-rules';
import { FieldOptionSchema } from './field-options';

export const FormSettingsSchema = z.object({
    active: z.boolean(),
    anonymous: z.boolean(),
    singleResponse: z.boolean()
});

export const FormSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    settings: FormSettingsSchema,
    fields: z.array(FieldSchema),
    fieldSettings: z.array(FieldSettingsSchema),
    fieldRules: FieldRulesSchema,
    fieldOptions: z.array(FieldOptionSchema),
    respondentCategories: z.array(RespondentCategorySchema),
    respondentCategoryRules: RespondentCategoryRulesSchema,
    createdAt: z.date(),
    userId: z.string()
});

export type FormSettings = z.infer<typeof FormSettingsSchema>;

export type Form = z.infer<typeof FormSchema>;
