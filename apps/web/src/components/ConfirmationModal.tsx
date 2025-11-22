import { ActionButton } from '@/features/form-editor/components/ui/ActionButton';
import { Button, Group, LoadingOverlay, Modal, Stack } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';

type Props = {
    title?: string;
    message?: string;
    opened?: boolean;
    onClose?: () => void;
    onConfirm?: () => void;
    loading?: boolean;
};

export function ConfirmationModal(props: Props) {
    const {
        title = 'Confirmation',
        message = 'Are you sure you want to perform this action?',
        opened = false,
        onClose = () => null,
        onConfirm = () => null,
        loading = false
    } = props;
    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={<span className='font-bold'>{title}</span>}
            classNames={{ header: 'pt-lg px-lg min-h-fit', body: 'px-lg' }}
        >
            <Stack gap='lg' className='relative'>
                <LoadingOverlay
                    visible={loading}
                    zIndex={1000}
                    overlayProps={{ radius: 'sm', blur: 2 }}
                />
                <span>{message}</span>
                <Group className='flex-row-reverse'>
                    <Button onClick={onClose} variant='default'>
                        Cancel
                    </Button>
                    <ActionButton
                        onClick={onConfirm}
                        color='red'
                        label='Delete'
                        icon={IconTrash}
                        variant='light'
                    />
                </Group>
            </Stack>
        </Modal>
    );
}
