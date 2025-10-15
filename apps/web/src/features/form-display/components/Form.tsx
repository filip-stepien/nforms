import { Form as FormType } from '@packages/db/generated';

type Props = {
    form: FormType;
};

export function Form({ form }: Props) {
    return <div>{form.title}</div>;
}
