import 'server-only';

import { Field } from '../hooks/useFormFields';
import { verifyUser } from '@/auth';
import { prisma } from '@/db/prisma';

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
