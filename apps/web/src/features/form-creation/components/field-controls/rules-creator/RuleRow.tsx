import { Group, Select } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { IconButton } from '../../ui/IconButton';
import { QuestionButton } from './QuestionButton';
import { updateRule, deleteRule } from '@/features/form-creation/lib/rules';
import { useFormDispatch } from '@/features/form-creation/hooks/useFormDispatch';
import { useFormSelector } from '@/features/form-creation/hooks/useFormSelector';
import { selectFieldById, setField } from '@/features/form-creation/state/formFieldsSlice';
import {
    ControlsMap,
    FieldType,
    Rule,
    RuleConfigMap,
    RuleGroup
} from '@/features/form-creation/lib/types';

type Props = {
    rule: Rule;
    ruleConfig: RuleConfigMap;
    fieldId: string;
};

export function RuleRow(props: Props) {
    const { rule, fieldId, ruleConfig } = props;
    const { id, operator, condition, value } = rule;

    const dispatch = useFormDispatch();
    const field = useFormSelector(state => selectFieldById(state, fieldId));
    const root = field.controls.rules;

    const conditions = ruleConfig[field.type].map(cfg => cfg.condition);
    const operators = ruleConfig[field.type].find(cfg => cfg.condition === condition)?.operators;
    const values = ruleConfig[field.type].find(cfg => cfg.condition === condition)?.values;

    const dispatchRules = (updatedRules: RuleGroup) => {
        dispatch(setField({ fieldId, field: { controls: { rules: updatedRules } } }));
    };

    const handleRuleChange = (value: string | null, property: keyof Rule) => {
        dispatchRules(updateRule(root, id, rule => ({ ...rule, [property]: value ?? undefined })));
    };

    const handleRuleDelete = () => {
        dispatchRules(deleteRule(root, id));
    };

    const handleConditionChange = (newCondition: string | null) => {
        if (newCondition) {
            dispatchRules(
                updateRule(root, id, rule => ({
                    ...rule,
                    condition: newCondition,
                    operator: ruleConfig[field.type]
                        .find(rule => rule.condition === newCondition)
                        ?.operators.at(0),
                    value: ruleConfig[field.type]
                        .find(rule => rule.condition === newCondition)
                        ?.values?.at(0)
                }))
            );
        }
    };

    const handleOperatorChange = (newOperator: string | null) => {
        handleRuleChange(newOperator, 'operator');
    };

    const handleValueChange = (newValue: string | null) => {
        handleRuleChange(newValue !== '' ? newValue : null, 'value');
    };

    let selectComponent = null;

    if (field.type === FieldType.SELECTION) {
        const selectionValues = [
            ...(field.controls as ControlsMap[FieldType.SELECTION]).options.map(opt => ({
                label: opt.content,
                value: opt.id
            })),
            { label: '<Select option>', value: '', disabled: true }
        ];

        const selectionValue =
            (field.controls as ControlsMap[FieldType.SELECTION]).options.find(
                opt => opt.id === value
            )?.id ?? '';

        if (selectionValues.length > 1) {
            selectComponent = (
                <Select
                    data={selectionValues}
                    value={selectionValue}
                    onChange={handleValueChange}
                    allowDeselect={false}
                />
            );
        } else {
            selectComponent = (
                <Select
                    data={[{ label: '<No options available>', value: '' }]}
                    value={''}
                    disabled={true}
                    onChange={handleValueChange}
                    allowDeselect={false}
                />
            );
        }
    } else {
        if (values && values.length > 0) {
            selectComponent = (
                <Select
                    data={values}
                    value={value}
                    onChange={handleValueChange}
                    allowDeselect={false}
                />
            );
        } else {
            selectComponent = (
                <Select
                    data={[{ label: '<No options available>', value: '' }]}
                    value={''}
                    disabled={true}
                    onChange={handleValueChange}
                    allowDeselect={false}
                />
            );
        }
    }

    return (
        <Group>
            <QuestionButton rule={rule} fieldId={fieldId} />
            <Select
                data={conditions}
                value={condition}
                onChange={handleConditionChange}
                allowDeselect={false}
            />
            <Select
                data={operators}
                value={operator}
                onChange={handleOperatorChange}
                allowDeselect={false}
            />
            {selectComponent}
            <IconButton icon={IconX} variant='light' color='red' onClick={handleRuleDelete} />
        </Group>
    );
}
