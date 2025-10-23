import { Switch } from '@mantine/core';
import { ChangeEventHandler } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { selectSettingsByFieldId, setSettings } from '../../state/settings';

type Props = {
    fieldId: string;
};

export function BaseFieldSettings({ fieldId }: Props) {
    const dispatch = useAppDispatch();
    const settings = useAppSelector(state => selectSettingsByFieldId(state, fieldId));

    const handleRequiredChange: ChangeEventHandler<HTMLInputElement> = event => {
        dispatch(
            setSettings({
                fieldId,
                settings: { required: event.target.checked }
            })
        );
    };

    return (
        <Switch
            defaultChecked
            label='Required'
            checked={settings.required}
            onChange={handleRequiredChange}
        />
    );
}
