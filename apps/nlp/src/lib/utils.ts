import { JsonValue } from '@prisma/client/runtime/library';

export function canSummarizeFieldResponse(response: JsonValue): response is { value: string } {
    return typeof (response as { value: string | undefined })?.value === 'string';
}
