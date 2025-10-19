import { Button, Flex } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconCode } from '@tabler/icons-react';
import { EmbedModal } from '../modals/EmbedModal';

type Props = {
    embedding: string;
};

export function EmbedButton({ embedding }: Props) {
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <>
            <EmbedModal opened={opened} onClose={close} embedding={embedding} />
            <Button size='sm' className='px-sm text-xs' variant='light' onClick={open}>
                <Flex align='center' gap='xs'>
                    <IconCode size={18} stroke={1.5} />
                    <span>Embed</span>
                </Flex>
            </Button>
        </>
    );
}
