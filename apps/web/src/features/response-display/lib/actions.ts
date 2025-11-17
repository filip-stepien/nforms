'use server';

import { redirect } from 'next/navigation';
import { deleteResponseById } from './data';

export async function deleteResponseAction(responseId: string, formId: string) {
    await deleteResponseById(responseId);
    redirect('/form-details/' + formId);
}
