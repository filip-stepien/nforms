import { Table } from '@mantine/core';
import { FormTableData } from '../../lib/data';
import { TextCell } from '../cells/TextCell';
import { StatusCell } from '../cells/StatusCell';
import { ResponsesCell } from '../cells/ResponsesCell';
import { ActionsCell } from '../cells/ActionsCell';

type Props = {
    data: FormTableData[];
};

export function FormsTableBody({ data }: Props) {
    return (
        <Table.Tbody>
            {data.map(form => (
                <Table.Tr key={form.id}>
                    <TextCell text={form.title} />
                    <TextCell text={form.createdOn} />
                    <ResponsesCell responses={form.responses} />
                    <StatusCell status={form.status} />
                    <ActionsCell actions={form.actions} />
                </Table.Tr>
            ))}
        </Table.Tbody>
    );
}
