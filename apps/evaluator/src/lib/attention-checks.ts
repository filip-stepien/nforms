import { Form } from '@packages/db/schemas/form/form';
import { FieldRawResponse } from '@packages/queue';
import { getFieldEvaluationContexts } from './fields';
import {
    findCategoryById,
    findFirstFieldById,
    findFirstFieldContextByFieldIdAndCondition
} from './query';
import { EvaluatedAttentionCheck, AttentionCheckValue } from '@packages/db/schemas/form-responses';

export async function evaluateAttentionChecks(
    rawResponses: FieldRawResponse[],
    form: Form
): Promise<EvaluatedAttentionCheck[]> {
    const contexts = await Promise.all(
        rawResponses.map(async rawResponse => await getFieldEvaluationContexts(rawResponse))
    );

    return form.attentionChecks.map(check => {
        const category = findCategoryById(check.categoryId, form);

        const actualValues: AttentionCheckValue[] = check.fields.map(fieldId => {
            const field = findFirstFieldById(fieldId, form);

            const context = findFirstFieldContextByFieldIdAndCondition(
                fieldId,
                check.condition,
                contexts.flat()
            );

            return {
                fieldTitle: field.title,
                actualValue: context.value,
                valueMatches: context.value === check.value
            };
        });

        return {
            score: check.score,
            category: {
                name: category.category,
                color: category.color
            },
            condition: check.condition,
            operator: check.operator,
            ruleValue: check.value,
            actualValues,
            applied: actualValues.every(actualValue => actualValue.valueMatches)
        };
    });
}
