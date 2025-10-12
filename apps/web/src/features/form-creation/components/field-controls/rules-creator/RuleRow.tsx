import { Group, Select } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { IconButton } from '../../ui/IconButton';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import {
    deleteRule,
    RulePatch,
    selectRuleById,
    setRule
} from '@/features/form-creation/state/slices/rules';
import { selectFields } from '@/features/form-creation/state/slices/fields';

type Props = {
    ruleId: string;
    groupId: string;
};

export function RuleRow({ ruleId, groupId }: Props) {
    const dispatch = useAppDispatch();
    const fields = useAppSelector(state => selectFields(state));
    const { targetFieldId, operator, condition, value } = useAppSelector(state =>
        selectRuleById(state, ruleId)
    );

    const handleRuleDelete = () => {
        dispatch(deleteRule({ groupId, ruleId }));
    };

    const handleRuleChange = (key: keyof RulePatch) => (value: string | null) => {
        if (value) {
            dispatch(setRule({ ruleId, rule: { [key]: value } }));
        }
    };

    return (
        <Group>
            <Select
                data={fields.map(f => ({ label: f.title, value: f.id }))}
                value={targetFieldId}
                onChange={handleRuleChange('targetFieldId')}
                allowDeselect={false}
            />
            <Select
                data={['condition 1', 'condition 2']}
                value={condition}
                onChange={handleRuleChange('condition')}
                allowDeselect={false}
            />
            <Select
                data={['is', 'is not']}
                value={operator}
                onChange={handleRuleChange('operator')}
                allowDeselect={false}
            />
            <Select
                data={['ok', 'not ok']}
                value={value}
                onChange={handleRuleChange('value')}
                allowDeselect={false}
            />
            <IconButton icon={IconX} variant='light' color='red' onClick={handleRuleDelete} />
        </Group>
    );
}
