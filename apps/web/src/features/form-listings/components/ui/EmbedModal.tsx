import { Modal, Stack, Flex, Code, Text } from '@mantine/core';
import { CopyButton } from './CopyButton';

type Props = {
    embedding: string;
    opened: boolean;
    onClose: () => void;
};

export function EmbedModal({ embedding, opened, onClose }: Props) {
    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title='Embed form'
            classNames={{ title: 'font-bold' }}
            size='lg'
        >
            <Stack>
                <Text size='sm'>Paste this tag on your website:</Text>
                <Flex align='center' gap='xs'>
                    <Code className='whitespace-nowrap p-sm flex-1'>{embedding}</Code>
                    <CopyButton value={embedding} />
                </Flex>
            </Stack>
        </Modal>
    );
}
