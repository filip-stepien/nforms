import 'server-only';

import dayjs from 'dayjs';
import {
    getPaginationMeta,
    getPaginationQueryParams,
    PaginationMeta,
    PaginationParams
} from './pagination';
import { verifyUser } from '@/auth';
import { prisma } from '@packages/db';
import { debug_wait } from '@/lib/debug';
import { env } from '@packages/env';

export type FormTableData = {
    id: string;
    title: string;
    createdOn: string;
    responses: number;
    status: 'active' | 'inactive';
    actions: {
        editHref: string;
        shareHref: string;
        embedding: string;
    };
};

export type PaginatedFormsTableData = {
    data: FormTableData[];
    pagination: PaginationMeta;
};

export async function getFormsTableData(
    pagination: PaginationParams
): Promise<PaginatedFormsTableData> {
    const user = await verifyUser();
    const totalCount = await prisma.form.count();
    const forms = await prisma.form.findMany({
        where: { userId: user.id },
        ...getPaginationQueryParams(pagination)
    });

    await debug_wait();

    return {
        data: forms.map(form => ({
            id: form.id,
            title: form.title,

            /* debug values */
            responses: 123,
            createdOn: dayjs().format('DD.MM.YYYY'),
            status: 'active' as const,
            actions: {
                shareHref: env.BASE_URL + 'form/' + form.id,
                editHref: '/',
                embedding: 'embedding'
            }
        })),
        pagination: getPaginationMeta({ ...pagination, totalCount })
    };
}

export async function deleteForm(formId: string) {
    await verifyUser();
    await prisma.form.delete({ where: { id: formId } });
}
