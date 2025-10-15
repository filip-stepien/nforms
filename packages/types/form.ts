export enum FieldType {
    TEXT = 'Text',
    SELECTION = 'Selection'
}

export const ruleCombinators = ['AND', 'OR'] as const;

export type RuleCombinator = (typeof ruleCombinators)[number];
