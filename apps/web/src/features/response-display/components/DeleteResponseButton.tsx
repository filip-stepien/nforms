import { ActionButton } from '@/features/form-editor/components/ui/ActionButton';
import { debug_wait } from '@/lib/debug';
import { useDisclosure } from '@mantine/hooks';
import { IconTrash } from '@tabler/icons-react';
import { useTransition } from 'react';
import { deleteResponseAction } from '../lib/actions';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ConfirmationModal } from '@/components/ConfirmationModal';

type Props = {
    responseId: string;
    formId: string;
};

export function DeleteResponseButton({ responseId, formId }: Props) {
    const router = useRouter();
    const [opened, { open, close }] = useDisclosure();
    const [isPending, startTransition] = useTransition();

    const handleConfirm = async () => {
        startTransition(async () => {
            try {
                await debug_wait();
                await deleteResponseAction(responseId);
                router.replace('/form-details/' + formId);
                toast.success('Response deleted successfuly.');
            } catch {
                toast.error('Could not delete response.');
                close();
            }
        });
    };

    return (
        <>
            <ConfirmationModal
                title='Delete response'
                message='Are you sure you want to delete this response?'
                loading={isPending}
                onClose={close}
                onConfirm={handleConfirm}
                opened={opened}
            />
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
