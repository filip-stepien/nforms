import { Flex } from '@mantine/core';
import { ShareButton } from './buttons/CopyURLButton';
import { DeleteButton } from './buttons/DeleteButton';
import { EmbedButton } from './buttons/EmbedButton';
import { OpenButton } from './buttons/OpenButton';
import { SaveButton } from './buttons/SaveButton';

type Props = {
    formId: string;
    isSaveLoading: boolean;
    baseUrl: string;
};

export function FormActions({ formId, isSaveLoading, baseUrl }: Props) {
    return (
        <Flex gap='xs' align='flex-end' justify='flex-end'>
            <SaveButton isLoading={isSaveLoading} />
            <OpenButton url={`/form/${formId}`} />
            <ShareButton url={`${baseUrl}form/${formId}`} />
            <EmbedButton embedding='<div />' />
            <DeleteButton formId={formId} />
        </Flex>
    );
}
