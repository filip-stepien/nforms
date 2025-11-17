import { ActionButton } from '@/features/form-editor/components/ui/ActionButton';
import { debug_wait } from '@/lib/debug';
import { Group, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconTrash } from '@tabler/icons-react';
import { useTransition } from 'react';
import { deleteResponseAction } from '../lib/actions';

type Props = {
    responseId: string;
    formId: string;
};

export function DeleteResponseButton({ responseId, formId }: Props) {
    const [opened, { open, close }] = useDisclosure();
    const [isPending, startTransition] = useTransition();

    const handleConfirm = async () => {
        startTransition(async () => {
            await debug_wait();
            await deleteResponseAction(responseId, formId);
        });
    };

    return (
        <>
            <Modal
                title={<span className='font-bold'>Delete response</span>}
                opened={opened}
                onClose={close}
                classNames={{ header: 'min-h-0 pt-md pb-sm' }}
            >
                <div className='pb-lg'>Are you sure you want to delete this response?</div>
                <Group className='flex-row-reverse'>
                    <ActionButton label='Cancel' variant='default' onClick={close} />
                    <ActionButton
                        icon={IconTrash}
                        label='Delete'
                        color='red'
                        variant='light'
                        type='submit'
                        loading={isPending}
                        onClick={handleConfirm}
                    />
                </Group>
            </Modal>
            <ActionButton
                icon={IconTrash}
                label='Delete'
                color='red'
                variant='light'
                onClick={open}
            />
        </>
    );
}
