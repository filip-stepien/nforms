import { Stack, Badge, Accordion, Flex } from '@mantine/core';
import { CategoryRuleGroupRow } from './CategoryRuleGroupRow';
import { useAppSelector } from '@/hooks/useAppSelector';
import { deleteCategory, selectCategoryById } from '../../state/categories';
import { IconTrash } from '@tabler/icons-react';
import { IconButton } from '../ui/IconButton';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { selectCategoryRootGroupIdByCategoryId } from '../../state/category-rules';

type Props = {
    categoryId: string;
};

export function Category({ categoryId }: Props) {
    const { category, color } = useAppSelector(state => selectCategoryById(state, categoryId));
    const rootGroupId = useAppSelector(state =>
        selectCategoryRootGroupIdByCategoryId(state, categoryId)
    );
    const dispatch = useAppDispatch();

    const handleCategoryDelete = () => {
        dispatch(deleteCategory({ categoryId }));
    };

    return (
        <Flex align='flex-start' gap='md'>
            <Accordion
                className='flex-1'
                classNames={{ control: 'bg-neutral-100', panel: 'bg-neutral-100' }}
                variant='contained'
            >
                <Accordion.Item value='categoryRules'>
                    <Accordion.Control>
                        <Badge size='lg' color={color} radius='sm'>
                            {category}
                        </Badge>
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Stack>
                            <Badge size='lg' variant='default' radius='sm'>
                                classify respondent when score
                            </Badge>
                            <CategoryRuleGroupRow
                                categoryGroupId={rootGroupId}
                                hasBackgroundColor={true}
                                isFirstGroup={true}
                            />
                        </Stack>
                    </Accordion.Panel>
                </Accordion.Item>
            </Accordion>
            <IconButton
                color='red'
                variant='light'
                icon={IconTrash}
                className='mt-2'
                onClick={handleCategoryDelete}
            />
        </Flex>
    );
}
