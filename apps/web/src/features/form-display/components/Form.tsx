import { Flex, Stack } from '@mantine/core';
import { Form as FormType } from '@packages/db/schemas/form';

type Props = {
    form: FormType;
};

export function Form({ form }: Props) {
    console.log(JSON.stringify(form, null, 2));

    return (
        <Flex justify='center' className='bg-neutral-background min-h-dvh'>
            <Stack className='bg-background shadow-card rounded-md w-1/2 my-xl h-fit p-xl'>
                <h1 className='text-3xl font-medium'>{form.title}</h1>
            </Stack>
        </Flex>
    );
}
