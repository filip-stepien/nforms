import z from 'zod';

export const RespondentCategoryRuleRelationSchema = z.object({
    categoryId: z.string(),
    rootGroupId: z.string()
});

export const respondentCategoryRuleCombinators = ['AND', 'OR'] as const;

export const RespondentCategoryRuleGroupSchema = z.object({
    id: z.string(),
    categoryId: z.string(),
    combinator: z.enum(respondentCategoryRuleCombinators),
    childrenRules: z.array(z.string()),
    childrenGroups: z.array(z.string())
});

export const respondentCategoryRuleOperators = ['IS GREATER THAN', 'IS LESSER THAN', 'EQUALS'];

export const RespondentCategoryRuleSchema = z.object({
    id: z.string(),
    categoryId: z.string(),
    operator: z.enum(respondentCategoryRuleOperators),
    value: z.number()
});

export const RespondentCategoryRulesSchema = z.object({
    relations: z.array(RespondentCategoryRuleRelationSchema),
    groups: z.array(RespondentCategoryRuleGroupSchema),
    rules: z.array(RespondentCategoryRuleSchema)
});

export type RespondentCategoryRuleRelation = z.infer<typeof RespondentCategoryRuleRelationSchema>;

export type RespondentCategoryRuleGroup = z.infer<typeof RespondentCategoryRuleGroupSchema>;

export type RespondentCategoryRule = z.infer<typeof RespondentCategoryRuleSchema>;

export type RespondentCategoryRules = z.infer<typeof RespondentCategoryRulesSchema>;
