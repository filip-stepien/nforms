import { Form } from '@packages/db/schemas/form/form';
import {
    findFirstCategoryRuleGroupById,
    findFirstCategoryRuleById,
    findFirstCategoryRuleRelationByCategoryId
} from './query';
import { EvaluatedCategory, EvaluatedField } from '@packages/db/schemas/form-responses';

export type CategoryContext = {
    categoryId: string;
    value: number;
};

export type CategoryRuleLog = {
    type: 'rule';
    operator: string;
    ruleValue: number;
    actualValue: number;
    result: boolean;
};

export type CategoryRuleGroupLog = {
    type: 'group';
    combinator: string;
    result: boolean;
    logs: (CategoryRuleLog | CategoryRuleGroupLog)[];
};

function resolveCategoryRuleOperator(operator: string, ruleValue: number, actualValue: number) {
    switch (operator) {
        case 'is greater than':
            return actualValue > ruleValue;
        case 'is less than':
            return actualValue < ruleValue;
        case 'equals':
            return actualValue === ruleValue;
        default:
            throw new Error(`Unknown category rule operator: ${operator}`);
    }
}

function evaluateCategoryRule(ruleId: string, form: Form, actualValue: number): CategoryRuleLog {
    const rule = findFirstCategoryRuleById(ruleId, form);
    return {
        type: 'rule',
        operator: rule.operator,
        ruleValue: rule.value,
        actualValue,
        result: resolveCategoryRuleOperator(rule.operator, rule.value, actualValue)
    };
}

function resolveCategoryRuleGroupOperator(
    children: (CategoryRuleLog | CategoryRuleGroupLog)[],
    combinator: string
) {
    switch (combinator) {
        case 'AND':
            return children.every(c => c.result);
        case 'OR':
            return children.some(c => c.result);
        default:
            throw new Error(`Unknown category rule group combinator ${combinator}`);
    }
}

export function evaluateCategoryRuleGroup(
    groupId: string,
    form: Form,
    actualValue: number
): CategoryRuleGroupLog {
    const group = findFirstCategoryRuleGroupById(groupId, form);

    const childGroupRuleLogs = group.childrenGroups.map(id =>
        evaluateCategoryRuleGroup(id, form, actualValue)
    );
    const childRuleLogs = group.childrenRules.map(id =>
        evaluateCategoryRule(id, form, actualValue)
    );

    const childrenLogs = [...childGroupRuleLogs, ...childRuleLogs];

    return {
        type: 'group',
        result: resolveCategoryRuleGroupOperator(childrenLogs, group.combinator),
        combinator: group.combinator,
        logs: childrenLogs
    };
}

export function evaluateCategories(
    evaluatedFields: EvaluatedField[],
    form: Form
): EvaluatedCategory[] {
    const categoriesMap = new Map(
        form.respondentCategories.map(category => [
            category.category,
            {
                categoryId: category.id,
                categoryName: category.category,
                categoryColor: category.color,
                points: 0,
                assigned: false,
                logs: []
            }
        ])
    );

    for (const evaluatedField of evaluatedFields) {
        const categoryName = evaluatedField.score.category.name;
        const categoryEntry = categoriesMap.get(categoryName);
        if (evaluatedField.score.result) {
            categoryEntry.points += evaluatedField.score.points;
        }
    }

    const scoredCategories = Array.from(categoriesMap.values());

    return scoredCategories.map(scoredCategory => {
        const relation = findFirstCategoryRuleRelationByCategoryId(scoredCategory.categoryId, form);
        const rootGroupLog = evaluateCategoryRuleGroup(
            relation.rootGroupId,
            form,
            scoredCategory.points
        );

        return {
            category: {
                name: scoredCategory.categoryName,
                color: scoredCategory.categoryColor
            },
            points: scoredCategory.points,
            assigned: rootGroupLog.result,
            logs: [rootGroupLog]
        };
    });
}
