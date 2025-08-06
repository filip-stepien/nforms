import { saveFormAction } from '../lib/actions';
import { Field } from './useFormFields';
import { useActionState } from 'react';

export type FormCreateActionStatus = {
    success: boolean;
    message: string;
};

export function useFormCreateAction(title: string, fields: Field[]) {
    const formCreateAction = async (): Promise<FormCreateActionStatus> => {
        try {
            await saveFormAction(title, fields);
            return { success: true, message: 'Form has been saved successfully.' };
        } catch {
            return { success: false, message: 'Something went wrong.\nPlease try again.' };
        }
    };

    const [status, action, isLoading] = useActionState(formCreateAction, null);

    return { status, action, isLoading };
}
