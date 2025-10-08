import { ruleConfigUpdaters } from './constants';
import { RuleGroup, Rule, RuleConfigMap, FieldType, FieldMap, RuleConfigUpdater } from './types';

export function updateRule(root: RuleGroup, ruleId: string, updater: (r: Rule) => Rule): RuleGroup {
    return {
        ...root,
        rules: root.rules.map(r => {
            if (r.type === 'rule' && r.id === ruleId) {
                return updater(r);
            }

            if (r.type === 'group') {
                return updateRule(r, ruleId, updater);
            }

            return r;
        })
    };
}

export function deleteRule(root: RuleGroup, ruleId: string): RuleGroup {
    return {
        ...root,
        rules: root.rules
            .filter(r => !(r.type === 'rule' && r.id === ruleId))
            .map(r => (r.type === 'group' ? deleteRule(r, ruleId) : r))
    };
}

export function updateGroup(
    root: RuleGroup,
    groupId: string,
    updater: (g: RuleGroup) => RuleGroup
): RuleGroup {
    if (root.id === groupId) {
        return updater(root);
    }

    return {
        ...root,
        rules: root.rules.map(r => (r.type === 'group' ? updateGroup(r, groupId, updater) : r))
    };
}

export function deleteGroup(root: RuleGroup, groupId: string): RuleGroup {
    return {
        ...root,
        rules: root.rules
            .filter(r => !(r.type === 'group' && r.id === groupId))
            .map(r => (r.type === 'group' ? deleteGroup(r, groupId) : r))
    };
}

export function resolveRuleConfig<T extends FieldType = FieldType>(
    initialConfig: RuleConfigMap,
    field: FieldMap[T]
): RuleConfigMap {
    const updater = ruleConfigUpdaters[field.type];
    return updater ? updater(initialConfig, field) : initialConfig;
}

export const updateSelectionAnswerValues: RuleConfigUpdater<FieldType.SELECTION> = (cfg, field) => {
    return {
        ...cfg,
        [FieldType.SELECTION]: cfg[FieldType.SELECTION].map(rule =>
            rule.condition === 'answer'
                ? {
                      ...rule,
                      values: field.controls.options.map(ctrl => ctrl.id)
                  }
                : rule
        )
    };
};
