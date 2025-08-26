import z from 'zod';
import { FormField } from '../types';
import { parseFieldStructure } from '../utils';

const textSettingsSchema = z.object({
    required: z.boolean().nonoptional()
});

const textControlsSchema = z.object().optional();

export type WidgetTextField = {
    id: string;
    type: 'text';
    required: boolean;
    attributes: { placeholder: string };
};

export function mapTextFieldToWidgetField(textField: FormField): WidgetTextField {
    const { settings } = parseFieldStructure(textField, textSettingsSchema, textControlsSchema);

    return {
        id: textField.id,
        type: 'text',
        required: settings.required,
        attributes: { placeholder: '' }
    };
}
