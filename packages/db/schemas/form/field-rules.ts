import z from 'zod';

export const fieldCategoryOperations = ['ADD', 'SUBTRACT'] as const;

export const FieldCategoryActionSchema = z.object({
    id: z.string(),
    fieldId: z.string(),
    rootGroupId: z.string(),
    operation: z.enum(fieldCategoryOperations),
    points: z.number(),
    targetCategoryId: z.string().optional()
});

export const FieldRuleSchema = z.object({
    id: z.string(),
    type: z.string(),
    fieldId: z.string(),
    targetFieldId: z.string(),
    condition: z.string(),
    operator: z.string(),
    value: z.string().optional()
});

export const fieldRuleCombinators = ['AND', 'OR'] as const;

export const FieldRuleGroupSchema = z.object({
    id: z.string(),
    fieldId: z.string(),
    type: z.string(),
    combinator: z.enum(fieldRuleCombinators),
    childrenGroups: z.array(z.string()),
    childrenRules: z.array(z.string())
});

export const FieldRulesSchema = z.object({
    categoryActions: z.array(FieldCategoryActionSchema),
    rules: z.array(FieldRuleSchema),
    groups: z.array(FieldRuleGroupSchema)
});

export type FieldCategoryAction = z.infer<typeof FieldCategoryActionSchema>;

export type FieldCategoryOperation = (typeof fieldCategoryOperations)[number];

export type FieldRule = z.infer<typeof FieldRuleSchema>;

export type FieldRuleGroup = z.infer<typeof FieldRuleGroupSchema>;

export type FieldRules = z.infer<typeof FieldRulesSchema>;

export type FieldRuleCombinator = (typeof fieldRuleCombinators)[number];
