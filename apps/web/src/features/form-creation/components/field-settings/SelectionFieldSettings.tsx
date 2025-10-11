import { Checkbox, Divider, Stack } from '@mantine/core';
import { ChangeEvent } from 'react';
import { BaseFieldSettings } from './BaseFieldSettings';
import { selectFieldSettings } from '../../state/selectors';
import { FieldType } from '../../state/slices/fields';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { FieldSettingsMap, setSettings } from '../../state/slices/settings';

type Props = {
    fieldId: string;
};

export function SelectionFieldSettings({ fieldId }: Props) {
    const dispatch = useAppDispatch();
    const settings = useAppSelector(state =>
        selectFieldSettings<FieldType.SELECTION>(state, fieldId)
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
                    label='Single selection'
                    description='Whether only one option should be checked'
                    checked={settings.singleSelection}
                    onChange={e => handleSelectionSettingChange('singleSelection', e)}
                />
            </Stack>
        </>
    );
}
