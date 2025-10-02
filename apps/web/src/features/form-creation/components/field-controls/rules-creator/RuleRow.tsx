import { Group, Input, Select } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { IconButton } from '../../ui/IconButton';
import { Rule, RuleGroup } from './RulesCreator';
import { Field } from '@/features/form-creation/hooks/useFormFields';

type Props = {
    rule: Rule;
    rootGroup: RuleGroup;
    onRuleChange: (root: RuleGroup) => void;
    fields: Field[];
    conditions: string[];
    operators: string[];
    values?: string[];
};

function updateRule(root: RuleGroup, ruleId: string, updater: (r: Rule) => Rule): RuleGroup {
    return {
        ...root,
        rules: root.rules.map(r => {
            if (r.type === 'rule' && r.id === ruleId) {
                return updater(r);
            }

            if (r.type === 'group') {
                return updateRule(r, ruleId, updater);
            }

            return r;
        })
    };
}

function deleteRule(root: RuleGroup, ruleId: string): RuleGroup {
    return {
        ...root,
        rules: root.rules
            .filter(r => !(r.type === 'rule' && r.id === ruleId))
            .map(r => (r.type === 'group' ? deleteRule(r, ruleId) : r))
    };
}

export function RuleRow(props: Props) {
    const { rule, rootGroup, onRuleChange, fields, conditions, operators, values } = props;
    const { id, questionId, operator, condition, value } = rule;

    const handleRuleChange = (value: string | null, property: keyof Rule) => {
        onRuleChange(updateRule(rootGroup, id, rule => ({ ...rule, [property]: value })));
    };

    const handleRuleDelete = () => {
        onRuleChange(deleteRule(rootGroup, id));
    };

    const handleQuestionChange = (value: string | null) => {
        const questionId = fields.find(field => field.title === value)?.id as string;
        handleRuleChange(questionId, 'questionId');
    };

    return (
        <Group>
            <Select
                data={fields.map(field => field.title)}
                value={fields.find(field => field.id === questionId)?.title}
                onChange={handleQuestionChange}
            />
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
