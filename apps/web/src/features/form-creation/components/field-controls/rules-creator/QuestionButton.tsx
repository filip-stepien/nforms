import { Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { QuestionModal } from './QuestionModal';
import { useFormFieldsStore } from '@/features/form-creation/hooks/useFormFieldsStore';
import { Rule, RuleGroup } from '@/features/form-creation/lib/types';

type Props = {
    rule: Rule;
    rootGroup: RuleGroup;
    onRuleChange: (root: RuleGroup) => void;
};

export function QuestionButton({ rule, rootGroup, onRuleChange }: Props) {
    const fields = useFormFieldsStore(state => state.fields);
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <>
            <QuestionModal
                opened={opened}
                onClose={close}
                rule={rule}
                rootGroup={rootGroup}
                onRuleChange={onRuleChange}
            />
            <Button onClick={open}>{fields.find(f => f.id === rule.fieldId)?.title}</Button>
        </>
    );
}
