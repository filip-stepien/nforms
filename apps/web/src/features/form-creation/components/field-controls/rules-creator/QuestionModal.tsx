import { useFormDispatch } from '@/features/form-creation/hooks/useFormDispatch';
import { useFormSelector } from '@/features/form-creation/hooks/useFormSelector';
import { updateRule } from '@/features/form-creation/lib/rules';
import { Rule } from '@/features/form-creation/lib/types';
import { truncateText } from '@/features/form-creation/lib/utils';
import { selectFieldById, setField } from '@/features/form-creation/state/formFieldsSlice';
import { FormRootState } from '@/features/form-creation/state/formStore';
import { Modal, Select } from '@mantine/core';
import { createSelector } from '@reduxjs/toolkit';
import { IconLinkPlus } from '@tabler/icons-react';

type Props = {
    onClose: () => void;
    opened: boolean;
    rule: Rule;
    fieldId: string;
};

const selectDataSelector = createSelector(
    (state: FormRootState) => state.formFields.fields,
    fields => fields.map(f => ({ value: f.id, label: truncateText(f.title, 30) }))
);

export function QuestionModal({ onClose, opened, rule, fieldId }: Props) {
    const dispatch = useFormDispatch();
    const root = useFormSelector(state => selectFieldById(state, fieldId).controls.rules);
    const selectData = useFormSelector(selectDataSelector);

    const handleSelectChange = (selectedId: string | null) => {
        if (selectedId) {
            const updatedRules = updateRule(root, rule.id, rule => ({
                ...rule,
                fieldId: selectedId
            }));

            dispatch(setField({ fieldId, field: { controls: { rules: updatedRules } } }));
            onClose();
        }
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={
                <div className='flex items-center gap-2'>
                    <IconLinkPlus stroke={1.5} />
                    <span className='font-semibold text-sm'>Select question</span>
                </div>
            }
        >
            <Select
                data={selectData}
                value={rule.fieldId}
                onChange={handleSelectChange}
                allowDeselect={false}
            />
        </Modal>
    );
}
