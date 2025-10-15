import { prisma } from '@packages/db';
import { FieldOption, FieldSettingsMap, FieldType, FormSchema } from '@packages/db/schemas/form';

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

export type ParsedForm = { title: string; fields: ParsedField[] };

export async function getParsedForm(id: string): Promise<ParsedForm> {
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
        const fieldSettings = data.settings.find(s => s.fieldId === field.id);

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
                    options: data.controls.options
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
        title: data.title,
        fields
    };
}
