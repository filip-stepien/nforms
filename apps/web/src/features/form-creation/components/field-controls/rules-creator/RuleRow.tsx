import { Group, Select } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { IconButton } from '../../ui/IconButton';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { selectRule } from '@/features/form-creation/state/selectors';
import { deleteRule, RulePatch, setRule } from '@/features/form-creation/state/slices/rules';

type Props = {
    ruleId: string;
    fieldId: string;
};

export function RuleRow(props: Props) {
    const { ruleId, fieldId } = props;
    const dispatch = useAppDispatch();
    const fields = useAppSelector(state => state.formFields);
    const { targetFieldId, operator, condition, value } = useAppSelector(state =>
        selectRule(state, fieldId, ruleId)
    );

    const handleRuleDelete = () => {
        dispatch(deleteRule({ fieldId, ruleId }));
    };

    const handleRuleChange = (key: keyof RulePatch) => (value: string | null) => {
        if (value) {
            dispatch(setRule({ fieldId, ruleId, rule: { [key]: value } }));
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
