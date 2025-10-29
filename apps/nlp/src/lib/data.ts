import {
    FieldResponseData,
    FieldResponseQueueJobData,
    FieldResponseQueueJobResult,
    GroupLog,
    RuleLog
} from '@packages/queue';
import { FieldRules } from '@packages/db/schemas/form/field-rules';
import { FieldType } from '@packages/db/schemas/form/form-fields';
import { getSentiment } from 'src/pipelines/sentiment';
import { getEmotion } from 'src/pipelines/emotions';

type FieldEvalContext =
    | {
          fieldId: string;
          fieldType: FieldType.TEXT;
          context: {
              condition: 'sentiment' | 'emotion';
              value: string;
          }[];
      }
    | {
          fieldId: string;
          fieldType: FieldType.SELECTION;
          context: {
              condition: 'answer';
              value: string | string[];
          }[];
      };

type EvalFunction = (context: FieldEvalContext[]) => { result: boolean; log: RuleLog | GroupLog };

type CategoryScore = { categoryId: string; score: number };

type CategoryEval = {
    categoryId: string;
    getScore: () => CategoryScore;
    evaluate: EvalFunction;
};

type FieldScoreEval = {
    fieldId: string;
    categories: CategoryEval[];
};

function getRuleEval(ruleId: string, fieldRules: FieldRules): EvalFunction {
    const rule = fieldRules.rules.find(r => r.id === ruleId);

    if (!rule) {
        throw new Error(`Rule ${ruleId} not found`);
    }

    const evaluate: EvalFunction = context => {
        const rightValue = rule.value;
        const leftValue = context
            .find(ctx => ctx.fieldId === rule.targetFieldId)
            .context.find(ctx => ctx.condition === rule.condition).value;

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
            result,
            log: {
                type: 'rule',
                targetFieldId: rule.targetFieldId,
                leftValue,
                operator: rule.operator,
                rightValue,
                result
            }
        };
    };

    return evaluate;
}

function buildGroupEval(groupId: string, fieldRules: FieldRules): EvalFunction {
    const group = fieldRules.groups.find(g => g.id === groupId);

    if (!group) {
        throw new Error(`Group ${groupId} not found`);
    }

    const childGroups = group.childrenGroups.map(id => buildGroupEval(id, fieldRules));
    const childRules = group.childrenRules.map(id => getRuleEval(id, fieldRules));
    const children = [...childGroups, ...childRules];

    const evaluate: EvalFunction = context => {
        const logs = [];
        let result = false;

        const evaluateRule = (fn: EvalFunction) => {
            const { result, log } = fn(context);
            logs.push(log);
            return result;
        };

        switch (group.combinator) {
            case 'AND':
                result = children.every(evaluateRule);
                break;
            case 'OR':
                result = children.some(evaluateRule);
                break;
            default:
                throw new Error(`Unknown group combinator: ${group.combinator}`);
        }

        return {
            result,
            log: {
                type: 'group',
                result,
                combinator: group.combinator,
                logs
            }
        };
    };

    return evaluate;
}

export function getFieldScoreEvals(
    responses: FieldResponseData[],
    rules: FieldRules
): FieldScoreEval[] {
    return responses.map(response => {
        const categoryActions = rules.categoryActions.filter(
            action => action.fieldId === response.fieldId
        );

        const categories: CategoryEval[] = [];
        for (const action of categoryActions) {
            const evaluate = buildGroupEval(action.rootGroupId, rules);
            const getScore = () => {
                switch (action.operation) {
                    case 'ADD':
                        return { categoryId: action.targetCategoryId, score: action.points };
                    case 'SUBTRACT':
                        return { categoryId: action.targetCategoryId, score: -action.points };
                    default:
                        throw new Error(`Unknown action operation: ${action.operation}`);
                }
            };

            categories.push({ categoryId: action.targetCategoryId, evaluate, getScore });
        }

        return { fieldId: response.fieldId, categories };
    });
}

export async function createFieldsEvalContext(
    responses: FieldResponseData[]
): Promise<FieldEvalContext[]> {
    const fieldEvalContext: FieldEvalContext[] = [];

    for (const { fieldType, fieldId, requiredProcessings, response } of responses) {
        switch (fieldType) {
            case FieldType.TEXT: {
                const context = requiredProcessings.map(async processing => {
                    switch (processing) {
                        case 'sentiment':
                            return {
                                condition: processing,
                                value: await getSentiment(response)
                            };
                        case 'emotion':
                            return {
                                condition: processing,
                                value: await getEmotion(response)
                            };
                        default:
                            throw new Error(`Unknown text field processing: ${processing}`);
                    }
                });

                fieldEvalContext.push({ fieldId, fieldType, context: await Promise.all(context) });
                break;
            }

            case FieldType.SELECTION: {
                const context = requiredProcessings.map(processing => {
                    switch (processing) {
                        case 'answer':
                            return {
                                condition: processing,
                                value: response
                            };
                        default:
                            throw new Error(`Unknown selection field processing: ${processing}`);
                    }
                });

                fieldEvalContext.push({ fieldId, fieldType, context });
                break;
            }
        }
    }

    return fieldEvalContext;
}

export async function doFieldResponseProcessingJob(
    job: FieldResponseQueueJobData
): Promise<FieldResponseQueueJobResult> {
    const evals = getFieldScoreEvals(job.responses, job.rules);
    const context = await createFieldsEvalContext(job.responses);

    return {
        email: job.email,
        formId: job.formId,
        responses: job.responses.map(response => {
            const categoryEvals = evals.find(e => e.fieldId === response.fieldId);
            const logs: (RuleLog | GroupLog)[] = [];
            const scores: CategoryScore[] = job.categories.map(({ id: categoryId }) => ({
                categoryId,
                score: 0
            }));

            for (const categoryEval of categoryEvals.categories) {
                const { result, log } = categoryEval.evaluate(context);
                const categoryScore = scores.find(s => s.categoryId === categoryEval.categoryId);
                const newScore = categoryEval.getScore();

                if (result) {
                    categoryScore.score += newScore.score;
                }

                logs.push(log);
            }

            return {
                fieldId: response.fieldId,
                response: response.response,
                scores,
                logs
            };
        })
    };
}
