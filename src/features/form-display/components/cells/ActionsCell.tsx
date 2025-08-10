import { Table, Group } from '@mantine/core';
import { EmbedButton } from '../action-buttons/EmbedButton';
import { EditButton } from '../action-buttons/EditButton';

type Props = {
    actions: {
        editHref: string;
        embedding: string;
    };
};

export function ActionsCell({ actions }: Props) {
    return (
        <Table.Td>
            <Group>
                <EmbedButton embedding={actions.embedding} />
                <EditButton editHref={actions.editHref} />
            </Group>
        </Table.Td>
    );
}
