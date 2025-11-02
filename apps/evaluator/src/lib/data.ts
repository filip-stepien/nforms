import { FormResponse } from '@packages/db/schemas/form-responses';
import { prisma } from '@packages/db';

export async function saveFormResponse(
    formId: string,
    { email, responses }: Omit<FormResponse, 'id'>
) {
    await prisma.formResponse.create({ data: { email, responses, formId } });
}
