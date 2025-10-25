import { FieldType } from '@packages/db/schemas/form/form-fields';
import { ParsedField } from '../lib/data';
import { SelectionInput } from './inputs/SelectionInput';
import { TextInput } from './inputs/TextInput';
import { GetInputPropsReturnType } from '@mantine/form';

type Props = {
    question: string;
    field: ParsedField;
    inputProps: GetInputPropsReturnType;
    formKey: string;
};

export function FormInput({ question, field, inputProps, formKey }: Props) {
    switch (field.type) {
        case FieldType.SELECTION:
            return (
                <SelectionInput
                    question={question}
                    options={field.options}
                    required={field.settings.required}
                    multiSelect={field.settings.multiSelection}
                    formKey={formKey}
                    inputProps={inputProps}
                />
            );
        case FieldType.TEXT:
            return (
                <TextInput
                    question={question}
                    required={field.settings.required}
                    key={formKey}
                    formKey={formKey}
                    inputProps={inputProps}
                />
            );
    }
}
