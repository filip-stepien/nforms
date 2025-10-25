import { RulesAccordion } from './RulesAccordion';
import { useAppSelector } from '@/hooks/useAppSelector';
import { selectFieldCategoryActionByFieldId } from '@/features/form-editor/state/field-rules';
import { CategoryActionRow } from './CategoryActionRow';
import { AddCategoryActionButton } from './AddCategoryActionButton';
import { Stack } from '@mantine/core';

type Props = {
    fieldId: string;
};

export function RulesCreator({ fieldId }: Props) {
    const categoryActions = useAppSelector(selectFieldCategoryActionByFieldId(fieldId));

    return (
        <RulesAccordion>
            <Stack gap='md'>
                {categoryActions.map(({ id }) => (
                    <CategoryActionRow key={id} categoryActionId={id} fieldId={fieldId} />
                ))}
                <AddCategoryActionButton fieldId={fieldId} />
            </Stack>
        </RulesAccordion>
    );
}
