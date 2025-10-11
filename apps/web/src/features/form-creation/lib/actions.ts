'use server';

import { Field } from '../state/slices/fields';
import { saveForm } from './data';

export async function saveFormAction(title: string, fields: Field[]) {
    return await saveForm(title, fields);
}
