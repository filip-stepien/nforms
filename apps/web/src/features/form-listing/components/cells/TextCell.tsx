import { Table } from '@mantine/core';

type Props = {
    text: string;
};

export function TextCell({ text }: Props) {
    return <Table.Td>{text}</Table.Td>;
}
