import { useFormFieldsStore } from '@/features/form-creation/state/fieldsStore';
import { Modal } from '@mantine/core';
import { useShallow } from 'zustand/shallow';
import { RuleGroup, Rule } from './RulesCreator';

type Props = {
    fieldId: string;
    ruleId: string;
    onClose: () => void;
    opened: boolean;
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

export function QuestionModal({ onClose, ruleId, opened, onRuleChange, rootGroup }: Props) {
    const fields = useFormFieldsStore(state => state.fields);

    const handleClick = (selectedId: string) => {
        onRuleChange(updateRule(rootGroup, ruleId, rule => ({ ...rule, questionId: selectedId })));
    };

    return (
        <Modal opened={opened} onClose={onClose} title='Authentication'>
            {fields.map(f => (
                <p key={f.id} onClick={() => handleClick(f.id)}>
                    {f.id}
                </p>
            ))}
        </Modal>
    );
}
