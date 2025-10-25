import { useAppSelector } from '@/hooks/useAppSelector';
import {
    deleteCategoryRule,
    selectCategoryRuleById,
    setCategoryRule
} from '../../state/respondent-category-rules';
import { Group, NumberInput, Select } from '@mantine/core';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { IconX } from '@tabler/icons-react';
import { IconButton } from '../ui/IconButton';

type Props = {
    categoryGroupId: string;
    categoryRuleId: string;
};

export function CategoryRuleRow({ categoryGroupId, categoryRuleId }: Props) {
    const dispatch = useAppDispatch();
    const { operator, value } = useAppSelector(state =>
        selectCategoryRuleById(state, categoryRuleId)
    );

    const handleOperatorChange = (operator: string | null) => {
        if (operator) {
            dispatch(setCategoryRule({ categoryRuleId, categoryRule: { operator } }));
        }
    };

    const handleValueChange = (value: string | number) => {
        if (typeof value === 'number') {
            dispatch(setCategoryRule({ categoryRuleId, categoryRule: { value } }));
        }
    };

    const handleCategoryRuleDelete = () => {
        dispatch(deleteCategoryRule({ categoryGroupId, categoryRuleId }));
    };

    return (
        <Group>
            <Select
                data={['IS GREATER THAN', 'EQUALS', 'IS LESS THAN']}
                value={operator}
                onChange={handleOperatorChange}
            />
            <NumberInput value={value} onChange={handleValueChange} className='min-w-55' />
            <IconButton
                icon={IconX}
                variant='transparent'
                color='red'
                onClick={handleCategoryRuleDelete}
            />
        </Group>
    );
}
