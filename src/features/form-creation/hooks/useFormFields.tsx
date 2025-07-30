import { FieldOption } from '../components/field-controls/option-creator/OptionCreator';
import { useListState } from '@mantine/hooks';
import { v4 as uuid } from 'uuid';

export enum FieldType {
    TEXT = 'Text',
    RATING = 'Rating'
}

export type SettingsMap = {
    [FieldType.TEXT]: TextSettings;
    [FieldType.RATING]: BaseSettings;
};

export type ControlsMap = {
    [FieldType.TEXT]: null;
    [FieldType.RATING]: OptionsControl;
};

export type BaseSettings = {
    required: boolean;
};

export type TextSettings = BaseSettings & {
    summarize: boolean;
    analyseSentiment: boolean;
    extractKeywords: boolean;
};

export type OptionsControl = {
    options: FieldOption[];
};

type Field = {
    id: string;
    title: string;
    type: FieldType;
    controls: ControlsMap[FieldType];
    settings: SettingsMap[FieldType];
};

export const fieldInitialStates: Record<FieldType, Pick<Field, 'settings' | 'controls'>> = {
    [FieldType.TEXT]: {
        settings: {
            required: true,
            analyseSentiment: true,
            extractKeywords: true,
            summarize: true
        },
        controls: null
    },
    [FieldType.RATING]: {
        settings: {
            required: true,
            analyseSentiment: true,
            extractKeywords: true,
            summarize: true
        },
        controls: {
            options: []
        }
    }
};

export function useFormFields(initialFields: Field[] = []) {
    const [fields, fieldsHandlers] = useListState<Field>(initialFields);

    const addField = () => {
        const { settings, controls } = fieldInitialStates[FieldType.TEXT];
        fieldsHandlers.append({ id: uuid(), title: '', type: FieldType.TEXT, settings, controls });
    };

    const setField = (id: string, updatedField: Partial<Field>) => {
        fieldsHandlers.applyWhere(
            field => field.id === id,
            field => {
                const typeChanged = updatedField.type && field.type !== updatedField.type;
                return {
                    ...field,
                    ...updatedField,
                    settings: typeChanged
                        ? fieldInitialStates[updatedField.type!].settings
                        : (updatedField.settings ?? field.settings),
                    controls: typeChanged
                        ? fieldInitialStates[updatedField.type!].controls
                        : (updatedField.controls ?? field.controls)
                };
            }
        );
    };

    const deleteField = (id: string) => {
        fieldsHandlers.filter(f => f.id !== id);
    };

    return { fields, addField, setField, deleteField };
}
