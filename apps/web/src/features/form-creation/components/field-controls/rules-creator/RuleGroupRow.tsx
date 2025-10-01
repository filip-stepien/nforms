import { Group, Select, Stack } from '@mantine/core';
import { RuleCombinator, RuleGroup } from './RulesCreator';
import { ActionButton } from '../../ui/ActionButton';
import { RuleRow } from './RuleRow';
import { Dispatch, SetStateAction } from 'react';
import { v4 as uuid } from 'uuid';
import { IconCategoryPlus, IconPlus, IconX } from '@tabler/icons-react';
import { IconButton } from '../../ui/IconButton';
import { cn } from '@/lib/utils';

type Props = {
    hasBackgroundColor: boolean;
    isFirstGroup: boolean;
    group: RuleGroup;
    setRules: Dispatch<SetStateAction<RuleGroup>>;
    combinators: RuleCombinator[];
    questions: string[];
    conditions: string[];
    operators: string[];
    values?: string[];
};

function updateGroup(
    root: RuleGroup,
    groupId: string,
    updater: (g: RuleGroup) => RuleGroup
): RuleGroup {
    if (root.id === groupId) {
        return updater(root);
    }

    return {
        ...root,
        rules: root.rules.map(r => (r.type === 'group' ? updateGroup(r, groupId, updater) : r))
    };
}

function deleteGroup(root: RuleGroup, groupId: string): RuleGroup {
    return {
        ...root,
        rules: root.rules
            .filter(r => !(r.type === 'group' && r.id === groupId))
            .map(r => (r.type === 'group' ? deleteGroup(r, groupId) : r))
    };
}

export function RuleGroupRow(props: Props) {
    const {
        hasBackgroundColor,
        isFirstGroup,
        group,
        setRules,
        combinators,
        questions,
        conditions,
        operators,
        values
    } = props;

    const { id, combinator, rules } = group;

    const handleAddRule = () => {
        setRules(prev =>
            updateGroup(prev, id, group => ({
                ...group,
                rules: [
                    {
                        id: uuid(),
                        type: 'rule' as const,
                        question: questions.at(0),
                        condition: conditions.at(0),
                        operator: operators.at(0),
                        value: values ? values.at(0) : ''
                    },
                    ...group.rules
                ]
            }))
        );
    };

    const handleAddGroup = () => {
        setRules(prev =>
            updateGroup(prev, id, group => ({
                ...group,
                rules: [
                    ...group.rules,
                    {
                        id: uuid(),
                        type: 'group',
                        combinator: 'AND',
                        rules: []
                    }
                ]
            }))
        );
    };

    const handleGroupDelete = () => {
        setRules(prev => deleteGroup(prev, id));
    };

    const handleCombinatorChange = (value: string | null) => {
        setRules(prev =>
            updateGroup(prev, id, group => ({ ...group, combinator: value as RuleCombinator }))
        );
    };

    return (
        <Stack
            className={cn(
                !isFirstGroup && 'p-md border-1 border-border rounded-md',
                hasBackgroundColor ? 'bg-neutral-100' : 'bg-white'
            )}
        >
            <Group>
                <Select data={combinators} value={combinator} onChange={handleCombinatorChange} />
                <ActionButton
                    label='Rule'
                    icon={IconPlus}
                    variant='light'
                    onClick={handleAddRule}
                />
                <ActionButton
                    label='Group'
                    icon={IconCategoryPlus}
                    variant='light'
                    onClick={handleAddGroup}
                />
                {!isFirstGroup && (
                    <IconButton
                        icon={IconX}
                        variant='light'
                        color='red'
                        onClick={handleGroupDelete}
                    />
                )}
            </Group>
            {rules.map(ruleOrGroup =>
                ruleOrGroup.type === 'rule' ? (
                    <RuleRow
                        key={ruleOrGroup.id}
                        rule={ruleOrGroup}
                        setRules={setRules}
                        conditions={conditions}
                        operators={operators}
                        questions={questions}
                        values={values}
                    />
                ) : (
                    <RuleGroupRow
                        key={ruleOrGroup.id}
                        hasBackgroundColor={!hasBackgroundColor}
                        isFirstGroup={false}
                        group={ruleOrGroup}
                        setRules={setRules}
                        combinators={combinators}
                        conditions={conditions}
                        operators={operators}
                        questions={questions}
                        values={values}
                    />
                )
            )}
        </Stack>
    );
}
