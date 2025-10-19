import 'server-only';
import { prisma } from '@packages/db';
import {
    FieldOption,
    FieldSettingsMap,
    FieldType,
    FormSchema,
    FormSettings
} from '@packages/db/schemas/form';
import { LanguageProcessing } from '@packages/db/schemas/nlp';
import { FormResponse } from '@packages/db/schemas/formResponse';
import { enumValues, uniqueArray } from './utils';
import { v4 as uuid } from 'uuid';

export type ParsedField =
    | {
          id: string;
          title: string;
          type: FieldType.TEXT;
          settings: FieldSettingsMap[FieldType.TEXT];
          requiredProcessings: LanguageProcessing[];
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

export async function getParsedFormById(id: string): Promise<ParsedForm> {
    const form = await prisma.form.findFirstOrThrow({ where: { id } });
    const parseResult = FormSchema.safeParse(form);

    if (!parseResult.success) {
        console.error(
            `Form parse error. Issues: \n${JSON.stringify(parseResult.error.issues, null, 2)}`
        );

        throw new Error('Invalid form data');
    }

    const { data } = parseResult;

    const fields = data.fields.map((field): ParsedField => {
        const fieldSettings = data.fieldSettings.find(s => s.fieldId === field.id);
        const fieldRules = data.fieldControls.rules.rules.filter(r => r.targetFieldId === field.id);

        if (!fieldSettings) {
            throw new Error(`Missing settings for field ${field.id}`);
        }

        switch (field.type) {
            case FieldType.TEXT: {
                return {
                    ...field,
                    type: FieldType.TEXT,
                    settings: fieldSettings.settings as FieldSettingsMap[FieldType.TEXT],
                    requiredProcessings: uniqueArray(
                        fieldRules
                            .filter(r => enumValues(LanguageProcessing).includes(r.condition))
                            .map(r => r.condition as LanguageProcessing)
                    )
                };
            }

            case FieldType.SELECTION: {
                return {
                    ...field,
                    type: FieldType.SELECTION,
                    settings: fieldSettings.settings as FieldSettingsMap[FieldType.SELECTION],
                    options: data.fieldControls.options
                        .filter(o => o.fieldId === field.id)
                        .sort((a, b) => a.order - b.order)
                        .map(({ order: _, ...rest }) => rest)
                };
            }

            default:
                throw new Error(`Unknown field type: ${field.type}`);
        }
    });

    return {
        id: data.id,
        title: data.title,
        description: data.description,
        settings: data.settings,
        fields
    };
}

export async function saveFormResponse(
    formId: string,
    fieldResponses: Record<string, string>,
    email?: string
) {
    const data: Omit<FormResponse, 'id'> = {
        email: email ?? null,
        responses: Object.entries(fieldResponses).map(([fieldId, response]) => ({
            id: uuid(),
            fieldId,
            response
        }))
    };

    await prisma.formResponse.create({ data: { ...data, formId } });
}
