import { formFieldsReducer } from '@/features/form-editor/state/fields';
import { fieldOptionsReducer } from '@/features/form-editor/state/field-options';
import { fieldRulesReducer } from '@/features/form-editor/state/field-rules';
import { fieldSettingsReducer } from '@/features/form-editor/state/field-settings';
import { formReducer } from '@/features/form-editor/state/form';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { respondentCategoriesReducer } from '@/features/form-editor/state/respondent-categories';
import { respondentCategoryRulesReducer } from '@/features/form-editor/state/respondent-category-rules';

const reducer = combineReducers({
    form: formReducer,
    formFields: formFieldsReducer,
    fieldRules: fieldRulesReducer,
    fieldOptions: fieldOptionsReducer,
    fieldSettings: fieldSettingsReducer,
    respondentCategories: respondentCategoriesReducer,
    respondentCategoryRules: respondentCategoryRulesReducer
});

export const makeStore = (preloadedState?: Partial<RootState>) =>
    configureStore({ reducer, preloadedState });

export type RootState = ReturnType<typeof reducer>;

export type AppStore = ReturnType<typeof makeStore>;

export type AppDispatch = AppStore['dispatch'];
