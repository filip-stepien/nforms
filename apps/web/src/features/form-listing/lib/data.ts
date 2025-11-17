import 'server-only';

import dayjs from 'dayjs';
import {
    getPaginationMeta,
    getPaginationQueryParams,
    Paginated,
    PaginationParams
} from '../../../lib/pagination';
import { verifyUser } from '@/auth';
import { prisma } from '@packages/db';
import { debug_wait } from '@/lib/debug';
import { FormSchema } from '@packages/db/schemas/form/form';

export type FormTableData = {
    id: string;
    title: string;
    createdOn: string;
    responses: number;
    status: 'active' | 'inactive';
};

export async function getFormsTableDataPaginated(
    pagination: PaginationParams
): Promise<Paginated<FormTableData[]>> {
    const user = await verifyUser();
    const totalCount = await prisma.form.count();
    const forms = await prisma.form.findMany({
        where: { userId: user.id },
        ...getPaginationQueryParams(pagination)
    });

    const formsParsed = forms.map(f => FormSchema.parse(f));
    await debug_wait();

    return {
        data: await Promise.all(
            formsParsed.map(async form => ({
                id: form.id,
                title: form.title,
                responses: await countResponsesByFormId(form.id),
                createdOn: dayjs(form.createdAt).format('DD.MM.YYYY'),
                status: form.settings.active ? 'active' : 'inactive'
            }))
        ),
        pagination: getPaginationMeta({ ...pagination, totalCount })
    };
}

export function countResponsesByFormId(
    formId: string,
    dateRange: { from: Date; to: Date; perDay: true }
): Promise<number[]>;

export function countResponsesByFormId(
    formId: string,
    dateRange?: { from: Date; to: Date; perDay?: false }
): Promise<number>;

export async function countResponsesByFormId(
    formId: string,
    dateRange?: { from: Date; to: Date; perDay?: boolean }
) {
    await verifyUser();

    if (!dateRange || !dateRange.perDay) {
        return prisma.formResponse.count({
            where: {
                formId,
                ...(dateRange && {
                    submission: {
                        gte: dateRange.from,
                        lte: dateRange.to
                    }
                })
            }
        });
    }

    const days: number[] = [];

    for (let i = 0; i < 7; i++) {
        const dayStart = dayjs(dateRange.from).add(i, 'day').startOf('day').toDate();
        const dayEnd = dayjs(dateRange.from).add(i, 'day').endOf('day').toDate();

        const count = await prisma.formResponse.count({
            where: {
                formId,
                submission: {
                    gte: dayStart,
                    lte: dayEnd
                }
            }
        });

        days.push(count);
    }

    return days;
}
