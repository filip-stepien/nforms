import { Group, Select, Stack } from '@mantine/core';
import { ActionButton } from '../../ui/ActionButton';
import { RuleRow } from './RuleRow';
import { v4 as uuid } from 'uuid';
import { IconCategoryPlus, IconPlus, IconX } from '@tabler/icons-react';
import { IconButton } from '../../ui/IconButton';
import { cn } from '@/lib/utils';
import { RuleGroup, RuleCombinator } from './RulesCreator';
import { Field } from '@/features/form-creation/hooks/useFormFields';

type Props = {
    hasBackgroundColor: boolean;
    isFirstGroup: boolean;
    group: RuleGroup;
    rootGroup: RuleGroup;
    onRuleChange: (root: RuleGroup) => void;
    combinators: RuleCombinator[];
    fields: Field[];
    field: Field;
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
        rootGroup,
        onRuleChange,
        combinators,
        fields,
        field,
        conditions,
        operators,
        values
    } = props;

    const { id, combinator, rules } = group;

    const handleAddRule = () => {
        onRuleChange(
            updateGroup(rootGroup, id, group => ({
                ...group,
                rules: [
                    {
                        id: uuid(),
                        type: 'rule' as const,
                        questionId: field.id,
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
        onRuleChange(
            updateGroup(rootGroup, id, group => ({
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
        onRuleChange(deleteGroup(rootGroup, id));
    };

    const handleCombinatorChange = (value: string | null) => {
        onRuleChange(
            updateGroup(rootGroup, id, group => ({ ...group, combinator: value as RuleCombinator }))
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
                        rootGroup={rootGroup}
                        onRuleChange={onRuleChange}
                        conditions={conditions}
                        operators={operators}
                        fields={fields}
                        values={values}
                    />
                ) : (
                    <RuleGroupRow
                        key={ruleOrGroup.id}
                        hasBackgroundColor={!hasBackgroundColor}
                        isFirstGroup={false}
                        group={ruleOrGroup}
                        rootGroup={rootGroup}
                        onRuleChange={onRuleChange}
                        combinators={combinators}
                        conditions={conditions}
                        operators={operators}
                        fields={fields}
                        field={field}
                        values={values}
                    />
                )
            )}
        </Stack>
    );
}
