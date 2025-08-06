'use server';

import { Field } from '../hooks/useFormFields';
import { saveForm } from './data';

export async function saveFormAction(title: string, fields: Field[]) {
    return await saveForm(title, fields);
}
