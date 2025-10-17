import { Checkbox, Radio, Stack } from '@mantine/core';
import { GetInputPropsReturnType } from '@mantine/form';
import { FieldOption } from '@packages/db/schemas/form';

type Props = {
    required: boolean;
    multiSelect: boolean;
    question: string;
    options: Omit<FieldOption, 'order'>[];
    inputProps: GetInputPropsReturnType;
    formKey: string;
};

export function SelectionInput(props: Props) {
    const { required, question, multiSelect, options, inputProps, formKey } = props;

    return multiSelect ? (
        <Checkbox.Group
            key={formKey}
            label={question}
            withAsterisk={required}
            classNames={{ error: 'pt-md' }}
            {...inputProps}
        >
            <Stack className='pt-md'>
                {options.map(opt => (
                    <Checkbox key={opt.id} label={opt.content} value={opt.id} />
                ))}
            </Stack>
        </Checkbox.Group>
    ) : (
        <Radio.Group
            key={formKey}
            name={formKey}
            label={question}
            withAsterisk={required}
            classNames={{ error: 'pt-md' }}
            {...inputProps}
        >
            <Stack className='pt-md'>
                {options.map(opt => (
                    <Radio key={opt.id} label={opt.content} value={opt.id} />
                ))}
            </Stack>
        </Radio.Group>
    );
}
