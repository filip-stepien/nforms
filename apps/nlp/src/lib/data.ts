import {
    CategoryScore,
    FieldResponse,
    FieldResponseQueueJob,
    FieldResponseQueueJobResult,
    FieldRuleGroupLog,
    FieldRuleLog,
    CategoryRuleLog,
    CategoryRuleGroupLog,
    FieldResponseResult
} from '@packages/queue';
import { getSentiment } from 'src/pipelines/sentiment';
import { getEmotion } from 'src/pipelines/emotions';
import { FieldType } from '@packages/db/schemas/form/form-fields';
import { Form } from '@packages/db/schemas/form/form';

type EvalContext =
    | {
          condition: 'sentiment' | 'emotion';
          value: string;
      }
    | {
          condition: 'answer';
          value: string | string[];
      };

type FieldEvalContext = {
    fieldId: string;
    context: EvalContext[];
};

type FieldRuleEvalFunction = (context: FieldEvalContext[]) => FieldRuleLog;

type FieldRuleGroupEvalFunction = (context: FieldEvalContext[]) => FieldRuleGroupLog;

type CategoryRuleEvalFunction = (context: CategoryScore[]) => CategoryRuleLog;

type CategoryRuleGroupEvalFunction = (context: CategoryScore[]) => CategoryRuleGroupLog;

type FieldCategoryEval = {
    categoryId: string;
    getScore: () => number;
    evaluate: FieldRuleGroupEvalFunction;
};

type FieldScoreEval = {
    fieldId: string;
    categories: FieldCategoryEval[];
};

function getFieldRuleEval(ruleId: string, form: Form): FieldRuleEvalFunction {
    const rule = form.fieldRules.rules.find(r => r.id === ruleId);

    if (!rule) {
        throw new Error(`Rule ${ruleId} not found`);
    }

    const evaluate: FieldRuleEvalFunction = fieldContext => {
        const context = fieldContext.find(ctx => ctx.fieldId === rule.targetFieldId)?.context;

        const rightValue = rule.value;
        const leftValue = context?.find(ctx => ctx.condition === rule.condition)?.value;

        if (!leftValue || !rightValue) {
            throw new Error(`Unable to resolve context for rule ${rule.id}`);
        }

        let result = false;
        switch (rule.operator) {
            case 'is':
                result = Array.isArray(leftValue)
                    ? leftValue.includes(rightValue)
                    : leftValue === rightValue;
                break;
            case 'is not':
                result = Array.isArray(leftValue)
                    ? !leftValue.includes(rightValue)
                    : leftValue !== rightValue;
                break;
            default:
                throw new Error(`Unknown rule operator: ${rule.operator}`);
        }

        return {
            type: 'rule',
            targetFieldId: rule.targetFieldId,
            leftValue,
            operator: rule.operator,
            rightValue,
            result
        };
    };

    return evaluate;
}

function getFieldRuleGroupEval(groupId: string, form: Form): FieldRuleGroupEvalFunction {
    const group = form.fieldRules.groups.find(g => g.id === groupId);

    if (!group) {
        throw new Error(`Group ${groupId} not found`);
    }

    const childGroups = group.childrenGroups.map(id => getFieldRuleGroupEval(id, form));
    const childRules = group.childrenRules.map(id => getFieldRuleEval(id, form));
    const children = [...childGroups, ...childRules];

    const evaluate: FieldRuleGroupEvalFunction = context => {
        const logs = [];
        let result = false;

        const evaluateChildren = (fn: FieldRuleEvalFunction | FieldRuleGroupEvalFunction) => {
            const log = fn(context);
            logs.push(log);
            return log.result;
        };

        switch (group.combinator) {
            case 'AND':
                result = children.every(evaluateChildren);
                break;
            case 'OR':
                result = children.some(evaluateChildren);
                break;
            default:
                throw new Error(`Unknown group combinator: ${group.combinator}`);
        }

        return {
            type: 'group',
            result,
            combinator: group.combinator,
            logs,
            score: 0
        };
    };

    return evaluate;
}

function getFieldCategoryScoreEvals(responses: FieldResponse[], form: Form): FieldScoreEval[] {
    return responses.map(response => ({
        fieldId: response.fieldId,
        categories: form.fieldRules.categoryActions
            .filter(action => action.fieldId === response.fieldId)
            .map(action => ({
                categoryId: action.targetCategoryId,
                evaluate: getFieldRuleGroupEval(action.rootGroupId, form),
                getScore: () => {
                    switch (action.operation) {
                        case 'ADD':
                            return action.points;
                        case 'SUBTRACT':
                            return -action.points;
                        default:
                            throw new Error(`Unknown action operation: ${action.operation}`);
                    }
                }
            }))
    }));
}

