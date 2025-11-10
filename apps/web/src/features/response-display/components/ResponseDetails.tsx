import { Stack, Table } from '@mantine/core';
import { FormResponse } from '@packages/db/schemas/form-responses';
import dayjs from 'dayjs';
import { CategoriesAccordion } from './CategoriesAccordion';

type Props = {
    formResponse: FormResponse;
};

export function ResponseDetails({ formResponse }: Props) {
    return (
        <Stack gap={0}>
            <div className='border-outline overflow-hidden rounded-t-sm border-1'>
                <Table
                    variant='vertical'
                    classNames={{ th: 'font-bold w-[180px] bg-neutral-50 p-sm' }}
                >
                    <Table.Tbody>
                        <Table.Tr>
                            <Table.Th>Respondent</Table.Th>
                            <Table.Td>{formResponse.email}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Submission</Table.Th>
                            <Table.Td>
                                {dayjs(formResponse.submission).format('HH:mm DD.MM.YYYY')}
                            </Table.Td>
                        </Table.Tr>
                    </Table.Tbody>
                </Table>
            </div>
            <CategoriesAccordion formResponse={formResponse} />
        </Stack>
    );
}
