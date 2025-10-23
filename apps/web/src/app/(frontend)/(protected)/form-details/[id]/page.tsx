import { FormEditor } from '@/features/form-editor/components/FormEditor';
import { getFormById } from '@/features/form-editor/lib/data';
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
            <FormEditor formId={id} createdAt={form.createdAt} baseUrl={env.BASE_URL} />
        </StoreProvider>
    );
}
