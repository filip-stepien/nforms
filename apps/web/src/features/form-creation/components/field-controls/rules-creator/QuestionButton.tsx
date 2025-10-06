import { useDisclosure } from '@mantine/hooks';
import { QuestionModal } from './QuestionModal';
import { useFormFieldsStore } from '@/features/form-creation/hooks/useFormFieldsStore';
import { Rule, RuleGroup } from '@/features/form-creation/lib/types';
import { truncateText } from '@/features/form-creation/lib/utils';
import { ActionButton } from '../../ui/ActionButton';
import { IconLink } from '@tabler/icons-react';

type Props = {
    rule: Rule;
    rootGroup: RuleGroup;
    onRuleChange: (root: RuleGroup) => void;
};

export function QuestionButton({ rule, rootGroup, onRuleChange }: Props) {
    const fields = useFormFieldsStore(state => state.fields);
    const [opened, { open, close }] = useDisclosure(false);
    const buttonLabel = fields.find(f => f.id === rule.fieldId)?.title as string;

    return (
        <>
            <QuestionModal
                opened={opened}
                onClose={close}
                rule={rule}
                rootGroup={rootGroup}
                onRuleChange={onRuleChange}
            />
            <ActionButton
                label={truncateText(buttonLabel, 30)}
                className='pl-md border-border'
                icon={IconLink}
                variant='white'
                onClick={open}
            />
        </>
    );
}
