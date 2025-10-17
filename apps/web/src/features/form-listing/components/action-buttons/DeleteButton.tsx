import { Button, Flex } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { useTransition } from 'react';
import { deleteFormAction } from '../../lib/actions';
import { debug_wait } from '@/lib/debug';
import { useRouter } from 'next/navigation';

type Props = {
    formId: string;
};

export function DeleteButton({ formId }: Props) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleClick = async () => {
        startTransition(async () => {
            await debug_wait();
            await deleteFormAction(formId);
            router.refresh();
        });
    };

    return (
        <Button
            size='compact-sm'
            className='px-sm text-xs'
            variant='subtle'
            color='red'
            onClick={handleClick}
            loading={isPending}
        >
            <Flex align='center' gap='xs'>
                <IconTrash size={18} stroke={1.5} />
                <span>Delete</span>
            </Flex>
        </Button>
    );
}
