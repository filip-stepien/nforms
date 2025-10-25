import { AppDispatch, RootState } from '@/lib/store';
import { RespondentCategory } from '@packages/db/schemas/form/respondent-categories';
import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setFieldCategoryActionsByTargetCategoryId } from './field-rules';
import { addCategoryRuleGroup, deleteCategoryRulesState } from './respondent-category-rules';
import { v4 as uuid } from 'uuid';

type FormRespondentCategoryPatch = Omit<RespondentCategory, 'id'>;

type CategoriesState = ReturnType<typeof categoriesAdapter.getInitialState>;

const categoriesAdapter = createEntityAdapter<RespondentCategory>();

const initialState: CategoriesState = categoriesAdapter.getInitialState();

export const respondentCategoriesSlice = createSlice({
    name: 'respondentCategories',
    initialState,
    reducers: {
        _addCategory: (state, action: PayloadAction<RespondentCategory>) => {
            categoriesAdapter.addOne(state, action.payload);
        },

        _deleteCategory: (state, action: PayloadAction<{ categoryId: string }>) => {
            categoriesAdapter.removeOne(state, action.payload.categoryId);
        },

        setCategory: (
            state,
            action: PayloadAction<{
                categoryActionId: string;
                category: FormRespondentCategoryPatch;
            }>
        ) => {
            const { categoryActionId, category } = action.payload;
            categoriesAdapter.setOne(state, {
                id: categoryActionId,
                ...category
            });
        }
    }
});

export const addCategory = (category: RespondentCategory) => (dispatch: AppDispatch) => {
    dispatch(
        addCategoryRuleGroup({
            categoryGroup: {
                id: uuid(),
                categoryId: category.id,
                combinator: 'AND',
                childrenGroups: [],
                childrenRules: []
            }
        })
    );
    dispatch(_addCategory(category));
};

export const deleteCategory =
    ({ categoryId }: { categoryId: string }) =>
    (dispatch: AppDispatch) => {
        dispatch(
            setFieldCategoryActionsByTargetCategoryId({
                targetCategoryId: categoryId,
                categoryAction: { targetCategoryId: undefined }
            })
        );
        dispatch(deleteCategoryRulesState({ categoryId }));
        dispatch(_deleteCategory({ categoryId }));
    };

export const respondentCategoriesReducer = respondentCategoriesSlice.reducer;

export const { _addCategory, setCategory, _deleteCategory } = respondentCategoriesSlice.actions;

export const { selectAll: selectCategories, selectById: selectCategoryById } =
    categoriesAdapter.getSelectors<RootState>(state => state.respondentCategories);
