import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { Stack, Group, Select, NumberInput, Badge } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { RuleGroupRow } from './RuleGroupRow';
import { DefaultValueSelect } from './DefaultValueSelect';
import { IconButton } from '../../ui/IconButton';
import { selectCategories } from '@/features/form-editor/state/respondent-categories';
import {
    FieldCategoryOperation,
    fieldCategoryOperations
} from '@packages/db/schemas/form/field-rules';
import {
    deleteFieldCategoryAction,
    selectFieldCategoryActionById,
    setFieldCategoryAction
} from '@/features/form-editor/state/field-rules';

type Props = {
    fieldId: string;
    categoryActionId: string;
};

export function CategoryActionRow({ fieldId, categoryActionId }: Props) {
    const dispatch = useAppDispatch();
    const categories = useAppSelector(selectCategories);
    const categoryAction = useAppSelector(state =>
        selectFieldCategoryActionById(state, categoryActionId)
    );

    const handleCategoryActionDelete = (categoryActionId: string) => {
        dispatch(deleteFieldCategoryAction({ categoryActionId }));
    };

    const handleOperationSelect = (value: string | null) => {
        if (value) {
            dispatch(
                setFieldCategoryAction({
                    categoryActionId,
                    categoryAction: { operation: value as FieldCategoryOperation }
                })
            );
        }
    };

    const handlePointsSelect = (value: string | number) => {
        if (typeof value === 'number') {
            dispatch(
                setFieldCategoryAction({ categoryActionId, categoryAction: { points: value } })
            );
        }
    };

    const handleCategoryChange = (value: string | null) => {
        if (value) {
            dispatch(
                setFieldCategoryAction({
                    categoryActionId,
                    categoryAction: { targetCategoryId: value }
                })
            );
        }
    };

    return (
        <Stack gap={0} className='w-full'>
            <Group
                justify='space-between'
                className='p-md bg-blue-light border-blue-filled flex-1 rounded-sm'
            >
                <Group>
                    <Select
                        data={fieldCategoryOperations}
                        value={categoryAction.operation}
                        onChange={handleOperationSelect}
                    />
                    <NumberInput value={categoryAction.points} onChange={handlePointsSelect} />
                    <Badge size='lg' variant='default' radius='sm'>
                        for category
                    </Badge>
                    <DefaultValueSelect
                        data={categories.map(c => ({ label: c.category, value: c.id }))}
                        value={categoryAction.targetCategoryId}
                        allowDeselect={false}
                        onChange={handleCategoryChange}
                    />
                    <Badge size='lg' variant='default' radius='sm'>
                        when
                    </Badge>
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
                    groupId={categoryAction.rootGroupId}
                    fieldId={fieldId}
                />
            </div>
        </Stack>
    );
}
