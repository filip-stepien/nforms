import { Modal, Stack, Flex, Code, Text } from '@mantine/core';
import { CopyButton } from '../../../form-listing/components/ui/CopyButton';

type Props = {
    url: string;
    opened: boolean;
    onClose: () => void;
};

export function ShareModal({ url, opened, onClose }: Props) {
    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title='Share form'
            classNames={{ title: 'font-bold' }}
            size='lg'
        >
            <Stack>
                <Text size='sm'>
                    Copy this link to share your form. Anyone with the link can access and submit
                    it.
                </Text>
                <Flex align='center' gap='xs'>
                    <Code className='p-sm flex-1 whitespace-nowrap'>{url}</Code>
                    <CopyButton value={url} />
                </Flex>
            </Stack>
        </Modal>
    );
}
