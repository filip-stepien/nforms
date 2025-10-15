import { Button, Flex } from '@mantine/core';
import { IconEdit } from '@tabler/icons-react';
import Link from 'next/link';

type Props = {
    editHref: string;
};

export function EditButton({ editHref }: Props) {
    return (
        <Link href={editHref}>
            <Button size='compact-sm' className='px-sm text-xs' variant='subtle'>
                <Flex align='center' gap={6}>
                    <IconEdit size={18} />
                    <span>Edit</span>
                </Flex>
            </Button>
        </Link>
    );
}
