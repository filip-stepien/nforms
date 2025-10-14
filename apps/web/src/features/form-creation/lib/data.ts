import 'server-only';

import { verifyUser } from '@/auth';
import { FormState } from '@/lib/store';
import { stripId } from './utils';
import { prisma } from '@packages/db';

function serializeFormState(formState: FormState) {
    return {
        title: formState.formTitle.title,
        fields: Object.values(formState.formFields.entities),
        settings: formState.fieldSettings,
        controls: {
            rules: {
                relations: formState.fieldRules.relations,
                rules: Object.values(formState.fieldRules.rules.entities).map(stripId),
                groups: Object.values(formState.fieldRules.groups.entities).map(stripId)
            },
            options: Object.values(formState.fieldOptions.entities).map(stripId)
        }
    };
}

export async function saveForm(formState: FormState) {
    const user = await verifyUser();
    const form = serializeFormState(formState);

    await prisma.form.create({
        data: {
            ...form,
            user: {
                connect: { id: user.id }
            }
        }
    });
}
