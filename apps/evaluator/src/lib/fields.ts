import { Form } from '@packages/db/schemas/form/form';
import { getEmotion } from 'src/pipelines/emotions';
import { getSentiment } from 'src/pipelines/sentiment';
import { CategoryContext } from './categories';
import { Field, FieldType } from '@packages/db/schemas/form/form-fields';
import { FieldResponse } from './responses';

export type FieldContext =
    | {
          condition: 'sentiment' | 'emotion';
          value: string;
      }
    | {
          condition: 'answer';
          value: string | string[];
      };

export type FieldContextGroup = {
    fieldId: string;
    context: FieldContext[];
};

export type FieldRuleLog = {
    type: 'rule';
    targetFieldTitle: string;
    leftValue: string | string[];
    operator: string;
    rightValue: string;
    result: boolean;
};

export type FieldRuleGroupLog = {
    type: 'group';
    combinator: string;
    result: boolean;
    score: number;
    logs: (FieldRuleLog | FieldRuleGroupLog)[];
};

export type FieldRuleEvalFunction = (context: FieldContextGroup[]) => FieldRuleLog;

export type FieldRuleGroupEvalFunction = (context: FieldContextGroup[]) => FieldRuleGroupLog;

export type FieldCategoryEvaluation = {
    categoryId: string;
    getScore: () => number;
    evaluate: FieldRuleGroupEvalFunction;
};

export type FieldCategoryEvaluationGroup = {
    fieldId: string;
    categoryEvals: FieldCategoryEvaluation[];
};

export function findFieldById(fieldId: string, form: Form) {
    const field = form.fields.find(f => f.id === fieldId);

    if (!field) {
        throw new Error(`Field ${fieldId} not found`);
    }

    return field;
}

function findFieldOptionById(optionId: string, form: Form) {
    const option = form.fieldOptions.find(opt => opt.id === optionId);

    if (!option) {
        throw new Error(`Field option ${optionId} not found`);
    }

    return option;
}

function findFieldRuleById(ruleId: string, form: Form) {
    const rule = form.fieldRules.rules.find(r => r.id === ruleId);

    if (!rule) {
        throw new Error(`Field rule ${ruleId} not found`);
    }

    return rule;
}

function findFieldRuleGroupById(groupId: string, form: Form) {
    const group = form.fieldRules.groups.find(g => g.id === groupId);

    if (!group) {
        throw new Error(`Field rule group ${groupId} not found`);
    }

    return group;
}

function findFieldContext(fieldId: string, condition: string, context: FieldContextGroup[]) {
    const fieldContextGroup = context.find(ctx => ctx.fieldId === fieldId)?.context;
    const fieldContext = fieldContextGroup?.find(ctx => ctx.condition === condition);

    if (!fieldContext) {
        throw new Error(`Cannot resolve context for field ${fieldId}`);
    }

    return fieldContext;
}

export function findFieldScoreEvaluatorGroupByFieldId(
    fieldId: string,
    evalGroups: FieldCategoryEvaluationGroup[]
) {
    const evalGroup = evalGroups.find(e => e.fieldId === fieldId);

    if (!evalGroup) {
        throw new Error(`Score evaluation group for field ${fieldId} not found`);
    }

    return evalGroup;
}

function resolveFieldRuleOperator(
    operator: string,
    expectedValue: string,
    actualValue: string | string[]
) {
    switch (operator) {
        case 'is':
            return Array.isArray(actualValue)
                ? actualValue.includes(expectedValue)
                : actualValue === expectedValue;
        case 'is not':
            return Array.isArray(actualValue)
                ? !actualValue.includes(expectedValue)
                : actualValue !== expectedValue;
        default:
            throw new Error(`Unknown operator: ${operator}`);
    }
}

export function resolveFieldValue(value: string, field: Field, form: Form) {
    switch (field.type) {
        case FieldType.TEXT:
            return value;
        case FieldType.SELECTION:
            return findFieldOptionById(value, form).content;
    }
}

