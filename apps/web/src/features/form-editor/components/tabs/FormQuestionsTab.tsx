import { Flex } from '@mantine/core';
import { AddFieldButton } from '../fields-editor/AddFieldButton';
import { FormFieldsContainer } from '../fields-editor/FormFieldsContainer';

export function FormQuestionsTab() {
    return (
        <>
            <FormFieldsContainer />
            <Flex justify='center' className='pt-sm'>
                <AddFieldButton />
            </Flex>
        </>
    );
}
