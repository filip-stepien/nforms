'use client';

import { Group, Stack } from '@mantine/core';
import { FormResponse } from '@packages/db/schemas/form-responses';
import { ResponseDetails } from './ResponseDetails';
import { IconMessageCircleSearch } from '@tabler/icons-react';
import { ResponseField } from './ResponseField';
import { SectionTitle } from '@/components/SectionTitle';
import { DeleteResponseButton } from './DeleteResponseButton';

type Props = {
    formResponse: FormResponse;
};

export function Response({ formResponse }: Props) {
    return (
        <form>
            <Stack>
                <Group justify='space-between'>
                    <SectionTitle>
                        <SectionTitle.BackButton />
                        <SectionTitle.Icon icon={IconMessageCircleSearch} />
                        <SectionTitle.Title>Response details</SectionTitle.Title>
                    </SectionTitle>
                    <DeleteResponseButton
                        responseId={formResponse.id}
                        formId={formResponse.formId}
                    />
                </Group>
                <ResponseDetails formResponse={formResponse} />
                {formResponse.responses.map((response, i) => (
                    <ResponseField
                        key={i}
                        index={i}
                        formResponse={formResponse}
                        response={response}
                    />
                ))}
            </Stack>
        </form>
    );
}
