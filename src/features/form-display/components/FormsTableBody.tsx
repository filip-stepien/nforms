import { Badge, Button, Flex, Group, LoadingOverlay, Skeleton, Table } from '@mantine/core';
import { FormTableData } from '../lib/data';
import { IconEdit } from '@tabler/icons-react';
import { FormEmbedAction } from './FormEmbedAction';

type Props = {
    data?: FormTableData[];
};

export function FormsTableBody({ data = [] }: Props) {
    return (
        <Table.Tbody>
            {data.map(form => (
                <Table.Tr key={form.id}>
                    <Table.Td>
                        <span className=''>{form.title}</span>
                    </Table.Td>
                    <Table.Td>
                        <span className=''>{form.createdOn}</span>
                    </Table.Td>
                    <Table.Td>
                        <Badge className='' color='blue' variant='light'>
                            {form.responses}
                        </Badge>
                    </Table.Td>
                    <Table.Td>
                        <Badge color='green' variant='dot'>
                            {form.status}
                        </Badge>
                    </Table.Td>
                    <Table.Td>
                        <Group>
                            <FormEmbedAction embedding={form.actions.embedding} />
                            <Button size='compact-sm' className='px-sm text-xs' variant='subtle'>
                                <Flex align='center' gap={6}>
                                    <IconEdit size={18} />
                                    <span>Edit</span>
                                </Flex>
                            </Button>
                        </Group>
                    </Table.Td>
                </Table.Tr>
            ))}
        </Table.Tbody>
    );
}
