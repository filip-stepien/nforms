import { Button, Group, Modal, Stack } from '@mantine/core';

type Props = {
    title?: string;
    message?: string;
    opened?: boolean;
    onClose?: () => void;
    onConfirm?: () => void;
};

export function ConfirmationModal(props: Props) {
    const {
        title = 'Confirmation',
        message = 'Are you sure you want to perform this action?',
        opened = false,
        onClose = () => null,
        onConfirm = () => null
    } = props;
    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={<span className='font-bold'>{title}</span>}
            classNames={{ header: 'pt-lg px-lg min-h-fit', body: 'px-lg' }}
        >
            <Stack gap='lg'>
                <span>{message}</span>
                <Group className='flex-row-reverse'>
                    <Button onClick={onClose} variant='light'>
                        Cancel
                    </Button>
                    <Button onClick={onConfirm}>Confirm</Button>
                </Group>
            </Stack>
        </Modal>
    );
}
