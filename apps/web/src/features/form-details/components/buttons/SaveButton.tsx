import { ActionButton } from '@/features/form-creation/components/ui/ActionButton';
import { IconDeviceFloppy } from '@tabler/icons-react';

export function SaveButton() {
    return <ActionButton label='Save' type='submit' icon={IconDeviceFloppy} />;
}
