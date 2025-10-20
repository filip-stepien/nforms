import { Flex } from '@mantine/core';
import { FormHeader } from './FormHeader';
import { FormActions } from './FormActions';
import { FormSettings } from './FormSettings';
import { FormFieldsContainer } from './FormFieldsContainer';
import { useFormSaveAction } from '../../../../hooks/useFormSaveAction';
import { Card } from './Card';

export function FormCreator() {
    const { action, isLoading } = useFormSaveAction();

    return (
        <form action={action}>
            <Flex gap='sm' className='pb-sm'>
                <Card>
                    <FormHeader />
                </Card>
                <Card title='Form settings'>
                    <FormSettings />
                </Card>
            </Flex>
            <FormFieldsContainer />
            <FormActions isLoading={isLoading} />
        </form>
    );
}
