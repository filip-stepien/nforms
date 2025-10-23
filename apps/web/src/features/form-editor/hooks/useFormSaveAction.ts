import { useActionState, useEffect } from 'react';
import { useAppStore } from '@/hooks/useAppStore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { saveFormAction } from '../lib/actions';

export type FormCreateActionStatus =
    | {
          success: true;
          message: string;
          redirectHref: string;
      }
    | {
          success: false;
          message: string;
      };

export function useFormSaveAction(formId?: string) {
    const store = useAppStore();
    const router = useRouter();
    const [status, action, isLoading] = useActionState(
        async (): Promise<FormCreateActionStatus> => {
            try {
                const savedForm = await saveFormAction(store.getState(), formId);
                return {
                    success: true,
                    message: 'Form has been saved successfully.',
                    redirectHref: `/form-details/${savedForm.id}`
                };
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

            if (!formId) {
                router.replace(status.redirectHref);
            }
        } else {
            toast.error(status.message);
        }
    }, [status, formId, router]);

    return { action, isLoading };
}
