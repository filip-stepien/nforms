import { Group, Select, Stack } from '@mantine/core';
import { IconPlus, IconCategoryPlus, IconX } from '@tabler/icons-react';
import { ActionButton } from '../ui/ActionButton';
import {
    addCategoryRule,
    addCategoryRuleGroup,
    deleteCategoryRuleGroup,
    selectCategoryRuleGroupById,
    setCategoryRuleGroup
} from '../../state/category-rules';
import { CategoryRuleRow } from './CategoryRuleRow';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { v4 as uuid } from 'uuid';
import { cn } from '@/lib/utils';
import { IconButton } from '../ui/IconButton';

type Props = {
    hasBackgroundColor: boolean;
    isFirstGroup: boolean;
    categoryGroupId: string;
};

export function CategoryRuleGroupRow({ hasBackgroundColor, isFirstGroup, categoryGroupId }: Props) {
    const dispatch = useAppDispatch();
    const { combinator, childrenGroups, childrenRules, categoryId } = useAppSelector(state =>
        selectCategoryRuleGroupById(state, categoryGroupId)
    );

    const handleAddCategoryRule = () => {
        dispatch(
            addCategoryRule({
                categoryGroupId,
                categoryRule: {
                    id: uuid(),
                    categoryId,
                    operator: 'IS GREATER THAN',
                    value: 0
                }
            })
        );
    };

    const handleAddCategoryRuleGroup = () => {
        dispatch(
            addCategoryRuleGroup({
                parentCategoryGroupId: categoryGroupId,
                categoryGroup: {
                    id: uuid(),
                    categoryId,
                    combinator: 'AND',
                    childrenGroups: [],
                    childrenRules: []
                }
            })
        );
    };

    const handleCombinatorChange = (value: string | null) => {
        if (value) {
            dispatch(
                setCategoryRuleGroup({
                    categoryGroupId,
                    categoryGroup: {
                        combinator: value
                    }
                })
            );
        }
    };

    const handleCategoryGroupDelete = () => {
        dispatch(
            deleteCategoryRuleGroup({
                categoryId,
                categoryGroupId
            })
        );
    };

    return (
        <Stack
            className={cn(
                'p-md border-border rounded-md border-1',
                !hasBackgroundColor ? 'bg-neutral-100' : 'bg-white'
            )}
        >
            <Group>
                <Select data={['AND', 'OR']} value={combinator} onChange={handleCombinatorChange} />
                <ActionButton
                    variant='light'
                    icon={IconPlus}
                    label='Rule'
                    onClick={handleAddCategoryRule}
                />
                <ActionButton
                    variant='light'
                    icon={IconCategoryPlus}
                    label='Group'
                    onClick={handleAddCategoryRuleGroup}
                />
                {!isFirstGroup && (
                    <IconButton
                        icon={IconX}
                        variant='transparent'
                        color='red'
                        onClick={handleCategoryGroupDelete}
                    />
                )}
            </Group>
            {childrenRules.map(id => (
                <CategoryRuleRow key={id} categoryRuleId={id} categoryGroupId={categoryGroupId} />
            ))}
            {childrenGroups.map(id => (
                <CategoryRuleGroupRow
                    key={id}
                    categoryGroupId={id}
                    isFirstGroup={false}
                    hasBackgroundColor={!hasBackgroundColor}
                />
            ))}
        </Stack>
    );
}
