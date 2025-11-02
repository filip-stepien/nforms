import { z } from 'zod';

export const CategoryRuleLogSchema = z.object({
    type: z.literal('rule'),
    leftValue: z.number(),
    operator: z.string(),
    rightValue: z.number(),
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

export const FieldRuleLogSchema = z.object({
    type: z.literal('rule'),
    targetFieldTitle: z.string(),
    leftValue: z.union([z.string(), z.array(z.string())]),
    operator: z.string(),
    rightValue: z.string(),
    result: z.boolean()
});

export const FieldRuleGroupLogSchema: z.ZodType<{
    type: 'group';
    combinator: string;
    result: boolean;
    score: number;
    logs: (FieldRuleLog | FieldRuleGroupLog)[];
}> = z.lazy(() =>
    z.object({
        type: z.literal('group'),
        combinator: z.string(),
        result: z.boolean(),
        score: z.number(),
        logs: z.array(z.union([FieldRuleLogSchema, FieldRuleGroupLogSchema]))
    })
);

export const FieldResponseSchema = z.object({
    fieldTitle: z.string(),
    response: z.union([z.string(), z.array(z.string())]),
    fieldRuleLogs: z.array(FieldRuleGroupLogSchema),
    categoryRuleLogs: z.array(
        z.object({
            categoryName: z.string(),
            totalScore: z.number(),
            assigned: z.boolean(),
            logs: CategoryRuleGroupLogSchema
        })
    )
});

export const FormResponseSchema = z.object({
    id: z.string(),
    email: z.string().nullable(),
    responses: z.array(FieldResponseSchema)
});

export type CategoryRuleLog = z.infer<typeof CategoryRuleLogSchema>;

export type CategoryRuleGroupLog = z.infer<typeof CategoryRuleGroupLogSchema>;

export type FieldRuleLog = z.infer<typeof FieldRuleLogSchema>;

export type FieldRuleGroupLog = z.infer<typeof FieldRuleGroupLogSchema>;

export type FieldResponse = z.infer<typeof FieldResponseSchema>;

export type FormResponse = z.infer<typeof FormResponseSchema>;
