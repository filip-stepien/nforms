import { memo } from 'react';
import { RuleGroupRow } from './RuleGroupRow';
import { RulesAccordion } from './RulesAccordion';
import { useAppSelector } from '@/hooks/useAppSelector';
import { selectFieldRules } from '@/features/form-creation/state/selectors';

type Props = {
    fieldId: string;
};

export const RulesCreator = memo(function RulesCreator({ fieldId }: Props) {
    const rootGroupId = useAppSelector(state => selectFieldRules(state, fieldId).rootGroupId);

    return (
        <RulesAccordion>
            <div className='flex flex-col'>
                <RuleGroupRow
                    key={rootGroupId}
                    hasBackgroundColor={false}
                    isFirstGroup={true}
                    groupId={rootGroupId}
                    fieldId={fieldId}
                />
            </div>
        </RulesAccordion>
    );
});
