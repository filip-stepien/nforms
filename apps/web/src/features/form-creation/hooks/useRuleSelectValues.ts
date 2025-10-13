import { useAppSelector } from '@/hooks/useAppSelector';
import { FieldType } from '../state/slices/fields';
import { selectOptionsByFieldId } from '../state/slices/options';
import { useCallback } from 'react';

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
                values: ['POSITIVE', 'NEGATIVE']
            },
            {
                condition: 'emotion',
                operators: ['is1', 'is not1'],
                values: ['ANGER', 'HAPPINESS']
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
