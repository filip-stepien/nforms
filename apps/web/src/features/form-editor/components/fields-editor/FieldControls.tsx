import { Stack } from '@mantine/core';
import { ReactNode } from 'react';
import { selectFieldById } from '../../state/fields';
import { OptionCreator } from '../field-controls/option-creator/OptionCreator';
import { RulesCreator } from '../field-controls/rules-creator/RulesCreator';
import { useAppSelector } from '@/hooks/useAppSelector';
import { FieldType } from '@packages/db/schemas/form/form-fields';

type Props = {
    fieldId: string;
};

export function FieldControls({ fieldId }: Props) {
    const fieldType = useAppSelector(state => selectFieldById(state, fieldId).type);

    const controlsComponents: Record<FieldType, ReactNode> = {
        [FieldType.TEXT]: <RulesCreator fieldId={fieldId} />,
        [FieldType.SELECTION]: (
            <Stack>
                <RulesCreator fieldId={fieldId} />
                <OptionCreator fieldId={fieldId} />
            </Stack>
        )
    };

    return controlsComponents[fieldType] && <Stack>{controlsComponents[fieldType]}</Stack>;
}
