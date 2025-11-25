'use server';

import { deleteFormById } from '@/features/form-editor/lib/data';

export async function deleteFormAction(formId: string) {
    await deleteFormById(formId);
}
