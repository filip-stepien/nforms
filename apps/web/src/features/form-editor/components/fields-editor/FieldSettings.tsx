import { ReactNode } from 'react';
import { selectFieldById } from '../../state/fields';
import { SelectionFieldSettings } from '../field-settings/SelectionFieldSettings';
import { TextFieldSettings } from '../field-settings/TextFieldSettings';
import { useAppSelector } from '@/hooks/useAppSelector';
import { Menu, Stack } from '@mantine/core';
import { IconAdjustments } from '@tabler/icons-react';
import { IconButton } from '../ui/IconButton';
import { FieldType } from '@packages/db/schemas/form';

type Props = {
    fieldId: string;
};

export function FieldSettings({ fieldId }: Props) {
    const fieldType = useAppSelector(state => selectFieldById(state, fieldId).type);

    const settingsComponents: Record<FieldType, ReactNode> = {
        [FieldType.TEXT]: <TextFieldSettings fieldId={fieldId} />,
        [FieldType.SELECTION]: <SelectionFieldSettings fieldId={fieldId} />
    };

    return (
        settingsComponents[fieldType] && (
            <Menu shadow='md' width={300} position='bottom-end'>
                <Menu.Target>
                    <IconButton variant='light' icon={IconAdjustments} />
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Label>Field settings</Menu.Label>
                    <Stack className='p-sm'>{settingsComponents[fieldType]}</Stack>
                </Menu.Dropdown>
            </Menu>
        )
    );
}
