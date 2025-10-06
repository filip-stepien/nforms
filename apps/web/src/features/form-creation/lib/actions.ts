'use server';

import { saveForm } from './data';
import { Field } from './types';

export async function saveFormAction(title: string, fields: Field[]) {
    return await saveForm(title, fields);
}
