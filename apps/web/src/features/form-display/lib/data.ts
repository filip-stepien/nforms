import 'server-only';
import { prisma } from '@packages/db';
import { LanguageProcessing } from '@packages/db/schemas/nlp';
import { enumValues, uniqueArray } from './utils';
import { FieldOption } from '@packages/db/schemas/form/field-options';
import { FieldSettingsMap } from '@packages/db/schemas/form/field-settings';
import { FormSettings, FormSchema } from '@packages/db/schemas/form/form';
import { Field, FieldType } from '@packages/db/schemas/form/form-fields';
import { Form } from '@packages/db/schemas/form/form';
import { createJob, FieldResponseData } from '@packages/queue';

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

export type ParsedFieldResponse =
    | {
          fieldId: string;
          fieldType: FieldType.TEXT;
          response: string;
          requiredProcessings: LanguageProcessing[];
      }
    | {
          fieldId: string;
          fieldType: FieldType.SELECTION;
          response: string | string[];
      };

async function findFirstFormById(formId: string): Promise<Form> {
    const form = await prisma.form.findFirstOrThrow({ where: { id: formId } });
    const parseResult = FormSchema.safeParse(form);

    if (!parseResult.success) {
        console.error(
            `Form parse error. Issues: \n${JSON.stringify(parseResult.error.issues, null, 2)}`
        );

        throw new Error('Invalid form data');
    }

    return parseResult.data;
}

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

export async function getParsedFormById(formId: string): Promise<ParsedForm> {
    const form = await findFirstFormById(formId);
    const fields = form.fields.map(field => parseFormField(form, field));

    return {
        id: form.id,
        title: form.title,
        description: form.description,
        settings: form.settings,
        fields
    };
}

function parseFieldResponse(form: Form, rawResponse: RawFieldResponse): FieldResponseData {
    const { fieldType, fieldId, response } = rawResponse;

    switch (fieldType) {
        case FieldType.TEXT: {
            return {
                ...rawResponse,
                requiredProcessings: uniqueArray(
                    form.fieldRules.rules
                        .filter(r => r.targetFieldId === fieldId)
                        .filter(r => enumValues(LanguageProcessing).includes(r.condition))
                        .map(r => r.condition as LanguageProcessing)
                )
            };
        }

        case FieldType.SELECTION: {
            const getOptionContent = (optionId: string) => {
                const option = form.fieldOptions.find(opt => opt.id === optionId);

                if (!option) {
                    throw new Error(`Option ${optionId} not found.`);
                }

                return option.content;
            };

            const parsedResponse = Array.isArray(response)
                ? response.map(getOptionContent)
                : getOptionContent(response);

            return {
                ...rawResponse,
                response: parsedResponse,
                requiredProcessings: ['answer']
            };
        }

        default:
            throw new Error(`Unsupported field type: ${fieldType}`);
    }
}

export async function saveFormResponse(
    formId: string,
    fieldResponses: RawFieldResponse[],
    email?: string
) {
    const form = await findFirstFormById(formId);
    const responses = fieldResponses.map(raw => parseFieldResponse(form, raw));

    await createJob('response_processing', {
        email: email ?? null,
        formId,
        responses,
        categories: form.respondentCategories,
        rules: form.fieldRules
    });
}
