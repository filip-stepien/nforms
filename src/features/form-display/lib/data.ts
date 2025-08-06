import 'server-only';

import { verifyUser } from '@/auth';
import { prisma } from '@/db/prisma';
import dayjs from 'dayjs';

export type FormTableData = {
    id: string;
    title: string;
    createdOn: string;
    responses: number;
    status: 'active' | 'inactive';
    actions: {
        editHref: string;
        embedding: string;
    };
};

const DEBUG_FORMS: FormTableData[] = [
    {
        id: '1',
        title: 'Debug form #1',
        responses: 123,
        createdOn: dayjs().format('DD.MM.YYYY'),
        status: 'active',
        actions: {
            editHref: '/',
            embedding: 'embedding'
        }
    },
    {
        id: '2',
        title: 'Debug form #2',
        responses: 123,
        createdOn: dayjs().format('DD.MM.YYYY'),
        status: 'inactive',
        actions: {
            editHref: '/',
            embedding: 'embedding'
        }
    },
    {
        id: '3',
        title: 'Debug form #3',
        responses: 123,
        createdOn: dayjs().format('DD.MM.YYYY'),
        status: 'inactive',
        actions: {
            editHref: '/',
            embedding: 'embedding'
        }
    }
];

export async function getFormsTableData(): Promise<FormTableData[]> {
    const user = await verifyUser();
    const forms = await prisma.form.findMany({ where: { userId: user.id } });

    return [
        ...DEBUG_FORMS,
        ...forms.map(form => ({
            id: form.id,
            title: form.title,

            /* debug values */
            responses: 123,
            createdOn: dayjs().format('DD.MM.YYYY'),
            status: 'active' as const,
            actions: {
                editHref: '/',
                embedding: 'embedding'
            }
        }))
    ];
}
