import { cn } from '@/lib/utils';
import { TextInput, Group } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { IconButton } from '../ui/IconButton';
import { ColorPickButton, ColorRef } from './ColorPickButton';
import { ChangeEventHandler, useRef, useState } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { v4 as uuid } from 'uuid';
import { selectCategories, addCategory } from '../../state/respondent-categories';

export function CategoryInput() {
    const colorRef = useRef<ColorRef>(null);
    const [error, setError] = useState(false);
    const [category, setCategory] = useState('');
    const categories = useAppSelector(selectCategories);
    const dispatch = useAppDispatch();

    const handleInputChange: ChangeEventHandler<HTMLInputElement> = event => {
        setCategory(event.target.value);
        setError(false);
    };

    const handleCategoryAdd = () => {
        const color = colorRef.current?.color;

        if (categories.some(c => c.category.toLowerCase() === category?.toLowerCase())) {
            setError(true);
            return;
        }

        if (category && color) {
            dispatch(addCategory({ id: uuid(), category, color }));
            setCategory('');
        }
    };

    return (
        <TextInput
            label='Add category'
            description='Create a new category to classify survey participants.'
            placeholder='Type a category name...'
            onChange={handleInputChange}
            value={category}
            error={error && 'Category already exists.'}
            classNames={{
                input: 'w-75'
            }}
            inputContainer={input => (
                <Group>
                    {input}
                    <Group className={cn(error ? 'my-[5px]' : 'mt-[5px]')}>
                        <ColorPickButton ref={colorRef} />
                        <IconButton icon={IconPlus} onClick={handleCategoryAdd} />
                    </Group>
                </Group>
            )}
        />
    );
}
