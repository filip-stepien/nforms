import { memo } from 'react';
import { RuleGroupRow } from './RuleGroupRow';
import { RulesAccordion } from './RulesAccordion';
import { useFormSelector } from '@/features/form-creation/hooks/useFormSelector';
import { selectFieldById } from '@/features/form-creation/state/formFieldsSlice';

type Props = {
    fieldId: string;
};

export const RulesCreator = memo(function RulesCreator({ fieldId }: Props) {
    const rules = useFormSelector(state => selectFieldById(state, fieldId).controls.rules);

    return (
        <RulesAccordion>
            <div className='flex flex-col'>
                <RuleGroupRow
                    key={rules.id}
                    hasBackgroundColor={false}
                    isFirstGroup={true}
                    group={rules}
                    fieldId={fieldId}
                />
            </div>
        </RulesAccordion>
    );
});
