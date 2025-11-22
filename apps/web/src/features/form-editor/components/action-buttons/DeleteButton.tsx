import { Button, Flex } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { useTransition } from 'react';
import { debug_wait } from '@/lib/debug';
import { deleteFormAction } from '@/features/form-listing/lib/actions';
import { useDisclosure } from '@mantine/hooks';
import { ConfirmationModal } from '@/components/ConfirmationModal';

type Props = {
    formId: string;
};

export function DeleteButton({ formId }: Props) {
    const [isPending, startTransition] = useTransition();
    const [confirmOpened, { close: closeConfirm, open: openConfirm }] = useDisclosure();

    const handleConfirm = async () => {
        startTransition(async () => {
            await debug_wait();
            await deleteFormAction(formId);
        });
    };

    return (
        <>
            <ConfirmationModal
                opened={confirmOpened}
                onClose={closeConfirm}
                onConfirm={handleConfirm}
                message='Are you sure you want to delete this form? This action cannot be undone.'
            />
            <Button
                size='sm'
                className='px-sm w-[100px] text-xs'
                color='red'
                variant='light'
                onClick={openConfirm}
                loading={isPending}
            >
                <Flex align='center' gap='xs'>
                    <IconTrash size={18} stroke={1.5} />
                    <span>Delete</span>
                </Flex>
            </Button>
        </>
    );
}
