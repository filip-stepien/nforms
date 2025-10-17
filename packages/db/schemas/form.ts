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

export const RuleRelationSchema = z.object({ fieldId: z.string(), rootGroupId: z.string() });

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
    relations: z.array(RuleRelationSchema),
    rules: z.array(RuleSchema),
    groups: z.array(RuleGroupSchema)
});

export const FieldControlsSchema = z.object({
    rules: FieldRulesSchema,
    options: z.array(FieldOptionSchema)
});

export const FormSchema = z.object({
    id: z.string(),
    title: z.string(),
    fields: z.array(FieldSchema),
    settings: z.array(FieldSettingsSchema),
    controls: FieldControlsSchema,
    createdAt: z.date(),
    userId: z.string()
});

export type Field = z.infer<typeof FieldSchema>;

export type FieldSettingsMap = {
    [FieldType.TEXT]: z.infer<typeof TextFieldSettingsSchema>;
    [FieldType.SELECTION]: z.infer<typeof SelectionFieldSettingsSchema>;
};

export type RuleRelation = z.infer<typeof RuleRelationSchema>;

export type Rule = z.infer<typeof RuleSchema>;

export type RuleGroup = z.infer<typeof RuleGroupSchema>;

export type RuleCombinator = (typeof ruleCombinators)[number];

export type FieldOption = z.infer<typeof FieldOptionSchema>;

export type FieldRules = z.infer<typeof FieldRulesSchema>;

export type FieldControls = z.infer<typeof FieldControlsSchema>;

export type Form = z.infer<typeof FormSchema>;
