import { useEffect } from 'react';
import { FormCreateActionStatus } from './useFormCreateAction';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export function useFormStatusEffect(
    status: FormCreateActionStatus | null,
    redirectHref: string = '/'
) {
    const router = useRouter();

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
}
