import { Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { QuestionModal } from './QuestionModal';
import { Rule, RuleGroup } from './RulesCreator';

type Props = {
    rule: Rule;
    fieldId: string;
    rootGroup: RuleGroup;
    onRuleChange: (root: RuleGroup) => void;
};

export function QuestionButton({ rule, fieldId, rootGroup, onRuleChange }: Props) {
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <>
            <QuestionModal
                opened={opened}
                onClose={close}
                fieldId={fieldId}
                ruleId={rule.id}
                rootGroup={rootGroup}
                onRuleChange={onRuleChange}
            />
            <Button onClick={open}>{rule.questionId}</Button>
        </>
    );
}
