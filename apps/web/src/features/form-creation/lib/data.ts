import 'server-only';

import { verifyUser } from '@/auth';
import { prisma } from '@packages/db';
import { Field } from '../state/slices/fields';

export async function saveForm(title: string, fields: Field[]) {
    const user = await verifyUser();
    const form = await prisma.form.create({ data: { title, userId: user.id } });

    if (fields.length > 0) {
        // TODO: save settings and controls
        await prisma.formField.createMany({
            data: fields.map(field => ({
                formId: form.id,
                type: field.type,
                settings: {},
                controls: {}
            }))
        });
    }
}
