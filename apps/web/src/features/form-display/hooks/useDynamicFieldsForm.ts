import { useForm } from '@mantine/form';
import { ParsedField } from '../lib/data';

function requiredValidator(value: string | string[]) {
    return value && value.length > 0 ? null : 'This question is required.';
}

export function useDynamicFieldsForm(fields: ParsedField[]) {
    const form = useForm({
        mode: 'uncontrolled',
        validate: Object.fromEntries(
            fields.filter(f => f.settings.required).map(f => [f.id, requiredValidator])
        )
    });

    return {
        getKey: form.key,
        getInputProps: form.getInputProps,
        onSubmit: form.onSubmit
    };
}
