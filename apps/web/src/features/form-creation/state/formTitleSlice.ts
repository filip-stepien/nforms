import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type FormTitleState = {
    title: string;
};

export const titleInitialState: FormTitleState = {
    title: 'Untitled form'
};

const formTitleSlice = createSlice({
    name: 'formTitle',
    initialState: titleInitialState,
    reducers: {
        setTitle: (state, action: PayloadAction<string>) => {
            state.title = action.payload;
        }
    }
});

export const { setTitle } = formTitleSlice.actions;

export const formTitleReducer = formTitleSlice.reducer;
