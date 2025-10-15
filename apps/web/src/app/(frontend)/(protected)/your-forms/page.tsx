import { FormListing } from '@/features/form-listing/components/FormListing';
import { getFormsTableData } from '@/features/form-listing/lib/data';
import { getPaginationSearchParams } from '@/features/form-listing/lib/pagination';

type Props = {
    searchParams?: Promise<unknown>;
};

export default async function YourFormsPage({ searchParams }: Props) {
    const { page, pageSize } = getPaginationSearchParams(await searchParams);
    const formData = getFormsTableData({ page, pageSize });

    return <FormListing suspenseKey={`${page}${pageSize}`} formData={formData} />;
}
