import { Switch } from '@mantine/core';
import { ChangeEventHandler } from 'react';
import { useFormDispatch } from '../../hooks/useFormDispatch';
import { useFormSelector } from '../../hooks/useFormSelector';
import { selectFieldById, setField } from '../../state/formFieldsSlice';

type Props = {
    fieldId: string;
};

export function BaseFieldSettings({ fieldId }: Props) {
    const dispatch = useFormDispatch();
    const settings = useFormSelector(state => selectFieldById(state, fieldId).settings);

    const handleRequiredChange: ChangeEventHandler<HTMLInputElement> = event => {
        dispatch(
            setField({
                fieldId,
                field: { settings: { required: event.target.checked } }
            })
        );
    };

    return (
        <Switch
            defaultChecked
            label='Required'
            checked={settings?.required}
            onChange={handleRequiredChange}
        />
    );
}
