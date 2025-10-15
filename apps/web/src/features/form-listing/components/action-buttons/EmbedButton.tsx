import { Button, Flex } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconCode } from '@tabler/icons-react';
import { EmbedModal } from '../ui/EmbedModal';

type Props = {
    embedding: string;
};

export function EmbedButton({ embedding }: Props) {
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <>
            <EmbedModal opened={opened} onClose={close} embedding={embedding} />
            <Button size='compact-sm' className='px-sm text-xs' variant='subtle' onClick={open}>
                <Flex align='center' gap={6}>
                    <IconCode size={18} />
                    <span>Embed</span>
                </Flex>
            </Button>
        </>
    );
}
