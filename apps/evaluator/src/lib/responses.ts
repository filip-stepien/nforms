import { FieldRawResponse } from '@packages/queue';
import { Form } from '@packages/db/schemas/form/form';
import { findFirstFieldById } from './query';
import { evaluateFields, resolveFieldValue } from './fields';
import { evaluateCategories } from './categories';
import {
    EvaluatedCategory,
    EvaluatedResponse,
    FormResponse
} from '@packages/db/schemas/form-responses';
import { prisma } from '@packages/db';

export async function evaluateResponses(
    rawResponses: FieldRawResponse[],
    form: Form
): Promise<{ responses: EvaluatedResponse[]; categoryRules: EvaluatedCategory[] }> {
    const responses = await Promise.all(
        rawResponses.map(async response => {
            const field = findFirstFieldById(response.fieldId, form);

            return {
                fieldTitle: findFirstFieldById(response.fieldId, form).title,
                response: Array.isArray(response.response)
                    ? response.response.map(r => resolveFieldValue(r, field, form))
                    : resolveFieldValue(response.response, field, form),
                fieldRules: await evaluateFields(response, form)
            };
        })
    );

    const categoryRules = evaluateCategories(
        responses.flatMap(r => r.fieldRules),
        form
    );

    return { responses, categoryRules };
}

export async function saveFormResponse(
    formId: string,
    formResponse: Omit<FormResponse, 'id' | 'submission'>
) {
    await prisma.formResponse.create({ data: { formId, ...formResponse } });
}
