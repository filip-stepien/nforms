'use server';

import { saveForm } from '@/lib/data';
import { RootState } from '@/lib/store';

export async function saveFormAction(state: RootState, formId?: string) {
    return await saveForm(state, formId);
}
