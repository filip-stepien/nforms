import { Switch } from '@mantine/core';
import { ChangeEventHandler } from 'react';
import { selectFieldSettings } from '../../state/selectors';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { setSettings } from '../../state/slices/settings';

type Props = {
    fieldId: string;
};

export function BaseFieldSettings({ fieldId }: Props) {
    const dispatch = useAppDispatch();
    const settings = useAppSelector(state => selectFieldSettings(state, fieldId));

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
