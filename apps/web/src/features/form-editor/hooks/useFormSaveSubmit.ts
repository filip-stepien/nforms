'use client';

import { FormEventHandler, useEffect, useState, useTransition } from 'react';
import { useAppStore } from '@/hooks/useAppStore';
import toast from 'react-hot-toast';
import { saveFormAction } from '../lib/actions';
import { useRouter } from 'next/navigation';

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

export function useFormSaveSubmit(formId?: string) {
    const store = useAppStore();
    const router = useRouter();
    const [status, setStatus] = useState<FormCreateActionStatus | null>(null);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        if (!status) return;

        if (status.success) {
            toast.success(status.message);
            router.push(status.redirectHref);
        } else {
            toast.error(status.message);
        }
    }, [status, formId, router]);

    const action = () => {
        startTransition(async () => {
            try {
                const savedForm = await saveFormAction(store.getState(), formId);

                setStatus({
                    success: true,
                    message: 'Form has been saved successfully.',
                    redirectHref: `/form-details/${savedForm.id}`
                });
            } catch {
                setStatus({
                    success: false,
                    message: 'Something went wrong.\nPlease try again.'
                });
            }
        });
    };

    const submit: FormEventHandler<HTMLFormElement> = event => {
        event.preventDefault();
        action();
    };

    return { submit, isLoading: isPending };
}
