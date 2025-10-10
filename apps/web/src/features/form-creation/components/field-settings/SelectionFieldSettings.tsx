import { Checkbox, Divider, Stack } from '@mantine/core';
import { ChangeEvent } from 'react';
import { BaseFieldSettings } from './BaseFieldSettings';
import { FieldType, SettingsMap } from '../../lib/types';
import { useFormDispatch } from '../../hooks/useFormDispatch';
import { useFormSelector } from '../../hooks/useFormSelector';
import { selectFieldById, setField } from '../../state/formFieldsSlice';

type Props = {
    fieldId: string;
};

export function SelectionFieldSettings({ fieldId }: Props) {
    const dispatch = useFormDispatch();
    const settings = useFormSelector(
        state => selectFieldById<FieldType.SELECTION>(state, fieldId).settings
    );

    const handleSelectionSettingChange = (
        setting: keyof SettingsMap[FieldType.SELECTION],
        event: ChangeEvent<HTMLInputElement>
    ) => {
        dispatch(
            setField<FieldType.SELECTION>({
                fieldId,
                field: { settings: { [setting]: event.target.checked } }
            })
        );
    };

    return (
        <>
            <BaseFieldSettings fieldId={fieldId} />
            <Divider />
            <Stack>
                <Checkbox
                    label='Single selection'
                    description='Whether only one option should be checked'
                    checked={settings?.singleSelection}
                    onChange={e => handleSelectionSettingChange('singleSelection', e)}
                />
            </Stack>
        </>
    );
}
