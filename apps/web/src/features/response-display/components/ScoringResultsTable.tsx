import { Table, Badge } from '@mantine/core';
import { FormResponse } from '@packages/db/schemas/form-responses';

type Props = {
    formResponse: FormResponse;
    response: FormResponse['responses'][number];
};

export function ScoringResultsTable({ response, formResponse }: Props) {
    const getScoringResult = (categoryName: string) =>
        response.fieldRules.reduce((acc, rule) => {
            if (!rule.score.result || rule.score.category.name !== categoryName) {
                return acc;
            }

            switch (rule.score.operation) {
                case 'ADD':
                    return acc + rule.score.points;
                case 'SUBTRACT':
                    return acc - rule.score.points;
                default:
                    throw new Error(`Invalid rule score operation: ${rule.score.operation}`);
            }
        }, 0);

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
                    {formResponse.categoryRules.map(({ category }) => {
                        const scoringResult = getScoringResult(category.name);
                        return (
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
                                    {scoringResult > 0 ? `+${scoringResult}` : scoringResult}
                                </Table.Td>
                            </Table.Tr>
                        );
                    })}
                </Table.Tbody>
            </Table>
        </div>
    );
}
