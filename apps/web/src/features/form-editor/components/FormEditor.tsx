'use client';

import { FormHeader } from './layout/FormHeader';
import { FormTimestamp } from './layout/FormTimestamp';
import { Stack, Flex } from '@mantine/core';
import { ShareButton } from './action-buttons/CopyURLButton';
import { DeleteButton } from './action-buttons/DeleteButton';
import { EmbedButton } from './action-buttons/EmbedButton';
import { OpenButton } from './action-buttons/OpenButton';
import { SaveButton } from './action-buttons/SaveButton';
import { useFormSaveAction } from '../hooks/useFormSaveAction';
import { FormTabs } from './layout/FormTabs';

type Props = {
    formId: string;
    baseUrl: string;
    createdAt: Date;
};

export function FormEditor({ formId, baseUrl, createdAt }: Props) {
    const { isLoading, action } = useFormSaveAction(formId);

    return (
        <form action={action}>
            <Flex gap={100} className='pb-xs'>
                <Stack flex={1}>
                    <FormTimestamp createdAt={createdAt} />
                    <FormHeader />
                </Stack>
                <Flex gap='xs' align='flex-end' justify='flex-end'>
                    <SaveButton isLoading={isLoading} />
                    <OpenButton url={`/form/${formId}`} />
                    <ShareButton url={`${baseUrl}form/${formId}`} />
                    <EmbedButton embedding='<div />' />
                    <DeleteButton formId={formId} />
                </Flex>
            </Flex>
            <FormTabs
                tabs={['responses', 'questions', 'categories', 'settings']}
                defaultTab='responses'
            />
        </form>
    );
}
