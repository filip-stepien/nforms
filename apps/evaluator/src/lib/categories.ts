import { Form } from '@packages/db/schemas/form/form';

export type CategoryContext = {
    categoryId: string;
    value: number;
};

export type CategoryRuleLog = {
    type: 'rule';
    leftValue: number;
    operator: string;
    rightValue: number;
    result: boolean;
};

export type CategoryRuleGroupLog = {
    type: 'group';
    combinator: string;
    result: boolean;
    logs: (CategoryRuleLog | CategoryRuleGroupLog)[];
};

export type CategoryRuleEvalFunction = (context: CategoryContext[]) => CategoryRuleLog;

export type CategoryRuleGroupEvalFunction = (context: CategoryContext[]) => CategoryRuleGroupLog;

function findCategoryRuleById(ruleId: string, form: Form) {
    const rule = form.respondentCategoryRules.rules.find(r => r.id === ruleId);

    if (!rule) {
        throw new Error(`Category rule ${ruleId} not found`);
    }

    return rule;
}

function findCategoryRuleGroupById(groupId: string, form: Form) {
    const group = form.respondentCategoryRules.groups.find(g => g.id === groupId);

    if (!group) {
        throw new Error(`Category rule group ${groupId} not found`);
    }

    return group;
}

function findCategoryContext(categoryId: string, context: CategoryContext[]) {
    const categroyContext = context.find(ctx => ctx.categoryId === categoryId);

    if (!categroyContext) {
        throw new Error(`Cannot resolve context for category ${categoryId}`);
    }

    return categroyContext;
}

function resolveCategoryRuleOperator(operator: string, expectedValue: number, actualValue: number) {
    switch (operator) {
        case 'is greater than':
            return actualValue > expectedValue;
        case 'is less than':
            return actualValue < expectedValue;
        case 'equals':
            return actualValue === expectedValue;
        default:
            throw new Error(`Unknown category rule operator: ${operator}`);
    }
}

function getCategoryRuleEvaluator(ruleId: string, form: Form): CategoryRuleEvalFunction {
    const rule = findCategoryRuleById(ruleId, form);

    const evaluate: CategoryRuleEvalFunction = context => {
        const categoryContext = findCategoryContext(rule.categoryId, context);
        const expectedValue = rule.value;
        const actualValue = categoryContext.value;

        return {
            type: 'rule',
            leftValue: actualValue,
            operator: rule.operator,
            rightValue: expectedValue,
            result: resolveCategoryRuleOperator(rule.operator, expectedValue, actualValue)
        };
    };

    return evaluate;
}

function resolveCategoryRuleGroupOperator(
    children: (CategoryRuleEvalFunction | CategoryRuleGroupEvalFunction)[],
    combinator: string,
    context: CategoryContext[]
) {
    const logs: (CategoryRuleLog | CategoryRuleGroupLog)[] = [];
    let result = false;

    const evaluateChildren = (fn: CategoryRuleEvalFunction | CategoryRuleGroupEvalFunction) => {
        const log = fn(context);
        logs.push(log);
        return log.result;
    };

    switch (combinator) {
        case 'AND':
            result = children.every(evaluateChildren);
            break;
        case 'OR':
            result = children.some(evaluateChildren);
            break;
        default:
            throw new Error(`Unknown field rule group combinator ${combinator}`);
    }

    return { result, logs };
}

export function getCategoryRuleGroupEvaluator(
    groupId: string,
    form: Form
): CategoryRuleGroupEvalFunction {
    const group = findCategoryRuleGroupById(groupId, form);

    const childGroups = group.childrenGroups.map(id => getCategoryRuleGroupEvaluator(id, form));
    const childRules = group.childrenRules.map(id => getCategoryRuleEvaluator(id, form));
    const children = [...childGroups, ...childRules];

    const evaluate: CategoryRuleGroupEvalFunction = context => {
        const { result, logs } = resolveCategoryRuleGroupOperator(
            children,
            group.combinator,
            context
        );

        return {
            type: 'group',
            result,
            combinator: group.combinator,
            logs
        };
    };

    return evaluate;
}

export function evaluateCategories(context: CategoryContext[], form: Form) {
    return form.respondentCategoryRules.relations.map(({ categoryId, rootGroupId }) => {
        const evaluate = getCategoryRuleGroupEvaluator(rootGroupId, form);
        const evaluationResult = evaluate(context);
        const totalScore = findCategoryContext(categoryId, context).value ?? 0;

        return {
            categoryId,
            totalScore,
            assigned: evaluationResult.result,
            logs: evaluationResult
        };
    });
}

export function getCategoryEvaluationContext(form: Form): CategoryContext[] {
    return form.respondentCategories.map(({ id }) => ({
        categoryId: id,
        value: 0
    }));
}
