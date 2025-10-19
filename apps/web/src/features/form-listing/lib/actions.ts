'use server';

import { deleteFormById } from '@/features/form-details/lib/data';
import { redirect } from 'next/navigation';

export async function deleteFormAction(formId: string) {
    await deleteFormById(formId);
    redirect('/your-forms');
}
