'use client';

import { useEffect, useState, useTransition } from 'react';
import { useAppStore } from '@/hooks/useAppStore';
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

    const [status, setStatus] = useState<FormCreateActionStatus | null>(null);
    const [isPending, startTransition] = useTransition();

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

    useEffect(() => {
        if (!status) return;

        if (status.success) {
            toast.success(status.message);
        } else {
            toast.error(status.message);
        }
    }, [status]);

    return { action, isLoading: isPending };
}
