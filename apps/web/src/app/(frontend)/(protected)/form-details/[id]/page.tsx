import { FormDetails } from '@/features/form-details/components/FormDetails';
import { getFormById } from '@/features/form-details/lib/data';
import StoreProvider from '@/providers/StoreProvider';

type Props = {
    params: Promise<{ id: string }>;
};

export default async function FormDetailsPage({ params }: Props) {
    const { id } = await params;
    const form = await getFormById(id);
    return (
        <StoreProvider>
            <FormDetails form={form} />
        </StoreProvider>
    );
}
