import { Button, Code, Flex, Modal, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconCode } from '@tabler/icons-react';
import { CopyButton } from './CopyButton';

type Props = {
    embedding: string;
};

export function FormEmbedAction({ embedding }: Props) {
    const [opened, { open, close }] = useDisclosure(false);
    return (
        <>
            <Modal
                opened={opened}
                onClose={close}
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
            <Button size='compact-sm' className='px-sm text-xs' variant='subtle' onClick={open}>
                <Flex align='center' gap={6}>
                    <IconCode size={18} />
                    <span>Embed</span>
                </Flex>
            </Button>
        </>
    );
}
