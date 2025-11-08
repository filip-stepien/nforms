import 'server-only';
import { createJob, FieldRawResponse } from '@packages/queue';
import { Field, FieldType } from '@packages/db/schemas/form/form-fields';
import { uniqueArray, enumValues } from './utils';
import { LanguageProcessing } from '@packages/db/schemas/nlp';
import { Form, FormSettings } from '@packages/db/schemas/form/form';
import { FieldOption } from '@packages/db/schemas/form/field-options';
import { FieldSettingsMap } from '@packages/db/schemas/form/field-settings';
import { findFirstFormById } from '@/lib/data';

export type ParsedField =
    | {
          id: string;
          title: string;
          type: FieldType.TEXT;
          settings: FieldSettingsMap[FieldType.TEXT];
      }
    | {
          id: string;
          title: string;
          type: FieldType.SELECTION;
          settings: FieldSettingsMap[FieldType.SELECTION];
          options: Omit<FieldOption, 'order'>[];
      };

export type ParsedForm = {
    id: string;
    title: string;
    description: string | null;
    settings: FormSettings;
    fields: ParsedField[];
};

export type RawFieldResponse =
    | {
          fieldId: string;
          fieldType: FieldType.TEXT;
          response: string;
      }
    | {
          fieldId: string;
          fieldType: FieldType.SELECTION;
          response: string | string[];
      };

export function parseFormField(form: Form, field: Field): ParsedField {
    const fieldSettings = form.fieldSettings.find(s => s.fieldId === field.id);

    if (!fieldSettings) {
        throw new Error(`Missing settings for field ${field.id}`);
    }

    switch (field.type) {
        case FieldType.TEXT: {
            return {
                ...field,
                type: FieldType.TEXT,
                settings: fieldSettings.settings as FieldSettingsMap[FieldType.TEXT]
            };
        }

        case FieldType.SELECTION: {
            return {
                ...field,
                type: FieldType.SELECTION,
                settings: fieldSettings.settings as FieldSettingsMap[FieldType.SELECTION],
                options: form.fieldOptions
                    .filter(o => o.fieldId === field.id)
                    .sort((a, b) => a.order - b.order)
                    .map(({ order: _, ...rest }) => rest)
            };
        }

        default:
            throw new Error(`Unknown field type: ${field.type}`);
    }
}

export async function parseForm(form: Form): Promise<ParsedForm> {
    const fields = form.fields.map(field => parseFormField(form, field));

    return {
        id: form.id,
        title: form.title,
        description: form.description,
        settings: form.settings,
        fields
    };
}

function parseFieldConditions(form: Form, raw: RawFieldResponse): FieldRawResponse {
    const { fieldType, fieldId } = raw;

    switch (fieldType) {
        case FieldType.TEXT: {
            return {
                ...raw,
                conditions: uniqueArray(
                    form.fieldRules.rules
                        .filter(r => r.targetFieldId === fieldId)
                        .filter(r => enumValues(LanguageProcessing).includes(r.condition))
                        .map(r => r.condition as LanguageProcessing)
                )
            };
        }

        case FieldType.SELECTION: {
            return {
                ...raw,
                conditions: ['answer']
            };
        }

        default:
            throw new Error(`Unsupported field type: ${fieldType}`);
    }
}

export async function saveFormResponse(
    formId: string,
    responses: RawFieldResponse[],
    email?: string
) {
    const form = await findFirstFormById(formId);

    await createJob('response_processing', {
        email: email ?? null,
        form,
        responses: responses.map(raw => parseFieldConditions(form, raw))
    });
}
