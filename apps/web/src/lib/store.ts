import { formFieldsReducer } from '@/features/form-creation/state/slices/fields';
import { fieldOptionsReducer } from '@/features/form-creation/state/slices/options';
import { fieldRulesReducer } from '@/features/form-creation/state/slices/rules';
import { fieldSettingsReducer } from '@/features/form-creation/state/slices/settings';
import { formTitleReducer } from '@/features/form-creation/state/slices/title';
import { configureStore } from '@reduxjs/toolkit';

export const makeStore = () => {
    return configureStore({
        reducer: {
            formTitle: formTitleReducer,
            formFields: formFieldsReducer,
            fieldRules: fieldRulesReducer,
            fieldOptions: fieldOptionsReducer,
            fieldSettings: fieldSettingsReducer
        }
    });
};

export type AppStore = ReturnType<typeof makeStore>;

export type AppDispatch = AppStore['dispatch'];

export type RootState = ReturnType<AppStore['getState']>;

export type FormState = RootState;
