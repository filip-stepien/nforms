'use client';

import { useFormSaveAction } from '@/hooks/useFormSaveAction';
import { FormHeader } from './FormHeader';
import { FormTimestamp } from './FormTimestamp';
import { FormActions } from './FormActions';
import { FormDetailsTabs } from './FormDetailsTabs';
import { Stack, Flex } from '@mantine/core';

type Props = {
    formId: string;
    createdAt: Date;
    baseUrl: string;
};

export function FormDetails({ formId, createdAt, baseUrl }: Props) {
    const { isLoading, action } = useFormSaveAction(formId);

    return (
        <form action={action}>
            <Flex gap={100} className='pb-xs'>
                <Stack flex={1}>
                    <FormTimestamp createdAt={createdAt} />
                    <FormHeader />
                </Stack>
                <FormActions isSaveLoading={isLoading} baseUrl={baseUrl} formId={formId} />
            </Flex>
            <FormDetailsTabs />
        </form>
    );
}
