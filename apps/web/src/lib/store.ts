import { formFieldsReducer } from '@/features/form-creation/state/fields';
import { fieldOptionsReducer } from '@/features/form-creation/state/options';
import { fieldRulesReducer } from '@/features/form-creation/state/rules';
import { fieldSettingsReducer } from '@/features/form-creation/state/settings';
import { formReducer } from '@/features/form-creation/state/form';
import { combineReducers, configureStore } from '@reduxjs/toolkit';

const reducer = combineReducers({
    form: formReducer,
    formFields: formFieldsReducer,
    fieldRules: fieldRulesReducer,
    fieldOptions: fieldOptionsReducer,
    fieldSettings: fieldSettingsReducer
});

export const makeStore = (preloadedState?: Partial<RootState>) =>
    configureStore({ reducer, preloadedState });

export type RootState = ReturnType<typeof reducer>;

export type AppStore = ReturnType<typeof makeStore>;

export type AppDispatch = AppStore['dispatch'];
