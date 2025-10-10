import { createAction, createReducer } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';
import { ControlsMap, Field, FieldMap, FieldType, SettingsMap } from '../lib/types';
import { FormRootState } from './formStore';
import { formatActionName, withPayloadType } from '@/lib/utils';
import { DeepPartial } from '@/lib/types';
import merge from 'deepmerge';

export type FormFieldsState = {
    fields: Field[];
    lastAddedId: string | null;
};

export type DistinctFieldsState = {
    [K in FieldType]: {
        settings: SettingsMap[K];
        controls: ControlsMap[K];
    };
};

const initialState: FormFieldsState = {
    fields: [],
    lastAddedId: null
};

const distinctFieldsInitialState: DistinctFieldsState = {
    [FieldType.TEXT]: {
        settings: {
            required: true,
            analyseSentiment: true,
            extractKeywords: true,
            summarize: true
        },
        controls: {
            rules: {
                id: uuid(),
                combinator: 'AND',
                type: 'group',
                rules: []
            }
        }
    },
    [FieldType.SELECTION]: {
        settings: {
            required: true,
            singleSelection: false
        },
        controls: {
            options: [],
            rules: {
                id: uuid(),
                combinator: 'AND',
                type: 'group',
                rules: []
            }
        }
    }
};

const sliceName = 'formField';

const _addField = createAction(formatActionName(sliceName, 'addField'));

const _deleteField = createAction(
    formatActionName(sliceName, 'deleteField'),
    withPayloadType<string>()
);

const _reorderField = createAction(
    formatActionName(sliceName, 'reorderField'),
    withPayloadType<{ from: number; to?: number }>()
);

const _setField = createAction(
    formatActionName(sliceName, 'setField'),
    withPayloadType<{ fieldId: string; field: DeepPartial<Field> }>()
);

const _setLastAddedId = createAction(
    formatActionName(sliceName, 'setLastAddedId'),
    withPayloadType<string | null>()
);

export const formFieldsReducer = createReducer(initialState, builder => {
    builder.addCase(_addField, state => {
        const { settings, controls } = distinctFieldsInitialState[FieldType.TEXT];
        const id = uuid();

        state.fields.push({
            id,
            title: 'Untitled question ' + state.fields.length,
            type: FieldType.TEXT,
            settings,
            controls
        });

        state.lastAddedId = id;
    });

    builder.addCase(_deleteField, (state, action) => {
        state.fields = state.fields.filter(f => f.id !== action.payload);
    });

    builder.addCase(_reorderField, (state, action) => {
        const { from, to } = action.payload;
        const copy = [...state.fields];
        const [moved] = copy.splice(from, 1);
        copy.splice(to ?? from, 0, moved);
        state.fields = copy;
    });

    builder.addCase(_setField, (state, action) => {
        const { fieldId, field: fieldPatch } = action.payload;

        state.fields = state.fields.map(field => {
            if (field.id !== fieldId) {
                return field;
            }

            if (fieldPatch.type && fieldPatch.type !== field.type) {
                const { settings, controls } = distinctFieldsInitialState[fieldPatch.type];
                field.settings = settings;
                field.controls = controls;
            }

            return merge(
                // @ts-expect-error: field type in known at runtime
                field,
                fieldPatch,
                { arrayMerge: (_target, source) => source }
            ) as Field;
        });
    });

    builder.addCase(_setLastAddedId, (state, action) => {
        state.lastAddedId = action.payload;
    });
});

export const addField = _addField;

export const deleteField = _deleteField;

export const reorderField = _reorderField;

export const setLastAddedId = _setLastAddedId;

export const setField = <T extends FieldType>(payload: {
    fieldId: string;
    field: DeepPartial<FieldMap[T]>;
}) => _setField({ ...payload });

export const selectFieldById = <T extends FieldType>(state: FormRootState, id: string) => {
    const field = state.formFields.fields.find(f => f.id === id) as FieldMap[T] | undefined;

    if (!field) {
        throw new Error(`Field with ID "${id}" does not exist in form store.`);
    }

    return field;
};
