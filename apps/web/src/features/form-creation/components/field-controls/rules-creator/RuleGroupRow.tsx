import { Group, Select, Stack } from '@mantine/core';
import { ActionButton } from '../../ui/ActionButton';
import { RuleRow } from './RuleRow';
import { v4 as uuid } from 'uuid';
import { IconCategoryPlus, IconPlus, IconX } from '@tabler/icons-react';
import { IconButton } from '../../ui/IconButton';
import { cn } from '@/lib/utils';
import { selectRuleGroup } from '@/features/form-creation/state/selectors';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import {
    RuleCombinator,
    setGroup,
    addRule,
    addGroup,
    deleteGroup,
    ruleCombinators
} from '@/features/form-creation/state/slices/rules';

type Props = {
    hasBackgroundColor: boolean;
    isFirstGroup: boolean;
    groupId: string;
    fieldId: string;
};

export function RuleGroupRow(props: Props) {
    const { hasBackgroundColor, isFirstGroup, groupId, fieldId } = props;
    const dispatch = useAppDispatch();
    const { combinator, childrenGroups, childrenRules } = useAppSelector(state =>
        selectRuleGroup(state, fieldId, groupId)
    );

    const handleAddRule = () => {
        dispatch(
            addRule({
                fieldId,
                groupId,
                rule: {
                    id: uuid(),
                    type: 'rule',
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
                fieldId,
                groupId,
                group: {
                    id: uuid(),
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
                <RuleRow key={id} ruleId={id} fieldId={fieldId} />
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
