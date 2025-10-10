import { ruleConfigUpdaters } from './constants';
import {
    RuleGroup,
    Rule,
    RuleConfigMap,
    FieldType,
    RuleConfigUpdater,
    Field,
    ControlsMap
} from './types';

export function updateRule(root: RuleGroup, ruleId: string, update: (r: Rule) => Rule): RuleGroup {
    return {
        ...root,
        rules: root.rules.map(r => {
            if (r.type === 'rule' && r.id === ruleId) {
                return update(r);
            }

            if (r.type === 'group') {
                return updateRule(r, ruleId, update);
            }

            return r;
        })
    };
}

export function updateRules(
    root: RuleGroup,
    where: (r: Rule) => boolean,
    update: (r: Rule) => Rule
): RuleGroup {
    const rules = findRules(root, where);
    let newRoot: RuleGroup = root;

    for (const { id } of rules) {
        newRoot = updateRule(root, id, update);
    }

    return newRoot;
}

export function deleteRule(root: RuleGroup, ruleId: string): RuleGroup {
    return {
        ...root,
        rules: root.rules
            .filter(r => !(r.type === 'rule' && r.id === ruleId))
            .map(r => (r.type === 'group' ? deleteRule(r, ruleId) : r))
    };
}

export function findRules(root: RuleGroup, where: (r: Rule) => boolean): Rule[] {
    const result: Rule[] = [];

    for (const r of root.rules) {
        if (r.type === 'rule') {
            if (where(r)) result.push(r);
        } else if (r.type === 'group') {
            result.push(...findRules(r, where));
        }
    }

    return result;
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

export function resolveRuleConfig(initialConfig: RuleConfigMap, field: Field): RuleConfigMap {
    const updater = ruleConfigUpdaters[field.type];
    return updater ? updater(initialConfig, field) : initialConfig;
}

export const updateSelectionAnswerValues: RuleConfigUpdater = (cfg, field) => {
    return {
        ...cfg,
        [FieldType.SELECTION]: cfg[FieldType.SELECTION].map(rule =>
            rule.condition === 'answer'
                ? {
                      ...rule,
                      values: (field.controls as ControlsMap[FieldType.SELECTION]).options.map(
                          ctrl => ctrl.id
                      )
                  }
                : rule
        )
    };
};
