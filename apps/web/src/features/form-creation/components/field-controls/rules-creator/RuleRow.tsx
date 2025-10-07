import { Group, Select } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { IconButton } from '../../ui/IconButton';
import { QuestionButton } from './QuestionButton';
import { FieldType, Rule, RuleGroup } from '@/features/form-creation/lib/types';
import { updateRule, deleteRule } from '@/features/form-creation/lib/rules';
import { possibleRules } from '@/features/form-creation/lib/constants';

type Props = {
    rule: Rule;
    rootGroup: RuleGroup;
    onRuleChange: (root: RuleGroup) => void;
    fieldType: FieldType;
};

export function RuleRow(props: Props) {
    const { rule, rootGroup, onRuleChange, fieldType } = props;
    const { id, operator, condition, value } = rule;

    const conditions = possibleRules[fieldType].map(cfg => cfg.condition);
    const operators = possibleRules[fieldType].find(cfg => cfg.condition === condition)?.operators;
    const values = possibleRules[fieldType].find(cfg => cfg.condition === condition)?.values;

    const handleRuleChange = (value: string | null, property: keyof Rule) => {
        if (value) {
            onRuleChange(updateRule(rootGroup, id, rule => ({ ...rule, [property]: value })));
        }
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
                    operator: possibleRules[fieldType]
                        .find(rule => rule.condition === newCondition)
                        ?.operators.at(0),
                    value: possibleRules[fieldType]
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
        handleRuleChange(newValue, 'value');
    };

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
            <Select
                data={values}
                value={value}
                onChange={handleValueChange}
                allowDeselect={false}
            />
            <IconButton icon={IconX} variant='light' color='red' onClick={handleRuleDelete} />
        </Group>
    );
}
