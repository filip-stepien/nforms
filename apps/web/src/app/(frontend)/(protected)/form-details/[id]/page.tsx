import { FormEditor } from '@/features/form-editor/components/FormEditor';
import {
    findAllResponsesByFormIdPaginated,
    getCategoriesChartData
} from '@/features/form-editor/lib/data';
import { deserializeState, findFirstFormById } from '@/lib/data';
import { getPaginationSearchParams } from '@/lib/pagination';
import StoreProvider from '@/providers/StoreProvider';
import { env } from '@packages/env';
import { notFound } from 'next/navigation';

type Props = {
    params: Promise<{ id: string }>;
    searchParams?: Promise<unknown>;
};

export default async function FormDetailsPage({ params, searchParams }: Props) {
    const { id } = await params;
    const pagination = getPaginationSearchParams(await searchParams);

    try {
        const form = await findFirstFormById(id);
        const responses = findAllResponsesByFormIdPaginated(id);
        const categoriesChartData = getCategoriesChartData(id);
        const preloadedState = deserializeState(form);

        return (
            <StoreProvider preloadedState={preloadedState}>
                <FormEditor
                    formId={id}
                    createdAt={form.createdAt}
                    baseUrl={env.BASE_URL}
                    responses={responses}
                    categoriesChartData={categoriesChartData}
                    suspenseKey={pagination.suspenseKey}
                    initialState={preloadedState}
                />
            </StoreProvider>
        );
    } catch {
        notFound();
    }
}
