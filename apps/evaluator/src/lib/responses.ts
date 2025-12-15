import { FieldRawResponse } from '@packages/queue';
import { Form } from '@packages/db/schemas/form/form';
import { findFirstFieldById } from './query';
import { evaluateFields, resolveFieldValue } from './fields';
import { evaluateCategories } from './categories';
import {
    EvaluatedAttentionCheck,
    EvaluatedCategory,
    EvaluatedResponse,
    FormResponse
} from '@packages/db/schemas/form-responses';
import { prisma } from '@packages/db';
import { evaluateAttentionChecks } from './attention-checks';

export async function evaluateResponses(
    rawResponses: FieldRawResponse[],
    form: Form
): Promise<{
    responses: EvaluatedResponse[];
    categoryRules: EvaluatedCategory[];
    attentionChecks: EvaluatedAttentionCheck[];
}> {
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

    const attentionChecks = await evaluateAttentionChecks(rawResponses, form);

    const categoryRules = evaluateCategories(
        responses.flatMap(r => r.fieldRules),
        attentionChecks,
        form
    );

    return { responses, categoryRules, attentionChecks };
}

export async function saveFormResponse(
    formId: string,
    formResponse: Omit<FormResponse, 'id' | 'submission'>
) {
    await prisma.formResponse.create({ data: { formId, ...formResponse } });
}
