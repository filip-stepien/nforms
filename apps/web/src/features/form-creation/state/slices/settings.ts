import { createAction, createReducer } from '@reduxjs/toolkit';
import { formatActionName, withPayloadType } from '@/lib/utils';
import { FieldType } from './fields';
import { RootState } from '@/lib/store';

export type BaseSettings = {
    required: boolean;
};

export type TextSettings = BaseSettings & {
    analyseSentiment: boolean;
    extractKeywords: boolean;
    summarize: boolean;
};

export type SelectionSettings = BaseSettings & {
    singleSelection: boolean;
};

export type FieldSettingsMap = {
    [FieldType.TEXT]: TextSettings;
    [FieldType.SELECTION]: SelectionSettings;
};

export type FieldSettingsState = { fieldId: string; settings: FieldSettingsMap[FieldType] }[];

const sliceName = 'fieldSettings';

const _addSettings = createAction(
    formatActionName(sliceName, 'addSettings'),
    withPayloadType<{ fieldId: string; fieldType: FieldType }>()
);

const _deleteSettings = createAction(
    formatActionName(sliceName, 'deleteSettings'),
    withPayloadType<{ fieldId: string }>()
);

const _setSettings = createAction(
    formatActionName(sliceName, 'setSettings'),
    withPayloadType<{ fieldId: string; settings: Partial<FieldSettingsMap[FieldType]> }>()
);

const _initializeSettings = createAction(
    formatActionName(sliceName, 'initializeSettings'),
    withPayloadType<{ fieldId: string; fieldType: FieldType }>()
);

const initialSettings: FieldSettingsMap = {
    [FieldType.TEXT]: {
        required: true,
        analyseSentiment: true,
        extractKeywords: true,
        summarize: true
    },
    [FieldType.SELECTION]: {
        required: true,
        singleSelection: false
    }
};

const initialState: FieldSettingsState = [];

export const fieldSettingsReducer = createReducer(initialState, builder => {
    builder.addCase(_initializeSettings, (state, action) => {
        const { fieldId, fieldType } = action.payload;
        const existing = state.find(setting => setting.fieldId === fieldId);

        if (existing) {
            existing.settings = initialSettings[fieldType];
        } else {
            state.push({ fieldId, settings: initialSettings[fieldType] });
        }
    });

    builder.addCase(_addSettings, (state, action) => {
        const { fieldId, fieldType } = action.payload;
        state.push({ fieldId, settings: initialSettings[fieldType] });
    });

    builder.addCase(_deleteSettings, (state, action) => {
        const { fieldId } = action.payload;
        const index = state.findIndex(setting => setting.fieldId === fieldId);

        if (index !== -1) {
            state.splice(index, 1);
        }
    });

    builder.addCase(_setSettings, (state, action) => {
        const { fieldId, settings } = action.payload;
        const index = state.findIndex(setting => setting.fieldId === fieldId);

        if (index !== -1) {
            Object.assign(state[index].settings, settings);
        }
    });
});

export const { addSettings, deleteSettings, initializeSettings, setSettings } = {
    addSettings: _addSettings,
    deleteSettings: _deleteSettings,
    initializeSettings: _initializeSettings,
    setSettings: <T extends FieldType>(payload: {
        fieldId: string;
        settings: Partial<FieldSettingsMap[T]>;
    }) => _setSettings({ ...payload })
};

export const selectSettingsByFieldId = <T extends FieldType>(state: RootState, fieldId: string) => {
    const fieldSettings = state.fieldSettings.find(f => f.fieldId === fieldId);
    return fieldSettings!.settings as FieldSettingsMap[T];
};
