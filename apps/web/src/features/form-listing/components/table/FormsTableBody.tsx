import { Table } from '@mantine/core';
import { FormTableData } from '../../lib/data';
import { TextCell } from '../cells/TextCell';
import { StatusCell } from '../cells/StatusCell';
import { ResponsesCell } from '../cells/ResponsesCell';
import { useRouter } from 'next/navigation';

type Props = {
    data: FormTableData[];
};

export function FormsTableBody({ data }: Props) {
    const router = useRouter();

    const handleRowClick = (formId: string) => () => {
        router.push('/form-details/' + formId);
    };

    return (
        <Table.Tbody>
            {data.map(form => (
                <Table.Tr
                    key={form.id}
                    onClick={handleRowClick(form.id)}
                    className='cursor-pointer hover:bg-neutral-50'
                >
                    <TextCell text={form.title} />
                    <TextCell text={form.createdOn} />
                    <ResponsesCell responses={form.responses} />
                    <StatusCell status={form.status} />
                </Table.Tr>
            ))}
        </Table.Tbody>
    );
}
