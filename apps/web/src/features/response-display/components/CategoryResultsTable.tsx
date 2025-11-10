import { Table, Badge } from '@mantine/core';
import { FormResponse } from '@packages/db/schemas/form-responses';
import { getFieldScoring } from '../lib/score';

type Props = {
    formResponse: FormResponse;
};

export function CategoryResultsTable({ formResponse }: Props) {
    return (
        <div className='border-outline w-fit overflow-hidden rounded-sm border-1'>
            <Table
                variant='vertical'
                withColumnBorders
                classNames={{
                    table: 'w-fit block text-xs',
                    th: 'bg-white',
                    td: 'bg-white'
                }}
            >
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th className='min-w-[160px]'>Category</Table.Th>
                        <Table.Th>Total score</Table.Th>
                        <Table.Th>Questions</Table.Th>
                        <Table.Th>Score result</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {formResponse.categoryRules.map(category =>
                        formResponse.responses.map((response, i) => (
                            <Table.Tr key={`${category.category.name}-${i}`}>
                                {i === 0 && (
                                    <>
                                        <Table.Th rowSpan={formResponse.responses.length}>
                                            <Badge
                                                color={category.category.color}
                                                className='rounded-sm'
                                                variant='light'
                                            >
                                                {category.category.name}
                                            </Badge>
                                        </Table.Th>
                                        <Table.Td rowSpan={formResponse.responses.length}>
                                            {category.points}
                                        </Table.Td>
                                    </>
                                )}

                                <Table.Td>{response.fieldTitle}</Table.Td>
                                <Table.Td>
                                    {getFieldScoring(response.fieldRules, category.category.name)}
                                </Table.Td>
                            </Table.Tr>
                        ))
                    )}
                </Table.Tbody>
            </Table>
        </div>
    );
}
