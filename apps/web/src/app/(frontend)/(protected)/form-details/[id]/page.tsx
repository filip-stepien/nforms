import { FormDetails } from '@/features/form-details/components/FormDetails';
import { getFormById } from '@/features/form-details/lib/data';
import { deserializeState } from '@/lib/data';
import StoreProvider from '@/providers/StoreProvider';
import { env } from '@packages/env';

type Props = {
    params: Promise<{ id: string }>;
};

export default async function FormDetailsPage({ params }: Props) {
    const { id } = await params;
    const form = await getFormById(id);
    const preloadedState = deserializeState(form);

    return (
        <StoreProvider preloadedState={preloadedState}>
            <FormDetails formId={id} createdAt={form.createdAt} baseUrl={env.BASE_URL} />
        </StoreProvider>
    );
}
