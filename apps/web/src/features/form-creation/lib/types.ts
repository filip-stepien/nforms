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

export enum RuleValueSource {
    STATIC = 'static', // values are defined
    DYNAMIC = 'dynamic' // values are resolved at runtime
}

export type RuleConfig =
    | {
          condition: 'sentiment' | 'emotion';
          operators: string[];
          valueSource: RuleValueSource.STATIC;
          values: string[];
      }
    | {
          condition: 'answer';
          operators: string[];
          valueSource: RuleValueSource.DYNAMIC;
          values: string[];
      };

export type RuleConfigMap = Record<FieldType, RuleConfig[]>;

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

export type Field = {
    id: string;
    title: string;
    type: FieldType;
    settings: SettingsMap[FieldType];
    controls: ControlsMap[FieldType];
};

export type FieldUpdater = (field: Field | ((prev: Field) => Field)) => any;

export type InitialFieldStates = {
    [K in FieldType]: {
        settings: SettingsMap[K];
        controls: ControlsMap[K];
    };
};
