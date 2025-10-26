'use server';

import { RawFieldResponse, saveFormResponse } from './data';

export async function saveFormResponseAction(
    formId: string,
    fieldResponses: RawFieldResponse[],
    email?: string
) {
    return await saveFormResponse(formId, fieldResponses, email);
}
