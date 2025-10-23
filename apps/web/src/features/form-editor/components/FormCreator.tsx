import { Flex } from '@mantine/core';
import { SaveButton } from './action-buttons/SaveButton';
import { FormHeader } from './layout/FormHeader';
import { useFormSaveAction } from '../hooks/useFormSaveAction';
import { FormTabs } from './layout/FormTabs';

export function FormCreator() {
    const { isLoading, action } = useFormSaveAction();

    return (
        <form action={action}>
            <Flex gap={100} className='pb-xs' justify='space-between' align='flex-end'>
                <FormHeader />
                <SaveButton isLoading={isLoading} />
            </Flex>
            <FormTabs tabs={['questions', 'settings']} defaultTab='questions' />
        </form>
    );
}
