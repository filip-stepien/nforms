import 'server-only';

import { verifyUser } from '@/auth';
import { prisma } from '@packages/db';
import { Field } from './types';

export async function saveForm(title: string, fields: Field[]) {
    const user = await verifyUser();
    const form = await prisma.form.create({ data: { title, userId: user.id } });

    if (fields.length > 0) {
        await prisma.formField.createMany({
            data: fields.map(field => ({
                formId: form.id,
                type: field.type,
                settings: field.settings ?? {},
                controls: field.controls ?? {}
            }))
        });
    }
}
