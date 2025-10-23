import { Group, Select, Stack } from '@mantine/core';
import { RuleRow } from './RuleRow';
import { v4 as uuid } from 'uuid';
import { IconCategoryPlus, IconPlus, IconX } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { selectFieldById } from '@/features/form-editor/state/fields';
import { RuleCombinator, ruleCombinators } from '@packages/db/schemas/form';
import { useRuleSelectValues } from '@/features/form-editor/hooks/useRuleSelectValues';
import {
    setGroup,
    addRule,
    addGroup,
    deleteGroup,
    selectGroupById
} from '@/features/form-editor/state/rules';
import { ActionButton } from '../../ui/ActionButton';
import { IconButton } from '../../ui/IconButton';

type Props = {
    hasBackgroundColor: boolean;
    isFirstGroup: boolean;
    groupId: string;
    fieldId: string;
};

export function RuleGroupRow({ hasBackgroundColor, isFirstGroup, groupId, fieldId }: Props) {
    const dispatch = useAppDispatch();
    const fieldType = useAppSelector(state => selectFieldById(state, fieldId).type);
    const { selectValues, transformValue } = useRuleSelectValues(fieldId);
    const { combinator, childrenGroups, childrenRules } = useAppSelector(state =>
        selectGroupById(state, groupId)
    );

    const handleAddRule = () => {
        const firstValuesRecord = selectValues[fieldType][0];

        dispatch(
            addRule({
                groupId,
                rule: {
                    id: uuid(),
                    type: 'rule',
                    fieldId,
                    targetFieldId: fieldId,
                    condition: firstValuesRecord.condition,
                    operator: firstValuesRecord.operators[0],
                    value: transformValue(firstValuesRecord.values[0])
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
        dispatch(deleteGroup({ groupId }));
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
                !isFirstGroup && 'p-md border-border rounded-md border-1',
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
                        variant='transparent'
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