function getFieldRuleEvaluator(ruleId: string, form: Form): FieldRuleEvalFunction {
    const rule = findFieldRuleById(ruleId, form);

    const evaluate: FieldRuleEvalFunction = context => {
        const targetField = findFieldById(rule.targetFieldId, form);
        const fieldContext = findFieldContext(rule.targetFieldId, rule.condition, context);
        const expectedValue = resolveFieldValue(rule.value, targetField, form);

        const actualValue = Array.isArray(fieldContext.value)
            ? fieldContext.value.map(val => resolveFieldValue(val, targetField, form))
            : resolveFieldValue(fieldContext.value, targetField, form);

        return {
            type: 'rule',
            targetFieldTitle: findFieldById(rule.targetFieldId, form).title,
            leftValue: actualValue,
            operator: rule.operator,
            rightValue: expectedValue,
            result: resolveFieldRuleOperator(rule.operator, expectedValue, actualValue)
        };
    };

    return evaluate;
}

function resolveFieldRuleGroupOperator(
    children: (FieldRuleEvalFunction | FieldRuleGroupEvalFunction)[],
    combinator: string,
    context: FieldContextGroup[]
) {
    const logs: (FieldRuleLog | FieldRuleGroupLog)[] = [];
    let result = false;

    const evaluateChildren = (fn: FieldRuleEvalFunction | FieldRuleGroupEvalFunction) => {
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

export function getFieldRuleGroupEvaluator(
    groupId: string,
    form: Form
): FieldRuleGroupEvalFunction {
    const { childrenGroups, childrenRules, combinator } = findFieldRuleGroupById(groupId, form);

    const childGroups = childrenGroups.map(id => getFieldRuleGroupEvaluator(id, form));
    const childRules = childrenRules.map(id => getFieldRuleEvaluator(id, form));
    const children = [...childGroups, ...childRules];

    const evaluate: FieldRuleGroupEvalFunction = context => {
        const { result, logs } = resolveFieldRuleGroupOperator(children, combinator, context);

        return {
            type: 'group',
            result,
            combinator,
            logs,
            score: 0
        };
    };

    return evaluate;
}

async function resolveFieldContext<T extends FieldResponse>(
    { response, fieldType }: T,
    condition: T['conditions'][number]
): Promise<FieldContext> {
    switch (fieldType) {
        case FieldType.TEXT:
            switch (condition) {
                case 'sentiment':
                    return { condition, value: await getSentiment(response) };
                case 'emotion':
                    return { condition, value: await getEmotion(response) };
            }
            break;

        case FieldType.SELECTION:
            switch (condition) {
                case 'answer':
                    return { condition, value: response };
            }
    }
}

export async function getFieldEvaluationContext(
    responses: FieldResponse[]
): Promise<FieldContextGroup[]> {
    return Promise.all(
        responses.map(async response => ({
            fieldId: response.fieldId,
            context: await Promise.all(
                response.conditions.map(condition => resolveFieldContext(response, condition))
            )
        }))
    );
}

function resolveFieldScoreOperation(operation: string, points: number) {
    switch (operation) {
        case 'ADD':
            return points;
        case 'SUBTRACT':
            return -points;
        default:
            throw new Error(`Unknown field score operation: ${operation}`);
    }
}

export function getFieldCategoryScoreEvaluators(
    responses: FieldResponse[],
    form: Form
): FieldCategoryEvaluationGroup[] {
    return responses.map(response => ({
        fieldId: response.fieldId,
        categoryEvals: form.fieldRules.categoryActions
            .filter(action => action.fieldId === response.fieldId)
            .map(action => ({
                categoryId: action.targetCategoryId,
                evaluate: getFieldRuleGroupEvaluator(action.rootGroupId, form),
                getScore: () => resolveFieldScoreOperation(action.operation, action.points)
            }))
    }));
}

export function evaluateFields(
    fieldCategoryEvals: FieldCategoryEvaluation[],
    fieldCtx: FieldContextGroup[],
    categoryCtx: CategoryContext[]
) {
    const scoresMap = new Map(categoryCtx.map(c => [c.categoryId, { ...c }]));
    const logs: FieldRuleGroupLog[] = [];

    for (const { categoryId, evaluate, getScore } of fieldCategoryEvals) {
        const log = evaluate(fieldCtx);

        if (!log.result) {
            continue;
        }

        const score = scoresMap.get(categoryId);

        if (score) {
            const addedScore = getScore();
            score.value += addedScore;
            logs.push({ ...log, score: addedScore });
        }
    }

    return { scores: Array.from(scoresMap.values()), logs };
}
