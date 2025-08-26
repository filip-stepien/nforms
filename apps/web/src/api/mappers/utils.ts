import { JsonValue } from '@prisma/client/runtime/library';
import { ZodType } from 'zod';

export function parseFieldStructure<SettingsType, ControlsType>(
    field: { settings: JsonValue; controls: JsonValue },
    settingsSchema: ZodType<SettingsType>,
    controlsSchema: ZodType<ControlsType>
) {
    const settings = settingsSchema.safeParse(field.settings);
    const controls = controlsSchema.safeParse(field.controls);

    if (settings.error || controls.error) {
        throw new Error('Unexpected text field structure while mapping to widget field.');
    }

    return { settings: settings.data, controls: controls.data };
}
