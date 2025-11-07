import { z } from 'zod';

export const FieldRuleLogSchema = z.object({
    type: z.literal('rule'),
    targetFieldTitle: z.string(),
    condition: z.string(),
    operator: z.string(),
    ruleValue: z.string(),
    actualValue: z.union([z.string(), z.array(z.string())]),
    result: z.boolean()
});

export const FieldRuleGroupLogSchema: z.ZodType<{
    type: 'group';
    combinator: string;
    result: boolean;
    logs: (FieldRuleLog | FieldRuleGroupLog)[];
}> = z.lazy(() =>
    z.object({
        type: z.literal('group'),
        combinator: z.string(),
        result: z.boolean(),
        logs: z.array(z.union([FieldRuleLogSchema, FieldRuleGroupLogSchema]))
    })
);

export const CategoryRuleLogSchema = z.object({
    type: z.literal('rule'),
    operator: z.string(),
    ruleValue: z.number(),
    actualValue: z.number(),
    result: z.boolean()
});

export const CategoryRuleGroupLogSchema: z.ZodType<{
    type: 'group';
    combinator: string;
    result: boolean;
    logs: (CategoryRuleLog | CategoryRuleGroupLog)[];
}> = z.lazy(() =>
    z.object({
        type: z.literal('group'),
        combinator: z.string(),
        result: z.boolean(),
        logs: z.array(z.union([CategoryRuleLogSchema, CategoryRuleGroupLogSchema]))
    })
);

export const EvaluatedFieldSchema = z.object({
    score: z.object({
        category: z.object({
            name: z.string(),
            color: z.string()
        }),
        operation: z.string(),
        points: z.number(),
        result: z.boolean()
    }),
    logs: z.array(FieldRuleGroupLogSchema)
});

export const EvaluatedCategorySchema = z.object({
    category: z.object({
        name: z.string(),
        color: z.string()
    }),
    points: z.number(),
    assigned: z.boolean(),
    logs: z.array(CategoryRuleGroupLogSchema)
});

export const EvaluatedResponseSchema = z.object({
    fieldTitle: z.string(),
    response: z.union([z.string(), z.array(z.string())]),
    fieldRules: z.array(EvaluatedFieldSchema)
});

export const FormResponseSchema = z.object({
    id: z.string(),
    email: z.string().nullable(),
    submission: z.date(),
    responses: z.array(EvaluatedResponseSchema),
    categoryRules: z.array(EvaluatedCategorySchema)
});

export type FieldRuleLog = z.infer<typeof FieldRuleLogSchema>;

export type FieldRuleGroupLog = z.infer<typeof FieldRuleGroupLogSchema>;

export type CategoryRuleLog = z.infer<typeof CategoryRuleLogSchema>;

export type CategoryRuleGroupLog = z.infer<typeof CategoryRuleGroupLogSchema>;

export type EvaluatedField = z.infer<typeof EvaluatedFieldSchema>;

export type EvaluatedCategory = z.infer<typeof EvaluatedCategorySchema>;

export type EvaluatedResponse = z.infer<typeof EvaluatedResponseSchema>;

export type FormResponse = z.infer<typeof FormResponseSchema>;