async function getFieldEvalContext(responses: FieldResponse[]): Promise<FieldEvalContext[]> {
    return Promise.all(
        responses.map(async ({ response, fieldId, fieldType, conditions }) => {
            switch (fieldType) {
                case FieldType.TEXT: {
                    return {
                        fieldId,
                        context: await Promise.all(
                            conditions.map(async condition => {
                                switch (condition) {
                                    case 'sentiment':
                                        return { condition, value: await getSentiment(response) };
                                    case 'emotion':
                                        return { condition, value: await getEmotion(response) };
                                }
                            })
                        )
                    };
                }

                default:
                    return {
                        fieldId,
                        context: conditions.map(condition => ({ condition, value: response }))
                    };
            }
        })
    );
}

function getCategoryRuleEval(ruleId: string, form: Form): CategoryRuleEvalFunction {
    const rule = form.respondentCategoryRules.rules.find(r => r.id === ruleId);

    if (!rule) {
        throw new Error(`Category rule ${ruleId} not found`);
    }

    const evaluate: CategoryRuleEvalFunction = categoryContext => {
        console.log(categoryContext);
        const context = categoryContext.find(ctx => ctx.categoryId === rule.categoryId);

        const rightValue = rule.value;
        const leftValue = context?.value;

        if (leftValue === undefined || rightValue === undefined) {
            throw new Error(`Unable to resolve context for category rule ${rule.id}`);
        }

        let result = false;
        switch (rule.operator) {
            case 'is greater than':
                result = leftValue > rightValue;
                break;
            case 'is less than':
                result = leftValue < rightValue;
                break;
            case 'equals':
                result = leftValue === rightValue;
                break;
            default:
                throw new Error(`Unknown category rule operator: ${rule.operator}`);
        }

        return {
            type: 'rule',
            leftValue,
            operator: rule.operator,
            rightValue,
            result
        };
    };

    return evaluate;
}

function getCategoryRuleGroupEval(groupId: string, form: Form): CategoryRuleGroupEvalFunction {
    const group = form.respondentCategoryRules.groups.find(g => g.id === groupId);

    if (!group) {
        throw new Error(`CAtegory rule group ${groupId} not found`);
    }

    const childGroups = group.childrenGroups.map(id => getCategoryRuleGroupEval(id, form));
    const childRules = group.childrenRules.map(id => getCategoryRuleEval(id, form));
    const children = [...childGroups, ...childRules];

    const evaluate: CategoryRuleGroupEvalFunction = context => {
        const logs = [];
        let result = false;

        const evaluateChildren = (fn: CategoryRuleEvalFunction | CategoryRuleGroupEvalFunction) => {
            const log = fn(context);
            logs.push(log);
            return log.result;
        };

        switch (group.combinator) {
            case 'AND':
                result = children.every(evaluateChildren);
                break;
            case 'OR':
                result = children.some(evaluateChildren);
                break;
            default:
                throw new Error(`Unknown group combinator: ${group.combinator}`);
        }

        return {
            type: 'group',
            result,
            combinator: group.combinator,
            logs
        };
    };

    return evaluate;
}

function evaluateCategories(scores: CategoryScore[], form: Form) {
    console.log(scores);

    return form.respondentCategoryRules.relations.map(({ categoryId, rootGroupId }) => {
        const evaluate = getCategoryRuleGroupEval(rootGroupId, form);
        const evalResult = evaluate(scores);

        return {
            categoryId,
            totalScore: scores.find(score => score.categoryId === categoryId)?.value ?? 0,
            assigned: evalResult.result,
            logs: evalResult
        };
    });
}

async function getResponses(
    responses: FieldResponse[],
    form: Form
): Promise<FieldResponseResult[]> {
    const scoreEvals = getFieldCategoryScoreEvals(responses, form);
    const context = await getFieldEvalContext(responses);

    return responses.map(response => {
        const evals = scoreEvals.find(e => e.fieldId === response.fieldId);
        const initialScores: CategoryScore[] = form.respondentCategories.map(({ id }) => ({
            categoryId: id,
            value: 0
        }));

        const { scores, logs: fieldRuleLogs } = evals.categories.reduce<{
            scores: CategoryScore[];
            logs: FieldRuleGroupLog[];
        }>(
            (acc, { categoryId, evaluate, getScore }) => {
                const log = evaluate(context);
                const newScore = log.result ? getScore() : 0;

                if (newScore > 0) {
                    acc.scores = acc.scores.map(score =>
                        score.categoryId === categoryId
                            ? { ...score, value: score.value + newScore }
                            : score
                    );
                }

                acc.logs.push(log.type === 'group' ? { ...log, score: newScore } : log);

                return acc;
            },
            { scores: initialScores, logs: [] }
        );

        return {
            fieldId: response.fieldId,
            response: response.response,
            fieldRuleLogs,
            categoryRuleLogs: evaluateCategories(scores, form)
        };
    });
}

export async function doResponseProcessingJob({
    email,
    form,
    responses
}: FieldResponseQueueJob): Promise<FieldResponseQueueJobResult> {
    return {
        email,
        formId: form.id,
        responses: await getResponses(responses, form)
    };
}
