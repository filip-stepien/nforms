import { useFormFieldsStore } from '@/features/form-creation/state/fieldsStore';
import { Modal } from '@mantine/core';
import { RuleGroup, Rule } from './RulesCreator';

type Props = {
    onClose: () => void;
    opened: boolean;
    rule: Rule;
    rootGroup: RuleGroup;
    onRuleChange: (root: RuleGroup) => void;
};

function updateRule(root: RuleGroup, ruleId: string, updater: (r: Rule) => Rule): RuleGroup {
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

export function QuestionModal({ onClose, opened, rule, onRuleChange, rootGroup }: Props) {
    const fields = useFormFieldsStore(state => state.fields);

    const handleClick = (fieldId: string) => {
        onRuleChange(updateRule(rootGroup, rule.id, rule => ({ ...rule, fieldId })));
    };

    return (
        <Modal opened={opened} onClose={onClose} title='Authentication'>
            {fields.map(f => (
                <p key={f.id} onClick={() => handleClick(f.id)}>
                    {f.title}
                </p>
            ))}
        </Modal>
    );
}
