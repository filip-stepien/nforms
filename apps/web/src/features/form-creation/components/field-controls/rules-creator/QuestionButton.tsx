import { useDisclosure } from '@mantine/hooks';
import { QuestionModal } from './QuestionModal';
import { Rule } from '@/features/form-creation/lib/types';
import { truncateText } from '@/features/form-creation/lib/utils';
import { ActionButton } from '../../ui/ActionButton';
import { IconLink } from '@tabler/icons-react';
import { useFormSelector } from '@/features/form-creation/hooks/useFormSelector';
import { selectFieldById } from '@/features/form-creation/state/formFieldsSlice';

type Props = {
    rule: Rule;
    fieldId: string;
};

export function QuestionButton({ rule, fieldId }: Props) {
    const [opened, { open, close }] = useDisclosure(false);
    const label = useFormSelector(state => selectFieldById(state, rule.fieldId!).title);

    return (
        <>
            <QuestionModal opened={opened} onClose={close} rule={rule} fieldId={fieldId} />
            <ActionButton
                label={truncateText(label, 30)}
                className='pl-md border-border'
                icon={IconLink}
                variant='white'
                onClick={open}
            />
        </>
    );
}
