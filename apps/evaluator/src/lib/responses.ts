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
    findFieldScoreEvaluatorGroupByFieldId,
    getFieldCategoryScoreEvaluators,
    getFieldEvaluationContext
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
    fieldId: string;
    response: string | string[];
    fieldRuleLogs: FieldRuleGroupLog[];
    categoryRuleLogs: {
        categoryId: string;
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
    const fieldEvalCtx = await getFieldEvaluationContext(responses);

    return responses.map(response => {
        const categoryCtx = getCategoryEvaluationContext(form);
        const { categoryEvals } = findFieldScoreEvaluatorGroupByFieldId(
            response.fieldId,
            categoryScoreEvals
        );

        const { scores, logs: fieldLogs } = evaluateFields(
            categoryEvals,
            fieldEvalCtx,
            categoryCtx
        );
        const categoryLogs = evaluateCategories(scores, form);

        return {
            fieldId: response.fieldId,
            response: response.response,
            fieldRuleLogs: fieldLogs,
            categoryRuleLogs: categoryLogs
        };
    });
}
