import 'server-only';
import { Form } from '@packages/db/schemas/form/form';
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
        fieldRules: {
            categoryActions: Object.values(state.fieldRules.categoryActions.entities),
            rules: Object.values(state.fieldRules.rules.entities),
            groups: Object.values(state.fieldRules.groups.entities)
        },
        fieldOptions: Object.values(state.fieldOptions.entities),
        respondentCategories: Object.values(state.respondentCategories.entities),
        respondentCategoryRules: {
            relations: state.respondentCategoryRules.relations,
            groups: Object.values(state.respondentCategoryRules.groups.entities),
            rules: Object.values(state.respondentCategoryRules.rules.entities)
        }
    };
}

function toEntityState<T extends { id: string }>(arr: T[]) {
    return {
        ids: arr.map(e => e.id),
        entities: Object.fromEntries(arr.map(e => [e.id, e]))
    };
}

export function deserializeState(state: SerializedState): RootState {
    return {
        form: {
            title: state.title,
            description: state.description,
            settings: state.settings
        },
        formFields: toEntityState(state.fields),
        fieldSettings: state.fieldSettings,
        fieldRules: {
            categoryActions: toEntityState(state.fieldRules.categoryActions),
            rules: toEntityState(state.fieldRules.rules),
            groups: toEntityState(state.fieldRules.groups)
        },
        fieldOptions: toEntityState(state.fieldOptions),
        respondentCategories: toEntityState(state.respondentCategories),
        respondentCategoryRules: {
            relations: state.respondentCategoryRules.relations,
            groups: toEntityState(state.respondentCategoryRules.groups),
            rules: toEntityState(state.respondentCategoryRules.rules)
        }
    };
}

export async function saveForm(state: RootState, formId?: string) {
    const user = await verifyUser();
    const form = serializeState(state);
    const data = { ...form, userId: user.id };

    return formId
        ? await prisma.form.update({ data, where: { id: formId } })
        : await prisma.form.create({ data });
}
