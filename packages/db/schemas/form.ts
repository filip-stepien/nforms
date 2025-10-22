import { z } from 'zod';

export enum FieldType {
    TEXT = 'Text',
    SELECTION = 'Selection'
}

export const FieldSchema = z.object({ id: z.string(), title: z.string(), type: z.enum(FieldType) });

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

export const categoryActions = ['ADD', 'DELETE', 'SET'] as const;

export const CategoryActionSchema = z.object({
    id: z.string(),
    fieldId: z.string(),
    rootGroupId: z.string(),
    action: z.enum(categoryActions),
    points: z.number(),
    targetCategoryId: z.string()
});

export const RuleSchema = z.object({
    id: z.string(),
    type: z.string(),
    fieldId: z.string(),
    targetFieldId: z.string(),
    condition: z.string(),
    operator: z.string(),
    value: z.string()
});

export const ruleCombinators = ['AND', 'OR'] as const;

export const RuleGroupSchema = z.object({
    id: z.string(),
    fieldId: z.string(),
    type: z.string(),
    combinator: z.enum(ruleCombinators),
    childrenGroups: z.array(z.string()),
    childrenRules: z.array(z.string())
});

export const FieldOptionSchema = z.object({
    id: z.string(),
    fieldId: z.string(),
    content: z.string(),
    order: z.number()
});

export const FieldRulesSchema = z.object({
    categoryActions: z.array(CategoryActionSchema),
    rules: z.array(RuleSchema),
    groups: z.array(RuleGroupSchema)
});

export const FieldControlsSchema = z.object({
    rules: FieldRulesSchema,
    options: z.array(FieldOptionSchema)
});

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
    fieldControls: FieldControlsSchema,
    createdAt: z.date(),
    userId: z.string()
});

export type Field = z.infer<typeof FieldSchema>;

export type FieldSettingsMap = {
    [FieldType.TEXT]: z.infer<typeof TextFieldSettingsSchema>;
    [FieldType.SELECTION]: z.infer<typeof SelectionFieldSettingsSchema>;
};

export type CategoryAction = z.infer<typeof CategoryActionSchema>;

export type Rule = z.infer<typeof RuleSchema>;

export type RuleGroup = z.infer<typeof RuleGroupSchema>;

export type RuleCombinator = (typeof ruleCombinators)[number];

export type FieldOption = z.infer<typeof FieldOptionSchema>;

export type FieldRules = z.infer<typeof FieldRulesSchema>;

export type FieldControls = z.infer<typeof FieldControlsSchema>;

export type FormSettings = z.infer<typeof FormSettingsSchema>;

export type Form = z.infer<typeof FormSchema>;
