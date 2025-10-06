import { Group, Input, Select } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { IconButton } from '../../ui/IconButton';
import { QuestionButton } from './QuestionButton';
import { FieldType, Rule, RuleConfig, RuleGroup } from '@/features/form-creation/lib/types';
import { updateRule, deleteRule } from '@/features/form-creation/lib/rules';

type Props = {
    rule: Rule;
    rootGroup: RuleGroup;
    onRuleChange: (root: RuleGroup) => void;
    fieldType: FieldType;
};

const possibleRules: Record<FieldType, RuleConfig[]> = {
    [FieldType.TEXT]: [
        {
            condition: 'sentiment',
            operators: ['es', 'huj'],
            values: ['POSITIVE', 'NEGATIVE']
        },
        {
            condition: 'emotion',
            operators: ['is'],
            values: ['ANGER', 'HAPPINESS']
        }
    ],
    [FieldType.SELECTION]: [
        {
            condition: 'answer',
            operators: ['is'],
            values: ['1', '2', '3']
        }
    ]
};

export function RuleRow(props: Props) {
    const { rule, rootGroup, onRuleChange, fieldType } = props;
    const { id, operator, condition, value } = rule;

    const ruleConfig = possibleRules[fieldType];
    const conditions = ruleConfig.map(cfg => cfg.condition);
    const operators = ruleConfig.find(cfg => cfg.condition === condition)?.operators;
    const values = ruleConfig.find(cfg => cfg.condition === condition)?.values;

    const handleRuleChange = (value: string | null, property: keyof Rule) => {
        onRuleChange(updateRule(rootGroup, id, rule => ({ ...rule, [property]: value })));
    };

    const handleRuleDelete = () => {
        onRuleChange(deleteRule(rootGroup, id));
    };

    return (
        <Group>
            <QuestionButton rule={rule} rootGroup={rootGroup} onRuleChange={onRuleChange} />
            <Select
                data={conditions}
                value={condition}
                onChange={value => handleRuleChange(value, 'condition')}
            />
            <Select
                data={operators}
                value={operator}
                onChange={value => handleRuleChange(value, 'operator')}
            />
            <Select
                data={values}
                value={value}
                onChange={value => handleRuleChange(value, 'value')}
            />
            <IconButton icon={IconX} variant='light' color='red' onClick={handleRuleDelete} />
        </Group>
    );
}
