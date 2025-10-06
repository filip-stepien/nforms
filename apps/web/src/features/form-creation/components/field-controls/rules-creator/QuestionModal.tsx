import { useFormFieldsStore } from '@/features/form-creation/hooks/useFormFieldsStore';
import { updateRule } from '@/features/form-creation/lib/rules';
import { Rule, RuleGroup } from '@/features/form-creation/lib/types';
import { Modal } from '@mantine/core';

type Props = {
    onClose: () => void;
    opened: boolean;
    rule: Rule;
    rootGroup: RuleGroup;
    onRuleChange: (root: RuleGroup) => void;
};

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
