import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type FormTitleState = {
    title: string;
};

export const initialTitle = 'Untitled form';

const initialState: FormTitleState = {
    title: initialTitle
};

const formTitleSlice = createSlice({
    name: 'formTitle',
    initialState,
    reducers: {
        setTitle: (state, action: PayloadAction<string>) => {
            state.title = action.payload;
        }
    }
});

export const { setTitle } = formTitleSlice.actions;

export const formTitleReducer = formTitleSlice.reducer;
