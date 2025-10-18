import 'server-only';

import { verifyUser } from '@/auth';
import { FormState } from '@/lib/store';
import { prisma } from '@packages/db';
import { Form } from '@packages/db/schemas/form';

type SerializedForm = Omit<Form, 'id' | 'createdAt' | 'userId'>;

function serializeFormState(formState: FormState): SerializedForm {
    return {
        title: formState.form.title,
        description: formState.form.description || null,
        settings: formState.form.settings,
        fields: Object.values(formState.formFields.entities),
        fieldSettings: formState.fieldSettings,
        fieldControls: {
            rules: {
                relations: formState.fieldRules.relations,
                rules: Object.values(formState.fieldRules.rules.entities),
                groups: Object.values(formState.fieldRules.groups.entities)
            },
            options: Object.values(formState.fieldOptions.entities)
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
