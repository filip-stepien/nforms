import { ChangeEventHandler, JSX } from 'react';
import { Stack, NativeSelect } from '@mantine/core';
import { FieldType, FieldUpdater } from '../../lib/types';

type Props = {
    fieldType: FieldType;
    onFieldChange: FieldUpdater;
    controlsComponent: JSX.Element;
};

export function FieldBody({ fieldType, onFieldChange, controlsComponent }: Props) {
    const handleInputTypeChange: ChangeEventHandler<HTMLSelectElement> = event => {
        onFieldChange(prev => ({ ...prev, type: event.target.value as FieldType }));
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
