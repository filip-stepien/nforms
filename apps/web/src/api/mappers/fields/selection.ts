import z from 'zod';
import { FormField } from '../types';
import { parseFieldStructure } from '../utils';

const selectionSettingsSchema = z.object({
    required: z.boolean().nonoptional(),
    singleSelection: z.boolean().nonoptional()
});

const selectionControlsSchema = z.object({
    options: z.array(
        z.object({
            id: z.string().min(1),
            content: z.string().min(1)
        })
    )
});

export type WidgetSelectionField = {
    id: string;
    type: 'checkbox' | 'radio';
    required: boolean;
    attributes: {
        values: { key: string; label: string }[];
    };
};

export function mapSelectionFieldToWidgetField(selectionField: FormField): WidgetSelectionField {
    const { settings, controls } = parseFieldStructure(
        selectionField,
        selectionSettingsSchema,
        selectionControlsSchema
    );

    return {
        id: selectionField.id,
        type: settings.singleSelection ? 'radio' : 'checkbox',
        required: settings.required,
        attributes: {
            values: controls.options.map(opt => ({ key: opt.id, label: opt.content }))
        }
    };
}
