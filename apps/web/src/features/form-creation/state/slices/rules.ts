import { RootState } from '@/lib/store';
import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';

export const ruleCombinators = ['AND', 'OR'] as const;

export type RuleCombinator = (typeof ruleCombinators)[number];

export type Rule = {
    id: string;
    type: 'rule';
    fieldId: string;
    targetFieldId: string;
    condition: string;
    operator: string;
    value: string | null;
};

export type RuleGroup = {
    id: string;
    type: 'group';
    fieldId: string;
    combinator: RuleCombinator;
    childrenRules: string[];
    childrenGroups: string[];
};

export type FieldRulesRelation = {
    fieldId: string;
    rootGroupId: string;
};

export type RulePatch = Partial<Omit<Rule, 'id' | 'type'>>;

export type RuleGroupPatch = Partial<Omit<RuleGroup, 'id' | 'type'>>;

export type RulesState = {
    relations: FieldRulesRelation[];
    rules: ReturnType<typeof rulesAdapter.getInitialState>;
    groups: ReturnType<typeof groupsAdapter.getInitialState>;
};

const rulesAdapter = createEntityAdapter<Rule>();

const groupsAdapter = createEntityAdapter<RuleGroup>();

const initialState: RulesState = {
    relations: [],
    rules: rulesAdapter.getInitialState(),
    groups: groupsAdapter.getInitialState()
};

const fieldRulesSlice = createSlice({
    name: 'fieldRules',
    initialState,
    reducers: {
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

            const relation = state.relations.find(r => r.fieldId === group.fieldId);
            if (!relation) {
                state.relations.push({ fieldId: group.fieldId, rootGroupId: group.id });
            }

            if (parentGroupId) {
                const parent = state.groups.entities[parentGroupId];

                if (parent) {
                    parent.childrenGroups.push(group.id);
                }
            }
        },

        deleteRule: (state, action: PayloadAction<{ groupId: string; ruleId: string }>) => {
            const { groupId, ruleId } = action.payload;

            rulesAdapter.removeOne(state.rules, ruleId);

            const group = state.groups.entities[groupId];
            if (group) {
                group.childrenRules = group.childrenRules.filter(id => id !== ruleId);
            }
        },

        deleteRulesByFieldId: (state, action: PayloadAction<{ fieldId: string }>) => {
            const ruleIds = Object.values(state.rules.entities)
                .filter(r => r.targetFieldId === action.payload.fieldId)
                .map(r => r.id);

            rulesAdapter.removeMany(state.rules, ruleIds);

            Object.values(state.groups.entities).forEach(g => {
                g.childrenRules = g.childrenRules.filter(ruleId => !ruleIds.includes(ruleId));
            });
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

        deleteGroup: (state, action: PayloadAction<{ fieldId: string; groupId: string }>) => {
            const { fieldId, groupId } = action.payload;

            const group = state.groups.entities[groupId];
            if (!group) return;

            const relationIndex = state.relations.findIndex(m => m.fieldId === fieldId);
            const relation = state.relations[relationIndex];
            if (relation && relation.rootGroupId === groupId) {
                state.relations.splice(relationIndex, 1);
            }

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

        deleteRulesAndGroups: (state, action: PayloadAction<{ fieldId: string }>) => {
            const { fieldId } = action.payload;

            const relationIndex = state.relations.findIndex(m => m.fieldId === fieldId);
            if (relationIndex === -1) return;

            const allGroupsIds = Object.values(state.groups.entities)
                .filter(g => g.fieldId === fieldId)
                .map(g => g.id);

            const allRulesIds = Object.values(state.rules.entities)
                .filter(r => r.fieldId === fieldId)
                .map(r => r.id);

            groupsAdapter.removeMany(state.groups, allGroupsIds);
            rulesAdapter.removeMany(state.rules, allRulesIds);
            state.relations.splice(relationIndex, 1);
        }
    }
});

export const fieldRulesReducer = fieldRulesSlice.reducer;

export const {
    addGroup,
    addRule,
    setGroup,
    setRule,
    setRules,
    deleteGroup,
    deleteRule,
    deleteRulesByFieldId,
    deleteRulesByValue,
    deleteRulesAndGroups
} = fieldRulesSlice.actions;

export function selectRootGroupId(state: RootState, fieldId: string) {
    const relation = state.fieldRules.relations.find(f => f.fieldId === fieldId);
    return relation!.rootGroupId!;
}

export const { selectById: selectRuleById, selectAll: selectRules } =
    rulesAdapter.getSelectors<RootState>(state => state.fieldRules.rules);

export const { selectById: selectGroupById } = groupsAdapter.getSelectors<RootState>(
    state => state.fieldRules.groups
);
