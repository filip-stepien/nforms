'use server';

import { prisma } from '@/db/prisma';
import { Field } from '../hooks/useFormFields';

export async function saveFormAction(title: string, fields: Field[], userId?: string) {
    if (!userId) {
        console.error('Error saving form: invalid user ID.');
        return;
    }

    try {
        const form = await prisma.form.create({ data: { title, userId } });

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

        console.log('Saved form');
    } catch (err) {
        console.error(err);
    }
}
