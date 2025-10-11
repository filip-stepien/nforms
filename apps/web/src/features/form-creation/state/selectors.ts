import { RootState } from '@/lib/store';
import { FieldType } from './slices/fields';
import { FieldSettingsMap } from './slices/settings';

export const selectField = (state: RootState, fieldId: string) => {
    const field = state.formFields.find(f => f.id === fieldId);

    if (!field) {
        throw new Error(`Field with ID "${fieldId}" does not exist in fields slice.`);
    }

    return field;
};

export const selectFieldSettings = <T extends FieldType>(state: RootState, fieldId: string) => {
    const fieldSettings = state.fieldSettings.find(f => f.fieldId === fieldId);

    if (!fieldSettings) {
        throw new Error(`Settings with field ID "${fieldId}" does not exist in settings slice.`);
    }

    return fieldSettings.settings as FieldSettingsMap[T];
};

export const selectFieldOptions = (state: RootState, fieldId: string) => {
    const field = state.fieldOptions.find(f => f.fieldId === fieldId);

    if (!field) {
        throw new Error(`Field with ID "${fieldId}" does not exist in options slice.`);
    }

    return field.options;
};

export const selectOption = (state: RootState, fieldId: string, optionId: string) => {
    const fieldOptions = selectFieldOptions(state, fieldId);
    const option = fieldOptions.find(opt => opt.id === optionId);

    if (!option) {
        throw new Error(`Option with ID "${optionId}" does not exist in options slice.`);
    }

    return option;
};

export const selectFieldRules = (state: RootState, fieldId: string) => {
    const rules = state.fieldRules.find(f => f.fieldId === fieldId);

    if (!rules) {
        throw new Error(`Field with ID "${fieldId}" does not exist in rules slice.`);
    }

    return { ...rules, rootGroupId: rules.rootGroupId as string };
};

export const selectRuleGroup = (state: RootState, fieldId: string, groupId: string) => {
    const fieldRules = selectFieldRules(state, fieldId);
    const group = fieldRules.groups.find(g => g.id === groupId);

    if (!group) {
        throw new Error(`Rule group with ID "${groupId}" does not exist in rules slice.`);
    }

    return group;
};

export const selectRule = (state: RootState, fieldId: string, ruleId: string) => {
    const fieldRules = selectFieldRules(state, fieldId);
    const rule = fieldRules.rules.find(g => g.id === ruleId);

    if (!rule) {
        throw new Error(`Rule with ID "${ruleId}" does not exist in rules slice.`);
    }

    return rule;
};
