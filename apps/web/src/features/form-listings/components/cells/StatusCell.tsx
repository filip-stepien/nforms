import { Table, Badge } from '@mantine/core';

type Props = {
    status: string;
};

export function StatusCell({ status }: Props) {
    return (
        <Table.Td>
            <Badge color='green' variant='dot'>
                {status}
            </Badge>
        </Table.Td>
    );
}
