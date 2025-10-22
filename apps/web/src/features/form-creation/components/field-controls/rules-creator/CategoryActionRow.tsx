import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { Stack, Group, Select, NumberInput, Badge } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { IconButton } from '../../ui/IconButton';
import { RuleGroupRow } from './RuleGroupRow';
import {
    deleteCategoryAction,
    selectCategoryActionById
} from '@/features/form-creation/state/rules';

type Props = {
    fieldId: string;
    categoryActionId: string;
};

export function CategoryActionRow({ fieldId, categoryActionId }: Props) {
    const dispatch = useAppDispatch();
    const categoryActionRootGroupId = useAppSelector(
        state => selectCategoryActionById(state, categoryActionId).rootGroupId
    );

    const handleCategoryActionDelete = (categoryActionId: string) => {
        dispatch(deleteCategoryAction({ categoryActionId }));
    };

    return (
        <Stack gap={0} className='w-full'>
            <Group
                justify='space-between'
                className='p-md bg-blue-light border-blue-filled flex-1 rounded-sm'
            >
                <Group>
                    <Select data={['ADD', 'SUBTRACT', 'SET']} value='ADD' />
                    <NumberInput value={0} />
                    <Badge size='lg'>FOR CATEGORY</Badge>
                    <Select data={['Valid', 'Invalid']} value='Valid' />
                    <Badge size='lg'>WHEN</Badge>
                </Group>
                <IconButton
                    icon={IconX}
                    color='red'
                    variant='transparent'
                    onClick={() => handleCategoryActionDelete(categoryActionId)}
                />
            </Group>
            <div className='p-md'>
                <RuleGroupRow
                    hasBackgroundColor={false}
                    isFirstGroup={true}
                    groupId={categoryActionRootGroupId}
                    fieldId={fieldId}
                />
            </div>
        </Stack>
    );
}
