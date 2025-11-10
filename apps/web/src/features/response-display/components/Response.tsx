'use client';

import { Group, Stack } from '@mantine/core';
import { FormResponse } from '@packages/db/schemas/form-responses';
import { ActionButton } from '@/features/form-editor/components/ui/ActionButton';
import { ResponseDetails } from './ResponseDetails';
import { IconMessageCircleSearch, IconTrash } from '@tabler/icons-react';
import { ResponseField } from './ResponseField';

type Props = {
    formResponse: FormResponse;
};

export function Response({ formResponse }: Props) {
    return (
        <Stack>
            <Group justify='space-between'>
                <Group gap='sm'>
                    <IconMessageCircleSearch stroke={1.5} />
                    <h1 className='text-2xl font-bold'>Response details</h1>
                </Group>
                <ActionButton icon={IconTrash} label='Delete' color='red' variant='light' />
            </Group>
            <ResponseDetails formResponse={formResponse} />
            {formResponse.responses.map((response, i) => (
                <ResponseField key={i} index={i} formResponse={formResponse} response={response} />
            ))}
        </Stack>
    );
}
