import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type FieldOption = {
    id: string;
    content: string;
};

export type FieldOptionPatch = Partial<Omit<FieldOption, 'id'>>;

export type OptionsControl = {
    options: FieldOption[];
};

export type FieldOptionsState = {
    fieldId: string;
    options: FieldOption[];
}[];

const initialState: FieldOptionsState = [];

const fieldOptionsSlice = createSlice({
    name: 'fieldOptions',
    initialState,
    reducers: {
        initializeOptions: (state, action: PayloadAction<{ fieldId: string }>) => {
            state.push({ fieldId: action.payload.fieldId, options: [] });
        },

        addOption: (state, action: PayloadAction<{ fieldId: string; option: FieldOption }>) => {
            const { fieldId, option } = action.payload;
            const field = state.find(f => f.fieldId === fieldId);

            if (field) {
                field.options.push(option);
            }
        },

        deleteOption: (state, action: PayloadAction<{ fieldId: string; optionId: string }>) => {
            const { fieldId, optionId } = action.payload;
            const field = state.find(f => f.fieldId === fieldId);

            if (field) {
                field.options = field.options.filter(opt => opt.id !== optionId);
            }
        },

        deleteOptions: (state, action: PayloadAction<{ fieldId: string }>) => {
            state = state.filter(f => f.fieldId !== action.payload.fieldId);
        },

        setOption: (
            state,
            action: PayloadAction<{
                fieldId: string;
                optionId: string;
                option: FieldOptionPatch;
            }>
        ) => {
            const { fieldId, optionId, option: optionPatch } = action.payload;
            const field = state.find(f => f.fieldId === fieldId);

            if (field) {
                const option = field.options.find(opt => opt.id === optionId);

                if (option) {
                    Object.assign(option, optionPatch);
                }
            }
        },

        reorderOption: (
            state,
            action: PayloadAction<{ fieldId: string; from: number; to?: number }>
        ) => {
            const { fieldId, from, to } = action.payload;
            const field = state.find(f => f.fieldId === fieldId);

            if (field) {
                console.log('ELO');
                const options = [...field.options];
                const [moved] = options.splice(from, 1);
                options.splice(to ?? from, 0, moved);
                field.options = options;
            }
        }
    }
});

export const {
    addOption,
    deleteOption,
    setOption,
    reorderOption,
    deleteOptions,
    initializeOptions
} = fieldOptionsSlice.actions;

export const fieldOptionsReducer = fieldOptionsSlice.reducer;
