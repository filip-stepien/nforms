import { Flex } from '@mantine/core';
import { useFormCreateAction } from '../../hooks/useFormCreateAction';
import { FormHeader } from './FormHeader';
import { FormActions } from './FormActions';
import { FormSettings } from './FormSettings';
import { FormFieldsContainer } from './FormFieldsContainer';
import { Card } from './Card';

export function FormCreator() {
    const { action, isLoading } = useFormCreateAction();

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
