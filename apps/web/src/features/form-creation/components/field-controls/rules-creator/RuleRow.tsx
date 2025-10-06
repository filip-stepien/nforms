import { Group, Input, Select } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { IconButton } from '../../ui/IconButton';
import { QuestionButton } from './QuestionButton';
import { Rule, RuleGroup } from '@/features/form-creation/lib/types';
import { updateRule, deleteRule } from '@/features/form-creation/lib/rules';

type Props = {
    rule: Rule;
    rootGroup: RuleGroup;
    onRuleChange: (root: RuleGroup) => void;
    conditions: string[];
    operators: string[];
    values?: string[];
};

export function RuleRow(props: Props) {
    const { rule, rootGroup, onRuleChange, conditions, operators, values } = props;
    const { id, operator, condition, value } = rule;

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
                defaultValue={conditions.at(0)}
                onChange={value => handleRuleChange(value, 'condition')}
            />
            <Select
                data={operators}
                value={operator}
                defaultValue={operators.at(0)}
                onChange={value => handleRuleChange(value, 'operator')}
            />
            {values ? (
                <Select
                    data={values}
                    value={value}
                    defaultValue={values.at(0)}
                    onChange={value => handleRuleChange(value, 'value')}
                />
            ) : (
                <Input
                    value={value}
                    onChange={event => handleRuleChange(event.target.value, 'value')}
                />
            )}
            <IconButton icon={IconX} variant='light' color='red' onClick={handleRuleDelete} />
        </Group>
    );
}
