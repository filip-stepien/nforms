import { Table, Badge } from '@mantine/core';

type Props = {
    status: string;
};

export function StatusCell({ status }: Props) {
    return (
        <Table.Td>
            <Badge
                color={status === 'active' ? 'green' : 'red'}
                variant='dot'
                className='cursor-pointer rounded-sm'
            >
                {status}
            </Badge>
        </Table.Td>
    );
}
