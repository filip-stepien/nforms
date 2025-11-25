import { Button, Flex } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconShare } from '@tabler/icons-react';
import { ShareModal } from '../modals/ShareModal';

type Props = {
    url: string;
};

export function ShareButton({ url }: Props) {
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <>
            <ShareModal opened={opened} onClose={close} url={url} />
            <Button size='sm' className='px-sm w-[100px] text-xs' variant='light' onClick={open}>
                <Flex align='center' gap='xs'>
                    <IconShare size={18} stroke={1.5} />
                    <span>Share</span>
                </Flex>
            </Button>
        </>
    );
}
