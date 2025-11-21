import { isEmail, useForm } from '@mantine/form';
import { ParsedField } from '../lib/data';

function requiredValidator(value: string | string[]) {
    return value && value.length > 0 ? null : 'This question is required.';
}

export function useDynamicFieldsForm(fields: ParsedField[], anonymous: boolean) {
    const form = useForm({
        mode: 'uncontrolled',
        validate: {
            email: anonymous ? undefined : isEmail('Invalid email.'),
            ...Object.fromEntries(
                fields.filter(f => f.settings.required).map(f => [f.id, requiredValidator])
            )
        }
    });

    return {
        getInputKey: form.key,
        getInputProps: form.getInputProps,
        emailKey: form.key('email'),
        emailProps: form.getInputProps('email'),
        onSubmit: form.onSubmit
    };
}
