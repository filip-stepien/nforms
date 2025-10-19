import { Button, Flex } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';
import Link from 'next/link';

type Props = {
    url: string;
};

export function OpenButton({ url }: Props) {
    return (
        <Link href={url}>
            <Button size='sm' className='px-sm text-xs' variant='light'>
                <Flex align='center' gap='xs'>
                    <IconExternalLink size={18} stroke={1.5} />
                    <span>Open</span>
                </Flex>
            </Button>
        </Link>
    );
}
