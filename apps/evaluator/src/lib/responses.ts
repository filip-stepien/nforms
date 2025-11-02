import { Form } from '@packages/db/schemas/form/form';
import { evaluateCategories, getCategoryEvaluationContext } from './categories';
import { FieldRawResponse } from '@packages/queue';
import {
    evaluateFields,
    findFieldById,
    findFieldScoreEvaluatorGroupByFieldId,
    getFieldCategoryScoreEvaluators,
    getFieldEvaluationContext,
    resolveFieldValue
} from './fields';

import { FieldResponse } from '@packages/db/schemas/form-responses';

export async function getResponses(
    responses: FieldRawResponse[],
    form: Form
): Promise<FieldResponse[]> {
    const categoryScoreEvals = getFieldCategoryScoreEvaluators(responses, form);
    const fieldCtx = await getFieldEvaluationContext(responses);
    const categoryCtx = getCategoryEvaluationContext(form);

    return responses.map(({ fieldId, response }) => {
        const field = findFieldById(fieldId, form);
        const { categoryEvals } = findFieldScoreEvaluatorGroupByFieldId(
            fieldId,
            categoryScoreEvals
        );

        const { scores, logs: fieldLogs } = evaluateFields(categoryEvals, fieldCtx, categoryCtx);
        const categoryLogs = evaluateCategories(scores, form);

        return {
            fieldTitle: field.title,
            categoryRuleLogs: categoryLogs,
            fieldRuleLogs: fieldLogs,
            response: Array.isArray(response)
                ? response.map(res => resolveFieldValue(res, field, form))
                : resolveFieldValue(response, field, form)
        };
    });
}
