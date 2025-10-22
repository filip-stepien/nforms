import { addCategoryAction } from '@/features/form-creation/state/rules';
import { IconPlus } from '@tabler/icons-react';
import { v4 as uuid } from 'uuid';
import { ActionButton } from '../../ui/ActionButton';
import { useAppDispatch } from '@/hooks/useAppDispatch';

type Props = {
    fieldId: string;
};

export function AddCategoryActionButton({ fieldId }: Props) {
    const dispatch = useAppDispatch();

    const handleCategoryActionAdd = () => {
        dispatch(
            addCategoryAction({
                id: uuid(),
                action: 'ADD',
                targetCategoryId: 'categoryId',
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
