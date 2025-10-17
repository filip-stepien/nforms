import { Table, Group } from '@mantine/core';
import { EmbedButton } from '../action-buttons/EmbedButton';
import { EditButton } from '../action-buttons/EditButton';
import { CopyURLButton } from '../action-buttons/CopyURLButton';
import { OpenButton } from '../action-buttons/OpenButton';
import { DeleteButton } from '../action-buttons/DeleteButton';

type Props = {
    formId: string;
    actions: {
        shareHref: string;
        editHref: string;
        embedding: string;
    };
};

export function ActionsCell({ formId, actions }: Props) {
    return (
        <Table.Td>
            <Group gap='xs'>
                <EditButton editHref={actions.editHref} />
                <EmbedButton embedding={actions.embedding} />
                <CopyURLButton url={actions.shareHref} />
                <OpenButton url={actions.shareHref} />
                <DeleteButton formId={formId} />
            </Group>
        </Table.Td>
    );
}
