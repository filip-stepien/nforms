import { useAppSelector } from '@/hooks/useAppSelector';
import { selectCategories } from '../../state/respondent-categories';
import { CategoryInput } from '../categories-editor/CategoryInput';
import { Stack } from '@mantine/core';
import { Category } from '../categories-editor/Category';

export function FormCategoriesTab() {
    const categories = useAppSelector(selectCategories);

    return (
        <Stack>
            <CategoryInput />
            {categories.toReversed().map(category => (
                <Category key={category.id} categoryId={category.id} />
            ))}
        </Stack>
    );
}
