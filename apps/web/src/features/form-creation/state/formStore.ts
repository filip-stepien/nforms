import { configureStore } from '@reduxjs/toolkit';
import { formFieldsReducer } from './formFieldsSlice';
import { formTitleReducer } from './formTitleSlice';

export const formStore = configureStore({
    reducer: {
        formFields: formFieldsReducer,
        formTitle: formTitleReducer
    }
});

export type FormRootState = ReturnType<typeof formStore.getState>;

export type FormDispatch = typeof formStore.dispatch;
