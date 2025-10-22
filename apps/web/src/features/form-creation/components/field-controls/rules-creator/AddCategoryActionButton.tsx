import { addCategoryAction, selectCategories } from '@/features/form-creation/state/rules';
import { IconPlus } from '@tabler/icons-react';
import { v4 as uuid } from 'uuid';
import { ActionButton } from '../../ui/ActionButton';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';

type Props = {
    fieldId: string;
};

export function AddCategoryActionButton({ fieldId }: Props) {
    const dispatch = useAppDispatch();
    const categories = useAppSelector(selectCategories);

    const handleCategoryActionAdd = () => {
        dispatch(
            addCategoryAction({
                id: uuid(),
                operation: 'ADD',
                targetCategoryId: categories.at(0)?.id,
                points: 1,
                fieldId
            })
        );
    };

    return (
        <ActionButton
            label='Scoring Rule'
            icon={IconPlus}
            variant='transparent'
            onClick={handleCategoryActionAdd}
        />
    );
}
