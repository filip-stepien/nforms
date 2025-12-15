import { Table, Badge } from '@mantine/core';
import { FormResponse } from '@packages/db/schemas/form-responses';
import { getFieldScoring } from '../lib/score';

type Props = {
    formResponse: FormResponse;
    response: FormResponse['responses'][number];
};

export function ScoringResultsTable({ response, formResponse }: Props) {
    return (
        <div className='border-outline w-fit overflow-hidden rounded-sm border-1'>
            <Table
                variant='vertical'
                withColumnBorders
                classNames={{
                    table: 'w-fit block text-xs',
                    th: 'bg-white min-w-[160px]',
                    td: 'bg-white min-w-[160px]'
                }}
            >
                <Table.Tbody>
                    <Table.Tr>
                        <Table.Th>Category</Table.Th>
                        <Table.Td>Scoring result</Table.Td>
                    </Table.Tr>
                    {formResponse.categoryRules.map(({ category }) => (
                        <Table.Tr key={category.name}>
                            <Table.Th>
                                <Badge
                                    key={category.name}
                                    color={category.color}
                                    className='rounded-sm'
                                    variant='light'
                                >
                                    {category.name}
                                </Badge>
                            </Table.Th>
                            <Table.Td>
                                {getFieldScoring(response.fieldRules, category.name)}
                            </Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        </div>
    );
}
