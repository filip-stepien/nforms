import { Flex, Group, Stack, TextInput } from '@mantine/core';
import { FormHeader } from './FormHeader';
import { FormActions } from './FormActions';
import { FormSettings } from './FormSettings';
import { FormFieldsContainer } from './FormFieldsContainer';
import { useFormSaveAction } from '../../../../hooks/useFormSaveAction';
import { Card } from './Card';
import { useAppSelector } from '@/hooks/useAppSelector';
import { IconButton } from '../ui/IconButton';
import { IconPlus, IconX } from '@tabler/icons-react';
import { useRef } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { v4 as uuid } from 'uuid';
import { addCategory, deleteCategory, selectCategories } from '../../state/rules';

export function FormCreator() {
    const { action, isLoading } = useFormSaveAction();
    const dispatch = useAppDispatch();
    const categories = useAppSelector(selectCategories);

    const categoryRef = useRef<HTMLInputElement>(null);

    const handleCategoryAdd = () => {
        const value = categoryRef.current?.value;
        if (value) {
            dispatch(addCategory({ id: uuid(), category: value }));
        }
    };

    const handleCategoryDelete = (categoryActionId: string) => {
        dispatch(deleteCategory({ categoryActionId }));
    };

    return (
        <form action={action}>
            <Flex gap='sm' className='pb-sm'>
                <Card>
                    <FormHeader />
                </Card>
                <Card title='Form settings'>
                    <FormSettings />
                </Card>
            </Flex>
            <Stack>
                <Group>
                    <TextInput className='w-fit' placeholder='Category...' ref={categoryRef} />
                    <IconButton icon={IconPlus} onClick={handleCategoryAdd} />
                </Group>
                {categories.map(c => (
                    <Group key={c.id}>
                        <div>{c.category}</div>
                        <IconButton icon={IconX} onClick={() => handleCategoryDelete(c.id)} />
                    </Group>
                ))}
            </Stack>
            <FormFieldsContainer />
            <FormActions isLoading={isLoading} />
        </form>
    );
}
