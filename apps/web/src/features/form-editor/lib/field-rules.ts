import { FieldRulesState } from '../state/field-rules';

type FieldContext = {
    [key: string]: {
        [key: string]: any;
    };
};

type EvaluateFunction = (context: FieldContext) => { result: boolean; log: string };

type ScoringTree = {
    fieldId: string;
    getScore: () => number;
    evaluate: EvaluateFunction;
};

function getRuleEval(ruleId: string, fieldRules: FieldRulesState): EvaluateFunction {
    const rule = fieldRules.rules.entities[ruleId];

    const evaluate = (context: FieldContext) => {
        const leftValue = context[rule.targetFieldId][rule.condition];
        const rightValue = rule.value;

        if (!leftValue || !rightValue) {
            return {
                result: false,
                log: ''
            };
        }

        let result = false;
        switch (rule.operator) {
            case 'is':
                result = leftValue === rightValue;
                break;
            case 'is not':
                result = leftValue !== rightValue;
                break;
            default:
                result = false;
                console.warn(`Unknown rule operator: ${rule.operator}`);
                break;
        }

        return {
            result,
            log: `${rule.targetFieldId} ${leftValue} ${rule.operator} ${rightValue} ${result ? '✅' : '❌'}`
        };
    };

    return evaluate;
}

function buildGroupEval(groupId: string, fieldRules: FieldRulesState): EvaluateFunction {
    const group = fieldRules.groups.entities[groupId];

    const childGroups = group.childrenGroups.map(id => buildGroupEval(id, fieldRules));
    const childRules = group.childrenRules.map(id => getRuleEval(id, fieldRules));
    const children = [...childGroups, ...childRules];

    const evaluate = (context: FieldContext) => {
        let result = false;
        let groupLog = '';

        const evaluateRule = (fn: EvaluateFunction) => {
            const { result, log } = fn(context);
            groupLog += `${log}\n${group.combinator}\n`;
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
                result = false;
                console.warn(`Unknown group combinator: ${group.combinator}`);
                break;
        }

        return { result, log: groupLog.split('\n').slice(0, -2).join('\n') };
    };

    return evaluate;
}

export function getFieldScoringTrees(
    fieldIds: string[],
    fieldRules: FieldRulesState
): ScoringTree[] {
    return fieldRules.categoryActions.ids
        .map(id => fieldRules.categoryActions.entities[id])
        .filter(action => fieldIds.includes(action.fieldId))
        .map(action => {
            const evaluate = buildGroupEval(action.rootGroupId, fieldRules);

            const getScore = () => {
                switch (action.operation) {
                    case 'ADD':
                        return action.points;
                    case 'SUBTRACT':
                        return -action.points;
                    default:
                        console.warn(`Unknown action operation: ${action.operation}`);
                        return 0;
                }
            };

            return { fieldId: action.fieldId, getScore, evaluate };
        });
}

export function getFieldScores(
    scoringTrees: ScoringTree[],
    context: FieldContext
): Record<string, number> {
    const scores: Record<string, number> = {};

    for (const tree of scoringTrees) {
        const evaluateResult = tree.evaluate(context);

        console.log(evaluateResult.log);

        if (evaluateResult.result) {
            const score = tree.getScore();

            if (!scores[tree.fieldId]) {
                scores[tree.fieldId] = 0;
            }

            scores[tree.fieldId] += score;

            console.log(`Result: ✅ (${score > 0 ? `+${score}` : `-${score}`})\n`);
        } else {
            console.log('Result: ❌\n');
        }
    }

    return scores;
}

const fieldRules: FieldRulesState = {
    categoryActions: {
        ids: ['add-positive', 'add-emotion', 'sub-negative'],
        entities: {
            'add-positive': {
                id: 'add-positive',
                fieldId: 'sentiment-field',
                rootGroupId: 'group-positive',
                operation: 'ADD',
                points: 2,
                targetCategoryId: 'category-positive'
            },
            'add-emotion': {
                id: 'add-emotion',
                fieldId: 'emotion-field',
                rootGroupId: 'group-emotion',
                operation: 'ADD',
                points: 1,
                targetCategoryId: 'category-emotion'
            },
            'sub-negative': {
                id: 'sub-negative',
                fieldId: 'sentiment-field',
                rootGroupId: 'group-negative',
                operation: 'SUBTRACT',
                points: 2,
                targetCategoryId: 'category-negative'
            }
        }
    },

    rules: {
        ids: ['rule-positive', 'rule-emotion-high', 'rule-joy', 'rule-love', 'rule-negative'],
        entities: {
            'rule-positive': {
                id: 'rule-positive',
                fieldId: 'sentiment-field',
                type: 'rule',
                targetFieldId: 'sentiment-field',
                condition: 'sentiment',
                operator: 'is',
                value: 'POSITIVE'
            },
            'rule-emotion-high': {
                id: 'rule-emotion-high',
                fieldId: 'emotion-field',
                type: 'rule',
                targetFieldId: 'emotion-field',
                condition: 'emotion',
                operator: 'is',
                value: 'JOY'
            },
            'rule-joy': {
                id: 'rule-joy',
                fieldId: 'emotion-field',
                type: 'rule',
                targetFieldId: 'emotion-field',
                condition: 'emotion',
                operator: 'is',
                value: 'JOY'
            },
            'rule-love': {
                id: 'rule-love',
                fieldId: 'emotion-field',
                type: 'rule',
                targetFieldId: 'emotion-field',
                condition: 'emotion',
                operator: 'is',
                value: 'LOVE'
            },
            'rule-negative': {
                id: 'rule-negative',
                type: 'rule',
                fieldId: 'sentiment-field',
                targetFieldId: 'sentiment-field',
                condition: 'sentiment',
                operator: 'is',
                value: 'NEGATIVE'
            }
        }
    },

    groups: {
        ids: ['group-positive', 'group-positive-combo', 'group-emotion', 'group-negative'],
        entities: {
            'group-positive-combo': {
                id: 'group-positive-combo',
                fieldId: 'sentiment-field',
                type: 'group',
                combinator: 'AND',
                childrenGroups: [],
                childrenRules: ['rule-positive', 'rule-emotion-high']
            },
            'group-positive': {
                id: 'group-positive',
                fieldId: 'sentiment-field',
                type: 'group',
                combinator: 'AND',
                childrenGroups: ['group-positive-combo'], // zagnieżdżona grupa
                childrenRules: []
            },
            'group-emotion': {
                id: 'group-emotion',
                fieldId: 'emotion-field',
                type: 'group',
                combinator: 'OR',
                childrenGroups: [],
                childrenRules: ['rule-joy', 'rule-love']
            },
            'group-negative': {
                id: 'group-negative',
                fieldId: 'sentiment-field',
                type: 'group',
                combinator: 'AND',
                childrenGroups: [],
                childrenRules: ['rule-negative']
            }
        }
    }
};

const context: FieldContext = {
    'sentiment-field': { sentiment: 'POSITIVE' },
    'emotion-field': { emotion: 'JOY' }
};

const scoringTrees = getFieldScoringTrees(['sentiment-field', 'emotion-field'], fieldRules);

const fieldScores = getFieldScores(scoringTrees, context);

console.log(fieldScores);
