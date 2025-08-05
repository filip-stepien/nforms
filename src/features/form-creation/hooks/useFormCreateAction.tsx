import { useSession } from 'next-auth/react';
import { Field } from './useFormFields';
import { useActionState } from 'react';
import { saveForm } from '../lib/form';

export function useFormCreateAction(title: string, fields: Field[]) {
    const { data: session } = useSession();

    const formCreateAction = async () => {
        await saveForm(title, fields, session?.user.id);
    };

    const [_, action, isLoading] = useActionState(formCreateAction, undefined);

    return { action, isLoading };
}
