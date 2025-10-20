import { Checkbox, Divider, Stack } from '@mantine/core';
import { ChangeEvent } from 'react';
import { BaseFieldSettings } from './BaseFieldSettings';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { selectSettingsByFieldId, setSettings } from '../../state/settings';
import { FieldType, FieldSettingsMap } from '@packages/db/schemas/form';

type Props = {
    fieldId: string;
};

export function SelectionFieldSettings({ fieldId }: Props) {
    const dispatch = useAppDispatch();
    const settings = useAppSelector(state =>
        selectSettingsByFieldId<FieldType.SELECTION>(state, fieldId)
    );

    const handleSelectionSettingChange = (
        setting: keyof FieldSettingsMap[FieldType.SELECTION],
        event: ChangeEvent<HTMLInputElement>
    ) => {
        dispatch(
            setSettings<FieldType.SELECTION>({
                fieldId,
                settings: { [setting]: event.target.checked }
            })
        );
    };

    return (
        <>
            <BaseFieldSettings fieldId={fieldId} />
            <Divider />
            <Stack>
                <Checkbox
                    label='Multi selection'
                    description='Whether more than one option could be checked'
                    checked={settings.multiSelection}
                    onChange={e => handleSelectionSettingChange('multiSelection', e)}
                />
            </Stack>
        </>
    );
}
