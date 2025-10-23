import { ActionButton } from '@/features/form-editor/components/ui/ActionButton';
import { IconDeviceFloppy } from '@tabler/icons-react';

type Props = {
    isLoading: boolean;
};

export function SaveButton({ isLoading }: Props) {
    return <ActionButton label='Save' type='submit' icon={IconDeviceFloppy} loading={isLoading} />;
}
