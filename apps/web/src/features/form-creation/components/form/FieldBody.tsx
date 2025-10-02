import { ChangeEventHandler, ReactNode, JSX } from 'react';
import { FieldType } from '../../hooks/useFormFields';
import { Stack, NativeSelect } from '@mantine/core';

type Props = {
    fieldType: FieldType;
    onFieldTypeChange: (fieldType: FieldType) => void;
    controlsComponent: JSX.Element;
};

export function FieldBody({ fieldType, onFieldTypeChange, controlsComponent }: Props) {
    const handleInputTypeChange: ChangeEventHandler<HTMLSelectElement> = event => {
        onFieldTypeChange(event.target.value as FieldType);
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
            {controlsComponent && <Stack>{controlsComponent}</Stack>}
        </Stack>
    );
}
