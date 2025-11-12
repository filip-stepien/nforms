'use client';

import { Group, Stack } from '@mantine/core';
import { FormResponse } from '@packages/db/schemas/form-responses';
import { ActionButton } from '@/features/form-editor/components/ui/ActionButton';
import { ResponseDetails } from './ResponseDetails';
import { IconMessageCircleSearch, IconTrash } from '@tabler/icons-react';
import { ResponseField } from './ResponseField';
import { SectionTitle } from '@/components/SectionTitle';

type Props = {
    formResponse: FormResponse;
};

export function Response({ formResponse }: Props) {
    return (
        <Stack>
            <Group justify='space-between'>
                <SectionTitle>
                    <SectionTitle.BackButton />
                    <SectionTitle.Icon icon={IconMessageCircleSearch} />
                    <SectionTitle.Title>Response details</SectionTitle.Title>
                </SectionTitle>
                <ActionButton icon={IconTrash} label='Delete' color='red' variant='light' />
            </Group>
            <ResponseDetails formResponse={formResponse} />
            {formResponse.responses.map((response, i) => (
                <ResponseField key={i} index={i} formResponse={formResponse} response={response} />
            ))}
        </Stack>
    );
}
