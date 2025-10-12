import { Group, Select, Stack } from '@mantine/core';
import { ActionButton } from '../../ui/ActionButton';
import { RuleRow } from './RuleRow';
import { v4 as uuid } from 'uuid';
import { IconCategoryPlus, IconPlus, IconX } from '@tabler/icons-react';
import { IconButton } from '../../ui/IconButton';
import { cn } from '@/lib/utils';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import {
    RuleCombinator,
    setGroup,
    addRule,
    addGroup,
    deleteGroup,
    ruleCombinators,
    selectGroupById
} from '@/features/form-creation/state/slices/rules';

type Props = {
    hasBackgroundColor: boolean;
    isFirstGroup: boolean;
    groupId: string;
    fieldId: string;
};

export function RuleGroupRow({ hasBackgroundColor, isFirstGroup, groupId, fieldId }: Props) {
    const dispatch = useAppDispatch();
    const { combinator, childrenGroups, childrenRules } = useAppSelector(state =>
        selectGroupById(state, groupId)
    );

    const handleAddRule = () => {
        dispatch(
            addRule({
                groupId,
                rule: {
                    id: uuid(),
                    type: 'rule',
                    fieldId,
                    targetFieldId: fieldId,
                    condition: '',
                    operator: '',
                    value: ''
                }
            })
        );
    };

    const handleAddGroup = () => {
        dispatch(
            addGroup({
                parentGroupId: groupId,
                group: {
                    id: uuid(),
                    fieldId,
                    type: 'group',
                    combinator: 'OR',
                    childrenGroups: [],
                    childrenRules: []
                }
            })
        );
    };

    const handleGroupDelete = () => {
        dispatch(deleteGroup({ fieldId, groupId }));
    };

    const handleCombinatorChange = (value: string | null) => {
        if (value) {
            dispatch(
                setGroup({ fieldId, groupId, group: { combinator: value as RuleCombinator } })
            );
        }
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
            {childrenRules.map(id => (
                <RuleRow key={id} ruleId={id} groupId={groupId} />
            ))}
            {childrenGroups.map(id => (
                <RuleGroupRow
                    key={id}
                    hasBackgroundColor={!hasBackgroundColor}
                    isFirstGroup={false}
                    groupId={id}
                    fieldId={fieldId}
                />
            ))}
        </Stack>
    );
}
