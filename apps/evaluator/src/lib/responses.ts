import { Form } from '@packages/db/schemas/form/form';
import { FieldType } from '@packages/db/schemas/form/form-fields';
import {
    CategoryRuleGroupLog,
    evaluateCategories,
    getCategoryEvaluationContext
} from './categories';
import {
    evaluateFields,
    FieldRuleGroupLog,
    findFieldById,
    findFieldScoreEvaluatorGroupByFieldId,
    getFieldCategoryScoreEvaluators,
    getFieldEvaluationContext,
    resolveFieldValue
} from './fields';

export type FieldResponse =
    | {
          fieldId: string;
          fieldType: FieldType.TEXT;
          response: string;
          conditions: ('sentiment' | 'emotion')[];
      }
    | {
          fieldId: string;
          fieldType: FieldType.SELECTION;
          response: string | string[];
          conditions: 'answer'[];
      };

export type FieldResponseResult = {
    fieldTitle: string;
    response: string | string[];
    fieldRuleLogs: FieldRuleGroupLog[];
    categoryRuleLogs: {
        categoryName: string;
        totalScore: number;
        assigned: boolean;
        logs: CategoryRuleGroupLog;
    }[];
};

export async function getResponses(
    responses: FieldResponse[],
    form: Form
): Promise<FieldResponseResult[]> {
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
