import { Group, Input, Select } from '@mantine/core';
import { Dispatch, SetStateAction } from 'react';
import { Rule, RuleGroup } from './RulesCreator';
import { IconX } from '@tabler/icons-react';
import { IconButton } from '../../ui/IconButton';

type Props = {
    rule: Rule;
    setRules: Dispatch<SetStateAction<RuleGroup>>;
    questions: string[];
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
    const { rule, setRules, questions, conditions, operators, values } = props;
    const { id, question, operator, condition, value } = rule;

    const handleRuleChange = (value: string | null, property: keyof Rule) => {
        setRules(prev => updateRule(prev, id, rule => ({ ...rule, [property]: value })));
    };

    const handleRuleDelete = () => {
        setRules(prev => deleteRule(prev, id));
    };

    return (
        <Group className='children:flex-1'>
            <Select
                data={questions}
                value={question}
                defaultValue={questions.at(0)}
                onChange={value => handleRuleChange(value, 'question')}
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
