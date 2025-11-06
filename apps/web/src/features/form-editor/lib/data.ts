import 'server-only';
import { verifyUser } from '@/auth';
import { prisma } from '@packages/db';
import { Form, FormSchema } from '@packages/db/schemas/form/form';
import { FormResponse, FormResponseSchema } from '@packages/db/schemas/form-responses';
import {
    defaultPaginationParams,
    getPaginationMeta,
    getPaginationQueryParams,
    Paginated,
    PaginationParams
} from '@/lib/pagination';
import { debug_wait } from '@/lib/debug';

export async function getFormById(id: string): Promise<Form> {
    await verifyUser();
    const form = await prisma.form.findFirstOrThrow({ where: { id } });
    return FormSchema.parse(form);
}

export async function getResponsesByFormIdPaginated(
    formId: string,
    pagination: PaginationParams = defaultPaginationParams
): Promise<Paginated<FormResponse[]>> {
    await verifyUser();

    const responses = await prisma.formResponse.findMany({
        where: { formId },
        ...getPaginationQueryParams(pagination)
    });

    const data = responses.map(response => FormResponseSchema.parse(response));
    const totalCount = await prisma.formResponse.count();

    await debug_wait();

    return {
        data,
        pagination: getPaginationMeta({ ...pagination, totalCount })
    };
}

export async function deleteFormById(formId: string) {
    await verifyUser();
    await prisma.$transaction([
        prisma.formResponse.deleteMany({ where: { formId } }),
        prisma.form.delete({ where: { id: formId } })
    ]);
}
