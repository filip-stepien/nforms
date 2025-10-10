import { ruleCombinators } from './constants';

export type Rule = {
    id: string;
    type: 'rule';
    fieldId?: string;
    condition?: string;
    operator?: string;
    value?: string;
};

export type RuleCombinator = (typeof ruleCombinators)[number];

export type RuleGroup = {
    id: string;
    type: 'group';
    combinator: RuleCombinator;
    rules: (Rule | RuleGroup)[];
};

export type RuleConfigEntry = {
    condition: 'sentiment' | 'emotion' | 'answer';
    operators: string[];
    values: string[];
};

export type RuleConfigMap = Record<FieldType, RuleConfigEntry[]>;

export type RuleConfigUpdater = (ruleConfig: RuleConfigMap, field: Field) => RuleConfigMap;

export type RuleConfigUpdatersMap = {
    [K in FieldType]?: RuleConfigUpdater;
};

export type FieldOption = {
    id: string;
    content: string;
};

export enum FieldType {
    TEXT = 'Text',
    SELECTION = 'Selection'
}

export type BaseSettings = {
    required: boolean;
};

export type TextSettings = BaseSettings & {
    analyseSentiment: boolean;
    extractKeywords: boolean;
    summarize: true;
};

export type SelectionSettings = BaseSettings & {
    singleSelection: boolean;
};

export type OptionsControl = { options: FieldOption[] };

export type RulesControl = { rules: RuleGroup };

export type SettingsMap = {
    [FieldType.TEXT]: TextSettings;
    [FieldType.SELECTION]: SelectionSettings;
};

export type ControlsMap = {
    [FieldType.TEXT]: RulesControl;
    [FieldType.SELECTION]: OptionsControl & RulesControl;
};

export type FieldMap = {
    [T in FieldType]: {
        id: string;
        title: string;
        type: T;
        settings: SettingsMap[T];
        controls: ControlsMap[T];
    };
};

export type Field = FieldMap[FieldType];

export type FieldUpdater = (field: Field | ((prev: Field) => Field)) => any;
