import 'server-only';
import { Form } from '@packages/db/schemas/form';
import { RootState } from './store';
import { verifyUser } from '@/auth';
import { prisma } from '@packages/db';

export type SerializedState = Omit<Form, 'id' | 'createdAt' | 'userId'>;

export function serializeState(state: RootState): SerializedState {
    return {
        title: state.form.title,
        description: state.form.description,
        settings: state.form.settings,
        fields: Object.values(state.formFields.entities),
        fieldSettings: state.fieldSettings,
        fieldControls: {
            rules: {
                respondentCategories: Object.values(state.fieldRules.respondentCategories.entities),
                categoryActions: Object.values(state.fieldRules.categoryActions.entities),
                rules: Object.values(state.fieldRules.rules.entities),
                groups: Object.values(state.fieldRules.groups.entities)
            },
            options: Object.values(state.fieldOptions.entities)
        }
    };
}

export function deserializeState(state: SerializedState): RootState {
    return {
        form: {
            title: state.title,
            description: state.description ?? '',
            settings: state.settings
        },
        formFields: {
            ids: state.fields.map(f => f.id),
            entities: Object.fromEntries(state.fields.map(f => [f.id, f]))
        },
        fieldRules: {
            respondentCategories: {
                ids: state.fieldControls.rules.respondentCategories.map(c => c.id),
                entities: Object.fromEntries(
                    state.fieldControls.rules.respondentCategories.map(c => [c.id, c])
                )
            },
            categoryActions: {
                ids: state.fieldControls.rules.categoryActions.map(c => c.id),
                entities: Object.fromEntries(
                    state.fieldControls.rules.categoryActions.map(c => [c.id, c])
                )
            },
            rules: {
                ids: state.fieldControls.rules.rules.map(r => r.id),
                entities: Object.fromEntries(state.fieldControls.rules.rules.map(r => [r.id, r]))
            },
            groups: {
                ids: state.fieldControls.rules.groups.map(g => g.id),
                entities: Object.fromEntries(state.fieldControls.rules.groups.map(g => [g.id, g]))
            }
        },
        fieldOptions: {
            ids: state.fieldControls.options.map(o => o.id),
            entities: Object.fromEntries(state.fieldControls.options.map(o => [o.id, o]))
        },
        fieldSettings: state.fieldSettings
    };
}

export async function saveForm(state: RootState, formId?: string) {
    const user = await verifyUser();
    const form = serializeState(state);
    const data = { ...form, userId: user.id };

    if (formId) {
        await prisma.form.update({ data, where: { id: formId } });
    } else {
        await prisma.form.create({ data });
    }
}
