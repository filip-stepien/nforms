import { Flex, TextInput, NativeSelect, Stack } from '@mantine/core';
import { ChangeEventHandler, Ref } from 'react';
import { FieldSettings } from './FieldSettings';
import { FieldType } from '../hooks/useFormFieldConfiguration';
import { FormFieldRef, useFormField } from '../hooks/useFormField';

type Props = {
    ref?: Ref<FormFieldRef>;
};

export function FormField({ ref }: Props) {
    const { titleRef, defaultSettingsRef, controlsComponent, settingsComponent, setFieldType } =
        useFormField(ref);

    const handleInputTypeChange: ChangeEventHandler<HTMLSelectElement> = event => {
        setFieldType(event.target.value as FieldType);
    };

    return (
        <Flex direction='column' gap='sm' className='w-1/2'>
            <TextInput
                label='Question title'
                placeholder='e.g. How would you describe your experience with our product?'
                className='flex-1'
                ref={titleRef}
            />
            <Flex align='end' gap='sm'>
                <NativeSelect
                    label='Input type'
                    data={Object.values(FieldType)}
                    className='flex-1'
                    onChange={handleInputTypeChange}
                />
                <FieldSettings ref={defaultSettingsRef} settings={settingsComponent} />
            </Flex>
            <Stack>{controlsComponent}</Stack>
        </Flex>
    );
}
