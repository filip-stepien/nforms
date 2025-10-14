'use server';

import { FormState } from '@/lib/store';
import { saveForm } from './data';

export async function saveFormAction(formState: FormState) {
    return await saveForm(formState);
}
