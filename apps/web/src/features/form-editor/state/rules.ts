import { AppDispatch, RootState } from '@/lib/store';
import { CategoryAction, Rule, RuleGroup } from '@packages/db/schemas/form';
import { createEntityAdapter, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';

export type RulePatch = Partial<Omit<Rule, 'id' | 'type'>>;

export type RuleGroupPatch = Partial<Omit<RuleGroup, 'id' | 'type'>>;

export type CategoryActionPatch = Partial<Omit<CategoryAction, 'id'>>;

export type RulesState = {
    categoryActions: ReturnType<typeof categoryActionsAdapter.getInitialState>;
    rules: ReturnType<typeof rulesAdapter.getInitialState>;
    groups: ReturnType<typeof groupsAdapter.getInitialState>;
};

const categoryActionsAdapter = createEntityAdapter<CategoryAction>();

const rulesAdapter = createEntityAdapter<Rule>();

const groupsAdapter = createEntityAdapter<RuleGroup>();

const initialState: RulesState = {
    categoryActions: categoryActionsAdapter.getInitialState(),
    rules: rulesAdapter.getInitialState(),
    groups: groupsAdapter.getInitialState()
};

const fieldRulesSlice = createSlice({
    name: 'fieldRules',
    initialState,
    reducers: {
        _addCategoryAction: (state, action: PayloadAction<CategoryAction>) => {
            categoryActionsAdapter.addOne(state.categoryActions, action.payload);
        },

        addRule: (state, action: PayloadAction<{ groupId: string; rule: Rule }>) => {
            const { groupId, rule } = action.payload;

            const group = state.groups.entities[groupId];
            if (group) {
                rulesAdapter.addOne(state.rules, rule);
                group.childrenRules.push(rule.id);
            }
        },

        addGroup: (state, action: PayloadAction<{ parentGroupId?: string; group: RuleGroup }>) => {
            const { group, parentGroupId } = action.payload;

            groupsAdapter.addOne(state.groups, group);

            if (parentGroupId) {
                const parent = state.groups.entities[parentGroupId];

                if (parent) {
                    parent.childrenGroups.push(group.id);
                }
            }
        },

        _deleteCategoryAction: (state, action: PayloadAction<{ categoryActionId: string }>) => {
            categoryActionsAdapter.removeOne(
                state.categoryActions,
                action.payload.categoryActionId
            );
        },

        deleteRule: (state, action: PayloadAction<{ groupId: string; ruleId: string }>) => {
            const { groupId, ruleId } = action.payload;

            rulesAdapter.removeOne(state.rules, ruleId);

            const group = state.groups.entities[groupId];
            if (group) {
                group.childrenRules = group.childrenRules.filter(id => id !== ruleId);
            }
        },

        deleteRulesByValue: (state, action: PayloadAction<{ value: string }>) => {
            const ruleIds = Object.values(state.rules.entities)
                .filter(r => r.value === action.payload.value)
                .map(r => r.id);

            rulesAdapter.removeMany(state.rules, ruleIds);

            Object.values(state.groups.entities).forEach(g => {
                g.childrenRules = g.childrenRules.filter(ruleId => !ruleIds.includes(ruleId));
            });
        },

        deleteGroup: (state, action: PayloadAction<{ groupId: string }>) => {
            const { groupId } = action.payload;

            const group = state.groups.entities[groupId];
            if (!group) return;

            rulesAdapter.removeMany(state.rules, group.childrenRules);

            state.groups.ids = state.groups.ids.filter(id => !group.childrenGroups.includes(id));
            group.childrenGroups.forEach(childGroupId => {
                delete state.groups.entities[childGroupId];
            });

            Object.values(state.groups.entities).forEach(g => {
                g.childrenGroups = g.childrenGroups.filter(id => id !== groupId);
            });

            groupsAdapter.removeOne(state.groups, groupId);
        },

        setCategoryAction: (
            state,
            action: PayloadAction<{ categoryActionId: string; categoryAction: CategoryActionPatch }>
        ) => {
            const { categoryActionId, categoryAction } = action.payload;
            categoryActionsAdapter.updateOne(state.categoryActions, {
                id: categoryActionId,
                changes: categoryAction
            });
        },

        setCategoryActionsByTargetCategoryId: (
            state,
            action: PayloadAction<{ targetCategoryId: string; categoryAction: CategoryActionPatch }>
        ) => {
            const { targetCategoryId, categoryAction } = action.payload;
            const ids = Object.values(state.categoryActions.entities)
                .filter(c => c.targetCategoryId === targetCategoryId)
                .map(c => c.id);

            categoryActionsAdapter.updateMany(
                state.categoryActions,
                ids.map(id => ({ id, changes: categoryAction }))
            );
        },

        setRule: (state, action: PayloadAction<{ ruleId: string; rule: RulePatch }>) => {
            const { ruleId, rule } = action.payload;
            rulesAdapter.updateOne(state.rules, { id: ruleId, changes: rule });
        },

        setRules: (state, action: PayloadAction<{ ruleIds: string[]; rule: RulePatch }>) => {
            const { ruleIds, rule } = action.payload;
            rulesAdapter.updateMany(
                state.rules,
                ruleIds.map(ruleId => ({ id: ruleId, changes: rule }))
            );
        },

        setGroup: (
            state,
            action: PayloadAction<{ fieldId: string; groupId: string; group: RuleGroupPatch }>
        ) => {
            const { groupId, group } = action.payload;
            groupsAdapter.updateOne(state.groups, { id: groupId, changes: group });
        },

        deleteRulesState: (state, action: PayloadAction<{ fieldId: string }>) => {
            const { fieldId } = action.payload;

            const allGroupsIds = Object.values(state.groups.entities)
                .filter(g => g.fieldId === fieldId)
                .map(g => g.id);

            const allRulesIds = Object.values(state.rules.entities)
                .filter(r => r.fieldId === fieldId)
                .map(r => r.id);

            const allCategoryActionsIds = Object.values(state.categoryActions.entities)
                .filter(r => r.fieldId === fieldId)
                .map(r => r.id);

            groupsAdapter.removeMany(state.groups, allGroupsIds);
            rulesAdapter.removeMany(state.rules, allRulesIds);
            categoryActionsAdapter.removeMany(state.categoryActions, allCategoryActionsIds);
        }
    }
});

export const addCategoryAction =
    (categoryAction: Omit<CategoryAction, 'rootGroupId'>) => (dispatch: AppDispatch) => {
        const rootGroupId = uuid();

        dispatch(
            addGroup({
                group: {
                    id: rootGroupId,
                    fieldId: categoryAction.fieldId,
                    childrenGroups: [],
                    childrenRules: [],
                    combinator: 'AND',
                    type: 'group'
                }
            })
        );

        dispatch(_addCategoryAction({ ...categoryAction, rootGroupId }));
    };

export const deleteCategoryAction =
    ({ categoryActionId }: { categoryActionId: string }) =>
    (dispatch: AppDispatch, getState: () => RootState) => {
        const categoryAction = selectCategoryActionById(getState(), categoryActionId);

        dispatch(_deleteCategoryAction({ categoryActionId }));
        dispatch(deleteGroup({ groupId: categoryAction.rootGroupId }));
    };

export const fieldRulesReducer = fieldRulesSlice.reducer;

export const {
    _addCategoryAction,
    addGroup,
    addRule,
    setGroup,
    setRule,
    setRules,
    setCategoryAction,
    setCategoryActionsByTargetCategoryId,
    _deleteCategoryAction,
    deleteGroup,
    deleteRule,
    deleteRulesByValue,
    deleteRulesState
} = fieldRulesSlice.actions;

export const { selectById: selectRuleById, selectAll: selectRules } =
    rulesAdapter.getSelectors<RootState>(state => state.fieldRules.rules);

export const { selectById: selectGroupById } = groupsAdapter.getSelectors<RootState>(
    state => state.fieldRules.groups
);

export const { selectAll: selectCategoryActions, selectById: selectCategoryActionById } =
    categoryActionsAdapter.getSelectors<RootState>(state => state.fieldRules.categoryActions);

export const selectCategoryActionByFieldId = (fieldId: string) =>
    createSelector(selectCategoryActions, actions =>
        actions.filter(actions => actions.fieldId === fieldId)
    );
