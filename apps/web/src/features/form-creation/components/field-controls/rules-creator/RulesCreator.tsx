import { RuleGroupRow } from './RuleGroupRow';
import { RulesAccordion } from './RulesAccordion';
import { useAppSelector } from '@/hooks/useAppSelector';
import { selectRootGroupId } from '@/features/form-creation/state/slices/rules';

type Props = {
    fieldId: string;
};

export function RulesCreator({ fieldId }: Props) {
    const rootGroupId = useAppSelector(state => selectRootGroupId(state, fieldId));

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
}
