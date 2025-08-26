import { JsonValue } from '@prisma/client/runtime/library';

export type FormField = {
    type: string;
    id: string;
    formId: string;
    settings: JsonValue;
    controls: JsonValue;
};
