import { FormEditor } from '@/features/form-editor/components/FormEditor';
import { getFormById, getResponsesByFormIdPaginated } from '@/features/form-editor/lib/data';
import { deserializeState } from '@/lib/data';
import { getPaginationSearchParams } from '@/lib/pagination';
import StoreProvider from '@/providers/StoreProvider';
import { env } from '@packages/env';

type Props = {
    params: Promise<{ id: string }>;
    searchParams?: Promise<unknown>;
};

export default async function FormDetailsPage({ params, searchParams }: Props) {
    const { id } = await params;
    const pagination = getPaginationSearchParams(await searchParams);

    const form = await getFormById(id);
    const responses = getResponsesByFormIdPaginated(id);
    const preloadedState = deserializeState(form);

    return (
        <StoreProvider preloadedState={preloadedState}>
            <FormEditor
                formId={id}
                createdAt={form.createdAt}
                baseUrl={env.BASE_URL}
                responses={responses}
                suspenseKey={pagination.suspenseKey}
            />
        </StoreProvider>
    );
}
