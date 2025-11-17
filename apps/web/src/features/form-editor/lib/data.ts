import 'server-only';
import { verifyUser } from '@/auth';
import { prisma } from '@packages/db';
import { FormResponse, FormResponseSchema } from '@packages/db/schemas/form-responses';
import {
    defaultPaginationParams,
    getPaginationMeta,
    getPaginationQueryParams,
    Paginated,
    PaginationParams
} from '@/lib/pagination';
import { debug_wait } from '@/lib/debug';
import { capitalizeFirstLetter } from './utils';
import dayjs from 'dayjs';

export async function findAllResponsesByFormIdPaginated(
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

export type CategoriesChartData = {
    categoryName: string;
    categoryColor: string;
    count: number;
};

export type ResponsesChartData = {
    label: string;
    value: number;
};

export async function getCategoriesChartData(formId: string): Promise<CategoriesChartData[]> {
    await verifyUser();

    const responsesRaw = await prisma.formResponse.findMany({
        where: { formId }
    });

    const responses = responsesRaw.map(response => FormResponseSchema.parse(response));
    const categoriesMap = new Map<string, CategoriesChartData>([
        ['none', { categoryName: 'None', categoryColor: 'gray', count: 0 }]
    ]);

    for (const response of responses) {
        if (response.categoryRules.every(category => !category.assigned)) {
            categoriesMap.get('none')!.count++;
            continue;
        }

        for (const { category, assigned } of response.categoryRules) {
            if (!assigned) {
                continue;
            }

            if (categoriesMap.has(category.name)) {
                categoriesMap.get(category.name)!.count++;
            } else {
                categoriesMap.set(category.name, {
                    categoryName: capitalizeFirstLetter(category.name),
                    categoryColor: category.color,
                    count: 1
                });
            }
        }
    }

    if (categoriesMap.get('none')!.count === 0) {
        categoriesMap.delete('none');
    }

    return Array.from(categoriesMap).map(entry => entry[1]);
}

export async function getResponsesChartData(formId: string): Promise<ResponsesChartData[]> {
    const today = dayjs().endOf('day');
    const sevenDaysAgo = dayjs().subtract(6, 'day').startOf('day');

    const counts = await countResponsesByFormId(formId, {
        from: sevenDaysAgo.toDate(),
        to: today.toDate(),
        perDay: true
    });

    return counts.map((value, i) => ({
        label: sevenDaysAgo.add(i, 'day').format('DD.MM'),
        value
    }));
}

export async function deleteFormById(formId: string) {
    await verifyUser();
    await prisma.$transaction([
        prisma.formResponse.deleteMany({ where: { formId } }),
        prisma.form.delete({ where: { id: formId } })
    ]);
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
