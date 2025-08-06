import { useSession } from 'next-auth/react';
import { Field } from './useFormFields';
import { useActionState } from 'react';
import { saveForm } from '../lib/form';

export type FormCreateActionStatus = {
    success: boolean;
    message: string;
};

export function useFormCreateAction(title: string, fields: Field[]) {
    const { data: session } = useSession();

    const formCreateAction = async (): Promise<FormCreateActionStatus> => {
        try {
            await saveForm(title, fields, session?.user.id);
            return { success: true, message: 'Form has been saved successfully.' };
        } catch {
            return { success: false, message: 'Something went wrong.\nPlease try again.' };
        }
    };

    const [status, action, isLoading] = useActionState(formCreateAction, null);

    return { status, action, isLoading };
}
