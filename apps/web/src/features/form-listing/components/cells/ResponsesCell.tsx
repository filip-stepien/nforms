import { Table, Badge } from '@mantine/core';

type Props = {
    responses: number;
};

export function ResponsesCell({ responses }: Props) {
    return (
        <Table.Td>
            <Badge color='blue' variant='light' className='cursor-pointer'>
                {responses}
            </Badge>
        </Table.Td>
    );
}
