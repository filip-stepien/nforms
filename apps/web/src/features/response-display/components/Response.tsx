'use client';

import { Badge, Stack, Table } from '@mantine/core';
import { FormResponse } from '@packages/db/schemas/form-responses';
import { Form } from '@packages/db/schemas/form/form';
import dayjs from 'dayjs';

type Props = {
    response: FormResponse;
    form: Form;
};

export function Response({ response, form }: Props) {
    const assignedCategories = response.categoryRules
        .filter(category => category.assigned)
        .map(({ category }, i) => (
            <Badge key={i} color={category.color} className='rounded-sm pt-0.5'>
                {category.name}
            </Badge>
        ));

    return (
        <Stack>
            <Stack>
                <span className='text-2xl font-bold'>Response details</span>
            </Stack>
            <Table variant='vertical' layout='fixed' withTableBorder>
                <Table.Tbody>
                    <Table.Tr>
                        <Table.Th w={160}>Respondent</Table.Th>
                        <Table.Td>{response.email}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Submission</Table.Th>
                        <Table.Td>{dayjs(response.submission).format('HH:mm DD.MM.YYYY')}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Assigned categories</Table.Th>
                        <Table.Td>
                            {assignedCategories.length > 0 ? (
                                assignedCategories
                            ) : (
                                <span className='italic'>{'<None>'}</span>
                            )}
                        </Table.Td>
                    </Table.Tr>
                </Table.Tbody>
            </Table>
            {response.responses.map((r, i) => (
                <Stack key={i}>
                    <span className='font-bold'>
                        {i + 1}. {r.fieldTitle}
                    </span>
                    <span>{r.response}</span>
                </Stack>
            ))}
        </Stack>
    );
}
