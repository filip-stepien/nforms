import { z } from 'zod';
import { FieldType, ruleCombinators } from '../../types/form';

const fieldSchema = z.object({
    id: z.string(),
    title: z.string(),
    type: z.enum(FieldType)
});

const textFieldSettingsSchema = z.object({
    required: z.boolean(),
    analyseSentiment: z.boolean(),
    extractKeywords: z.boolean(),
    summarize: z.boolean()
});

const selectionFieldSettingsSchema = z.object({
    required: z.boolean(),
    singleSelection: z.boolean()
});

const fieldSettingsSchema = z.object({
    fieldId: z.string(),
    settings: z.union([textFieldSettingsSchema, selectionFieldSettingsSchema])
});

const relationSchema = z.object({
    fieldId: z.string(),
    rootGroupId: z.string()
});

const ruleSchema = z.object({
    type: z.string(),
    fieldId: z.string(),
    targetFieldId: z.string(),
    condition: z.string(),
    operator: z.string(),
    value: z.string()
});

const groupSchema = z.object({
    fieldId: z.string(),
    type: z.string(),
    combinator: z.enum(ruleCombinators),
    childrenGroups: z.array(z.string()),
    childrenRules: z.array(z.string())
});

const optionSchema = z.object({
    fieldId: z.string(),
    content: z.string(),
    order: z.number()
});

const rulesSchema = z.object({
    relations: z.array(relationSchema),
    rules: z.array(ruleSchema),
    groups: z.array(groupSchema)
});

const controlsSchema = z.object({
    rules: rulesSchema,
    options: z.array(optionSchema)
});

export const formSchema = z.object({
    id: z.string(),
    title: z.string(),
    fields: z.array(fieldSchema),
    settings: z.array(fieldSettingsSchema),
    controls: controlsSchema,
    createdAt: z.date(),
    userId: z.string()
});

export type Form = z.infer<typeof formSchema>;
