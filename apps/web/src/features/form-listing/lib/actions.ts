'use server';

import { deleteForm } from './data';

export async function deleteFormAction(formId: string) {
    await deleteForm(formId);
}
