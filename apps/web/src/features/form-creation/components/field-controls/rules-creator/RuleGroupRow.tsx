import { Group, Select, Stack } from '@mantine/core';
import { ActionButton } from '../../ui/ActionButton';
import { RuleRow } from './RuleRow';
import { v4 as uuid } from 'uuid';
import { IconCategoryPlus, IconPlus, IconX } from '@tabler/icons-react';
import { IconButton } from '../../ui/IconButton';
import { cn } from '@/lib/utils';
import { updateGroup, deleteGroup } from '@/features/form-creation/lib/rules';
import { ruleCombinators, ruleConfig } from '@/features/form-creation/lib/constants';
import { useFormDispatch } from '@/features/form-creation/hooks/useFormDispatch';
import { useFormSelector } from '@/features/form-creation/hooks/useFormSelector';
import { selectFieldById, setField } from '@/features/form-creation/state/formFieldsSlice';
import {
    RuleGroup,
    RuleCombinator,
    FieldType,
    ControlsMap
} from '@/features/form-creation/lib/types';

type Props = {
    hasBackgroundColor: boolean;
    isFirstGroup: boolean;
    group: RuleGroup;
    fieldId: string;
};

export function RuleGroupRow(props: Props) {
    const { hasBackgroundColor, isFirstGroup, group, fieldId } = props;
    const { id, combinator, rules } = group;

    const dispatch = useFormDispatch();
    const field = useFormSelector(state => selectFieldById(state, fieldId));
    const root = field.controls.rules;

    const dispatchRules = (updatedRules: RuleGroup) => {
        dispatch(setField({ fieldId, field: { controls: { rules: updatedRules } } }));
    };

    const handleAddRule = () => {
        dispatchRules(
            updateGroup(root, id, group => ({
                ...group,
                rules: [
                    {
                        id: uuid(),
                        type: 'rule' as const,
                        fieldId,
                        condition: ruleConfig[field.type].at(0)?.condition,
                        operator: ruleConfig[field.type].at(0)?.operators.at(0),
                        value:
                            field.type === FieldType.SELECTION
                                ? (field.controls as ControlsMap[FieldType.SELECTION]).options.at(0)
                                      ?.id
                                : ruleConfig[field.type].at(0)?.values.at(0)
                    },
                    ...group.rules
                ]
            }))
        );
    };

    const handleAddGroup = () => {
        dispatchRules(
            updateGroup(root, id, group => ({
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
        dispatchRules(deleteGroup(root, id));
    };

    const handleCombinatorChange = (value: string | null) => {
        dispatchRules(
            updateGroup(root, id, group => ({ ...group, combinator: value as RuleCombinator }))
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
                        ruleConfig={ruleConfig}
                        fieldId={fieldId}
                    />
                ) : (
                    <RuleGroupRow
                        key={ruleOrGroup.id}
                        hasBackgroundColor={!hasBackgroundColor}
                        isFirstGroup={false}
                        group={ruleOrGroup}
                        fieldId={fieldId}
                    />
                )
            )}
        </Stack>
    );
}
