import { saveFormAction } from '../lib/actions';
import { useActionState } from 'react';
import { useAppStore } from '@/hooks/useAppStore';

export type FormCreateActionStatus = {
    success: boolean;
    message: string;
};

export function useFormCreateAction() {
    const store = useAppStore();

    const formCreateAction = async (): Promise<FormCreateActionStatus> => {
        try {
            await saveFormAction(store.getState());
            return { success: true, message: 'Form has been saved successfully.' };
        } catch {
            return { success: false, message: 'Something went wrong.\nPlease try again.' };
        }
    };

    const [status, action, isLoading] = useActionState(formCreateAction, null);

    return { status, action, isLoading };
}
