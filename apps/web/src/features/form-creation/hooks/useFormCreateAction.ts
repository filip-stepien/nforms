import { saveFormAction } from '../lib/actions';
import { useActionState, useEffect } from 'react';
import { useAppStore } from '@/hooks/useAppStore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export type FormCreateActionStatus = {
    success: boolean;
    message: string;
};

export function useFormCreateAction(redirectHref = '/') {
    const store = useAppStore();
    const router = useRouter();
    const [status, action, isLoading] = useActionState(
        async (): Promise<FormCreateActionStatus> => {
            try {
                await saveFormAction(store.getState());
                return { success: true, message: 'Form has been saved successfully.' };
            } catch {
                return { success: false, message: 'Something went wrong.\nPlease try again.' };
            }
        },
        null
    );

    useEffect(() => {
        if (!status) {
            return;
        }

        if (status.success) {
            toast.success(status.message);
            if (redirectHref) {
                router.push(redirectHref);
            }
        } else {
            toast.error(status.message);
        }
    }, [status, redirectHref, router]);

    return { action, isLoading };
}
