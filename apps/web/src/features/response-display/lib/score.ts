import { EvaluatedField } from '@packages/db/schemas/form-responses';

export function getFieldScoring(fields: EvaluatedField[], categoryName: string) {
    const score = fields.reduce((acc, rule) => {
        if (!rule.score.result || rule.score.category.name !== categoryName) {
            return acc;
        }

        switch (rule.score.operation) {
            case 'ADD':
                return acc + rule.score.points;
            case 'SUBTRACT':
                return acc - rule.score.points;
            default:
                throw new Error(`Invalid rule score operation: ${rule.score.operation}`);
        }
    }, 0);

    return score > 0 ? `+${score}` : score.toString();
}
