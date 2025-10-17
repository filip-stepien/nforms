import { GetInputPropsReturnType } from '@mantine/form';
import { ParsedField } from '../lib/data';
import { FormInput } from './FormInput';

type Props = {
    index: number;
    field: ParsedField;
    inputProps: GetInputPropsReturnType;
    formKey: string;
};

export function FormQuestion({ index, field, inputProps, formKey }: Props) {
    return (
        <div className='bg-background shadow-card sm:p-xl p-lg h-fit w-full rounded-md'>
            <FormInput
                question={`${index + 1}. ${field.title}`}
                field={field}
                inputProps={inputProps}
                formKey={formKey}
            />
        </div>
    );
}
