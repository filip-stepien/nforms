import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const ruleCombinators = ['AND', 'OR'] as const;

export type RuleCombinator = (typeof ruleCombinators)[number];

export type Rule = {
    id: string;
    type: 'rule';
    targetFieldId: string;
    condition: string;
    operator: string;
    value: string;
};

export type RulePatch = Partial<Omit<Rule, 'id' | 'type'>>;

export type RuleGroup = {
    id: string;
    type: 'group';
    combinator: RuleCombinator;
    childrenRules: string[];
    childrenGroups: string[];
};

export type RuleGroupPatch = Partial<Omit<RuleGroup, 'id' | 'type'>>;

export type RulesState = {
    fieldId: string;
    rootGroupId: string | null;
    groups: RuleGroup[];
    rules: Rule[];
}[];

const initialState: RulesState = [];

const fieldRulesSlice = createSlice({
    name: 'fieldRules',
    initialState,
    reducers: {
        addRule: (
            state,
            action: PayloadAction<{ fieldId: string; groupId: string; rule: Rule }>
        ) => {
            const { fieldId, groupId, rule } = action.payload;

            const field = state.find(f => f.fieldId === fieldId);
            if (!field) return;

            const group = field.groups.find(r => r.id === groupId);
            if (!group) return;

            field.rules.push(rule);
            group.childrenRules.push(rule.id);
        },

        addGroup: (
            state,
            action: PayloadAction<{ fieldId: string; groupId?: string; group: RuleGroup }>
        ) => {
            const { fieldId, group, groupId } = action.payload;
            const field = state.find(f => f.fieldId === fieldId);

            if (!field) {
                state.push({
                    fieldId,
                    rootGroupId: group.id,
                    groups: [group],
                    rules: []
                });

                return;
            }

            if (groupId) {
                const parentGroup = field.groups.find(g => g.id === groupId);

                if (parentGroup) {
                    parentGroup.childrenGroups.push(group.id);
                }
            }

            field.groups.push(group);

            if (!field.rootGroupId) {
                field.rootGroupId = group.id;
            }
        },

        deleteRule: (state, action: PayloadAction<{ fieldId: string; ruleId: string }>) => {
            const { fieldId, ruleId } = action.payload;

            const field = state.find(f => f.fieldId === fieldId);
            if (!field) return;

            const index = field.rules.findIndex(r => r.id === ruleId);
            if (index === -1) return;

            field.rules.splice(index, 1);

            for (const group of field.groups) {
                group.childrenRules = group.childrenRules.filter(
                    childrenId => childrenId !== ruleId
                );
            }
        },

        deleteGroup: (state, action: PayloadAction<{ fieldId: string; groupId: string }>) => {
            const { fieldId, groupId } = action.payload;

            const field = state.find(f => f.fieldId === fieldId);
            if (!field) return;

            const index = field.groups.findIndex(r => r.id === groupId);
            if (index === -1) return;

            const group = field.groups[index];

            field.groups.splice(index, 1);
            field.rules = field.rules.filter(r => !group.childrenRules.includes(r.id));
            field.groups = field.groups.map(group => ({
                ...group,
                childrenGroups: group.childrenGroups.filter(id => id !== groupId)
            }));

            if (field.rootGroupId === groupId) {
                field.rootGroupId = null;
            }
        },

        setRule: (
            state,
            action: PayloadAction<{ fieldId: string; ruleId: string; rule: RulePatch }>
        ) => {
            const { fieldId, ruleId, rule: rulePatch } = action.payload;

            const field = state.find(f => f.fieldId === fieldId);
            if (!field) return;

            const rule = field.rules.find(r => r.id === ruleId);
            if (!rule) return;

            Object.assign(rule, rulePatch);
        },

        setGroup: (
            state,
            action: PayloadAction<{ fieldId: string; groupId: string; group: RuleGroupPatch }>
        ) => {
            const { fieldId, groupId, group: groupPatch } = action.payload;

            const field = state.find(f => f.fieldId === fieldId);
            if (!field) return;

            const group = field.groups.find(r => r.id === groupId);
            if (!group) return;

            Object.assign(group, groupPatch);
        },

        deleteRulesAndGroups: (state, action: PayloadAction<{ fieldId: string }>) => {
            const { fieldId } = action.payload;
            const index = state.findIndex(f => f.fieldId === fieldId);

            if (index !== -1) {
                state.slice(index, 1);
            }
        }
    }
});

export const fieldRulesReducer = fieldRulesSlice.reducer;

export const { addGroup, addRule, deleteGroup, deleteRule, setGroup, setRule } =
    fieldRulesSlice.actions;
