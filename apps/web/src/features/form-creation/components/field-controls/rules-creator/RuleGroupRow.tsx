import { Group, Select, Stack } from '@mantine/core';
import { ActionButton } from '../../ui/ActionButton';
import { RuleRow } from './RuleRow';
import { v4 as uuid } from 'uuid';
import { IconCategoryPlus, IconPlus, IconX } from '@tabler/icons-react';
import { IconButton } from '../../ui/IconButton';
import { cn } from '@/lib/utils';
import {
    RuleGroup,
    RuleCombinator,
    FieldType,
    RuleConfigMap
} from '@/features/form-creation/lib/types';
import { updateGroup, deleteGroup } from '@/features/form-creation/lib/rules';
import { ruleCombinators } from '@/features/form-creation/lib/constants';

type Props = {
    hasBackgroundColor: boolean;
    isFirstGroup: boolean;
    group: RuleGroup;
    rootGroup: RuleGroup;
    onRuleChange: (root: RuleGroup) => void;
    fieldId: string;
    fieldType: FieldType;
    ruleConfig: RuleConfigMap;
};

export function RuleGroupRow(props: Props) {
    const {
        hasBackgroundColor,
        isFirstGroup,
        group,
        rootGroup,
        onRuleChange,
        fieldId,
        fieldType,
        ruleConfig
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
                        fieldId,
                        condition: ruleConfig[fieldType].at(0)?.condition,
                        operator: ruleConfig[fieldType].at(0)?.operators.at(0),
                        value: ruleConfig[fieldType].at(0)?.values?.at(0)
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
                <Select
                    data={ruleCombinators}
                    value={combinator}
                    onChange={handleCombinatorChange}
                    allowDeselect={false}
                />
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
                        fieldType={fieldType}
                        ruleConfig={ruleConfig}
                    />
                ) : (
                    <RuleGroupRow
                        key={ruleOrGroup.id}
                        hasBackgroundColor={!hasBackgroundColor}
                        isFirstGroup={false}
                        group={ruleOrGroup}
                        rootGroup={rootGroup}
                        onRuleChange={onRuleChange}
                        fieldId={fieldId}
                        fieldType={fieldType}
                        ruleConfig={ruleConfig}
                    />
                )
            )}
        </Stack>
    );
}
