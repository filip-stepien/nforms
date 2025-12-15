import { FieldRawResponse } from '@packages/queue';
import { Form } from '@packages/db/schemas/form/form';
import { Field, FieldType } from '@packages/db/schemas/form/form-fields';
import {
    findFirstFieldOptionById,
    findFirstFieldRuleById,
    findFirstFieldRuleGroupById,
    findAllFieldCategoryActionsByFieldId,
    findCategoryById,
    findFirstFieldContextByFieldIdAndCondition,
    findFirstFieldById
} from './query';
import { getEmotion } from 'src/pipelines/emotions';
import { getSentiment } from 'src/pipelines/sentiment';
import { EvaluatedField } from '@packages/db/schemas/form-responses';

export type FieldContext =
    | { fieldId: string; condition: 'sentiment' | 'emotion'; value: string }
    | { fieldId: string; condition: 'answer'; value: string | string[] };

export type FieldRuleLog = {
    type: 'rule';
    targetFieldTitle: string;
    condition: string;
    operator: string;
    ruleValue: string;
    actualValue: string | string[];
    result: boolean;
};

export type FieldRuleGroupLog = {
    type: 'group';
    combinator: string;
    result: boolean;
    logs: (FieldRuleLog | FieldRuleGroupLog)[];
};

export function resolveFieldValue(value: string, field: Field, form: Form) {
    switch (field.type) {
        case FieldType.TEXT:
            return value;
        case FieldType.SELECTION:
            return findFirstFieldOptionById(value, form).content;
    }
}

function resolveFieldRuleOperator(
    operator: string,
    ruleValue: string,
    actualValue: string | string[]
) {
    switch (operator) {
        case 'is':
            return Array.isArray(actualValue)
                ? actualValue.includes(ruleValue)
                : actualValue === ruleValue;
        case 'is not':
            return Array.isArray(actualValue)
                ? !actualValue.includes(ruleValue)
                : actualValue !== ruleValue;
        default:
            throw new Error(`Unknown operator: ${operator}`);
    }
}

function evaluateFieldRule(ruleId: string, form: Form, contexts: FieldContext[]): FieldRuleLog {
    const rule = findFirstFieldRuleById(ruleId, form);
    const targetField = findFirstFieldById(rule.targetFieldId, form);
    const context = findFirstFieldContextByFieldIdAndCondition(
        rule.targetFieldId,
        rule.condition,
        contexts
    );

    const ruleValue = resolveFieldValue(rule.value, targetField, form);
    const actualValue = Array.isArray(context.value)
        ? context.value.map(val => resolveFieldValue(val, targetField, form))
        : resolveFieldValue(context.value, targetField, form);

    return {
        type: 'rule',
        targetFieldTitle: targetField.title,
        condition: rule.condition,
        operator: rule.operator,
        ruleValue,
        actualValue,
        result: resolveFieldRuleOperator(rule.operator, ruleValue, actualValue)
    };
}

function resolveFieldRuleGroupOperator(
    children: (FieldRuleLog | FieldRuleGroupLog)[],
    combinator: string
) {
    switch (combinator) {
        case 'AND':
            return children.every(c => c.result);
        case 'OR':
            return children.some(c => c.result);
        default:
            throw new Error(`Unknown field rule group combinator ${combinator}`);
    }
}

function evaluateFieldRuleGroup(
    ruleGroupId: string,
    form: Form,
    contexts: FieldContext[]
): FieldRuleGroupLog {
    const { childrenGroups, childrenRules, combinator } = findFirstFieldRuleGroupById(
        ruleGroupId,
        form
    );

    const childGroupLogs = childrenGroups.map(id => evaluateFieldRuleGroup(id, form, contexts));
    const childRuleLogs = childrenRules.map(id => evaluateFieldRule(id, form, contexts));
    const childrenLogs = [...childGroupLogs, ...childRuleLogs];

    return {
        type: 'group',
        result: resolveFieldRuleGroupOperator(childrenLogs, combinator),
        combinator,
        logs: childrenLogs
    };
}

async function resolveFieldContext<T extends FieldRawResponse>(
    { fieldId, response, fieldType }: T,
    condition: T['conditions'][number]
): Promise<FieldContext> {
    switch (fieldType) {
        case FieldType.TEXT:
            switch (condition) {
                case 'sentiment':
                    return { fieldId, condition, value: await getSentiment(response) };
                case 'emotion':
                    return { fieldId, condition, value: await getEmotion(response) };
            }
            break;
        case FieldType.SELECTION:
            switch (condition) {
                case 'answer':
                    return { fieldId, condition, value: response };
            }
    }
}

export async function getFieldEvaluationContexts(response: FieldRawResponse) {
    return await Promise.all(
        response.conditions.map(condition => resolveFieldContext(response, condition))
    );
}

export async function evaluateFields(
    response: FieldRawResponse,
    form: Form
): Promise<EvaluatedField[]> {
    const categoryActions = findAllFieldCategoryActionsByFieldId(response.fieldId, form);
    const contexts = await getFieldEvaluationContexts(response);

    return categoryActions.map(action => {
        const category = findCategoryById(action.targetCategoryId, form);
        const rootGroupLog = evaluateFieldRuleGroup(action.rootGroupId, form, contexts);

        return {
            score: {
                category: { name: category.category, color: category.color },
                operation: action.operation,
                points: action.points,
                result: rootGroupLog.result
            },
            logs: [rootGroupLog]
        };
    });
}
