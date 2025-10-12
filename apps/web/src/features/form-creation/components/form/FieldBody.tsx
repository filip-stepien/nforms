import { ChangeEventHandler, ReactNode } from 'react';
import { Stack, NativeSelect } from '@mantine/core';
import { OptionCreator } from '../field-controls/option-creator/OptionCreator';
import { RulesCreator } from '../field-controls/rules-creator/RulesCreator';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { FieldType, selectFieldById } from '../../state/slices/fields';
import { setField } from '../../state/thunks';

type Props = {
    fieldId: string;
};

export function FieldBody({ fieldId }: Props) {
    const dispatch = useAppDispatch();
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

    const handleInputTypeChange: ChangeEventHandler<HTMLSelectElement> = event => {
        dispatch(setField({ fieldId, field: { type: event.target.value as FieldType } }));
    };

    return (
        <Stack className='ml-[calc(32px+1rem)]'>
            <NativeSelect
                label='Input type'
                defaultValue={fieldType}
                data={Object.values(FieldType)}
                className='flex-1'
                onChange={handleInputTypeChange}
            />
            {controlsComponents[fieldType] && <Stack>{controlsComponents[fieldType]}</Stack>}
        </Stack>
    );
}
