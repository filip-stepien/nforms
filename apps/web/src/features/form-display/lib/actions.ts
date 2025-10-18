'use server';

import { saveFormResponse } from './data';

export async function saveFormResponseAction(
    formId: string,
    fieldResponses: Record<string, string>,
    email?: string
) {
    return await saveFormResponse(formId, fieldResponses, email);
}
