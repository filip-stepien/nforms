import { Textarea } from '@mantine/core';
import { GetInputPropsReturnType } from '@mantine/form';

type Props = {
    question: string;
    required: boolean;
    inputProps: GetInputPropsReturnType;
    formKey: string;
};

export function TextInput({ question, required, inputProps, formKey }: Props) {
    return (
        <Textarea
            key={formKey}
            withAsterisk={required}
            label={question}
            classNames={{
                label: 'pb-sm',
                input: 'border-0 placeholder:text-placeholder text-foreground',
                wrapper: 'border-b-1 border-border',
                error: 'pt-xs'
            }}
            autosize
            minRows={1}
            placeholder='Your answer...'
            {...inputProps}
            className='!text-foreground'
        />
    );
}
