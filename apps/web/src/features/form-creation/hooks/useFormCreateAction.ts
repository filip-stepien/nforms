import { useAppSelector } from '@/hooks/useAppSelector';
import { saveFormAction } from '../lib/actions';
import { useActionState } from 'react';

export type FormCreateActionStatus = {
    success: boolean;
    message: string;
};

export function useFormCreateAction() {
    const title = useAppSelector(state => state.formTitle.title);
    const fields = useAppSelector(state => state.formFields);

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
