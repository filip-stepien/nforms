import { FormListing } from '@/features/form-listing/components/FormListing';
import { getFormsTableDataPaginated } from '@/features/form-listing/lib/data';
import { getPaginationSearchParams } from '@/lib/pagination';

type Props = {
    searchParams?: Promise<unknown>;
};

export default async function YourFormsPage({ searchParams }: Props) {
    const { page, pageSize, suspenseKey } = getPaginationSearchParams(await searchParams);
    const formData = getFormsTableDataPaginated({ page, pageSize });
    return <FormListing suspenseKey={suspenseKey} formData={formData} />;
}
