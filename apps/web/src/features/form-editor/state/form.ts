import { FormSettings } from '@packages/db/schemas/form/form';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type FormState = {
    title: string;
    description: string;
    settings: FormSettings;
};

export const initialTitle = 'Untitled form';

const initialState: FormState = {
    title: initialTitle,
    description: '',
    settings: {
        anonymous: false,
        active: true,
        singleResponse: true
    }
};

const formTitleSlice = createSlice({
    name: 'form',
    initialState,
    reducers: {
        setFormTitle: (state, action: PayloadAction<string>) => {
            state.title = action.payload;
        },
        setFormDescription: (state, action: PayloadAction<string>) => {
            state.description = action.payload;
        },
        setFormSettings: (state, action: PayloadAction<Partial<FormSettings>>) => {
            Object.assign(state.settings, action.payload);
        }
    }
});

export const { setFormTitle, setFormDescription, setFormSettings } = formTitleSlice.actions;

export const formReducer = formTitleSlice.reducer;
