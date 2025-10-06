import { useFormFieldsStore } from '@/features/form-creation/hooks/useFormFieldsStore';
import { updateRule } from '@/features/form-creation/lib/rules';
import { Rule, RuleGroup } from '@/features/form-creation/lib/types';
import { truncateText } from '@/features/form-creation/lib/utils';
import { Modal, Select } from '@mantine/core';
import { IconLinkPlus } from '@tabler/icons-react';

type Props = {
    onClose: () => void;
    opened: boolean;
    rule: Rule;
    rootGroup: RuleGroup;
    onRuleChange: (root: RuleGroup) => void;
};

export function QuestionModal({ onClose, opened, rule, onRuleChange, rootGroup }: Props) {
    const fields = useFormFieldsStore(state => state.fields);

    const handleSelectChange = (fieldId: string | null) => {
        if (fieldId) {
            onRuleChange(updateRule(rootGroup, rule.id, rule => ({ ...rule, fieldId })));
            onClose();
        }
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={
                <div className='flex items-center gap-2'>
                    <IconLinkPlus stroke={1.5} size={20} />
                    <span className='font-semibold text-sm'>Select question</span>
                </div>
            }
        >
            <Select
                data={fields.map(f => ({ value: f.id, label: truncateText(f.title, 30) }))}
                value={rule.fieldId}
                onChange={handleSelectChange}
            />
        </Modal>
    );
}
