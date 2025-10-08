import { v4 as uuid } from 'uuid';
import { InitialFieldStates, FieldType, RuleConfigMap, RuleConfigUpdatersMap } from './types';
import { updateSelectionAnswerValues } from './rules';

export const initialFieldStates: InitialFieldStates = {
    [FieldType.TEXT]: {
        settings: {
            required: true,
            analyseSentiment: true,
            extractKeywords: true,
            summarize: true
        },
        controls: {
            rules: {
                id: uuid(),
                combinator: 'AND',
                type: 'group',
                rules: []
            }
        }
    },
    [FieldType.SELECTION]: {
        settings: {
            required: true,
            singleSelection: false
        },
        controls: {
            options: [],
            rules: {
                id: uuid(),
                combinator: 'AND',
                type: 'group',
                rules: []
            }
        }
    }
};

export const ruleCombinators = ['AND', 'OR'] as const;

export const ruleConfig: RuleConfigMap = {
    [FieldType.TEXT]: [
        {
            condition: 'sentiment',
            operators: ['is'],
            values: ['POSITIVE', 'NEGATIVE']
        },
        {
            condition: 'emotion',
            operators: ['is'],
            values: ['ANGER', 'HAPPINESS']
        }
    ],
    [FieldType.SELECTION]: [
        {
            condition: 'answer',
            operators: ['is'],
            values: []
        }
    ]
};

export const ruleConfigUpdaters: RuleConfigUpdatersMap = {
    [FieldType.SELECTION]: updateSelectionAnswerValues
};
