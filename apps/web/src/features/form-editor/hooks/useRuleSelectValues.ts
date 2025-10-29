import { useAppSelector } from '@/hooks/useAppSelector';
import { selectOptionsByFieldId } from '../state/field-options';
import { useCallback } from 'react';
import { FieldType } from '@packages/db/schemas/form/form-fields';

export type RuleLabeledValue = { label: string; value: string };

export type RuleSelectValue = {
    condition: string;
    operators: string[];
    values: string[] | RuleLabeledValue[];
};

export type RuleSelectValues = Record<FieldType, RuleSelectValue[]>;

export function useRuleSelectValues(fieldId: string) {
    const options = useAppSelector(selectOptionsByFieldId(fieldId));

    const isLabeledValue = (v: string | object): v is RuleLabeledValue =>
        typeof v === 'object' && 'label' in v && 'value' in v;

    const transformValue = useCallback(
        (valueObj: string | RuleLabeledValue) =>
            isLabeledValue(valueObj) ? valueObj.value : valueObj,
        []
    );

    const selectValues: RuleSelectValues = {
        [FieldType.TEXT]: [
            {
                condition: 'sentiment',
                operators: ['is', 'is not'],
                values: ['positive', 'negative', 'unknown']
            },
            {
                condition: 'emotion',
                operators: ['is', 'is not'],
                values: ['anger', 'happiness']
            }
        ],
        [FieldType.SELECTION]: [
            {
                condition: 'answer',
                operators: ['is'],
                values: options.map(f => ({ label: f.content, value: f.id }))
            }
        ]
    };
    return {
        selectValues,
        transformValue
    };
}
