import { ChangeEventHandler, ReactNode } from 'react';
import { Stack, NativeSelect } from '@mantine/core';
import { FieldType } from '../../lib/types';
import { OptionCreator } from '../field-controls/option-creator/OptionCreator';
import { RulesCreator } from '../field-controls/rules-creator/RulesCreator';
import { useFormSelector } from '../../hooks/useFormSelector';
import { selectFieldById, setField } from '../../state/formFieldsSlice';
import { useDispatch } from 'react-redux';

type Props = {
    fieldId: string;
};

export function FieldBody({ fieldId }: Props) {
    const dispatch = useDispatch();
    const fieldType = useFormSelector(state => selectFieldById(state, fieldId).type);

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
