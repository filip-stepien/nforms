import { RootState } from '@/lib/store';
import {
    RespondentCategoryRule,
    RespondentCategoryRuleGroup,
    RespondentCategoryRuleRelation
} from '@packages/db/schemas/form/respondent-category-rules';
import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';

type CategoryRulePatch = Omit<Partial<RespondentCategoryRule>, 'id'>;

type CategoryRuleGroupPatch = Omit<Partial<RespondentCategoryRuleGroup>, 'id'>;

type CategoryRulesState = {
    relations: RespondentCategoryRuleRelation[];
    rules: ReturnType<typeof categoryRulesAdapter.getInitialState>;
    groups: ReturnType<typeof categoryGroupsAdapter.getInitialState>;
};

const categoryRulesAdapter = createEntityAdapter<RespondentCategoryRule>();

const categoryGroupsAdapter = createEntityAdapter<RespondentCategoryRuleGroup>();

const initialState: CategoryRulesState = {
    relations: [],
    rules: categoryRulesAdapter.getInitialState(),
    groups: categoryGroupsAdapter.getInitialState()
};

export const respondentCategoryRulesSlice = createSlice({
    name: 'respondentCategoryRules',
    initialState,
    reducers: {
        addCategoryRule: (
            state,
            action: PayloadAction<{ categoryGroupId: string; categoryRule: RespondentCategoryRule }>
        ) => {
            const { categoryGroupId, categoryRule } = action.payload;

            const group = state.groups.entities[categoryGroupId];
            if (group) {
                categoryRulesAdapter.addOne(state.rules, categoryRule);
                group.childrenRules.push(categoryRule.id);
            }
        },

        addCategoryRuleGroup: (
            state,
            action: PayloadAction<{
                parentCategoryGroupId?: string;
                categoryGroup: RespondentCategoryRuleGroup;
            }>
        ) => {
            const { categoryGroup, parentCategoryGroupId } = action.payload;

            categoryGroupsAdapter.addOne(state.groups, categoryGroup);

            const relation = state.relations.find(r => r.categoryId === categoryGroup.categoryId);
            if (!relation) {
                state.relations.push({
                    categoryId: categoryGroup.categoryId,
                    rootGroupId: categoryGroup.id
                });
            }

            if (parentCategoryGroupId) {
                const parent = state.groups.entities[parentCategoryGroupId];

                if (parent) {
                    parent.childrenGroups.push(categoryGroup.id);
                }
            }
        },

        deleteCategoryRule: (
            state,
            action: PayloadAction<{ categoryGroupId: string; categoryRuleId: string }>
        ) => {
            const { categoryGroupId, categoryRuleId } = action.payload;

            categoryRulesAdapter.removeOne(state.rules, categoryRuleId);

            const group = state.groups.entities[categoryGroupId];
            if (group) {
                group.childrenRules = group.childrenRules.filter(id => id !== categoryRuleId);
            }
        },

        deleteCategoryRuleGroup: (
            state,
            action: PayloadAction<{ categoryId: string; categoryGroupId: string }>
        ) => {
            const { categoryId, categoryGroupId } = action.payload;

            const group = state.groups.entities[categoryGroupId];
            if (!group) return;

            const relationIndex = state.relations.findIndex(r => r.categoryId === categoryId);
            const relation = state.relations[relationIndex];
            if (relation && relation.rootGroupId === categoryGroupId) {
                state.relations.splice(relationIndex, 1);
            }

            categoryRulesAdapter.removeMany(state.rules, group.childrenRules);

            state.groups.ids = state.groups.ids.filter(id => !group.childrenGroups.includes(id));
            group.childrenGroups.forEach(childGroupId => {
                delete state.groups.entities[childGroupId];
            });

            Object.values(state.groups.entities).forEach(g => {
                g.childrenGroups = g.childrenGroups.filter(id => id !== categoryGroupId);
            });

            categoryGroupsAdapter.removeOne(state.groups, categoryGroupId);
        },

        setCategoryRule: (
            state,
            action: PayloadAction<{ categoryRuleId: string; categoryRule: CategoryRulePatch }>
        ) => {
            const { categoryRuleId, categoryRule } = action.payload;
            categoryRulesAdapter.updateOne(state.rules, {
                id: categoryRuleId,
                changes: categoryRule
            });
        },

        setCategoryRuleGroup: (
            state,
            action: PayloadAction<{
                categoryGroupId: string;
                categoryGroup: CategoryRuleGroupPatch;
            }>
        ) => {
            const { categoryGroupId, categoryGroup } = action.payload;
            categoryGroupsAdapter.updateOne(state.groups, {
                id: categoryGroupId,
                changes: categoryGroup
            });
        },

        deleteCategoryRulesState: (state, action: PayloadAction<{ categoryId: string }>) => {
            const { categoryId } = action.payload;

            const relationIndex = state.relations.findIndex(r => r.categoryId === categoryId);
            if (relationIndex === -1) return;

            const allGroupsIds = Object.values(state.groups.entities)
                .filter(g => g.categoryId === categoryId)
                .map(g => g.id);

            const allRulesIds = Object.values(state.rules.entities)
                .filter(r => r.categoryId === categoryId)
                .map(r => r.id);

            categoryGroupsAdapter.removeMany(state.groups, allGroupsIds);
            categoryRulesAdapter.removeMany(state.rules, allRulesIds);
            state.relations.splice(relationIndex, 1);
        }
    }
});

export const respondentCategoryRulesReducer = respondentCategoryRulesSlice.reducer;

export const {
    addCategoryRule,
    addCategoryRuleGroup,
    deleteCategoryRule,
    deleteCategoryRuleGroup,
    deleteCategoryRulesState,
    setCategoryRule,
    setCategoryRuleGroup
} = respondentCategoryRulesSlice.actions;

export const { selectById: selectCategoryRuleById, selectAll: selectCategoryRules } =
    categoryRulesAdapter.getSelectors<RootState>(state => state.respondentCategoryRules.rules);

export const { selectById: selectCategoryRuleGroupById, selectAll: selectCategoryRuleGroups } =
    categoryGroupsAdapter.getSelectors<RootState>(state => state.respondentCategoryRules.groups);

export const selectCategoryRootGroupIdByCategoryId = (state: RootState, categoryId: string) =>
    state.respondentCategoryRules.relations.find(r => r.categoryId === categoryId)!.rootGroupId;
