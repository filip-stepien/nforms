import { Button, Flex } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconShare } from '@tabler/icons-react';
import { CopyURLModal } from '../ui/CopyURLModal';

type Props = {
    url: string;
};

export function CopyURLButton({ url }: Props) {
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <>
            <CopyURLModal opened={opened} onClose={close} url={url} />
            <Button size='compact-sm' className='px-sm text-xs' variant='subtle' onClick={open}>
                <Flex align='center' gap='xs'>
                    <IconShare size={18} stroke={1.5} />
                    <span>Share</span>
                </Flex>
            </Button>
        </>
    );
}
