import { Group, Select } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { IconButton } from '../../ui/IconButton';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { selectFieldById, selectFields } from '@/features/form-creation/state/fields';
import { deleteRule, selectRuleById, setRule } from '@/features/form-creation/state/rules';
import { useRuleSelectValues } from '@/features/form-creation/hooks/useRuleSelectValues';
import { useAppStore } from '@/hooks/useAppStore';
import { DefaultValueSelect } from './DefaultValueSelect';

type Props = {
    ruleId: string;
    groupId: string;
};

export function RuleRow({ ruleId, groupId }: Props) {
    const { targetFieldId, operator, condition, value } = useAppSelector(state =>
        selectRuleById(state, ruleId)
    );
    const dispatch = useAppDispatch();
    const store = useAppStore();
    const fieldType = useAppSelector(state => selectFieldById(state, targetFieldId).type);
    const fields = useAppSelector(state => selectFields(state));
    const { selectValues, transformValue } = useRuleSelectValues(targetFieldId);

    const handleTargetFieldChange = (targetFieldId: string | null) => {
        if (targetFieldId) {
            const state = store.getState();
            const newFieldType = selectFieldById(state, targetFieldId).type;
            const firstValuesRecord = selectValues[newFieldType][0];

            dispatch(
                setRule({
                    ruleId,
                    rule: {
                        targetFieldId,
                        condition: firstValuesRecord.condition,
                        operator: firstValuesRecord.operators[0],
                        value: transformValue(firstValuesRecord.values[0])
                    }
                })
            );
        }
    };

    const handleConditionChange = (condition: string | null) => {
        if (condition && fieldType) {
            const valuesByCondition = selectValues[fieldType].find(v => v.condition === value)!;
            const firstOperator = valuesByCondition?.operators[0];
            const firstValue = valuesByCondition?.values[0];

            dispatch(
                setRule({
                    ruleId,
                    rule: {
                        condition,
                        operator: firstOperator,
                        value: transformValue(firstValue)
                    }
                })
            );
        }
    };

    const handleOperatorChange = (operator: string | null) => {
        if (operator) {
            dispatch(setRule({ ruleId, rule: { operator } }));
        }
    };

    const handleValueChange = (value: string | null) => {
        if (value) {
            dispatch(setRule({ ruleId, rule: { value } }));
        }
    };

    const handleRuleDelete = () => {
        dispatch(deleteRule({ groupId, ruleId }));
    };

    return (
        <Group>
            <Select
                data={fields.map(f => ({ label: f.title, value: f.id }))}
                value={targetFieldId}
                onChange={handleTargetFieldChange}
                allowDeselect={false}
            />
            <Select
                data={selectValues[fieldType].map(v => v.condition)}
                value={condition}
                onChange={handleConditionChange}
                allowDeselect={false}
            />
            <Select
                data={selectValues[fieldType].find(v => v.condition === condition)!.operators}
                value={operator}
                onChange={handleOperatorChange}
                allowDeselect={false}
            />
            <DefaultValueSelect
                data={selectValues[fieldType].find(v => v.condition === condition)!.values}
                value={value}
                onChange={handleValueChange}
                allowDeselect={false}
            />
            <IconButton icon={IconX} variant='light' color='red' onClick={handleRuleDelete} />
        </Group>
    );
}
