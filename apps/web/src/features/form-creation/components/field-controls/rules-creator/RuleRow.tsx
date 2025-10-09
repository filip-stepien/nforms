import { Group, Select } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { IconButton } from '../../ui/IconButton';
import { QuestionButton } from './QuestionButton';
import {
    ControlsMap,
    Field,
    FieldType,
    Rule,
    RuleConfigMap,
    RuleGroup
} from '@/features/form-creation/lib/types';
import { updateRule, deleteRule } from '@/features/form-creation/lib/rules';

type Props = {
    rule: Rule;
    rootGroup: RuleGroup;
    onRuleChange: (root: RuleGroup) => void;
    ruleConfig: RuleConfigMap;
    fieldType: FieldType;
    field: Field;
};

export function RuleRow(props: Props) {
    const { rule, rootGroup, onRuleChange, fieldType, ruleConfig, field } = props;
    const { id, operator, condition, value } = rule;

    const conditions = ruleConfig[fieldType].map(cfg => cfg.condition);
    const operators = ruleConfig[fieldType].find(cfg => cfg.condition === condition)?.operators;
    const values = ruleConfig[fieldType].find(cfg => cfg.condition === condition)?.values;

    const handleRuleChange = (value: string | null, property: keyof Rule) => {
        onRuleChange(
            updateRule(rootGroup, id, rule => ({ ...rule, [property]: value ?? undefined }))
        );
    };

    const handleRuleDelete = () => {
        onRuleChange(deleteRule(rootGroup, id));
    };

    const handleConditionChange = (newCondition: string | null) => {
        if (newCondition) {
            onRuleChange(
                updateRule(rootGroup, id, rule => ({
                    ...rule,
                    condition: newCondition,
                    operator: ruleConfig[fieldType]
                        .find(rule => rule.condition === newCondition)
                        ?.operators.at(0),
                    value: ruleConfig[fieldType]
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

    if (fieldType === FieldType.SELECTION) {
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
            <QuestionButton rule={rule} rootGroup={rootGroup} onRuleChange={onRuleChange} />
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
